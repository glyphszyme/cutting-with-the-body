"use client";

import { useState } from "react";
import { useSetCornerLinks } from "@/hooks/useSetCornerLinks";

const bodyParts = [
    // 그룹 1: 손과 팔
    {
        group: "hand-arm-1",
        parts: [
            { id: "palm", label: "손바닥" },
            { id: "back-hand", label: "손등" },
            { id: "fingertip", label: "손끝" },
        ]
    },
    {
        group: "hand-arm-2",
        parts: [
            { id: "arm", label: "팔" },
            { id: "forearm", label: "팔뚝" },
            { id: "elbow", label: "팔꿈치" },
        ]
    },
    // 그룹 2: 발과 다리
    {
        group: "foot-leg-1",
        parts: [
            { id: "sole", label: "발바닥" },
            { id: "back-foot", label: "발등" },
            { id: "toe", label: "발끝" },
        ]
    },
    {
        group: "foot-leg-2",
        parts: [
            { id: "leg", label: "다리" },
            { id: "thigh", label: "허벅지" },
            { id: "calf", label: "종아리" },
            { id: "shin", label: "정강이" },
        ]
    },
    // 그룹 3: 몸통과 머리
    {
        group: "body-head-1",
        parts: [
            { id: "hip", label: "엉덩이" },
            { id: "shoulder", label: "어깨" },
            { id: "chest", label: "가슴" },
            { id: "back", label: "등" },
        ]
    },
    {
        group: "body-head-2",
        parts: [
            { id: "back-head", label: "뒷통수" },
            { id: "crown", label: "정수리" },
            { id: "face", label: "얼굴" },
            { id: "neck", label: "목" },
        ]
    },
];

interface FormData {
        height: string;
        shoulderWidth: string;
        width: string;
        length: string;
        bodyParts: string[];
}

