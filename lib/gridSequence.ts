// ===== 보정 상수 =====
// 신체 비례 보정: 표준 신체(170cm, 45cm)가 실제 크기로 나오도록 조정
export const BODY_FACTOR_C = 0.02;

// 매트 크기 제한 (cm)
const MAX_WIDTH_CM = 60;   // 가로
const MAX_HEIGHT_CM = 180; // 세로

// 그리드 범위
const MIN_GRID = 1;
const MAX_GRID_WIDTH = 30;  // 60cm ÷ 2cm = 30개
const MAX_GRID_HEIGHT = 90; // 180cm ÷ 2cm = 90개

export interface GridStep {
    width: number;
    height: number;
    displayWidth: number;
    displayHeight: number;
}

/**
 * 특정 w, h에 대한 display 크기 계산
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
 * 목표 그리드 개수에 가까운 (w, h) 조합 생성 (작은 값 증가 알고리즘)
 */
export function generateGridSequence(
    bodyHeight: number,
    shoulderWidth: number,
    initialWidth: number,
    initialHeight: number
): GridStep[] {
    const targetGridCount = initialWidth * initialHeight;
    const sequence: GridStep[] = [];
    const visited = new Set<string>();
    
    // w < h 구간: w를 증가시키며 최적 h 찾기
    let w = MIN_GRID;
    let h = Math.min(MAX_GRID_HEIGHT, Math.round(targetGridCount / w));
    
    while (w < h && w <= MAX_GRID_WIDTH && h >= MIN_GRID) {
        const key = `${w},${h}`;
        if (!visited.has(key)) {
            visited.add(key);
            const sizes = calculateDisplaySize(bodyHeight, shoulderWidth, w, h);
            sequence.push({ width: w, height: h, ...sizes });
        }
        
        w += 1;
        const h_floor = Math.floor(targetGridCount / w);
        const h_ceil = Math.ceil(targetGridCount / w);
        
        const diff_floor = Math.abs(w * h_floor - targetGridCount);
        const diff_ceil = Math.abs(w * h_ceil - targetGridCount);
        h = diff_floor <= diff_ceil ? h_floor : h_ceil;
        
        // 범위 체크
        if (h > MAX_GRID_HEIGHT || h < MIN_GRID) break;
    }
    
    // w >= h 구간: h를 감소시키며 최적 w 찾기
    h = Math.min(MAX_GRID_HEIGHT, Math.round(Math.sqrt(targetGridCount)));
    w = Math.min(MAX_GRID_WIDTH, Math.round(targetGridCount / h));
    
    while (h >= MIN_GRID && w <= MAX_GRID_WIDTH) {
        const key = `${w},${h}`;
        if (!visited.has(key)) {
            visited.add(key);
            const sizes = calculateDisplaySize(bodyHeight, shoulderWidth, w, h);
            sequence.push({ width: w, height: h, ...sizes });
        }
        
        h -= 1;
        if (h < MIN_GRID) break;
        
        const w_floor = Math.floor(targetGridCount / h);
        const w_ceil = Math.ceil(targetGridCount / h);
        
        const diff_floor = Math.abs(w_floor * h - targetGridCount);
        const diff_ceil = Math.abs(w_ceil * h - targetGridCount);
        w = diff_floor <= diff_ceil ? w_floor : w_ceil;
        
        // 범위 체크
        if (w > MAX_GRID_WIDTH || w < MIN_GRID) break;
    }
    
    return sequence;
}

/**
 * 초기 인덱스 찾기
 */
export function findInitialStepIndex(
    sequence: GridStep[],
    targetWidth: number,
    targetHeight: number
): number {
    const targetArea = targetWidth * targetHeight;
    let closestIndex = 0;
    let minDiff = Infinity;
    
    sequence.forEach((step, index) => {
        const diff = Math.abs(step.width * step.height - targetArea);
        if (diff < minDiff) {
            minDiff = diff;
            closestIndex = index;
        }
    });
    
    return closestIndex;
}
