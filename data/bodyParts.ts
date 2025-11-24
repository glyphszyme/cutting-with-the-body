export interface BodyPartGroup {
    group: string;
    parts: Array<{
        id: string;
        label: string;
    }>;
}

export const bodyPartGroups: BodyPartGroup[] = [
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
