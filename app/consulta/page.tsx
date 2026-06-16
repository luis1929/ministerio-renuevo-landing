'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CalendarCheck, Users, MessageSquare, FileText, Bell, Image, DollarSign, Calendar, ArrowRight, Database, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

const tables = [
  { slug: 'registraciones', label: 'Registraciones', desc: 'Asistencias registradas a servicios', icon: CalendarCheck },
  { slug: 'fieles', label: 'Fieles', desc: 'Miembros registrados de la comunidad', icon: Users },
  { slug: 'comunicaciones', label: 'Comunicaciones', desc: 'Mensajes enviados a miembros', icon: MessageSquare },
  { slug: 'blog-posts', label: 'Blog Posts', desc: 'Artículos y publicaciones del blog', icon: FileText },
  { slug: 'notificaciones', label: 'Notificaciones', desc: 'Alertas y avisos del sistema', icon: Bell },
  { slug: 'carousel', label: 'Carrusel', desc: 'Slides del hero principal', icon: Image },
  { slug: 'donaciones', label: 'Donaciones', desc: 'Métodos de donación y ofrendas', icon: DollarSign },
  { slug: 'eventos', label: 'Eventos', desc: 'Noticias, eventos y campañas', icon: Calendar },
]

export default function ConsultaPage() {
  const router = useRouter()
  const [counts, setCounts] = useState<Record<string, number>>({})

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  useEffect(() => {
    tables.forEach(async (t) => {
      try {
        const res = await fetch(`/api/${t.slug === 'blog-posts' ? 'blog-posts' : t.slug}`)
        const json = await res.json()
        setCounts((prev) => ({ ...prev, [t.slug]: json.data?.length ?? 0 }))
      } catch {
        setCounts((prev) => ({ ...prev, [t.slug]: 0 }))
      }
    })
  }, [])

  return (
    <div className="min-h-screen bg-[hsl(220,35%,6%)]">
      <div className="max-w-5xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="w-14 h-14 rounded-2xl gold-gradient flex items-center justify-center mx-auto mb-4">
            <Database className="w-7 h-7 text-[hsl(220,35%,6%)]" />
          </div>
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              Panel de Consulta
            </h1>
            <button onClick={handleLogout} className="p-2 rounded-lg bg-[hsl(220,28%,14%)] text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Cerrar sesión">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[hsl(45,60%,75%)] mt-2 max-w-md mx-auto">
            Selecciona una tabla para ver sus registros
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tables.map((t) => {
            const Icon = t.icon
            return (
              <Link
                key={t.slug}
                href={`/consulta/${t.slug}`}
                className="group rounded-xl bg-[hsl(220,28%,12%)] border border-[hsl(43,96%,56%)]/10 p-5 hover:border-[hsl(43,96%,56%)]/30 transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[hsl(220,28%,16%)] flex items-center justify-center">
                    <Icon className="w-5 h-5 text-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-white font-semibold">{t.label}</h2>
                    <p className="text-xs text-[hsl(45,60%,60%)] truncate">{t.desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[hsl(45,60%,40%)] group-hover:text-gold group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-2xl font-bold text-gold">
                  {counts[t.slug] ?? (
                    <span className="inline-block w-8 h-5 rounded bg-[hsl(220,28%,16%)] animate-pulse" />
                  )}
                </p>
                <p className="text-[10px] text-[hsl(45,60%,40%)] mt-0.5">registros</p>
              </Link>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-[hsl(45,60%,50%)] hover:text-gold transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
