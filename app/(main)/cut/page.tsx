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
    const [errorMessage, setErrorMessage] = useState("신장과 어깨너비를 모르는 경우, 아래의 줄자를 이용해주세요.");

    const [formData, setFormData] = useState<FormData>({
        bodyHeight: "",
        shoulderWidth: "",
        width: "",
        height: "",
        bodyParts: [],
    });
;
    const handleNext = () => {
        const initialErrorMessage = (
            step === 1 ? "가로와 세로 모듈 수를 모르는 경우, 매트 위 네모(■■■)를 참고해주세요."
            : step === 2 ? "신체 부위를 선택해주세요."
            : ""
        );
        setErrorMessage(initialErrorMessage);
        
        // Step별 validation
        if (step === 1) {
            const height = parseInt(formData.bodyHeight);
            const width = parseInt(formData.shoulderWidth);
            
            if (!formData.bodyHeight || isNaN(height)) {
                setErrorMessage('신장을 숫자로 입력해주세요.');
                return;
            }
            if (height <= 0 || height >= 300) {
                setErrorMessage('3m 미만의 신장을 입력해주세요.');
                return;
            }
            
            if (!formData.shoulderWidth || isNaN(width)) {
                setErrorMessage('어깨너비를 숫자로 입력해주세요.');
                return;
            }
            if (width <= 0 || width >= 100) {
                setErrorMessage('1m 미만의 어깨너비를 입력해주세요.');
                return;
            }
        } else if (step === 2) {
            const width = parseInt(formData.width);
            const height = parseInt(formData.height);
            
            if (!formData.width || isNaN(width)) {
                setErrorMessage('가로 개수를 숫자로 입력해주세요.');
                return;
            }
            if (width <= 0 || width > 25) {
                setErrorMessage('가로 모듈의 최대 개수는 25개입니다.');
                return;
            }
            
            if (!formData.height || isNaN(height)) {
                setErrorMessage('세로 개수를 숫자로 입력해주세요.');
                return;
            }
            if (height <= 0 || height > 84) {
                setErrorMessage('세로 모듈의 최대 개수는 84개입니다.');
                return;
            }
        } else if (step === 3) {
            if (formData.bodyParts.length === 0) {
                setErrorMessage('신체 부위를 하나 이상 선택해주세요.');
                return;
            }
        }

        if (step < 4) {
            setStep(step + 1);
        }
    };

    const handlePrevious = () => {
        const initialErrorMessage = (
            step === 2 ? "신장과 어깨너비를 모르는 경우, 아래의 줄자를 이용해주세요"
            : step === 3 ? "가로와 세로 모듈 수를 모르는 경우, 매트 위 네모(■■■)를 참고해주세요"
            : step === 4 ? "신체 부위를 선택해주세요."
            : ""
        );
        setErrorMessage(initialErrorMessage);
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
                router.push('/adjust');
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
            ...(step !== 4 ? [{ slot: 'center' as const, onClick: handleNext, label: '다음으로' }] : []),
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
                        <div className="text">입력해주세요.</div>
                    </div>
                    
                    <form className="step-main">
                        <FormInput
                            id="bodyHeight"
                            label="신장"
                            value={formData.bodyHeight}
                            placeholder="161"
                            unit="cm"
                            onChange={(value) => handleInputChange("bodyHeight", value)}
                            min={50}
                            max={250}
                        />
                        
                        <FormInput
                            id="shoulderWidth"
                            label="어깨"
                            value={formData.shoulderWidth}
                            placeholder="40"
                            unit="cm"
                            onChange={(value) => handleInputChange("shoulderWidth", value)}
                            min={20}
                            max={100}
                        />
                    </form>

                    <div className="step-footer">
                        <div className="text">
                            {errorMessage}
                        </div>
                    </div>
                </>)}

                {/* Step 2: 가로/세로 */}
                {step === 2 && (<>
                    <div className="step-header">
                        <div className="text">2</div>
                        <div className="text">매트 위에 신체가 닿는 영역의</div>
                        <div className="text">가로와 세로 모듈 수를 입력해주세요.</div>
                    </div>

                    <form className="step-main">
                        <FormInput
                            id="width"
                            label="가로"
                            value={formData.width}
                            placeholder="5"
                            unit="개"
                            onChange={(value) => handleInputChange("width", value)}
                            min={1}
                            max={25}
                        />

                        <FormInput
                            id="height"
                            label="세로"
                            value={formData.height}
                            placeholder="8"
                            unit="개"
                            onChange={(value) => handleInputChange("height", value)}
                            min={1}
                            max={84}
                        />
                    </form>

                    <div className="step-footer">
                        <div className="text">
                            {errorMessage}
                        </div>
                    </div>

                </>)}

                {/* Step 3: 신체 부위 다중 선택 */}
                {step === 3 && (<>
                    <div className="step-header">
                        <div className="text">3</div>
                        <div className="text">매트에 닿은 신체 부위의 명칭을</div>
                        <div className="text">골라주세요.</div>
                    </div>
                
                    <form className="step-main">
                        <div className="form-group">
                            <BodyPartSelector
                                groups={bodyPartGroups}
                                selected={formData.bodyParts}
                                onToggle={handleBodyPartToggle}
                            />
                        </div>
                        <br />
                    </form>

                    <div className="step-footer">
                        <div className="text">
                            {errorMessage}
                        </div>
                    </div>
                </>)}

                {/* Step 4: 제출 동의 */}
                {step === 4 && (<>
                    <div className="step-header">
                        <div className="text">4</div>
                        <div className="text">입력하신 정보는 이후 연구 및</div>
                        <div className="text">아카이브 작업에 활용됩니다.</div>
                        <div className="text">이에 동의하시나요?</div>
                    </div>
                    
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '40px'
                    }}>
                        <button 
                            onClick={handleSubmit}
                            className="text"
                            style={{
                                position: 'absolute',
                                top: 'calc(50% + 60px)',
                                transform: 'translateY(-50%)',
                                padding: '15px 30px 12px',
                                background: 'var(--color-text)',
                                color: 'var(--color-bg)',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: 'var(--font-size-large)',
                                fontFamily: 'inherit',
                            }}
                        >
                            동의 및 업로드
                        </button>
                    </div>
                </>)}
            </main>
        </div>
    );
}
