"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useSetFrameLinks } from "@/hooks/useSetFrameLinks";

interface TextLine {
    id: number;
    x: number;
    y: number;
    rotation: number; // 0, 45, 90, 135
    text: string;
}

const LONG_TEXT = `${Array(4).fill("CUTTING WITH THE BODY 몸으로 재단하기").join(" ")}`;
const ROTATIONS = [-45, 0, 45, 90]; // 수평, 우상향 45도, 수직, 좌상향 45도
const MAX_LINES = 4; // 최대 4개의 선만 표시

export default function HomePage() {
    const [lines, setLines] = useState<TextLine[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // 이전 각도와 다른 각도 선택
        const lastRotation = lines.length > 0 ? lines[lines.length - 1].rotation : null;
        const availableRotations = ROTATIONS.filter(r => r !== lastRotation);
        const rotation = availableRotations[Math.floor(Math.random() * availableRotations.length)];

        const newLine: TextLine = {
            id: Date.now(),
            x,
            y,
            rotation,
            text: LONG_TEXT,
        };

        // 최대 4개까지만 유지, 5번째부터는 맨 앞 제거
        setLines((prevLines) => {
            const updatedLines = [...prevLines, newLine];
            if (updatedLines.length > MAX_LINES) {
                return updatedLines.slice(1); // 맨 앞 제거
            }
            return updatedLines;
        });
    };

    useSetFrameLinks({
        links: lines.length >= 3 
            ? [{ slot: 'center', href: '/select', label: '자세둘러보기' }]
            : [],
    });

    return (
        <div 
            className="container" 
            onClick={handleClick}
            style={{ cursor: 'crosshair' }}
        >
            <main>
                <div className="text">
                    화면을 클릭해 재단선을 만들어주세요.
                </div>
                
                <Image
                    src="/images/standing_original.webp" 
                    alt="재단선 예시"
                    width={393} 
                    height={852} 
                    style={{
                        width: '100%',
                        height: 'auto',
                        position: 'absolute',
                        top: 'calc(50% + 40px)',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: -1,
                    }}
                />

                {/* Portal로 body에 직접 렌더링 */}
                {mounted && createPortal(
                    lines.map((line) => (
                        <div
                            key={line.id}
                            className="text"
                            style={{
                                position: 'fixed',
                                left: `${line.x}px`,
                                top: `${line.y}px`,
                                // transform: `translate(-50%, -50%) rotate(${line.rotation}deg)`,
                                whiteSpace: 'nowrap',
                                pointerEvents: 'none',
                                zIndex: 100,
                                textDecoration: 'underline',
                                // mixBlendMode: 'difference',
                                // color: '#ffffff',
                                color: 'var(--color-text)',
                                letterSpacing: '4px',
                                fontSize: 'var(--font-size-base) !important',
                            }}
                        >
                            {line.text}
                        </div>
                    )),
                    document.body
                )}
            </main>
        </div>
    );
}
