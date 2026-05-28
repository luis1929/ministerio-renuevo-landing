// lib/supabase-server.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Cliente para server-side (sin autenticación de usuario)
export const supabaseServer = createClient(supabaseUrl, supabaseAnonKey)

// Función para crear cliente autenticado (para Server Actions)
export function createAuthenticatedSupabaseClient(accessToken: string) {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  })
}
