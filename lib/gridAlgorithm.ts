/**
 * 그리드 조합 생성 알고리즘
 * 
 * 입력: (w, h) 숫자 쌍
 * 출력: 면적을 유지하는 (w, h) 조합 리스트
 */

export interface GridPair {
    w: number;
    h: number;
}

const MAX_W = 30;
const MAX_H = 90;
const MIN_GRID = 1;
const TOLERANCE = 0.1; // 10% 허용 오차

/**
 * (w, h) 입력 → 면적 유지하며 다양한 조합 생성
 */
export function generateGridCombinations(inputW: number, inputH: number): GridPair[] {
    const area = inputW * inputH;
    const pairs: GridPair[] = [];
    const visited = new Set<string>();

    // 1. 세로로 긴 사각형 구간 (w < h)
    let w = Math.max(Math.floor(area / MAX_H), MIN_GRID);
    let h = Math.floor(area / w);

    while (w < h && w <= MAX_W) {
        const h_floor = Math.floor(area / w);
        const h_ceil = Math.ceil(area / w);

        // area에 더 가까운 쪽 선택
        const diff_floor = Math.abs(w * h_floor - area);
        const diff_ceil = Math.abs(w * h_ceil - area);
        h = diff_floor <= diff_ceil ? h_floor : h_ceil;

        // 10% 오차 체크
        const diff = Math.abs(w * h - area);
        if (diff / area <= TOLERANCE && h >= MIN_GRID && h <= MAX_H) {
            const key = `${w},${h}`;
            if (!visited.has(key)) {
                visited.add(key);
                pairs.push({ w, h });
            }
        }

        w += 1;
    }

    // 2. 가로로 긴 사각형 구간 (w >= h)
    h = Math.max(Math.floor(area / MAX_W), MIN_GRID);
    w = Math.floor(area / h);

    while (h < w && h <= MAX_H) {
        const w_floor = Math.floor(area / h);
        const w_ceil = Math.ceil(area / h);

        // area에 더 가까운 쪽 선택
        const diff_floor = Math.abs(w_floor * h - area);
        const diff_ceil = Math.abs(w_ceil * h - area);
        w = diff_floor <= diff_ceil ? w_floor : w_ceil;

        // 10% 오차 체크
        const diff = Math.abs(w * h - area);
        if (diff / area <= TOLERANCE && w >= MIN_GRID && w <= MAX_W) {
            const key = `${w},${h}`;
            if (!visited.has(key)) {
                visited.add(key);
                pairs.push({ w, h });
            }
        }

        h += 1;
    }

    // 3. w == h (정사각형)
    const s = Math.round(Math.sqrt(area));
    const diff_square = Math.abs(s * s - area);
    if (diff_square / area <= TOLERANCE && s >= MIN_GRID && s <= MAX_W && s <= MAX_H) {
        const key = `${s},${s}`;
        if (!visited.has(key)) {
            visited.add(key);
            pairs.push({ w: s, h: s });
        }
    }

    // 정렬: w 기준 오름차순, w가 같으면 h 기준 오름차순
    return pairs.sort((a, b) => {
        if (a.w !== b.w) return a.w - b.w;
        return a.h - b.h;
    });
}
