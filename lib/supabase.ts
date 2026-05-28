// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

// Leer variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validar que existan
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan variables de entorno: NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

// ✅ Crear y exportar el cliente de Supabase (named export)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ✅ Exportar tipos para usar en page.tsx
export type BlogPost = {
  id: string
  titulo: string
  contenido: string
  publicado: boolean
  created_at: string
  [key: string]: any // Permite campos adicionales dinámicos
}
