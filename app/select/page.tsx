"use client";
import Link from "next/link";
import { useSetCornerLinks } from "@/hooks/useSetCornerLinks";
import { poses } from "@/data/poses";

export default function SelectPage() {
    useSetCornerLinks({
        links: [
            { slot: 'bottom-left-center', href: '/cut', label: '바로재단하기' },
            { slot: 'bottom-right-center', href: '/notice', label: '주의사항보기' },
        ]
    });

    return (
        <div className="container">
            <main>
                <div className="text text--header">
                    <div>아래 6가지 동작들을 클릭해</div>
                    <div>매트 위에서 따라해보세요.</div>
                </div>
                
                <ul className="pose-list" style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, 0)',
                }}>
                    {poses.map((pose) => (
                        <li key={pose.id}>
                            <Link href={`/select/${pose.id}`}>
                                <div className="text">{pose.name}</div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </main>
        </div>
    );
}
