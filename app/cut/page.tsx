"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const STORAGE_KEY = "cut_form_data";

const bodyParts = [
  { id: "head", label: "머리" },
  { id: "neck", label: "목" },
  { id: "chest", label: "가슴" },
  { id: "waist", label: "허리" },
  { id: "hip", label: "엉덩이" },
  { id: "arm", label: "팔" },
  { id: "leg", label: "다리" },
];

interface FormData {
  height: string;
  shoulderWidth: string;
  width: string;
  length: string;
  bodyParts: string[];
}

export default function CutPage() {
  const [step, setStep] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const data = JSON.parse(saved);
          return data.step || 1;
        } catch (e) {
          console.error("Failed to restore step:", e);
        }
      }
    }
    return 1;
  });

  const [formData, setFormData] = useState<FormData>(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const data = JSON.parse(saved);
          return data.formData || {
            height: "",
            shoulderWidth: "",
            width: "",
            length: "",
            bodyParts: [],
          };
        } catch (e) {
          console.error("Failed to restore data:", e);
        }
      }
    }
    return {
      height: "",
      shoulderWidth: "",
      width: "",
      length: "",
      bodyParts: [],
    };
  });

  // 데이터 변경 시 sessionStorage에 저장
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ step, formData })
      );
    }
  }, [step, formData]);

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
        // 제출 후 sessionStorage 클리어 및 폼 초기화
        sessionStorage.removeItem(STORAGE_KEY);
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
        <h1>{step} 본인의 신장과 어깨너비를 입력해 주세요.</h1>

        {/* Step 1: 신장/어깨너비 */}
        {step === 1 && (
          <form onSubmit={handleNext}>
            <div className="form-group">
              <label htmlFor="height">신장 (cm)</label>
              <input
                type="number"
                id="height"
                value={formData.height}
                onChange={(e) => handleInputChange("height", e.target.value)}
                placeholder="예: 170"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="shoulderWidth">어깨너비 (cm)</label>
              <input
                type="number"
                id="shoulderWidth"
                value={formData.shoulderWidth}
                onChange={(e) => handleInputChange("shoulderWidth", e.target.value)}
                placeholder="예: 45"
                required
              />
            </div>

            <button type="submit">다음으로</button>
          </form>
        )}

        {/* Step 2: 가로/세로 */}
        {step === 2 && (
          <form onSubmit={handleNext}>
            <div className="form-group">
              <label htmlFor="width">가로 (cm)</label>
              <input
                type="number"
                id="width"
                value={formData.width}
                onChange={(e) => handleInputChange("width", e.target.value)}
                placeholder="예: 80"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="length">세로 (cm)</label>
              <input
                type="number"
                id="length"
                value={formData.length}
                onChange={(e) => handleInputChange("length", e.target.value)}
                placeholder="예: 90"
                required
              />
            </div>

            <div className="button-group">
              <button type="button" onClick={handlePrevious}>이전</button>
              <button type="submit">다음</button>
            </div>
          </form>
        )}

        {/* Step 3: 신체 부위 다중 선택 */}
        {step === 3 && (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>신체 부위 선택 (중복 가능)</label>
              <div className="checkbox-group">
                {bodyParts.map((part) => (
                  <label key={part.id} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.bodyParts.includes(part.id)}
                      onChange={() => handleBodyPartToggle(part.id)}
                    />
                    {part.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="button-group">
              <button type="button" onClick={handlePrevious}>이전</button>
              <button type="submit">제출</button>
            </div>
          </form>
        )}

        <Link href="/">홈으로 돌아가기</Link>
      </main>
    </div>
  );
}
