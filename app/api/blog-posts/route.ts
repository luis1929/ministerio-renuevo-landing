import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { titulo, resumen, contenido, imagen_url, categoria, publicado } = body

    if (!titulo || typeof titulo !== 'string' || titulo.trim().length === 0) {
      return NextResponse.json(
        { error: 'El título es obligatorio' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .insert([
        {
          titulo: titulo.trim(),
          resumen: resumen?.trim() || '',
          contenido: contenido?.trim() || '',
          imagen_url: imagen_url?.trim() || '',
          categoria: categoria?.trim() || 'General',
          publicado: publicado ?? false,
        },
      ])
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    revalidatePath('/')
    return NextResponse.json({ data }, { status: 201 })
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
      return NextResponse.json(
        { error: 'ID es obligatorio' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .update(campos)
      .eq('id', id)
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    revalidatePath('/')
    return NextResponse.json({ data })
  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID es obligatorio' },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin
      .from('blog_posts')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    revalidatePath('/')
    return NextResponse.json({ message: 'Eliminado correctamente' })
  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
