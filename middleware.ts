import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const COOKIE_NAME = 'session_token'
const RUTAS_PROTEGIDAS = ['/consulta']
const RUTA_LOGIN = '/login'
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const necesitaProteccion = RUTAS_PROTEGIDAS.some((r) => pathname.startsWith(r))
  if (!necesitaProteccion) return NextResponse.next()

  const token = request.cookies.get(COOKIE_NAME)?.value
  if (!token) {
    return NextResponse.redirect(new URL(RUTA_LOGIN, request.url))
  }

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/sessions?token=eq.${token}&select=expires_at`,
      {
        headers: {
          Authorization: `Bearer ${SERVICE_KEY}`,
          apikey: SERVICE_KEY,
        },
      }
    )

    if (!res.ok) {
      const response = NextResponse.redirect(new URL(RUTA_LOGIN, request.url))
      response.cookies.delete(COOKIE_NAME)
      return response
    }

    const sessions = await res.json()
    const session = sessions?.[0]

    if (!session || new Date(session.expires_at) < new Date()) {
      const response = NextResponse.redirect(new URL(RUTA_LOGIN, request.url))
      response.cookies.delete(COOKIE_NAME)
      return response
    }

    return NextResponse.next()
  } catch {
    const response = NextResponse.redirect(new URL(RUTA_LOGIN, request.url))
    response.cookies.delete(COOKIE_NAME)
    return response
  }
}

export const config = {
  matcher: ['/consulta/:path*'],
}
