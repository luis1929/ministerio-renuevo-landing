import { responderComoAnfitrion } from '@/hermes/agents/anfitrion'
import { procesarContenido } from '@/hermes/agents/admin-contenido'
import { reportarEstado } from '@/hermes/agents/copiloto'
import { guardarMensaje, obtenerHistorial } from '@/hermes/core/memoria'

export type Agente = 'anfitrion' | 'admin-contenido' | 'copiloto'

export interface HermesRequest {
  agente: Agente
  sessionId: string
  payload: Record<string, unknown>
}

export interface HermesResponse {
  success: boolean
  data?: unknown
  error?: string
}

export async function orquestar(req: HermesRequest): Promise<HermesResponse> {
  const { agente, sessionId, payload } = req

  try {
    switch (agente) {
      case 'anfitrion': {
        const mensaje = (payload.mensaje || payload.message) as string
        if (!mensaje) {
          return { success: false, error: 'Mensaje requerido' }
        }

        guardarMensaje(sessionId, {
          role: 'user',
          content: mensaje,
          agent: 'anfitrion',
        })

        const history = obtenerHistorial(sessionId)
        const respuesta = await responderComoAnfitrion(mensaje, history)

        guardarMensaje(sessionId, {
          role: 'assistant',
          content: respuesta,
          agent: 'anfitrion',
        })

        return { success: true, data: { respuesta } }
      }

      case 'admin-contenido': {
        const resultado = await procesarContenido(payload)
        return { success: true, data: resultado }
      }

      case 'copiloto': {
        const reporte = await reportarEstado(payload)
        return { success: true, data: reporte }
      }

      default:
        return { success: false, error: `Agente desconocido: ${agente}` }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error interno'
    return { success: false, error: message }
  }
}
