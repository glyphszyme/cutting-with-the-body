"use client";
import Link from "next/link";

import { useSetCornerLinks } from "@/hooks/useSetCornerLinks";


export default function NoticePage() {
    useSetCornerLinks({
        links: [
            { slot: 'bottom-left-center', href: '/', label: '처음으로' },
            { slot: 'bottom-right-center', href: '/select', label: '뒤로가기' },
        ]
    });
    
    return (
        <div className="container">
            <main>
                <div className="text text--header text--large" style={{
                    marginTop: '50px', marginBottom: '30px'
                }}>
                    재단하기 전 주의사항
                </div>

                <div className="text">
                    <div>0.</div>
                    <div>재단하기 전, 본인의 신장과 어깨너비가 필요합니다. 신장과 어깨너비를 모르는 경우, 아래의 줄자를 이용해주세요.</div>
                </div>
                <br />

                <div className="text">
                    <div>1.</div>
                    <div>매트 위에 올라가 재단을 원하는 신체 부위를 접촉시켜 주세요.</div>
                </div>
                <br />

                <div className="text">
                    <div>2.</div>
                    <div>접촉면의 모듈을 따라 가로와 세로의 갯수를 입력해 주세요.</div>
                </div>
                <br />
                <br />

                <br />
                <div className="text">
                    <div>부디 손끝 조심하시고, 즐거운 재단 되시길!</div>
                </div>
                
                <div className="text" style={{
                    lineHeight: '1.33',
                    position: 'absolute',
                    textDecoration: 'underline',
                    border: 'none',
                    left: '50%',
                    // marginTop: '20px',
                    bottom: 'var(--outer-padding)',
                    fontSize: 'var(--font-size-base)',
                    transform: 'translateX(-50%)',
                }}>
                    <Link href="cut">
                        재단하기
                    </Link>
                </div>
            </main>
        </div>
    );
}
