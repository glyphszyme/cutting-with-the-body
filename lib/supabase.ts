import { createClient } from '@supabase/supabase-js'

// 매번 새로운 클라이언트 생성 (서버/클라이언트 모두 사용 가능)
export function createSupabaseClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    
    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Missing Supabase environment variables')
    }
    
    return createClient(supabaseUrl, supabaseAnonKey)
}

// 클라이언트 사이드용 (기존 호환성)
export const supabase = createSupabaseClient()
