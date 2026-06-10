import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const fielId = searchParams.get('fiel_id')

  let query = supabaseAdmin
    .from('comunicaciones')
    .select('*')
    .order('fecha_envio', { ascending: false })

  if (fielId) {
    query = query.eq('fiel_id', fielId)
  }

  const { data, error } = await query.limit(50)

  if (error) {
    console.error('Supabase select error (comunicaciones):', error)
    return NextResponse.json(
      { error: 'Error al obtener comunicaciones' },
      { status: 500 }
    )
  }

  return NextResponse.json({ data })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { fiel_id, tipo, mensaje } = body

    if (!fiel_id) {
      return NextResponse.json(
        { error: 'fiel_id es obligatorio' },
        { status: 400 }
      )
    }

    if (!tipo || typeof tipo !== 'string') {
      return NextResponse.json(
        { error: 'El tipo de comunicación es obligatorio' },
        { status: 400 }
      )
    }

    if (!mensaje || typeof mensaje !== 'string' || mensaje.trim().length === 0) {
      return NextResponse.json(
        { error: 'El mensaje es obligatorio' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('comunicaciones')
      .insert([
        {
          fiel_id,
          tipo: tipo.trim(),
          mensaje: mensaje.trim(),
          estado: 'pendiente',
        },
      ])
      .select()

    if (error) {
      console.error('Supabase insert error (comunicaciones):', error)
      return NextResponse.json(
        { error: 'Error al crear comunicación' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Comunicación creada', data },
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
    if (!id) return NextResponse.json({ error: 'ID es obligatorio' }, { status: 400 })

    const { data, error } = await supabaseAdmin
      .from('comunicaciones')
      .update(campos)
      .eq('id', id)
      .select()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ data })
  } catch (err) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID es obligatorio' }, { status: 400 })

    const { error } = await supabaseAdmin.from('comunicaciones').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ message: 'Eliminado correctamente' })
  } catch (err) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
