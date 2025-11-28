"use client";
import { useParams, useRouter } from "next/navigation";
import { useSetFrameLinks } from "@/hooks/useSetFrameLinks";
import { getPoseById, poses } from "@/data/poses";

export default function PoseDetailPage() {
    const params = useParams();
    // const router = useRouter();
    const id = params.id as string;
    const pose = getPoseById(id);

    // 현재 포즈의 인덱스 찾기
    const currentIndex = poses.findIndex(p => p.id === id);
    const nextIndex = (currentIndex + 1) % poses.length; // 마지막이면 처음으로
    const nextPoseId = poses[nextIndex].id;

    useSetFrameLinks({
        links: [
            { slot: 'left', href: '/select', label: '모든자세보기' },
            { slot: 'center', href: `/select/${nextPoseId}`, label: '다음자세보기' },
            { slot: 'right', href: '/cut', label: '재단하기' },
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
                <div className="text text--large">
                    {pose.name}
                </div>
                <div className="text" style={{
                    borderTop: '1px solid var(--color-text)',
                    borderBottom: '1px solid var(--color-text)',
                    margin: '10px auto',
                    padding: '10px 0',
                }}>
                    ■ {pose.target_area.join('·')}
                </div>

                <img
                    src={`/images/${pose.id}_bg.png`} alt={pose.name} style={{
                        width: '100%',
                        height: 'auto',
                    }}
                />

                <div className="text">
                    {pose.description}
                </div>
            </main>
        </div>
    );
}
