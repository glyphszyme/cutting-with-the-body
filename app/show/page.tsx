"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const bodyPartsMap: Record<string, string> = {
    head: "머리",
    neck: "목",
    chest: "가슴",
    waist: "허리",
    hip: "엉덩이",
    arm: "팔",
    leg: "다리",
};

interface SubmissionData {
    id: number;
    height: string;
    shoulder_width: string;
    width: string;
    length: string;
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
        .map((id) => bodyPartsMap[id])
        .join(", ");

    return (
        <div className="container">
            <main>
                <h1>
                    이 지면은 {bodyPartsText}이(가) 재단되어 만들어졌습니다.
                </h1>
                <div className="measurements">
                    <p>가로: {latestData.width}cm</p>
                    <p>세로: {latestData.length}cm</p>
                    <p>신장: {latestData.height}cm</p>
                    <p>어깨너비: {latestData.shoulder_width}cm</p>
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
