import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('donaciones')
    .select('*')
    .order('orden', { ascending: true })
    .limit(100)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { metodo, valor, icono, activo, orden } = body

    if (!metodo || typeof metodo !== 'string' || metodo.trim().length === 0) {
      return NextResponse.json(
        { error: 'El nombre del método es obligatorio' },
        { status: 400 }
      )
    }

    if (!valor || typeof valor !== 'string' || valor.trim().length === 0) {
      return NextResponse.json(
        { error: 'El valor/dato para transferir es obligatorio' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('donaciones')
      .insert([
        {
          metodo: metodo.trim(),
          valor: valor.trim(),
          icono: icono?.trim() || 'generic',
          activo: activo ?? true,
          orden: orden ?? 0,
        },
      ])
      .select()

    if (error) {
      console.error('Supabase insert error (donaciones):', error)
      return NextResponse.json(
        { error: 'Error al guardar la donación. Intenta de nuevo.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Donación creada exitosamente', data },
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
      .from('donaciones')
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

    const { error } = await supabaseAdmin.from('donaciones').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ message: 'Eliminado correctamente' })
  } catch (err) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
