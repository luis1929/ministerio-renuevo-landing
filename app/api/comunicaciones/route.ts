import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const fielId = searchParams.get('fiel_id')

  let query = supabase
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

    const { data, error } = await supabase
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
