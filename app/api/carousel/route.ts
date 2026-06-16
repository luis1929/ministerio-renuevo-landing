import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('carousel_slides')
    .select('*')
    .order('orden', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, subtitle, description, image_url, cta1_label, cta1_href, cta2_label, cta2_href, fecha, hora, lugar, orden, activo } = body

    if (!title || !image_url) {
      return NextResponse.json({ error: 'Título e imagen son obligatorios' }, { status: 400 })
    }

    const { data: max } = await supabaseAdmin
      .from('carousel_slides')
      .select('orden')
      .order('orden', { ascending: false })
      .limit(1)

    const nextOrden = orden ?? (max?.[0]?.orden != null ? max[0].orden + 1 : 0)

    const { data, error } = await supabaseAdmin
      .from('carousel_slides')
      .insert({
        title: title.trim(),
        subtitle: subtitle?.trim() || '',
        description: description?.trim() || '',
        image_url: image_url.trim(),
        cta1_label: cta1_label?.trim() || 'REGISTRAR ASISTENCIA',
        cta1_href: cta1_href?.trim() || '#registro',
        cta2_label: cta2_label?.trim() || 'OFRENDAR',
        cta2_href: cta2_href?.trim() || '#donaciones',
        fecha: fecha || null,
        hora: hora?.trim() || null,
        lugar: lugar?.trim() || null,
        orden: nextOrden,
        activo: activo ?? true,
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
      .from('carousel_slides')
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

    const { error } = await supabaseAdmin.from('carousel_slides').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ message: 'Eliminado correctamente' })
  } catch (err) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
