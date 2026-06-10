import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { hashPassword } from '@/lib/auth'

export async function POST() {
  try {
    const { error: testErr } = await supabaseAdmin.from('usuarios').select('id').limit(1)

    if (testErr?.message?.includes('Could not find the table')) {
      const passwordHash = hashPassword('Admin')

      return NextResponse.json({
        error: 'Las tablas de autenticación no existen en Supabase.',
        instrucciones: 'Ve al SQL Editor de Supabase y ejecuta el siguiente SQL:',
        url: 'https://supabase.com/dashboard/project/ejxatamhznvwfhjrlcni/sql/new',
        sql: [
          '-- ============================================',
          '-- 1. Crear tablas de autenticación',
          '-- ============================================',
          'CREATE TABLE IF NOT EXISTS usuarios (',
          '  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),',
          '  email text UNIQUE NOT NULL,',
          '  password_hash text NOT NULL,',
          '  nombre text NOT NULL DEFAULT \'\',',
          '  created_at timestamptz DEFAULT now()',
          ');',
          '',
          'ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;',
          '',
          'CREATE TABLE IF NOT EXISTS sessions (',
          '  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),',
          '  usuario_id uuid NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,',
          '  token text UNIQUE NOT NULL,',
          '  expires_at timestamptz NOT NULL,',
          '  created_at timestamptz DEFAULT now()',
          ');',
          '',
          'ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;',
          '',
          '-- ============================================',
          '-- 2. Crear usuario admin',
          '-- ============================================',
          `INSERT INTO usuarios (email, password_hash, nombre)`,
          `VALUES ('admind@renuevo.org', '${passwordHash}', 'Administrador');`,
        ].join('\n'),
      }, { status: 500 })
    }

    const passwordHash = hashPassword('Admin')

    const { data: existing } = await supabaseAdmin
      .from('usuarios')
      .select('id')
      .eq('email', 'admind@renuevo.org')
      .single()

    if (existing) {
      return NextResponse.json({ message: 'El usuario admind@renuevo.org ya existe' })
    }

    const { error: insertError } = await supabaseAdmin
      .from('usuarios')
      .insert({ email: 'admind@renuevo.org', password_hash: passwordHash, nombre: 'Administrador' })

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Todo listo. Usuario: admind@renuevo.org / Admin',
    })
  } catch (err) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
