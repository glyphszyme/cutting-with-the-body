"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { bodyPartGroups } from "@/data/bodyParts";

interface AdjustmentData {
    id: number;
    width: number;
    height: number;
    user_id: string;
    updated_at: string;
}

export default function ShowPage() {
    const [width, setWidth] = useState(5);
    const [height, setHeight] = useState(8);
    const [loading, setLoading] = useState(true);

    // 테스트 데이터 (adjust에서 가져온 것과 동일)
    const testBodyHeight = 178;
    const testShoulderWidth = 50;
    const selectedBodyParts = ["palm", "leg", "thigh"];
    
    const CHAR_SIZE_CM = 2; // 각 글자 크기 (cm)
    
    // 실제 표시 크기 계산
    const bodyFactor = Math.sqrt(testBodyHeight * testShoulderWidth);
    const C = CHAR_SIZE_CM;
    
    const W_show_cm = bodyFactor * C * width;
    const H_show_cm = bodyFactor * C * height;
    
    // px로 변환 (1cm = 37.8px, 96 DPI 기준)
    const cmToPx = 0.1;
    const W_show_px = Math.round(W_show_cm * cmToPx);
    const H_show_px = Math.round(H_show_cm * cmToPx);

    // 받침이 있는지 확인하는 함수
    const hasJongseong = (str: string): boolean => {
        const lastChar = str.charCodeAt(str.length - 1);
        return (lastChar - 0xAC00) % 28 !== 0;
    };

    // 신체 부위 이름을 문자열로 연결하는 함수
    const buildBodyPartsString = (partIds: string[]): string => {
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

    // 초기 데이터 가져오기
    useEffect(() => {
        const fetchInitial = async () => {
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
                    console.log('실시간 업데이트:', payload);
                    const newData = payload.new as AdjustmentData;
                    setWidth(newData.width);
                    setHeight(newData.height);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const text1 = "이지면은";
    const text2 = "재단되어만들어진것으로부터비롯되었습니다인간의신체는오랫동안예술과건축의척도이자동시에우주와권력의상징으로기능해왔다고대그리스와로마의철학자들은인간의몸을우주의축소판으로보았고이에따라인간을위한공간의기준역시인간신체에서찾아야한다고생각했다고대로마의건축가비트루비우스는건축십서에서신체의각부분이조화롭게어우러져하나의전체를이루듯건축또한각부분이전체와미적인비례관계를가져야한다고주장했다그는건축의세가지기본요소를견고함유용함아름다움으로정의했으며이세요소가인간신체처럼균형을이루어야한다고보았다비트루비우스에게건축의비례는곧인간존재의비례였다신체의중심이배꼽에있고팔과다리를벌렸을때원과정사각형안에완벽히들어맞는다는생각에서비롯된그의이론은인체의비례를우주의질서와연결시키는몸을기준으로한설계의철학을확립했다이러한시도는인간을위한공간을만들기위한인문적탐구였지만동시에인간을하나의수학적단위와값으로환원하는제도적질서의시작이기도했다중세기독교사상가들은비트루비우스이론을수용해그리스도를우주적존재로이해하는소우주론으로발전시켰다즉인체비례의수리적기하학적규칙을그리스도의신체에적용해그리스도의몸이곧전체우주의구조적축소판이라는신학적시각을확립했다중세시대에제작된램버스궁세계지도는세계자체를그리스도의몸으로표현했다지도사방에그의신체부위가배치되어있는모습은마치그리스도가하늘과땅을포함한온우주를껴안고있는모습처럼보인다이는세상이곧그리스도의일부이자그가세계를온전히유지하는근간이라는중세신학의핵심개념을보여준다";

    const bodyPartsText = buildBodyPartsString(selectedBodyParts);
    const fullText = text1 + bodyPartsText + text2;
    
    const maxChars = width * height;
    const displayText = fullText.substring(0, maxChars);

    // 각 글자의 실제 크기 계산 (px)
    const charWidthPx = W_show_px / width;
    const charHeightPx = H_show_px / height;

    if (loading) {
        return (
            <div style={{ padding: '20px' }}>
                <div>데이터를 불러오는 중...</div>
            </div>
        );
    }

    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            position: 'relative',
            backgroundColor: 'white',
        }}>
            {/* 텍스트 컨테이너 */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: `${W_show_px}px`,
                height: `${H_show_px}px`,
                border: '1px solid black',
                display: 'grid',
                gridTemplateColumns: `repeat(${width}, 1fr)`,
                gridTemplateRows: `repeat(${height}, 1fr)`,
            }}>
                {displayText.split('').map((char, index) => (
                    <div key={index} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: `${Math.min(charWidthPx, charHeightPx) * 0.8}px`,
                        overflow: 'hidden',
                    }}>
                        {char}
                    </div>
                ))}
            </div>
        </div>
    );
}
