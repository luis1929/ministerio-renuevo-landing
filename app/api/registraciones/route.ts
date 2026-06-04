import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const opcionesServicio = [
  'Culto Dominical (10:00 AM)',
  'Estudio Bíblico (Miércoles)',
  'Oración (Viernes)',
  'Evento Especial',
  'Primera Visita',
] as const

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nombre, whatsapp, servicio } = body

    if (!nombre || typeof nombre !== 'string' || nombre.trim().length === 0) {
      return NextResponse.json(
        { error: 'El nombre es obligatorio' },
        { status: 400 }
      )
    }

    if (!servicio || !opcionesServicio.includes(servicio)) {
      return NextResponse.json(
        { error: 'Selecciona un servicio válido' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('registraciones')
      .insert([
        {
          nombre: nombre.trim(),
          whatsapp: whatsapp?.trim() || null,
          servicio,
        },
      ])
      .select()

    if (error) {
      console.error('Supabase insert error (registraciones):', error)
      return NextResponse.json(
        { error: 'Error al registrar la asistencia. Intenta de nuevo.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Asistencia registrada. ¡Te esperamos!', data },
      { status: 201 }
    )
  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
