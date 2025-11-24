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
                <div style={{ marginTop: '50px' }}>
                    <div className="text--large" style={{ textAlign: 'center', marginBottom: '30px' }}>
                        {pose.name}
                    </div>
                    <div className="text">
                        ■ {pose.target_area.join(' · ')}
                    </div>
                    {/* 여기에 포즈 이미지나 추가 정보를 넣을 수 있습니다 */}
                    <div className="text" style={{
                        position: 'absolute',
                        bottom: '100px',
                    }}>
                        {pose.description}
                    </div>
                    
                    <div className="text" style={{
                        position: 'absolute',
                        textAlign: 'center',
                        bottom: '50px',
                    }}>
                        <Link href="/">다음으로</Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
