import { execSync } from 'child_process'
import { sendTelegramNotification } from '@/lib/telegram'

export interface CopilotoRequest {
  accion: 'estado' | 'alerta' | 'logs'
  limite?: number
}

export interface ReporteEstado {
  sistema: {
    cpu: string
    memoria: string
    disco: string
    uptime: string
  }
  tunel?: {
    activo: boolean
    conexiones?: number
  }
  ollama?: {
    disponible: boolean
    modelos?: string[]
  }
  timestamp: string
}

function ejecutar(comando: string): string {
  try {
    return execSync(comando, { timeout: 5000, encoding: 'utf-8' }).trim()
  } catch {
    return 'Error al obtener métrica'
  }
}

export async function reportarEstado(
  payload: Record<string, unknown>
): Promise<ReporteEstado | { mensaje: string }> {
  const req = payload as unknown as CopilotoRequest

  const reporte: ReporteEstado = {
    sistema: {
      cpu: ejecutar("top -bn1 | grep 'Cpu(s)' | awk '{print $2 + $4}'"),
      memoria: ejecutar("free -h | awk '/^Mem:/ {print $3 \"/\" $2}'"),
      disco: ejecutar("df -h / | awk 'NR==2 {print $3 \"/\" $2 \" (\" $5 \")\"}'"),
      uptime: ejecutar("uptime -p"),
    },
    timestamp: new Date().toISOString(),
  }

  try {
    const tunelOut = ejecutar('pgrep -c cloudflared')
    reporte.tunel = {
      activo: parseInt(tunelOut, 10) > 0,
    }
  } catch {
    reporte.tunel = { activo: false }
  }

  try {
    const ollamaRes = await fetch('http://localhost:11434/api/tags')
    if (ollamaRes.ok) {
      const data = await ollamaRes.json()
      reporte.ollama = {
        disponible: true,
        modelos: data.models?.map((m: { name: string }) => m.name) || [],
      }
    } else {
      reporte.ollama = { disponible: false }
    }
  } catch {
    reporte.ollama = { disponible: false }
  }

  if (req.accion === 'alerta') {
    const cpuNum = parseFloat(reporte.sistema.cpu)
    if (cpuNum > 80) {
      sendTelegramNotification(
        `⚠️ ALERTA - Copiloto Técnico\nCPU al ${cpuNum}% en el servidor local.`
      )
    }
  }

  return reporte
}
