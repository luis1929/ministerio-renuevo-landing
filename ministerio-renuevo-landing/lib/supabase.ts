// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipo simple para BlogPost (ajusta los campos según tu tabla real)
export type BlogPost = {
  id: string
  titulo: string
  contenido: string
  publicado: boolean
  created_at: string
  [key: string]: any
}