export default function CutPage() {
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState<FormData>({
        height: "",
        shoulderWidth: "",
        width: "",
        length: "",
        bodyParts: [],
    });

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        if (step < 3) {
            setStep(step + 1);
        }
    };

    const handlePrevious = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    useSetCornerLinks({
        links: [
            { slot: 'bottom-left-center', href: '/', label: '처음으로' },
            { slot: 'bottom-right-center', onClick: handlePrevious, label: '뒤로가기' },
        ]
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const response = await fetch("/api/submissions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (result.success) {
                alert("데이터가 제출되었습니다!");
                // 제출 후 폼 초기화
                setFormData({
                    height: "",
                    shoulderWidth: "",
                    width: "",
                    length: "",
                    bodyParts: [],
                });
                setStep(1);
            } else {
                alert("제출에 실패했습니다. 다시 시도해주세요.");
            }
        } catch (error) {
            console.error("Submission error:", error);
            alert("제출 중 오류가 발생했습니다.");
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleBodyPartToggle = (partId: string) => {
        setFormData({
            ...formData,
            bodyParts: formData.bodyParts.includes(partId)
                ? formData.bodyParts.filter((id) => id !== partId)
                : [...formData.bodyParts, partId],
        });
    };

    return (
        <div className="container">
            <main>
                {/* Step 1: 신장/어깨너비 */}
                {step === 1 && (<>
                    <div style={{
                        marginTop: '50px', marginBottom: '50px'
                    }}>
                        <div className="text">1</div>
                        <div className="text">본인의 신장과 어깨너비를</div>
                        <div className="text">입력해 주세요.</div>
                    </div>
                    
                    <div></div>
                    <form onSubmit={handleNext}>
                        <div className="form-group" style={{
                            backgroundColor: 'black',
                            color: 'white',
                            height: 67,
                            margin: '10px 0',
                        }}>
                            <label htmlFor="height" style={{
                                fontSize: '20px',
                                left: '55px',
                                position: 'absolute',
                            }}>신<br />장</label>
                            <input
                                type="number"
                                id="height"
                                value={formData.height}
                                onChange={(e) => handleInputChange("height", e.target.value)}
                                placeholder="161"
                                style={{
                                    width: '100px',
                                    textAlign: 'right',
                                    fontSize: '20px',
                                    position: 'absolute',
                                    right: '100px',
                                }}
                                required
                            />
                            <label htmlFor="height" style={{
                                fontSize: '20px',
                                position: 'absolute',
                                right: '55px',
                            }}>cm</label>
                        </div>
                    </form>
                    <form onSubmit={handleNext}>
                        <div className="form-group" style={{
                            backgroundColor: 'black',
                            color: 'white',
                            height: 67,
                            margin: '10px 0',
                        }}>
                            <label htmlFor="shoulderWidth" style={{
                                fontSize: '20px',
                                left: '55px',
                                position: 'absolute',
                            }}>어<br />깨</label>
                            <input
                                type="number"
                                id="shoulderWidth"
                                value={formData.shoulderWidth}
                                onChange={(e) => handleInputChange("shoulderWidth", e.target.value)}
                                placeholder="40"
                                style={{
                                    width: '100px',
                                    textAlign: 'right',
                                    fontSize: '20px',
                                    position: 'absolute',
                                    right: '100px',
                                }}
                                required
                            />
                            <label htmlFor="shoulderWidth" style={{
                                fontSize: '20px',
                                position: 'absolute',
                                right: '55px',
                            }}>cm</label>
                        </div>

                        <button type="submit">다음으로</button>
                    </form>

                    <div className="text">*신장과 어깨너비를 모르는 경우,</div>
                    <div className="text">아래의 줄자를 이용해주세요.</div>
                </>)}

                {/* Step 2: 가로/세로 */}
                {step === 2 && (<>
                    <div style={{
                        marginTop: '50px', marginBottom: '50px'
                    }}>
                        <div className="text">2</div>
                        <div className="text">매트 위에 신체가 닿는 영역의</div>
                        <div className="text">가로와 세로 모듈 수를 입력해 주세요.</div>
                    </div>

                    <form onSubmit={handleNext}>
                        <div className="form-group" style={{
                            backgroundColor: 'black',
                            color: 'white',
                            height: 67,
                            margin: '10px 0',
                        }}>
                            <label htmlFor="height" style={{
                                fontSize: '20px',
                                left: '55px',
                                position: 'absolute',
                            }}>가<br />로</label>
                            <input
                                type="number"
                                id="width"
                                value={formData.width}
                                onChange={(e) => handleInputChange("width", e.target.value)}
                                placeholder="5"
                                style={{
                                    width: '100px',
                                    textAlign: 'right',
                                    fontSize: '20px',
                                    position: 'absolute',
                                    right: '90px',
                                }}
                                required
                            />
                            <label htmlFor="height" style={{
                                fontSize: '20px',
                                position: 'absolute',
                                right: '55px',
                            }}>개</label>
                        </div>

                        <div className="form-group" style={{
                            backgroundColor: 'black',
                            color: 'white',
                            height: 67,
                            margin: '10px 0',
                        }}>
                            <label htmlFor="height" style={{
                                fontSize: '20px',
                                left: '55px',
                                position: 'absolute',
                            }}>세<br />로</label>
                            <input
                                type="number"
                                id="length"
                                value={formData.length}
                                onChange={(e) => handleInputChange("length", e.target.value)}
                                placeholder="8"
                                style={{
                                    width: '100px',
                                    textAlign: 'right',
                                    fontSize: '20px',
                                    position: 'absolute',
                                    right: '90px',
                                }}
                                required
                            />
                            <label htmlFor="length" style={{
                                fontSize: '20px',
                                position: 'absolute',
                                right: '55px',
                            }}>개</label>
                        </div>

                        <div className="button-group">
                            <button type="button" onClick={handlePrevious}>이전</button>
                            <button type="submit">다음</button>
                        </div>
                    </form>

                    <div className="text">*매트 위 네모(ㅁㅁㅁ)는</div>
                    <div className="text">모듈 한 칸을 의미합니다.</div>
                </>)}

                {/* Step 3: 신체 부위 다중 선택 */}
                {step === 3 && (<>
                    <div style={{
                        marginTop: '50px', marginBottom: '50px'
                    }}>
                        <div className="text">3</div>
                        <div className="text">매트에 닿은 신체 부위의 명칭을</div>
                        <div className="text">골라주세요.</div>
                    </div>
                
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <div className="body-parts-container">
                                {/* 그룹 1: 손과 팔 */}
                                <div className="major-group">
                                    {bodyParts.slice(0, 2).map((group) => (
                                        <div key={group.group} className="body-part-group">
                                            <div className="checkbox-group">
                                                {group.parts.map((part) => (
                                                    <button
                                                        key={part.id}
                                                        type="button"
                                                        className={`body-part-button ${formData.bodyParts.includes(part.id) ? 'selected' : ''}`}
                                                        onClick={() => handleBodyPartToggle(part.id)}
                                                    >
                                                        {part.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* 그룹 2: 발과 다리 */}
                                <div className="major-group">
                                    {bodyParts.slice(2, 4).map((group) => (
                                        <div key={group.group} className="body-part-group">
                                            <div className="checkbox-group">
                                                {group.parts.map((part) => (
                                                    <button
                                                        key={part.id}
                                                        type="button"
                                                        className={`body-part-button ${formData.bodyParts.includes(part.id) ? 'selected' : ''}`}
                                                        onClick={() => handleBodyPartToggle(part.id)}
                                                    >
                                                        {part.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* 그룹 3: 몸통과 머리 */}
                                <div className="major-group">
                                    {bodyParts.slice(4, 6).map((group) => (
                                        <div key={group.group} className="body-part-group">
                                            <div className="checkbox-group">
                                                {group.parts.map((part) => (
                                                    <button
                                                        key={part.id}
                                                        type="button"
                                                        className={`body-part-button ${formData.bodyParts.includes(part.id) ? 'selected' : ''}`}
                                                        onClick={() => handleBodyPartToggle(part.id)}
                                                    >
                                                        {part.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="button-group">
                            <button type="button" onClick={handlePrevious}>이전</button>
                            <button type="submit">제출</button>
                        </div>
                    </form>
                </>)}
            </main>
        </div>
    );
}
