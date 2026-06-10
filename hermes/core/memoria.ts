export interface MemoriaEntry {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
  agent: string
}

const MAX_HISTORY = 50

const conversaciones = new Map<string, MemoriaEntry[]>()

export function guardarMensaje(
  sessionId: string,
  entry: Omit<MemoriaEntry, 'timestamp'>
): void {
  if (!conversaciones.has(sessionId)) {
    conversaciones.set(sessionId, [])
  }
  const history = conversaciones.get(sessionId)!
  history.push({ ...entry, timestamp: Date.now() })

  if (history.length > MAX_HISTORY) {
    conversaciones.set(sessionId, history.slice(-MAX_HISTORY))
  }
}

export function obtenerHistorial(sessionId: string): MemoriaEntry[] {
  return conversaciones.get(sessionId) || []
}

export function limpiarHistorial(sessionId: string): void {
  conversaciones.delete(sessionId)
}
