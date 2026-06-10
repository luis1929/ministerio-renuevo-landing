import { NextRequest, NextResponse } from 'next/server'
import { orquestar } from '@/hermes'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { agente, sessionId, payload } = body

    if (!agente || !sessionId || !payload) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos: agente, sessionId, payload' },
        { status: 400 }
      )
    }

    const resultado = await orquestar({ agente, sessionId, payload })

    if (!resultado.success) {
      return NextResponse.json(resultado, { status: 400 })
    }

    return NextResponse.json(resultado)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error interno'
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const agente = searchParams.get('agente') || 'copiloto'
  const sessionId = searchParams.get('sessionId') || '__health__'

  if (agente === 'copiloto') {
    const resultado = await orquestar({
      agente: 'copiloto',
      sessionId,
      payload: { accion: 'estado' },
    })

    return NextResponse.json(resultado)
  }

  return NextResponse.json({
    success: true,
    data: {
      hermes: 'operativo',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      agentes: ['anfitrion', 'admin-contenido', 'copiloto'],
    },
  })
}
