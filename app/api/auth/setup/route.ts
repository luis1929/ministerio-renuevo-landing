import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { hashPassword } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { email, password, nombre } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña requeridos' }, { status: 400 })
    }

    const { data: existing } = await supabaseAdmin
      .from('usuarios')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .single()

    if (existing) {
      return NextResponse.json({ error: 'El usuario ya existe' }, { status: 409 })
    }

    const password_hash = hashPassword(password)

    const { data, error } = await supabaseAdmin
      .from('usuarios')
      .insert({ email: email.toLowerCase().trim(), password_hash, nombre: nombre || '' })
      .select('id, email, nombre')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, usuario: data }, { status: 201 })
  } catch (err) {
    console.error('Setup error:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
