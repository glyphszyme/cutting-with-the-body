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
                <div style={{ marginTop: '50px' }}>
                    <div className="text">아래 6가지 동작들을 클릭해</div>
                    <div className="text">매트 위에서 따라해보세요.</div>
                </div>
                
                <ul className="pose-list"
                    style={{ marginTop: '100px' }}>
                    {poses.map((pose) => (
                        <li key={pose.id}>
                            <Link href={`/select/${pose.id}`}>
                                <h3>{pose.name}</h3>
                                {/* <p>{pose.description}</p> */}
                            </Link>
                        </li>
                    ))}
                </ul>
            </main>
        </div>
    );
}
