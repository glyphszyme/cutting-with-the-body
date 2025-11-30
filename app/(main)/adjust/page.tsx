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
    const [touchStartIndex, setTouchStartIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

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
                submissionData.initialHeight
            );
            setGridSequence(sequence);

            // 보정된 w, h 계산
            const { correctedW, correctedH } = calculateCorrectedGrid(
                submissionData.bodyHeight,
                submissionData.shoulderWidth,
                submissionData.initialWidth,
                submissionData.initialHeight
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
                });

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

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStartX(e.touches[0].clientX);
        setTouchStartIndex(stepIndex);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        const deltaX = e.touches[0].clientX - touchStartX;
        const swipeThreshold = 20; // 20px당 1 단계 변경
        const steps = Math.round(deltaX / swipeThreshold);
        const newIndex = Math.max(0, Math.min(gridSequence.length - 1, touchStartIndex + steps));
        
        if (newIndex !== stepIndex) {
            updateStepIndex(newIndex);
        }
    };

    const handleTouchEnd = () => {
        // 터치 종료 시 현재 index를 기준으로 재설정
        setTouchStartIndex(stepIndex);
    };

    // 마우스 이벤트 (데스크톱)
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setTouchStartX(e.clientX);
        setTouchStartIndex(stepIndex);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        const deltaX = e.clientX - touchStartX;
        const swipeThreshold = 20;
        const steps = Math.round(deltaX / swipeThreshold);
        const newIndex = Math.max(0, Math.min(gridSequence.length - 1, touchStartIndex + steps));
        
        if (newIndex !== stepIndex) {
            updateStepIndex(newIndex);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setTouchStartIndex(stepIndex);
    };

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
            <main>
                <div className="step-header">
                    <div className="text">
                        재단이 완료되었습니다. 중앙에 생성된 지면 위에서 손가락을 좌우로 움직여 보세요.
                    </div>
                </div>

                <div style={{
                    position: 'absolute',
                    top: 'calc(50% - 10px)',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}>
                    {/* 사각형 */}
                    <div
                        style={{
                            width: `${displayWidth}px`,
                            height: `${displayHeight}px`,
                            border: '2px solid var(--color-bg)',
                            cursor: 'ew-resize',
                            touchAction: 'none',
                            background: 'var(--color-text)',
                        }}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                    />
                    
                    {/* 오른쪽에 height 표시 */}
                    <div className="text" style={{
                        position: 'absolute',
                        right: `-20px`,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        whiteSpace: 'nowrap',
                    }}>
                        {currentStep.height}
                    </div>
                    
                    {/* 아래쪽에 width 표시 */}
                    <div className="text" style={{
                        position: 'absolute',
                        bottom: `-30px`,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        whiteSpace: 'nowrap',
                    }}>
                        {currentStep.width}
                    </div>
                </div>

                <div className="step-footer" style={{
                    textAlign: 'center',
                }}>
                    <div>{new Date(submissionData.createdAt).toLocaleTimeString('ko-KR', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })} 업로드</div>
                    <div>{isConnected ? '연결됨' : '연결끊김'}</div>
                </div>
            </main>
        </div>
    );
}