// ===== 보정 상수 =====
// 신체 비례 보정: 표준 신체(160cm, 36cm)가 실제 크기로 나오도록 조정
export const BODY_FACTOR_C = 0.01246;

// 매트 크기 제한 (cm)
const MAX_WIDTH_CM = 60;   // 가로
const MAX_HEIGHT_CM = 180; // 세로

// 그리드 범위
const MIN_GRID = 1;
const MAX_GRID_WIDTH = 30;  // 60cm ÷ 2cm = 30개
const MAX_GRID_HEIGHT = 90; // 180cm ÷ 2cm = 90개

// gridAlgorithm import
import { generateGridCombinations } from './gridAlgorithm';

export interface GridStep {
    width: number;
    height: number;
    displayWidth: number;
    displayHeight: number;
}

/**
 * 신체 데이터로부터 보정된 그리드 크기 계산
 */
export function calculateCorrectedGrid(
    bodyHeight: number,
    shoulderWidth: number,
    measuredW: number,
    measuredH: number
): { correctedW: number; correctedH: number } {
    const bodyFactor = Math.sqrt(bodyHeight * shoulderWidth);
    
    // 판형이 판을 넘는지 계수 계산
    const ratioW = measuredW / MAX_GRID_WIDTH;  // 30을 넘는지
    const ratioH = measuredH / MAX_GRID_HEIGHT; // 90을 넘는지
    
    let correctedW: number;
    let correctedH: number;
    
    // 두 계수가 모두 1 이하면 → 일반적인 경우, BODY_FACTOR_C 적용
    if (ratioW <= 1 && ratioH <= 1) {
        correctedW = BODY_FACTOR_C * bodyFactor * measuredW;
        correctedH = BODY_FACTOR_C * bodyFactor * measuredH;
    } 
    // 하나라도 1을 넘으면 → 판을 넘는 경우, 비율 유지하며 축소
    else {
        const maxRatio = Math.max(ratioW, ratioH);
        correctedW = measuredW / maxRatio;
        correctedH = measuredH / maxRatio;
    }
    
    // 최종 범위 클리핑 (2cm 단위로 개수 파악 시 30×90 이내)
    correctedW = Math.max(MIN_GRID, Math.min(MAX_GRID_WIDTH, Math.round(correctedW)));
    correctedH = Math.max(MIN_GRID, Math.min(MAX_GRID_HEIGHT, Math.round(correctedH)));

    return { correctedW, correctedH };
}

/**
 * 특정 w, h에 대한 display 크기 계산 (cm)
 */
function calculateDisplaySize(
    bodyHeight: number,
    shoulderWidth: number,
    w: number,
    h: number
): { displayWidth: number; displayHeight: number } {
    const bodyFactor = Math.sqrt(bodyHeight * shoulderWidth);
    let W_cm = BODY_FACTOR_C * bodyFactor * w;
    let H_cm = BODY_FACTOR_C * bodyFactor * h;
    
    // 매트 크기 제한
    const scale = Math.min(1, MAX_WIDTH_CM / W_cm, MAX_HEIGHT_CM / H_cm);
    W_cm *= scale;
    H_cm *= scale;
    
    return {
        displayWidth: Math.round(W_cm * 100) / 100,
        displayHeight: Math.round(H_cm * 100) / 100
    };
}

/**
 * 목표 그리드 개수에 가까운 (w, h) 조합 생성
 */
export function generateGridSequence(
    bodyHeight: number,
    shoulderWidth: number,
    initialWidth: number,
    initialHeight: number
): GridStep[] {
    // 1. 보정된 그리드 크기 계산
    const { correctedW, correctedH } = calculateCorrectedGrid(
        bodyHeight,
        shoulderWidth,
        initialWidth,
        initialHeight
    );
    
    // 2. gridAlgorithm으로 조합 생성
    const pairs = generateGridCombinations(correctedW, correctedH);
    
    // 3. 각 조합에 displayWidth/displayHeight 추가
    const sequence: GridStep[] = [];
    
    pairs.forEach(pair => {
        const sizes = calculateDisplaySize(bodyHeight, shoulderWidth, pair.w, pair.h);
        sequence.push({
            width: pair.w,
            height: pair.h,
            ...sizes
        });
    });
    
    return sequence;
}

/**
 * 초기 인덱스 찾기
 */
export function findInitialStepIndex(
    sequence: GridStep[],
    correctedW: number,
    correctedH: number
): number {
    // 보정된 w, h와 정확히 일치하는 조합 찾기
    const targetIndex = sequence.findIndex(
        step => step.width === correctedW && step.height === correctedH
    );
    
    // 일치하는 조합이 있으면 반환, 없으면 0 (첫 번째)
    return targetIndex >= 0 ? targetIndex : 0;
}
