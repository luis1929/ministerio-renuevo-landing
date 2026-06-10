export interface MetadataData {
  title?: string
  description?: string
  duration?: number
}

export interface ContenidoRequest {
  titulo?: string
  resumen?: string
  contenido?: string
  imagen_url?: string
  categoria?: string
  publicado?: boolean
  accion: 'crear' | 'listar' | 'buscar' | 'process_metadata'
  postId?: string
  action?: string
  data?: MetadataData
}

export interface ContenidoResultado {
  accion: string
  estructura?: Record<string, unknown>
  mensaje: string
}

export async function procesarContenido(
  payload: Record<string, unknown>
): Promise<ContenidoResultado> {
  // Normalize English "action" to Spanish "accion"
  if (payload.action && !payload.accion) {
    payload.accion = payload.action
  }
  const req = payload as unknown as ContenidoRequest

  switch (req.accion) {
    case 'crear': {
      if (!req.titulo || !req.contenido) {
        return {
          accion: 'crear',
          mensaje: 'Título y contenido son obligatorios',
        }
      }

      const estructura = {
        titulo: req.titulo,
        resumen: req.resumen || req.contenido.slice(0, 150) + '...',
        contenido: req.contenido,
        imagen_url: req.imagen_url || null,
        categoria: req.categoria || 'general',
        publicado: req.publicado ?? false,
      }

      return {
        accion: 'crear',
        estructura,
        mensaje: 'Estructura de contenido generada. Lista para insertar en Supabase.',
      }
    }

    case 'listar':
      return {
        accion: 'listar',
        mensaje: 'Usa GET /api/blog-posts para listar contenidos existentes.',
      }

    case 'buscar':
      return {
        accion: 'buscar',
        mensaje: req.postId
          ? `Buscar post con ID: ${req.postId}`
          : 'Especifica un postId para buscar.',
      }

    case 'process_metadata': {
      const metadata = req.data
      if (!metadata?.title) {
        return {
          accion: 'process_metadata',
          mensaje: 'Se requiere un título en los metadatos.',
        }
      }
      const estructura = {
        titulo: metadata.title,
        resumen: metadata.description || metadata.title,
        categoria: inferirCategoria(metadata.title, metadata.description || ''),
        duracion_minutos: metadata.duration ? Math.round(metadata.duration / 60) : null,
        publicado: false,
      }
      return {
        accion: 'process_metadata',
        estructura,
        mensaje: `Metadatos procesados para "${metadata.title}". Listo para insertar en blog_posts.`,
      }
    }

    default:
      return {
        accion: req.accion,
        mensaje: `Acción "${req.accion}" no reconocida.`,
      }
  }
}

function inferirCategoria(titulo: string, descripcion: string): string {
  const texto = `${titulo} ${descripcion}`.toLowerCase()
  if (texto.includes('fe') || texto.includes('creer') || texto.includes('confianza')) return 'fe'
  if (texto.includes('oraci') || texto.includes('clamar') || texto.includes('interces')) return 'oracion'
  if (texto.includes('adoraci') || texto.includes('alabanza') || texto.includes('canto')) return 'alabanza'
  if (texto.includes('familia') || texto.includes('hijos') || texto.includes('matrimonio')) return 'familia'
  if (texto.includes('joven') || texto.includes('adolescente') || texto.includes('juventud')) return 'jovenes'
  if (texto.includes('salud') || texto.includes('sanidad') || texto.includes('milagro')) return 'sanidad'
  if (texto.includes('profec') || texto.includes('vision') || texto.includes('revelacion')) return 'profecia'
  return 'general'
}
