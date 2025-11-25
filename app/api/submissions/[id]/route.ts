import { NextRequest, NextResponse } from "next/server";
import { createSupabaseClient } from "@/lib/supabase";

// 특정 ID의 데이터 조회
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = createSupabaseClient();
        const { data, error } = await supabase
            .from('submissions')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error("Supabase select error:", error);
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 500 }
            );
        }

        if (!data) {
            return NextResponse.json(
                { success: false, error: "Data not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error("Error reading submission:", error);
        return NextResponse.json(
            { success: false, error: "Failed to read submission" },
            { status: 500 }
        );
    }
}
