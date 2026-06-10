import { sendTelegramNotification } from '@/lib/telegram'
import type { MemoriaEntry } from '@/hermes/core/memoria'

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434'
const MODELO = process.env.OLLAMA_ANFITRION_MODEL || 'qwen2.5:3b'

const SYSTEM_PROMPT = `Eres "Anfitrión", el asistente virtual del Ministerio El Renuevo.
Tu personalidad es cálida, acogedora y profesional.
Hablas solo en español con un tono amable y servicial.

Conoces sobre:
- Horarios de servicios (Dominical 10:00 AM, Miércoles Estudio Bíblico)
- Eventos y actividades del ministerio
- Cómo registrarse como miembro
- Cómo realizar donaciones/diezmos
- Información de contacto general

Si alguien se registra como nuevo miembro, muestra entusiasmo.
Si no sabes algo, sé honesto y ofrece derivar a un líder.`

export async function responderComoAnfitrion(
  mensaje: string,
  history: MemoriaEntry[]
): Promise<string> {
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history.slice(-10).map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
    { role: 'user', content: mensaje },
  ]

  const payload = {
    model: MODELO,
    messages,
    stream: false,
  }

  try {
    const res = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      throw new Error(`Ollama respondió con ${res.status}`)
    }

    const data = await res.json()
    const respuesta = data.message?.content || ''

    if (mensaje.toLowerCase().includes('registr') || mensaje.toLowerCase().includes('nuevo miembro')) {
      sendTelegramNotification(
        `👋 Un visitante preguntó sobre registro:\n\n"${mensaje}"`
      )
    }

    return respuesta
  } catch (err) {
    console.error('[Anfitrión] Error:', err)
    return 'Lo siento, estoy teniendo problemas para conectarme. Por favor intenta más tarde o contáctanos directamente.'
  }
}
