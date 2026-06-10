'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, RefreshCw, Pencil, Trash2, X, Loader2, Bell, BellOff, Info, AlertTriangle, Megaphone } from 'lucide-react'
import type { Notificacion } from '@/lib/supabase-admin'

const tipoIcon: Record<string, typeof Bell> = { info: Info, alerta: AlertTriangle, anuncio: Megaphone }
const tipoColor: Record<string, string> = {
  info: 'text-blue-400 bg-blue-500/10',
  alerta: 'text-red-400 bg-red-500/10',
  anuncio: 'text-purple-400 bg-purple-500/10',
}
const tipos = ['info', 'alerta', 'anuncio']

export default function ConsultaNotificaciones() {
  const [data, setData] = useState<Notificacion[]>([])
  const [loading, setLoading] = useState(true)
  const [editRow, setEditRow] = useState<Notificacion | null>(null)
  const [form, setForm] = useState({ titulo: '', mensaje: '', tipo: 'info', leida: false })
  const [saving, setSaving] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/notificaciones')
      const json = await res.json()
      if (json.data) setData(json.data)
    } catch {} finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  function openEdit(row: Notificacion) {
    setEditRow(row)
    setForm({ titulo: row.titulo, mensaje: row.mensaje, tipo: row.tipo, leida: row.leida })
  }

  async function handleSave() {
    if (!editRow) return
    setSaving(true)
    try {
      await fetch('/api/notificaciones', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editRow.id, ...form }),
      })
      setEditRow(null)
      load()
    } catch {} finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar esta notificación?')) return
    try {
      await fetch(`/api/notificaciones?id=${id}`, { method: 'DELETE' })
      load()
    } catch {}
  }

  return (
    <div className="min-h-screen bg-[hsl(220,35%,6%)]">
      <div className="max-w-5xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/consulta" className="p-2 rounded-lg bg-[hsl(220,28%,14%)] text-gray-400 hover:text-gold hover:bg-[hsl(220,28%,18%)] transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">Notificaciones</h1>
            <p className="text-sm text-[hsl(45,60%,75%)]">Alertas y avisos del sistema</p>
          </div>
          <button onClick={load} className="p-2 rounded-lg bg-[hsl(220,28%,14%)] text-gray-400 hover:text-gold transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="space-y-3">
          {loading ? (
            <p className="text-center py-16 text-[hsl(45,60%,50%)]">Cargando...</p>
          ) : data.length === 0 ? (
            <p className="text-center py-16 text-[hsl(45,60%,50%)]">Sin registros</p>
          ) : (
            data.map((row) => {
              const Icon = tipoIcon[row.tipo] || Bell
              return (
                <div key={row.id} className={`rounded-xl bg-[hsl(220,28%,12%)] border p-4 transition-colors ${row.leida ? 'border-[hsl(43,96%,56%)]/5 opacity-60' : 'border-[hsl(43,96%,56%)]/20'}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${tipoColor[row.tipo] || 'bg-gray-500/10 text-gray-400'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-white font-medium text-sm">{row.titulo}</h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="flex items-center gap-1">
                            <button onClick={() => openEdit(row)} className="p-1.5 rounded-md bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors" title="Editar">
                              <Pencil className="w-3 h-3" />
                            </button>
                            <button onClick={() => handleDelete(row.id)} className="p-1.5 rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors" title="Eliminar">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                          {row.leida ? <BellOff className="w-3 h-3 text-[hsl(45,60%,40%)]" /> : <Bell className="w-3 h-3 text-gold" />}
                          <span className="text-[10px] text-[hsl(45,60%,40%)]">{new Date(row.created_at).toLocaleString('es')}</span>
                        </div>
                      </div>
                      <p className="text-sm text-[hsl(45,60%,75%)] mt-1">{row.mensaje}</p>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Modal editar */}
        {editRow && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="w-full max-w-lg rounded-xl bg-[hsl(220,28%,12%)] border border-[hsl(43,96%,56%)]/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Editar notificación</h3>
                <button onClick={() => setEditRow(null)} className="text-gray-400 hover:text-gold">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-[hsl(45,60%,70%)] mb-1">Título</label>
                  <input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[hsl(220,28%,16%)] border border-[hsl(43,96%,56%)]/20 text-white text-sm focus:outline-none focus:border-gold" />
                </div>
                <div>
                  <label className="block text-xs text-[hsl(45,60%,70%)] mb-1">Tipo</label>
                  <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[hsl(220,28%,16%)] border border-[hsl(43,96%,56%)]/20 text-white text-sm focus:outline-none focus:border-gold">
                    {tipos.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[hsl(45,60%,70%)] mb-1">Mensaje</label>
                  <textarea value={form.mensaje} onChange={(e) => setForm({ ...form, mensaje: e.target.value })} rows={3}
                    className="w-full px-3 py-2 rounded-lg bg-[hsl(220,28%,16%)] border border-[hsl(43,96%,56%)]/20 text-white text-sm focus:outline-none focus:border-gold resize-none" />
                </div>
                <label className="flex items-center gap-2 text-sm text-[hsl(45,60%,80%)]">
                  <input type="checkbox" checked={form.leida} onChange={(e) => setForm({ ...form, leida: e.target.checked })}
                    className="rounded border-[hsl(43,96%,56%)]/30 bg-[hsl(220,28%,16%)] text-gold focus:ring-gold" />
                  Leída
                </label>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setEditRow(null)} className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white transition-colors">Cancelar</button>
                <button onClick={handleSave} disabled={saving}
                  className="px-4 py-2 rounded-lg text-sm font-medium gold-gradient text-[hsl(220,35%,6%)] flex items-center gap-2 disabled:opacity-60">
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
