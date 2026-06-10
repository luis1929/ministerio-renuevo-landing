import { NextResponse } from 'next/server'
import { eliminarSesion, getTokenFromCookies, removeCookie } from '@/lib/auth'

export async function POST() {
  try {
    const token = getTokenFromCookies()
    if (token) {
      await eliminarSesion(token)
    }
    removeCookie()
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Logout error:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
