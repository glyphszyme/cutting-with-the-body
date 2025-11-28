"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSetFrameLinks } from "@/hooks/useSetFrameLinks";
import { bodyPartGroups } from "@/data/bodyParts";
import { supabase } from "@/lib/supabase";

export default function AdjustPage() {
    const router = useRouter();
    
    // 테스트 데이터
    const testBodyHeight = 178;
    const testShoulderWidth = 50;
    const testBodyParts = ["palm", "leg", "thigh"];
    const testCreatedAt = new Date().toISOString();
    
    const initialWidth = 10;
    const initialHeight = 30;
    const area = initialWidth * initialHeight; // 300
    const minWidth = 1;
    const maxWidth = 60; // 더 많은 단계 (1-60)

    const [width, setWidth] = useState(initialWidth);
    const [height, setHeight] = useState(initialHeight);
    const [userId, setUserId] = useState<string>('');
    const [isKickedOut, setIsKickedOut] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [touchStartX, setTouchStartX] = useState(0);
    const [touchStartWidth, setTouchStartWidth] = useState(initialWidth);

    useSetFrameLinks({
        links: [
            { slot: 'left', href: '/select', label: '다른자세보기' },
            { slot: 'center', href: '/', label: '처음으로' },
            { slot: 'right', href: '/cut', label: '다시재단하기' },
        ]
    });

    // 초기화: user_id 생성 및 Supabase에 저장
    useEffect(() => {
        const initSession = async () => {
            const newUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            setUserId(newUserId);

            // Supabase에 초기 데이터 저장
            const { error } = await supabase
                .from('adjustments')
                .upsert({
                    id: 1,
                    width: initialWidth,
                    height: initialHeight,
                    user_id: newUserId,
                    updated_at: new Date().toISOString()
                });

            if (error) {
                console.error('초기화 실패:', error);
                setIsConnected(false);
            } else {
                setIsConnected(true);
            }
        };

        initSession();
    }, []);

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

    const updateDimensions = async (newWidth: number) => {
        if (newWidth > 0 && !isKickedOut) {
            const newHeight = Math.floor(area / newWidth);
            setWidth(newWidth);
            setHeight(newHeight);

            // Supabase에 실시간 전송
            const { error } = await supabase
                .from('adjustments')
                .update({
                    width: newWidth,
                    height: newHeight,
                    updated_at: new Date().toISOString()
                })
                .eq('id', 1);

            if (error) {
                console.error('업데이트 실패:', error);
            }
        }
    };

    // 화면에 맞는 스케일 계산 (비율 유지)
    const maxDisplaySize = 200; // 최대 표시 크기 (px)
    const aspectRatio = width / height;
    let displayWidth, displayHeight;
    
    if (aspectRatio > 1) {
        // 가로가 더 긴 경우
        displayWidth = Math.min(width * 20, maxDisplaySize);
        displayHeight = displayWidth / aspectRatio;
    } else {
        // 세로가 더 긴 경우
        displayHeight = Math.min(height * 20, maxDisplaySize);
        displayWidth = displayHeight * aspectRatio;
    }

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStartX(e.touches[0].clientX);
        setTouchStartWidth(width);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        const deltaX = e.touches[0].clientX - touchStartX;
        const swipeThreshold = 10; // 10px당 1 단계 변경
        const steps = Math.round(deltaX / swipeThreshold);
        const newWidth = Math.max(minWidth, Math.min(maxWidth, touchStartWidth + steps));
        
        if (newWidth !== width) {
            updateDimensions(newWidth);
        }
    };

    const handleTouchEnd = () => {
        // 터치 종료 시 현재 width를 기준으로 재설정
        setTouchStartWidth(width);
    };

    return (
        <div className="container">
            <main>
                <div className="text">
                    재단이 완료되었습니다. 중앙에 생성된 지면 위에서 손가락을 좌우로 움직여 보세요.
                </div>

                <div className="text" style={{
                    textAlign: 'center',
                    margin: '20px 0',
                }}>
                    <div>신장: {testBodyHeight} cm·어깨너비: {testShoulderWidth} cm</div>
                    <div>■ {getBodyPartsLabels(testBodyParts).split(", ").join('·')}</div>
                </div>
                
                <div
                    style={{
                        position: 'absolute',
                        top: 'calc(50% + 30px)',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: `${displayWidth}px`,
                        height: `${displayHeight}px`,
                        border: '2px solid var(--color-bg)',
                        cursor: 'ew-resize',
                        touchAction: 'none',
                        background: 'red',
                    }}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                />
                <div className="text" style={{
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    bottom: '60px',
                }}>
                    <div>{new Date(testCreatedAt).toLocaleTimeString('ko-KR', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
                    <div>{isConnected ? '연결됨' : '연결끊김'}</div>
                </div>
            </main>
        </div>
    );
}