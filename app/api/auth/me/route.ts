import { NextResponse } from 'next/server'
import { obtenerSesionActual } from '@/lib/auth'

export async function GET() {
  const usuario = await obtenerSesionActual()
  if (!usuario) {
    return NextResponse.json({ autenticado: false }, { status: 401 })
  }
  return NextResponse.json({ autenticado: true, usuario })
}
