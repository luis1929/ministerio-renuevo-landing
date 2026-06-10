import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendTelegramNotification } from '@/lib/telegram'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nombre, email, whatsapp, ciudad, ministerio, notas } = body

    if (!nombre || typeof nombre !== 'string' || nombre.trim().length === 0) {
      return NextResponse.json(
        { error: 'El nombre es obligatorio' },
        { status: 400 }
      )
    }

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'El correo electrónico es obligatorio' },
        { status: 400 }
      )
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json(
        { error: 'El correo electrónico no es válido' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('fieles')
      .insert([
        {
          nombre: nombre.trim(),
          email: email.trim(),
          whatsapp: whatsapp?.trim() || null,
          ciudad: ciudad?.trim() || null,
          ministerio: ministerio?.trim() || null,
          notas: notas?.trim() || null,
          activo: true,
          fecha_registro: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      console.error('Supabase insert error (fieles):', error)
      return NextResponse.json(
        { error: 'Error al guardar el registro. Intenta de nuevo.' },
        { status: 500 }
      )
    }

    const nuevoFiel = data?.[0]
    const fielId = nuevoFiel?.id

    if (fielId) {
      await supabase.from('comunicaciones').insert([
        {
          fiel_id: fielId,
          tipo: 'Bienvenida',
          mensaje: `¡Bienvenido/a ${nuevoFiel.nombre}! Gracias por registrarte en Ministerio El Renuevo. Te contactaremos pronto.`,
          estado: 'pendiente',
        },
      ])

      sendTelegramNotification(
        `🙌 <b>Nuevo miembro registrado</b>\n\n` +
        `Nombre: ${nuevoFiel.nombre}\n` +
        `Email: ${nuevoFiel.email}\n` +
        `WhatsApp: ${nuevoFiel.whatsapp || '—'}\n` +
        `Ciudad: ${nuevoFiel.ciudad || '—'}\n` +
        `Ministerio: ${nuevoFiel.ministerio || '—'}`
      )
    }

    return NextResponse.json(
      { message: 'Registro exitoso. ¡Bienvenido!', data },
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
