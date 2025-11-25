"use client";

import { useState } from "react";
import { useSetCornerLinks } from "@/hooks/useSetCornerLinks";
import { bodyPartGroups } from "@/data/bodyParts";

export default function AdjustPage() {
    // 가상의 초기값
    const initialWidth = 5;
    const initialHeight = 8;
    const area = initialWidth * initialHeight; // 40

    const [width, setWidth] = useState(initialWidth);
    const [height, setHeight] = useState(initialHeight);

    // 가상의 선택된 신체 부위 (테스트용)
    const selectedBodyParts = ["palm", "leg", "thigh"];

    useSetCornerLinks({
        links: [
            { slot: 'bottom-left-center', href: '/', label: '처음으로' },
        ]
    });

    // 받침이 있는지 확인하는 함수
    const hasJongseong = (str: string): boolean => {
        const lastChar = str.charCodeAt(str.length - 1);
        return (lastChar - 0xAC00) % 28 !== 0;
    };

    // 신체 부위 이름을 문자열로 연결하는 함수
    const buildBodyPartsString = (partIds: string[]): string => {
        // ID로부터 label 찾기
        const allParts = bodyPartGroups.flatMap(group => group.parts);
        const labels = partIds
            .map(id => allParts.find(part => part.id === id)?.label)
            .filter((label): label is string => label !== undefined);

        if (labels.length === 0) return "";
        if (labels.length === 1) {
            const label = labels[0];
            return label + (hasJongseong(label) ? "이" : "가");
        }

        // 여러 개일 때: 마지막 제외하고는 "와/과"로 연결
        const result = labels.map((label, index) => {
            if (index === labels.length - 1) {
                // 마지막: "이/가"
                return label + (hasJongseong(label) ? "이" : "가");
            } else {
                // 중간: "와/과"
                return label + (hasJongseong(label) ? "과" : "와");
            }
        }).join("");

        return result;
    };

    const handleWidthChange = (newWidth: number) => {
        if (newWidth > 0) {
            setWidth(newWidth);
            setHeight(Math.floor(area / newWidth));
            // 면적을 일정하게 유지하면서 높이 계산
            // const newHeight = area / newWidth;
            // setHeight(Math.round(newHeight * 10) / 10); // 소수점 1자리까지
        }
    };

    const increaseWidth = () => {
        handleWidthChange(width + 1);
    };

    const decreaseWidth = () => {
        if (width > 1) {
            handleWidthChange(width - 1);
        }
    };

    const text1 = "이지면은";
    const text2 = "재단되어만들어진것으로부터비롯되었습니다인간의신체는오랫동안예술과건축의척도이자동시에우주와권력의상징으로기능해왔다고대그리스와로마의철학자들은인간의몸을우주의축소판으로보았고이에따라인간을위한공간의기준역시인간신체에서찾아야한다고생각했다고대로마의건축가비트루비우스는건축십서에서신체의각부분이조화롭게어우러져하나의전체를이루듯건축또한각부분이전체와미적인비례관계를가져야한다고주장했다그는건축의세가지기본요소를견고함유용함아름다움으로정의했으며이세요소가인간신체처럼균형을이루어야한다고보았다비트루비우스에게건축의비례는곧인간존재의비례였다신체의중심이배꼽에있고팔과다리를벌렸을때원과정사각형안에완벽히들어맞는다는생각에서비롯된그의이론은인체의비례를우주의질서와연결시키는몸을기준으로한설계의철학을확립했다이러한시도는인간을위한공간을만들기위한인문적탐구였지만동시에인간을하나의수학적단위와값으로환원하는제도적질서의시작이기도했다중세기독교사상가들은비트루비우스이론을수용해그리스도를우주적존재로이해하는소우주론으로발전시켰다즉인체비례의수리적기하학적규칙을그리스도의신체에적용해그리스도의몸이곧전체우주의구조적축소판이라는신학적시각을확립했다중세시대에제작된램버스궁세계지도는세계자체를그리스도의몸으로표현했다지도사방에그의신체부위가배치되어있는모습은마치그리스도가하늘과땅을포함한온우주를껴안고있는모습처럼보인다이는세상이곧그리스도의일부이자그가세계를온전히유지하는근간이라는중세신학의핵심개념을보여준다";

    // 신체 부위 문자열 생성
    const bodyPartsText = buildBodyPartsString(selectedBodyParts);
    const fullText = text1 + bodyPartsText + text2;

    // 표시할 글자 수 계산 및 슬라이싱
    const maxChars = width * height;
    const displayText = fullText.substring(0, maxChars);

    // 1글자당 픽셀 크기
    const charWidth = 16;
    const charHeight = 10;
    
    const containerWidth = width * charWidth;
    const containerHeight = height * charHeight;

    return (
        <div className="container">
            <main>
                <div className="text text--header">
                    <div>재단이 완료되었습니다.</div>
                    <div>중앙에 생성된 지면 위에서</div>
                    <div>손가락을 좌우로 움직여보세요.</div>
                </div>

                {/* 텍스트 컨테이너 - 중앙 배치, 슬라이싱된 텍스트 표시 */}
                <div style={{
                    position: 'absolute',
                    top: '55%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: `${containerWidth}px`,
                    height: `${containerHeight}px`,
                    border: '1px solid black',
                }}>
                    <div style={{
                        fontSize: '10px',
                        lineHeight: '1.2',
                        letterSpacing: '3px',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-all',
                    }}>
                        {displayText}
                    </div>
                </div>

                <div style={{
                    textAlign: 'center', position: 'absolute', bottom: '30px', width: '100%',
                }}>
                    <button onClick={decreaseWidth} style={{ margin: '0px' }}>
                        가로 줄이기
                    </button>
                    <button onClick={increaseWidth}>
                        가로 늘리기
                    </button>
                </div>
            </main>
        </div>
    );
}