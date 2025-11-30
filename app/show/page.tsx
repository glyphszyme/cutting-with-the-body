"use client";

import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { buildBodyPartsString } from "@/lib/textUtils";

// ===== 보정 상수 =====
// 프로젝터 캘리브레이션 후 아래 값들을 조정하세요

// 픽셀/cm 비율 (프로젝터 투사 후 자로 측정하여 조정)
const PX_PER_CM_H = 21.32155439;
const PX_PER_CM_W = 21.20269841;

interface AdjustmentData {
    id: number;
    width: number;
    height: number;
    display_width: number;
    display_height: number;
    user_id: string;
    updated_at: string;
}

const TEXT_CONTENT = {
    prefix: "이지면은",
    main: "재단되어만들어진것으로부터비롯되었습니다인간의신체는오랫동안예술과건축의척도이자동시에우주와권력의상징으로기능해왔다고대그리스와로마의철학자들은인간의몸을우주의축소판으로보았고이에따라인간을위한공간의기준역시인간신체에서찾아야한다고생각했다고대로마의건축가비트루비우스는건축십서에서신체의각부분이조화롭게어우러져하나의전체를이루듯건축또한각부분이전체와미적인비례관계를가져야한다고주장했다그는건축의세가지기본요소를견고함유용함아름다움으로정의했으며이세요소가인간신체처럼균형을이루어야한다고보았다비트루비우스에게건축의비례는곧인간존재의비례였다신체의중심이배꼽에있고팔과다리를벌렸을때원과정사각형안에완벽히들어맞는다는생각에서비롯된그의이론은인체의비례를우주의질서와연결시키는몸을기준으로한설계의철학을확립했다이러한시도는인간을위한공간을만들기위한인문적탐구였지만동시에인간을하나의수학적단위와값으로환원하는제도적질서의시작이기도했다중세기독교사상가들은비트루비우스이론을수용해그리스도를우주적존재로이해하는소우주론으로발전시켰다즉인체비례의수리적기하학적규칙을그리스도의신체에적용해그리스도의몸이곧전체우주의구조적축소판이라는신학적시각을확립했다중세시대에제작된램버스궁세계지도는세계자체를그리스도의몸으로표현했다지도사방에그의신체부위가배치되어있는모습은마치그리스도가하늘과땅을포함한온우주를껴안고있는모습처럼보인다이는세상이곧그리스도의일부이자그가세계를온전히유지하는근간이라는중세신학의핵심개념을보여준다"
};

const TEST_DATA = {
    bodyHeight: 178,
    shoulderWidth: 50,
    bodyParts: ["finger", "leg", "thigh"]
};

export default function ShowPage() {
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [displayWidth, setDisplayWidth] = useState(0); // cm 단위
    const [displayHeight, setDisplayHeight] = useState(0); // cm 단위
    const [loading, setLoading] = useState(true);
    const [bodyParts, setBodyParts] = useState<string[]>([]);


    // 초기 데이터 가져오기
    useEffect(() => {
        const fetchInitial = async () => {
            // adjustments
            const { data, error } = await supabase
                .from('adjustments')
                .select('*')
                .eq('id', 1)
                .single();

            if (error) {
                console.error('초기 데이터 로드 실패:', error);
            } else if (data) {
                setWidth(data.width);
                setHeight(data.height);
                setDisplayWidth(data.display_width || 0);
                setDisplayHeight(data.display_height || 0);
            }

            // submissions에서 bodyParts 불러오기
            const { data: subData, error: subError } = await supabase
                .from('submissions')
                .select('body_parts')
                .order('created_at', { ascending: false })
                .limit(1)
                .single();
            if (subError) {
                console.error('submissions 로드 실패:', subError);
            } else if (subData) {
                setBodyParts(subData.body_parts || []);
            }

            setLoading(false);
        };
        fetchInitial();
    }, []);

    // Realtime 구독
    useEffect(() => {
        const channel = supabase
            .channel('adjustments-realtime')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'adjustments', filter: 'id=eq.1' },
                (payload) => {
                    const newData = payload.new as AdjustmentData;
                    setWidth(newData.width);
                    setHeight(newData.height);
                    setDisplayWidth(newData.display_width || 0);
                    setDisplayHeight(newData.display_height || 0);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    // 텍스트 생성 (메모이제이션)
    const displayText = useMemo(() => {
        const bodyPartsText = buildBodyPartsString(bodyParts);
        const fullText = TEXT_CONTENT.prefix + bodyPartsText + TEXT_CONTENT.main;
        console.log("Generated Text:", bodyPartsText);
        const maxChars = width * height;
        return fullText.repeat(10).substring(0, maxChars);
    }, [width, height]);

    // 실제 물리적 크기 (픽셀로 변환)
    const W_show_px = displayWidth * PX_PER_CM_W;
    const H_show_px = displayHeight * PX_PER_CM_H;

    // 글자 크기 계산 (한 셀당 크기)
    const charWidthPx = width > 0 ? W_show_px / width : 0;
    const charHeightPx = height > 0 ? H_show_px / height : 0;
    const fontSize = Math.min(charWidthPx, charHeightPx) * 0.8;

    if (loading) {
        return (
            <div className="frame">
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    padding: '50px',
                    fontSize: '24px'
                }}>
                    로딩 중....
                </div>
            </div>
        );
    }

    return (
        <div className="frame" style={{
            left: `${charWidthPx/2 * (width % 2)}px`,
            top: `${charHeightPx/2 * (height % 2)}px`
        }}>
            <div className="crop-mark-top-left" />
            <div className="crop-mark-top-center" />
            <div className="crop-mark-top-right" />
            <div className="crop-mark-middle-left" />
            <div className="crop-mark-middle-right" />
            <div className="crop-mark-bottom-left" />
            <div className="crop-mark-bottom-center" />
            <div className="crop-mark-bottom-right" />
            <div 
                className="text-grid-container"
                style={{
                    gridTemplateColumns: `repeat(${width}, 1fr)`,
                    gridTemplateRows: `repeat(${height}, 1fr)`,
                    width: `${W_show_px}px`,
                    height: `${H_show_px}px`
                }}
            >
                {displayText.split('').map((char, index) => (
                    <div key={index} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: `${fontSize}px`,
                        overflow: 'hidden',
                        // border: '1px solid green',
                        boxSizing: 'border-box',
                    }}>
                        {char}
                    </div>
                ))}
            </div>
        </div>
    );
}
