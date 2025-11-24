import { NextRequest, NextResponse } from "next/server";
import { createSupabaseClient } from "@/lib/supabase";

// 데이터 저장
export async function POST(request: NextRequest) {
    try {
        const supabase = createSupabaseClient();
        const body = await request.json();
        
        const { data, error } = await supabase
            .from('submissions')
            .insert([{
                height: body.height,
                shoulder_width: body.shoulderWidth,
                width: body.width,
                length: body.length,
                body_parts: body.bodyParts,
            }])
            .select()
            .single();

        if (error) {
            console.error("Supabase insert error:", error);
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error("Error saving submission:", error);
        return NextResponse.json(
            { success: false, error: "Failed to save submission" },
            { status: 500 }
        );
    }
}

// 전체 데이터 조회 (선택사항)
export async function GET() {
    try {
        const supabase = createSupabaseClient();
        const { data, error } = await supabase
            .from('submissions')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100);

        if (error) {
            console.error("Supabase select error:", error);
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error("Error reading submissions:", error);
        return NextResponse.json(
            { success: false, error: "Failed to read submissions" },
            { status: 500 }
        );
    }
}
