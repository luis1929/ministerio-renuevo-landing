// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan variables de entorno de Supabase')
}

// ✅ Exporta 'supabase' como named export (lo que espera page.tsx)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ✅ También exporta tipos si los necesitas
export type { BlogPost } from '@/types/supabase' // Ajusta la ruta si es necesario
