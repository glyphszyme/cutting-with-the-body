"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSetCornerLinks } from "@/hooks/useSetCornerLinks";
import FormInput from "@/components/FormInput";
import BodyPartSelector from "@/components/BodyPartSelector";
import StepHeader from "@/components/StepHeader";
import StepFooter from "@/components/StepFooter";
import { bodyPartGroups } from "@/data/bodyParts";

interface FormData {
    bodyHeight: string;
    shoulderWidth: string;
    width: string;
    height: string;
    bodyParts: string[];
}

export default function CutPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState<FormData>({
        bodyHeight: "",
        shoulderWidth: "",
        width: "",
        height: "",
        bodyParts: [],
    });

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        if (step < 4) {
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
            step === 1 
                ? { slot: 'bottom-right-center', href: '/select', label: '뒤로가기' }
                : { slot: 'bottom-right-center', onClick: handlePrevious, label: '뒤로가기' },
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
                // 제출 성공 시 바로 홈으로 이동
                router.push('/');
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
                    <StepHeader
                        stepNumber={1}
                        title={["본인의 신장과 어깨너비를", "입력해 주세요."]}
                    />
                    
                    <form onSubmit={handleNext}>
                        <FormInput
                            id="bodyHeight"
                            label="신장"
                            value={formData.bodyHeight}
                            placeholder="161"
                            unit="cm"
                            onChange={(value) => handleInputChange("bodyHeight", value)}
                        />
                        
                        <FormInput
                            id="shoulderWidth"
                            label="어깨"
                            value={formData.shoulderWidth}
                            placeholder="40"
                            unit="cm"
                            onChange={(value) => handleInputChange("shoulderWidth", value)}
                        />

                        <StepFooter lines={["*신장과 어깨너비를 모르는 경우,", "아래의 줄자를 이용해주세요."]} />

                        <button type="submit">다음으로</button>
                    </form>

                </>)}

                {/* Step 2: 가로/세로 */}
                {step === 2 && (<>
                    <StepHeader
                        stepNumber={2}
                        title={["매트 위에 신체가 닿는 영역의", "가로와 세로 모듈 수를 입력해 주세요."]}
                    />

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
                            id="height"
                            label="세로"
                            value={formData.height}
                            placeholder="8"
                            unit="개"
                            onChange={(value) => handleInputChange("height", value)}
                        />

                        <StepFooter lines={["*매트 위 네모(ㅁㅁㅁ)는", "모듈 한 칸을 의미합니다."]} />

                        <button type="submit">다음으로</button>
                    </form>

                </>)}

                {/* Step 3: 신체 부위 다중 선택 */}
                {step === 3 && (<>
                    <StepHeader
                        stepNumber={3}
                        title={["매트에 닿은 신체 부위의 명칭을", "골라주세요."]}
                    />
                
                    <form onSubmit={handleNext}>
                        <div className="form-group">
                            <BodyPartSelector
                                groups={bodyPartGroups}
                                selected={formData.bodyParts}
                                onToggle={handleBodyPartToggle}
                            />
                        </div>

                        <button type="submit">다음으로</button>
                    </form>
                </>)}

                {/* Step 4: 제출 동의 */}
                {step === 4 && (<>
                    <StepHeader
                        stepNumber={4}
                        title={["입력하신 정보는 이후 연구 및", "아카이브 작업에 활용됩니다.", "이에 동의하시나요?"]}
                    />
                
                    <form onSubmit={handleSubmit}>
                        <button type="submit" style={{
                            width: '200px',
                            height: '67px',
                            backgroundColor: 'black',
                            color: 'white',
                            fontSize: '20px',
                            position: 'absolute',
                            left: '50%',
                            bottom: '10%',
                            textDecoration: 'none',
                            transform: 'translate(-50%, -50%)',
                        }}>동의 및 업로드</button>
                    </form>
                </>)}
            </main>
        </div>
    );
}
