import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// 최신 데이터 조회
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      // 데이터가 없는 경우
      if (error.code === 'PGRST116') {
        return NextResponse.json({ success: true, data: null });
      }
      console.error("Supabase select error:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error reading latest submission:", error);
    return NextResponse.json(
      { success: false, error: "Failed to read latest submission" },
      { status: 500 }
    );
  }
}
