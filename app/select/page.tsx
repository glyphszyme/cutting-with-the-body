"use client";
import { useSetFrameLinks } from "@/hooks/useSetFrameLinks";
import { poses } from "@/data/poses";
import { useRouter } from "next/navigation";

export default function SelectPage() {
    const router = useRouter();
    
    useSetFrameLinks({
        links: [
            { slot: 'left', href: '/cut', label: '바로재단하기' },
            { slot: 'right', href: '/notice', label: '주의사항보기' },
        ]
    });

    // 이미지 위치 설정 (6개)
    const imagePositions = [
        { id: poses[0].id, name: poses[0].name, top: '50px', left: '100px' },
        { id: poses[1].id, name: poses[1].name, top: '50px', left: '300px' },
        { id: poses[2].id, name: poses[2].name, top: '200px', left: '100px' },
        { id: poses[3].id, name: poses[3].name, top: '200px', left: '300px' },
        { id: poses[4].id, name: poses[4].name, top: '100px', left: '200px' },
        { id: poses[5].id, name: poses[5].name, top: '250px', left: '200px' },
    ];

    const handleImageClick = (e: React.MouseEvent<HTMLImageElement>, imageId: string) => {
        e.preventDefault();
        
        const img = e.currentTarget;
        const rect = img.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Canvas를 사용해 클릭한 위치의 픽셀 알파값 확인
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) return;

        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);

        // 클릭 좌표를 이미지의 실제 크기에 맞게 변환
        const scaleX = img.naturalWidth / rect.width;
        const scaleY = img.naturalHeight / rect.height;
        const imgX = Math.floor(x * scaleX);
        const imgY = Math.floor(y * scaleY);

        const pixelData = ctx.getImageData(imgX, imgY, 1, 1).data;
        const alpha = pixelData[3];

        // 투명한 부분이 아닐 때만 라우팅
        if (alpha > 0) {
            router.push(`/select/${imageId}`);
        }
    };

    return (
        <div className="container">
            <main>
                <div className="text">
                    <div>아래 6가지 동작들을 클릭해</div>
                    <div>매트 위에서 따라해보세요.</div>
                </div>
                
                {/* 프레임과 이미지 그룹 */}
                <div className="image-frame" style={{
                    position: 'relative',
                    width: '100%',
                    height: '100vh',
                    background: 'white',
                    border: '1px solid currentColor',
                    margin: '40px auto',
                }}>
                    {imagePositions.map((image) => (
                        <div
                            key={image.id}
                            style={{
                                position: 'absolute',
                                top: image.top,
                                left: image.left,
                            }}
                        >
                            <img
                                src={`/images/${image.id}.png`} 
                                alt={image.name}
                                onClick={(e) => handleImageClick(e, image.id)}
                                style={{
                                    width: '100px',
                                    height: 'auto',
                                    display: 'block',
                                    cursor: 'pointer',
                                }}
                            />
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
