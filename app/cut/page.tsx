"use client";

import { useState } from "react";
import { useSetCornerLinks } from "@/hooks/useSetCornerLinks";
import FormInput from "@/components/FormInput";
import BodyPartSelector from "@/components/BodyPartSelector";
import { bodyPartGroups } from "@/data/bodyParts";

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
                    
                    <form onSubmit={handleNext}>
                        <FormInput
                            id="height"
                            label="신장"
                            value={formData.height}
                            placeholder="161"
                            unit="cm"
                            onChange={(value) => handleInputChange("height", value)}
                        />
                        
                        <FormInput
                            id="shoulderWidth"
                            label="어깨"
                            value={formData.shoulderWidth}
                            placeholder="40"
                            unit="cm"
                            onChange={(value) => handleInputChange("shoulderWidth", value)}
                        />

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
                        <FormInput
                            id="width"
                            label="가로"
                            value={formData.width}
                            placeholder="5"
                            unit="개"
                            onChange={(value) => handleInputChange("width", value)}
                        />

                        <FormInput
                            id="length"
                            label="세로"
                            value={formData.length}
                            placeholder="8"
                            unit="개"
                            onChange={(value) => handleInputChange("length", value)}
                        />

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
                            <BodyPartSelector
                                groups={bodyPartGroups}
                                selected={formData.bodyParts}
                                onToggle={handleBodyPartToggle}
                            />
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
