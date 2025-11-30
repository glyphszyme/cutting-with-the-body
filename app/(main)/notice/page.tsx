"use client";
import Link from "next/link";

import { useSetFrameLinks } from "@/hooks/useSetFrameLinks";


export default function NoticePage() {
    useSetFrameLinks({
        links: [
            { slot: 'left', href: '/', label: '처음으로' },
            { slot: 'center', href: 'cut', label: '재단하기' },
            { slot: 'right', href: '/select', label: '뒤로가기' },
        ]
    });
    
    return (
        <>
            <style jsx global>{`
                .content-wrapper {
                    color: var(--color-bg);
                    background-color: var(--color-text);
                }
                .frame-link-slot-center > a {
                    background: color: var(--color-text);
                    color: var(--color-bg);
                }}
            `}</style>
            
            <div className="container">
                <main>
                    <div style={{
                        textAlign: 'center',
                        marginTop: '20px',
                    }}>
                        <div className="text text--large" style={{
                            padding: '5px 20px',
                            display: 'inline-block',

                            backgroundImage: 'repeating-linear-gradient(0deg, var(--color-bg), var(--color-bg) 4px, transparent 4px, transparent 12px), repeating-linear-gradient(90deg, var(--color-bg), var(--color-bg) 4px, transparent 4px, transparent 12px), repeating-linear-gradient(180deg, var(--color-bg), var(--color-bg) 4px, transparent 4px, transparent 12px), repeating-linear-gradient(270deg, var(--color-bg), var(--color-bg) 4px, transparent 4px, transparent 12px)',
                            backgroundSize: '2px 100%, 100% 2px, 2px 100%, 100% 2px',
                            backgroundPosition: '0 0, 0 0, 100% 0, 0 100%',
                            backgroundRepeat: 'no-repeat',
                        }}>
                            재단하기 전 주의사항
                        </div>
                    </div>
                    <br />
                    
                    <div style={{
                        height: 'calc(100vh - 380px)',
                        overflowX: 'hidden',
                        overflowY: 'scroll',
                    //     background: 'red',
                    }}>
                        <div className="text text--notice">
                            <div>0.</div>
                            <div>재단하기 전, 본인의 신장과 어깨너비가 필요합니다. 신장과 어깨너비를 모르는 경우, 비치된 줄자를 이용해주세요.</div>
                        </div>

                        <div className="text text--notice">
                            <div>1.</div>
                            <div>매트 위에 올라가 재단을 원하는 신체 부위를 접촉시켜 주세요.</div>
                        </div>

                        <div className="text text--notice">
                            <div>2.</div>
                            <div>접촉면의 모듈(■■■)을 따라 가로와 세로의 갯수를 입력해 주세요.</div>
                        </div>
                        
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            
                            position: 'relative',
                            left: '12px',
                        }}> 
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0px',
                            }}>
                                <div style={{
                                    fontSize: '12px',
                                    textAlign: 'center',
                                }}>4개</div>
                                
                                {/* 그리드와 이미지 컨테이너 */}
                                <div style={{
                                    position: 'relative',
                                    width: '80px',
                                    height: '80px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    {/* 4x4 그리드 배경 - SVG로 정확한 테두리 표현 */}
                                    <svg 
                                        style={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            zIndex: 0,
                                        }}
                                        width="80" 
                                        height="80" 
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        {/* 세로 선 (5개: 테두리 포함) */}
                                        <line x1="0" y1="0" x2="0" y2="80" stroke="var(--color-bg)" strokeWidth="1" />
                                        <line x1="20" y1="0" x2="20" y2="80" stroke="var(--color-bg)" strokeWidth="1" />
                                        <line x1="40" y1="0" x2="40" y2="80" stroke="var(--color-bg)" strokeWidth="1" />
                                        <line x1="60" y1="0" x2="60" y2="80" stroke="var(--color-bg)" strokeWidth="1" />
                                        <line x1="80" y1="0" x2="80" y2="80" stroke="var(--color-bg)" strokeWidth="1" />
                                        
                                        {/* 가로 선 (5개: 테두리 포함) */}
                                        <line x1="0" y1="0" x2="80" y2="0" stroke="var(--color-bg)" strokeWidth="1" />
                                        <line x1="0" y1="20" x2="80" y2="20" stroke="var(--color-bg)" strokeWidth="1" />
                                        <line x1="0" y1="40" x2="80" y2="40" stroke="var(--color-bg)" strokeWidth="1" />
                                        <line x1="0" y1="60" x2="80" y2="60" stroke="var(--color-bg)" strokeWidth="1" />
                                        <line x1="0" y1="80" x2="80" y2="80" stroke="var(--color-bg)" strokeWidth="1" />
                                    </svg>
                                    
                                    {/* hand 이미지 - 그리드보다 작게 */}
                                    <img src="/images/hand.webp" alt="" style={{
                                        position: 'relative',
                                        width: '50px', 
                                        height: '50px',
                                        zIndex: 1,
                                    }}/>
                                </div>
                            </div>
                            <div style={{
                                fontSize: '12px',
                                textAlign: 'center',
                                position: 'relative',
                                top: '14px',
                            }}>4개</div>
                        </div>

                    </div>

                    <br />

                    <div className="text" style={{
                        position: 'absolute',
                        bottom: '70px',
                        width: '100%',
                        textAlign: 'center',
                    }}>
                        <div>부디 손끝 조심하시고, 즐거운 재단 되시길!</div>
                    </div>
                </main>
            </div>
        </>
    );
}
