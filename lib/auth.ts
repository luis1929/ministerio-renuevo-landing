import { cookies } from 'next/headers'
import { scryptSync, randomBytes, timingSafeEqual } from 'crypto'
import { supabaseAdmin } from '@/lib/supabase-admin'

const SESION_DURACION_MS = 7 * 24 * 60 * 60 * 1000
const COOKIE_NAME = 'session_token'

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

export function verificarPassword(password: string, hashAlmacenado: string): boolean {
  const [salt, hash] = hashAlmacenado.split(':')
  const hashComparar = scryptSync(password, salt, 64).toString('hex')
  return timingSafeEqual(Buffer.from(hash), Buffer.from(hashComparar))
}

export function generarToken(): string {
  return randomBytes(48).toString('hex')
}

export async function crearSesion(usuarioId: string): Promise<string> {
  const token = generarToken()
  const expiresAt = new Date(Date.now() + SESION_DURACION_MS).toISOString()

  const { error } = await supabaseAdmin.from('sessions').insert({
    usuario_id: usuarioId,
    token,
    expires_at: expiresAt,
  })

  if (error) throw new Error('Error al crear sesión')

  return token
}

export async function eliminarSesion(token: string) {
  await supabaseAdmin.from('sessions').delete().eq('token', token)
}

export function setCookie(token: string) {
  const cookieStore = cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESION_DURACION_MS / 1000,
  })
}

export function removeCookie() {
  const cookieStore = cookies()
  cookieStore.delete(COOKIE_NAME)
}

export function getTokenFromCookies(): string | undefined {
  const cookieStore = cookies()
  return cookieStore.get(COOKIE_NAME)?.value
}

export async function validarSesion(token: string): Promise<{ id: string; email: string; nombre: string } | null> {
  const { data, error } = await supabaseAdmin
    .from('sessions')
    .select('usuario_id, expires_at, usuarios!inner(email, nombre)')
    .eq('token', token)
    .single()

  if (error || !data) return null

  const session = data as unknown as {
    usuario_id: string
    expires_at: string
    usuarios: { email: string; nombre: string }
  }

  if (new Date(session.expires_at) < new Date()) {
    await eliminarSesion(token)
    return null
  }

  return {
    id: session.usuario_id,
    email: session.usuarios.email,
    nombre: session.usuarios.nombre,
  }
}

export async function obtenerSesionActual() {
  const token = getTokenFromCookies()
  if (!token) return null
  return validarSesion(token)
}
