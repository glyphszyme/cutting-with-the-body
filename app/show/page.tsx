"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const bodyPartsMap: Record<string, string> = {
    // 손과 팔
    palm: "손바닥",
    "back-hand": "손등",
    fingertip: "손끝",
    arm: "팔",
    forearm: "팔뚝",
    elbow: "팔꿈치",
    
    // 발과 다리
    sole: "발바닥",
    "back-foot": "발등",
    toe: "발끝",
    leg: "다리",
    thigh: "허벅지",
    calf: "종아리",
    shin: "정강이",
    
    // 몸통과 머리
    hip: "엉덩이",
    shoulder: "어깨",
    chest: "가슴",
    back: "등",
    "back-head": "뒷통수",
    crown: "정수리",
    face: "얼굴",
    neck: "목",
};

interface SubmissionData {
    id: number;
    body_height: number;
    shoulder_width: number;
    width: number;
    height: number;
    body_parts: string[];
    created_at: string;
}

export default function ShowPage() {
    const [latestData, setLatestData] = useState<SubmissionData | null>(null);
    const [loading, setLoading] = useState(true);

    // 최신 데이터 가져오기
    const fetchLatest = async () => {
        try {
            const { data, error } = await supabase
                .from('submissions')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (error) {
                if (error.code !== 'PGRST116') { // 데이터 없음 에러 무시
                    console.error("Failed to fetch latest data:", error);
                }
            } else if (data) {
                setLatestData(data);
            }
        } catch (error) {
            console.error("Failed to fetch latest data:", error);
        } finally {
            setLoading(false);
        }
    };

    // 초기 로드
    useEffect(() => {
        fetchLatest();
        
        // 5초마다 새로고침
        const interval = setInterval(() => {
            fetchLatest();
        }, 100);
        
        return () => clearInterval(interval);
    }, []);

    // 실시간 구독
    useEffect(() => {
        const channel = supabase
            .channel('submissions-changes')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'submissions'
                },
                (payload) => {
                    console.log('New submission:', payload.new);
                    setLatestData(payload.new as SubmissionData);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    if (loading) {
        return (
            <div className="container">
                <main>
                    <h1>데이터를 불러오는 중...</h1>
                </main>
            </div>
        );
    }

    if (!latestData) {
        return (
            <div className="container">
                <main>
                    <h1>아직 제출된 데이터가 없습니다.</h1>
                </main>
            </div>
        );
    }

    const bodyPartsText = latestData.body_parts
        .map((id) => bodyPartsMap[id] || id)
        .join(", ");

    return (
        <div className="container">
            <main>
                <h1>
                    이 지면은 {bodyPartsText}이(가) 재단되어 만들어졌습니다.
                </h1>
                <div className="measurements">
                    <p>신장: {latestData.body_height}cm</p>
                    <p>어깨너비: {latestData.shoulder_width}cm</p>
                    <p>가로: {latestData.width}개</p>
                    <p>세로: {latestData.height}개</p>
                </div>
                <div className="timestamp">
                    <small>
                        마지막 업데이트: {new Date(latestData.created_at).toLocaleString("ko-KR")}
                    </small>
                </div>
            </main>
        </div>
    );
}
