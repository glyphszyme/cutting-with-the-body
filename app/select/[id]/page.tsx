"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSetCornerLinks } from "@/hooks/useSetCornerLinks";
import { getPoseById } from "@/data/poses";

export default function PoseDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const pose = getPoseById(id);

    useSetCornerLinks({
        links: [
            { slot: 'bottom-left-center', href: '/', label: '처음으로' },
            { slot: 'bottom-right-center', href: '/select', label: '뒤로가기' },
        ]
    });

    if (!pose) {
        return (
            <div className="container">
                <main>
                    <div style={{ marginTop: '50px' }}>
                        <div className="text">포즈를 찾을 수 없습니다.</div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="container">
            <main>
                <div style={{
                    marginTop: '50px',
                    minHeight: `calc(100vh - var(--outer-padding) * 9)`,
                    textAlign: 'center',
                    position: 'relative',
                    flexDirection: 'column',
                    display: 'flex', alignItems: 'center',
                }}>
                    <div className="text--large" style={{ textAlign: 'center', marginBottom: '30px' }}>
                        {pose.name}
                    </div>
                    <div className="text">
                        ■ {pose.target_area.join(' · ')}
                    </div>
                    <img style={{
                        maxWidth: '300px',
                        height: 'auto',
                    }} src={`/images/${pose.id}_bg.png`} alt={pose.name} />
                    <div className="text" style={{
                        position: 'absolute',
                        width: '80%',
                        bottom: '80px',
                    }}>
                        {pose.description}
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
                        <Link href="/">다음으로</Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
