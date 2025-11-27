"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSetFrameLinks } from "@/hooks/useSetFrameLinks";
import FormInput from "@/components/FormInput";
import BodyPartSelector from "@/components/BodyPartSelector";
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

    const handleNext = () => {
        if (step < 4) {
            setStep(step + 1);
        }
    };

    const handlePrevious = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleSubmit = async () => {
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
                router.push('/');
            } else {
                alert("제출에 실패했습니다. 다시 시도해주세요.");
            }
        } catch (error) {
            console.error("Submission error:", error);
            alert("제출 중 오류가 발생했습니다.");
        }
    };

    useSetFrameLinks({
        links: [
            { slot: 'left', href: '/', label: '처음으로' },
            step === 4
                ? { slot: 'center', onClick: handleSubmit, label: '동의 및 업로드' }
                : { slot: 'center', onClick: handleNext, label: '다음으로' },
            step === 1 
                ? { slot: 'right', href: '/select', label: '뒤로가기' }
                : { slot: 'right', onClick: handlePrevious, label: '뒤로가기' },
        ]
    });

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
                    <div className="step-header">
                        <div className="text">1</div>
                        <div className="text">본인의 신장과 어깨너비를</div>
                        <div className="text">입력해 주세요.</div>
                    </div>
                    
                    <form>
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

                        <div className="step-footer">
                            <div className="text">*신장과 어깨너비를 모르는 경우,</div>
                            <div className="text">아래의 줄자를 이용해주세요.</div>
                        </div>
                    </form>

                </>)}

                {/* Step 2: 가로/세로 */}
                {step === 2 && (<>
                    <div className="step-header">
                        <div className="text">2</div>
                        <div className="text">매트 위에 신체가 닿는 영역의</div>
                        <div className="text">가로와 세로 모듈 수를 입력해 주세요.</div>
                    </div>

                    <form>
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

                        <div className="step-footer">
                            <div className="text">*매트 위 네모(ㅁㅁㅁ)는</div>
                            <div className="text">모듈 한 칸을 의미합니다.</div>
                        </div>
                    </form>

                </>)}

                {/* Step 3: 신체 부위 다중 선택 */}
                {step === 3 && (<>
                    <div className="step-header">
                        <div className="text">3</div>
                        <div className="text">매트에 닿은 신체 부위의 명칭을</div>
                        <div className="text">골라주세요.</div>
                    </div>
                
                    <form>
                        <div className="form-group">
                            <BodyPartSelector
                                groups={bodyPartGroups}
                                selected={formData.bodyParts}
                                onToggle={handleBodyPartToggle}
                            />
                        </div>
                    </form>
                </>)}

                {/* Step 4: 제출 동의 */}
                {step === 4 && (<>
                    <div className="step-header">
                        <div className="text">4</div>
                        <div className="text">입력하신 정보는 이후 연구 및</div>
                        <div className="text">아카이브 작업에 활용됩니다.</div>
                        <div className="text">이에 동의하시나요?</div>
                    </div>
                </>)}
            </main>
        </div>
    );
}
