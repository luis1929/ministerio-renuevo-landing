import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export type Registracion = {
  id: string
  nombre: string
  whatsapp: string | null
  servicio: string
  created_at: string
}

export type Fiel = {
  id: string
  nombre: string
  email: string
  whatsapp: string | null
  ciudad: string | null
  ministerio: string | null
  notas: string | null
  activo: boolean
  fecha_registro: string
  created_at: string
}

export type Comunicacion = {
  id: string
  fiel_id: string
  tipo: string
  mensaje: string
  estado: string
  fecha_envio: string
  created_at: string
}

export type BlogPost = {
  id: string
  titulo: string
  resumen: string
  contenido: string
  imagen_url: string | null
  categoria: string
  publicado: boolean
  created_at: string
}

export type Notificacion = {
  id: string
  titulo: string
  mensaje: string
  tipo: string
  leida: boolean
  created_at: string
}

export type Evento = {
  id: string
  tipo: string
  titulo: string
  descripcion_corta: string
  descripcion_larga: string
  fecha: string
  hora: string
  lugar: string
  imagen: string
  activo: boolean
  orden: number
  created_at: string
}

export type Donacion = {
  id: string
  metodo: string
  valor: string
  icono: string
  activo: boolean
  orden: number
  created_at: string
}

export type CarouselSlide = {
  id: string
  title: string
  subtitle: string
  description: string
  image_url: string
  cta1_label: string
  cta1_href: string
  cta2_label: string
  cta2_href: string
  fecha: string | null
  hora: string | null
  lugar: string | null
  orden: number
  activo: boolean
  created_at: string
}
