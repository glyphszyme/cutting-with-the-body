import { bodyPartGroups } from "@/data/bodyParts";

const hasJongseong = (str: string): boolean => {
    const lastChar = str.charCodeAt(str.length - 1);
    return (lastChar - 0xAC00) % 28 !== 0;
};

export const buildBodyPartsString = (partIds: string[]): string => {
    const allParts = bodyPartGroups.flatMap(group => group.parts);
    const labels = partIds
        .map(id => allParts.find(part => part.id === id)?.label)
        .filter((label): label is string => label !== undefined);

    if (labels.length === 0) return "";
    if (labels.length === 1) {
        const label = labels[0];
        return label + (hasJongseong(label) ? "이" : "가");
    }

    const result = labels.map((label, index) => {
        if (index === labels.length - 1) {
            return label + (hasJongseong(label) ? "이" : "가");
        } else {
            return label + (hasJongseong(label) ? "과" : "와");
        }
    }).join("");

    return result;
};

export const calculateDisplaySize = (
    bodyHeight: number,
    shoulderWidth: number,
    width: number,
    height: number,
    charSizeCm: number = 2,
    cmToPx: number = 0.5
) => {
    const bodyFactor = Math.sqrt(bodyHeight * shoulderWidth);
    const W_show_cm = bodyFactor * charSizeCm * width;
    const H_show_cm = bodyFactor * charSizeCm * height;
    const W_show_px = Math.round(W_show_cm * cmToPx);
    const H_show_px = Math.round(H_show_cm * cmToPx);

    return { W_show_px, H_show_px };
};
