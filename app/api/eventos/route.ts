import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('eventos')
    .select('*')
    .order('fecha', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { tipo, titulo, descripcion_corta, descripcion_larga, fecha, hora, lugar, imagen, activo, orden } = body

    if (!titulo || !fecha) {
      return NextResponse.json({ error: 'Título y fecha son obligatorios' }, { status: 400 })
    }

    const { data: max } = await supabaseAdmin
      .from('eventos')
      .select('orden')
      .order('orden', { ascending: false })
      .limit(1)

    const nextOrden = orden ?? (max?.[0]?.orden != null ? max[0].orden + 1 : 0)

    const { data, error } = await supabaseAdmin
      .from('eventos')
      .insert({
        tipo: tipo?.trim() || 'Evento',
        titulo: titulo.trim(),
        descripcion_corta: descripcion_corta?.trim() || '',
        descripcion_larga: descripcion_larga?.trim() || '',
        fecha,
        hora: hora?.trim() || '',
        lugar: lugar?.trim() || '',
        imagen: imagen?.trim() || '',
        activo: activo ?? true,
        orden: nextOrden,
      })
      .select()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ data }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, ...campos } = body
    if (!id) return NextResponse.json({ error: 'ID es obligatorio' }, { status: 400 })

    const { data, error } = await supabaseAdmin
      .from('eventos')
      .update(campos)
      .eq('id', id)
      .select()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ data })
  } catch (err) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID es obligatorio' }, { status: 400 })

    const { error } = await supabaseAdmin.from('eventos').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ message: 'Eliminado correctamente' })
  } catch (err) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
