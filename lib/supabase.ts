import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Registration = {
  id: string;
  nombre: string;
  whatsapp: string;
  servicio: string;
  created_at: string;
};

export type BlogPost = {
  id: string;
  titulo: string;
  resumen: string;
  contenido: string;
  imagen_url: string;
  categoria: string;
  publicado: boolean;
  created_at: string;
};
