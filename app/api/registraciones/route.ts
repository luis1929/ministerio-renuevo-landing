import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

const opcionesServicio = [
  'Culto Dominical (10:00 AM)',
  'Estudio Bíblico (Miércoles)',
  'Oración (Viernes)',
  'Evento Especial',
  'Primera Visita',
] as const

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('registraciones')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}

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

    const { data, error } = await supabaseAdmin
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

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, ...campos } = body

    if (!id) {
      return NextResponse.json({ error: 'ID es obligatorio' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('registraciones')
      .update(campos)
      .eq('id', id)
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID es obligatorio' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('registraciones')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Eliminado correctamente' })
  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
