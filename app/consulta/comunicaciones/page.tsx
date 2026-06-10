'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, RefreshCw, Pencil, Trash2, X, Loader2, Send, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import type { Comunicacion } from '@/lib/supabase-admin'

const estadoIcon: Record<string, typeof Send> = {
  pendiente: Clock, enviado: Send, leido: CheckCircle, fallido: AlertTriangle,
}
const estadoColor: Record<string, string> = {
  pendiente: 'text-yellow-400 bg-yellow-500/10',
  enviado: 'text-blue-400 bg-blue-500/10',
  leido: 'text-green-400 bg-green-500/10',
  fallido: 'text-red-400 bg-red-500/10',
}
const tipos = ['Bienvenida', 'Recordatorio', 'Invitación', 'Aviso', 'Seguimiento']
const estados = ['pendiente', 'enviado', 'leido', 'fallido']

export default function ConsultaComunicaciones() {
  const [data, setData] = useState<Comunicacion[]>([])
  const [loading, setLoading] = useState(true)
  const [editRow, setEditRow] = useState<Comunicacion | null>(null)
  const [form, setForm] = useState({ tipo: '', mensaje: '', estado: '' })
  const [saving, setSaving] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/comunicaciones')
      const json = await res.json()
      if (json.data) setData(json.data)
    } catch {} finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  function openEdit(row: Comunicacion) {
    setEditRow(row)
    setForm({ tipo: row.tipo, mensaje: row.mensaje, estado: row.estado })
  }

  async function handleSave() {
    if (!editRow) return
    setSaving(true)
    try {
      await fetch('/api/comunicaciones', {
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
    if (!confirm('¿Eliminar esta comunicación?')) return
    try {
      await fetch(`/api/comunicaciones?id=${id}`, { method: 'DELETE' })
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
            <h1 className="text-2xl font-bold text-white">Comunicaciones</h1>
            <p className="text-sm text-[hsl(45,60%,75%)]">Mensajes enviados a miembros</p>
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
              const Icon = estadoIcon[row.estado] || Send
              return (
                <div key={row.id} className="rounded-xl bg-[hsl(220,28%,12%)] border border-[hsl(43,96%,56%)]/10 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gold uppercase">{row.tipo}</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${estadoColor[row.estado] || 'text-gray-400 bg-gray-500/10'}`}>
                        <Icon className="w-3 h-3" /> {row.estado}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(row)} className="p-1.5 rounded-md bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors" title="Editar">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(row.id)} className="p-1.5 rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors" title="Eliminar">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-[hsl(45,60%,80%)]">{row.mensaje}</p>
                  <p className="text-[10px] text-[hsl(45,60%,40%)] mt-1">Fiel ID: {row.fiel_id} &middot; {new Date(row.fecha_envio || row.created_at).toLocaleString('es')}</p>
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
                <h3 className="text-white font-semibold">Editar comunicación</h3>
                <button onClick={() => setEditRow(null)} className="text-gray-400 hover:text-gold">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-[hsl(45,60%,70%)] mb-1">Tipo</label>
                  <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[hsl(220,28%,16%)] border border-[hsl(43,96%,56%)]/20 text-white text-sm focus:outline-none focus:border-gold">
                    {tipos.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[hsl(45,60%,70%)] mb-1">Estado</label>
                  <select value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[hsl(220,28%,16%)] border border-[hsl(43,96%,56%)]/20 text-white text-sm focus:outline-none focus:border-gold">
                    {estados.map((e) => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[hsl(45,60%,70%)] mb-1">Mensaje</label>
                  <textarea value={form.mensaje} onChange={(e) => setForm({ ...form, mensaje: e.target.value })} rows={3}
                    className="w-full px-3 py-2 rounded-lg bg-[hsl(220,28%,16%)] border border-[hsl(43,96%,56%)]/20 text-white text-sm focus:outline-none focus:border-gold resize-none" />
                </div>
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
