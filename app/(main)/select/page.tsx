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

    // 이미지 위치 및 크기 설정 (6개) - 중심점 기준
    const imagePositions = [
        {
            // 누워있는
            id: poses[0].id, 
            name: poses[0].name, 
            centerX: '32%',  // 중심점 X 좌표 (%)
            centerY: '22%',  // 중심점 Y 좌표 (%)
            scale: 5.9       // 크기 비율 (bg 대비 %, 1.0 = 10%)
        },
        { 
            // 앉아있는
            id: poses[1].id, 
            name: poses[1].name, 
            centerX: '80%', 
            centerY: '24%', 
            scale: 4.4 
        },
        { 
            // 엎드려있는
            id: poses[2].id, 
            name: poses[2].name, 
            centerX: '50%', 
            centerY: '74%', 
            scale: 7.0
        },
        { 
            // 발을 뻗고있는
            id: poses[3].id, 
            name: poses[3].name, 
            centerX: '19%', 
            centerY: '48%', 
            scale: 5.0 
        },
        { 
            // 하늘을 보는
            id: poses[4].id, 
            name: poses[4].name, 
            centerX: '83%', 
            centerY: '56%', 
            scale: 3.7
        },
        { 
            // 생각하는
            id: poses[5].id, 
            name: poses[5].name, 
            centerX: '48%', 
            centerY: '44%', 
            scale: 4.3
        },
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
                    position: 'absolute',
                    top: 'calc(50% + 40px)',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '100%',
                    zIndex: '-2',
                }}>
                    {/* 배경 이미지 (액자) */}
                    <img
                        src="/images/bg.png"
                        alt="background frame"
                        style={{
                            width: '100%',
                            height: 'auto',
                            display: 'block',
                            pointerEvents: 'none',

                            // border: '1px solid red',
                        }}
                    />
                    
                    {/* 클릭 가능한 이미지들 - bg에 대한 absolute 위치 */}
                    {imagePositions.map((image) => (
                        <img
                            key={image.id}
                            src={`/images/${image.id}.png`} 
                            alt={image.name}
                            onClick={(e) => handleImageClick(e, image.id)}
                            style={{
                                position: 'absolute',
                                top: image.centerY,
                                left: image.centerX,
                                transform: 'translate(-50%, -50%)', // 중심점 기준 정렬
                                width: `${10 * image.scale}%`, // bg 너비 대비 %
                                height: 'auto',
                                display: 'block',
                                cursor: 'pointer',
                            }}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
}
