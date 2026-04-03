"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSetFrameLinks } from "@/hooks/useSetFrameLinks";
import { bodyPartGroups } from "@/data/bodyParts";
import { supabase } from "@/lib/supabase";
import { generateGridSequence, findInitialStepIndex, calculateCorrectedGrid, type GridStep } from "@/lib/gridSequence";

// ===== 사각형 표시 설정 =====
// 사각형 크기 제한 없이 순수 비율로만 표시

interface SubmissionData {
    bodyHeight: number;
    shoulderWidth: number;
    bodyParts: string[];
    createdAt: string;
    initialWidth: number;
    initialHeight: number;
}

export default function AdjustPage() {
    const router = useRouter();
    
    const [submissionData, setSubmissionData] = useState<SubmissionData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [gridSequence, setGridSequence] = useState<GridStep[]>([]);
    const [stepIndex, setStepIndex] = useState(0);
    const [userId, setUserId] = useState<string>('');
    const [isKickedOut, setIsKickedOut] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [touchStartX, setTouchStartX] = useState(0);
    const [touchStartY, setTouchStartY] = useState(0);
    const [touchStartIndex, setTouchStartIndex] = useState(0);
    const [touchStartRatio, setTouchStartRatio] = useState(0.8);
    const [isDragging, setIsDragging] = useState(false);
    const [dragDirection, setDragDirection] = useState<'none' | 'horizontal' | 'vertical'>('none');
    const [maxGridWidth, setMaxGridWidth] = useState(25);
    const [maxGridHeight, setMaxGridHeight] = useState(84);
    const [fontSizeRatio, setFontSizeRatio] = useState(0.8);

    const currentStep = useMemo(() => {
        return gridSequence[stepIndex] || { width: 10, height: 30, displayWidth: 0, displayHeight: 0 };
    }, [gridSequence, stepIndex]);

    // Frame links는 고정값이므로 useMemo로 메모이제이션
    const frameLinks = useMemo(() => [
        { slot: 'left' as const, href: '/select', label: '다른자세보기' },
        { slot: 'center' as const, href: '/', label: '처음으로' },
        { slot: 'right' as const, href: '/cut', label: '다시재단하기' },
    ], []);

    useSetFrameLinks({ links: frameLinks });

    // config 조회
    useEffect(() => {
        const fetchConfig = async () => {
            const { data } = await supabase
                .from('config')
                .select('max_grid_width, max_grid_height, font_size_ratio')
                .eq('id', 1)
                .single();
            if (data) {
                setMaxGridWidth(data.max_grid_width);
                setMaxGridHeight(data.max_grid_height);
                setFontSizeRatio(data.font_size_ratio);
            }
        };
        fetchConfig();
    }, []);

    // submissions에서 최신 데이터 조회
    useEffect(() => {
        const fetchSubmission = async () => {
            try {
                const { data, error } = await supabase
                    .from('submissions')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single();

                if (error || !data) {
                    console.error('데이터 조회 실패:', error);
                    alert('제출된 데이터가 없습니다. cut 페이지로 이동합니다.');
                    router.push('/cut');
                    return;
                }

                setSubmissionData({
                    bodyHeight: data.body_height,
                    shoulderWidth: data.shoulder_width,
                    bodyParts: data.body_parts,
                    createdAt: data.created_at,
                    initialWidth: data.width,
                    initialHeight: data.height
                });
            } catch (err) {
                console.error('조회 중 오류:', err);
                router.push('/cut');
            }
        };

        fetchSubmission();
    }, [router]);

    // 초기화: GRID_SEQUENCE 생성 및 Supabase에 저장
    useEffect(() => {
        if (!submissionData || gridSequence.length > 0) return;

        const initSession = async () => {
            const newUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            setUserId(newUserId);

            // GRID_SEQUENCE 생성
            const sequence = generateGridSequence(
                submissionData.bodyHeight,
                submissionData.shoulderWidth,
                submissionData.initialWidth,
                submissionData.initialHeight,
                maxGridWidth,
                maxGridHeight,
            );
            setGridSequence(sequence);

            // 보정된 w, h 계산
            const { correctedW, correctedH } = calculateCorrectedGrid(
                submissionData.bodyHeight,
                submissionData.shoulderWidth,
                submissionData.initialWidth,
                submissionData.initialHeight,
                maxGridWidth,
                maxGridHeight,
            );

            // 초기 인덱스 찾기 (보정된 값 사용)
            const initialIndex = findInitialStepIndex(sequence, correctedW, correctedH);
            setStepIndex(initialIndex);
            setTouchStartIndex(initialIndex);

            const initialStep = sequence[initialIndex];

            // Supabase에 초기 데이터 저장 (displayWidth, displayHeight 포함)
            const { error } = await supabase
                .from('adjustments')
                .upsert({
                    id: 1,
                    width: initialStep.width,
                    height: initialStep.height,
                    display_width: initialStep.displayWidth,
                    display_height: initialStep.displayHeight,
                    user_id: newUserId,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'id' });

            if (error) {
                console.error('초기화 실패:', error);
                setIsConnected(false);
            } else {
                setIsConnected(true);
            }

            setIsLoading(false);
        };

        initSession();
    }, [submissionData, gridSequence.length]);

    // Realtime 구독: 다른 사용자 감지
    useEffect(() => {
        if (!userId) return;

        const channel = supabase
            .channel('adjustments-changes')
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'adjustments' },
                (payload) => {
                    const newUserId = payload.new.user_id;
                    if (newUserId !== userId) {
                        setIsKickedOut(true);
                        alert('다른 사용자가 접속했습니다. 홈으로 이동합니다.');
                        router.push('/');
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId, router]);

    // 신체 부위 레이블 가져오기
    const getBodyPartsLabels = (partIds: string[]): string => {
        const allParts = bodyPartGroups.flatMap(group => group.parts);
        return partIds
            .map(id => allParts.find(part => part.id === id)?.label || id)
            .join(', ');
    };

    const updateStepIndex = async (newIndex: number) => {
        if (newIndex < 0 || newIndex >= gridSequence.length || isKickedOut) return;

        setStepIndex(newIndex);
        const step = gridSequence[newIndex];

        // Supabase에 실시간 전송 (displayWidth, displayHeight 포함)
        const { error } = await supabase
            .from('adjustments')
            .update({
                width: step.width,
                height: step.height,
                display_width: step.displayWidth,
                display_height: step.displayHeight,
                updated_at: new Date().toISOString()
            })
            .eq('id', 1);

        if (error) {
            console.error('업데이트 실패:', error);
        }
    };

    // 화면 표시용 크기 계산 (비율 유지하며 정규화)
    // 사각형의 실제 크기를 c * w, c * h로 직접 계산
    const c = 5; // 원하는 배율로 조정 (예: 2px)
    let displayWidth = c * currentStep.width;
    let displayHeight = c * currentStep.height;

    const DIRECTION_THRESHOLD = 10; // 방향 결정 임계값 (px)
    const GRID_STEP_PX = 20;        // 좌우: 20px당 1 단계
    const RATIO_PX = 30;            // 상하: 30px당 0.1 변경

    const updateFontSizeRatio = async (newRatio: number) => {
        const clamped = Math.round(Math.max(0.1, Math.min(1.0, newRatio)) * 100) / 100;
        setFontSizeRatio(clamped);
        await supabase.from('config').update({ font_size_ratio: clamped }).eq('id', 1);
    };

    const handleDragStart = (x: number, y: number) => {
        setTouchStartX(x);
        setTouchStartY(y);
        setTouchStartIndex(stepIndex);
        setTouchStartRatio(fontSizeRatio);
        setDragDirection('none');
    };

    const handleDragMove = (x: number, y: number) => {
        const deltaX = x - touchStartX;
        const deltaY = y - touchStartY;

        // 방향 미결정 → 임계값 초과 시 결정
        let currentDirection = dragDirection;
        if (currentDirection === 'none') {
            if (Math.abs(deltaX) < DIRECTION_THRESHOLD && Math.abs(deltaY) < DIRECTION_THRESHOLD) return;
            currentDirection = Math.abs(deltaX) >= Math.abs(deltaY) ? 'horizontal' : 'vertical';
            setDragDirection(currentDirection);
        }

        if (currentDirection === 'horizontal') {
            const steps = Math.round(deltaX / GRID_STEP_PX);
            const newIndex = Math.max(0, Math.min(gridSequence.length - 1, touchStartIndex + steps));
            if (newIndex !== stepIndex) updateStepIndex(newIndex);
        } else {
            const ratioChange = -(deltaY / RATIO_PX) * 0.1;
            updateFontSizeRatio(touchStartRatio + ratioChange);
        }
    };

    const handleDragEnd = () => {
        setTouchStartIndex(stepIndex);
        setTouchStartRatio(fontSizeRatio);
        setDragDirection('none');
        setIsDragging(false);
    };

    const handleTouchStart = (e: React.TouchEvent) => handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
    const handleTouchMove = (e: React.TouchEvent) => handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
    const handleTouchEnd = () => handleDragEnd();

    const handleMouseDown = (e: React.MouseEvent) => { setIsDragging(true); handleDragStart(e.clientX, e.clientY); };
    const handleMouseMove = (e: React.MouseEvent) => { if (!isDragging) return; handleDragMove(e.clientX, e.clientY); };
    const handleMouseUp = () => handleDragEnd();

    // 로딩 중
    if (isLoading || !submissionData) {
        return (
            <div className="container">
                <main>
                    <div className="text" style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center',
                    }}>
                        데이터를 제출하는 중입니다.
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="container">
            <main style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div className="step-header">
                    <div className="text">
                        재단이 완료되었습니다. 중앙에 생성된 지면 위에서 손가락을 좌우로 움직여 보세요.
                    </div>
                </div>

                {/* 드래그 영역 */}
                <div
                    style={{
                        width: '100%',
                        aspectRatio: '1',
                        border: '1px solid var(--color-text)',
                        boxSizing: 'border-box',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                        cursor: 'ew-resize',
                        touchAction: 'none',
                        flexShrink: 0,
                    }}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    {/* 사각형 */}
                    <div
                        style={{
                            width: `${displayWidth}px`,
                            height: `${displayHeight}px`,
                            flexShrink: 0,
                            border: '2px solid var(--color-bg)',
                            background: 'var(--color-text)',
                        }}
                    />

                    {/* 오른쪽에 height 표시 */}
                    <div className="text" style={{
                        position: 'absolute',
                        right: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        whiteSpace: 'nowrap',
                        background: 'var(--color-bg)',
                        zIndex: 1,
                    }}>
                        {currentStep.height}
                    </div>

                    {/* 아래쪽에 width 표시 */}
                    <div className="text" style={{
                        position: 'absolute',
                        bottom: 8,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        whiteSpace: 'nowrap',
                        background: 'var(--color-bg)',
                        zIndex: 1,
                    }}>
                        {currentStep.width}
                    </div>
                </div>

                <div className="step-footer" style={{ textAlign: 'center' }}>
                    <div>{new Date(submissionData.createdAt).toLocaleTimeString('ko-KR', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })} 업로드</div>
                    <div>{isConnected ? '연결됨' : '연결끊김'} · 글자비율 {fontSizeRatio.toFixed(2)}</div>
                </div>
            </main>
        </div>
    );
}