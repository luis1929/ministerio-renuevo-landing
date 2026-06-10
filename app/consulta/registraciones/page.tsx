'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CalendarCheck, ArrowLeft, RefreshCw, Pencil, Trash2, X, Loader2 } from 'lucide-react'
import type { Registracion } from '@/lib/supabase-admin'

const opcionesServicio = [
  'Culto Dominical (10:00 AM)',
  'Estudio Bíblico (Miércoles)',
  'Oración (Viernes)',
  'Evento Especial',
  'Primera Visita',
]

export default function ConsultaRegistraciones() {
  const [data, setData] = useState<Registracion[]>([])
  const [loading, setLoading] = useState(true)
  const [editRow, setEditRow] = useState<Registracion | null>(null)
  const [form, setForm] = useState({ nombre: '', whatsapp: '', servicio: '' })
  const [saving, setSaving] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/registraciones')
      const json = await res.json()
      if (json.data) setData(json.data)
    } catch {} finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  function openEdit(row: Registracion) {
    setEditRow(row)
    setForm({ nombre: row.nombre, whatsapp: row.whatsapp || '', servicio: row.servicio })
  }

  async function handleSave() {
    if (!editRow) return
    setSaving(true)
    try {
      await fetch('/api/registraciones', {
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
    if (!confirm('¿Eliminar este registro?')) return
    try {
      await fetch(`/api/registraciones?id=${id}`, { method: 'DELETE' })
      load()
    } catch {}
  }

  return (
    <div className="min-h-screen bg-[hsl(220,35%,6%)]">
      <div className="max-w-6xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/consulta" className="p-2 rounded-lg bg-[hsl(220,28%,14%)] text-gray-400 hover:text-gold hover:bg-[hsl(220,28%,18%)] transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">Registraciones</h1>
            <p className="text-sm text-[hsl(45,60%,75%)]">Asistencias registradas a servicios</p>
          </div>
          <button onClick={load} className="p-2 rounded-lg bg-[hsl(220,28%,14%)] text-gray-400 hover:text-gold transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[hsl(43,96%,56%)]/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[hsl(220,28%,12%)]">
                <th className="text-left px-4 py-3 text-[hsl(45,60%,70%)] font-medium">Nombre</th>
                <th className="text-left px-4 py-3 text-[hsl(45,60%,70%)] font-medium">WhatsApp</th>
                <th className="text-left px-4 py-3 text-[hsl(45,60%,70%)] font-medium">Servicio</th>
                <th className="text-left px-4 py-3 text-[hsl(45,60%,70%)] font-medium">Fecha</th>
                <th className="text-center px-4 py-3 text-[hsl(45,60%,70%)] font-medium">Acción</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-4 py-16 text-center text-[hsl(45,60%,50%)]">Cargando...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-16 text-center text-[hsl(45,60%,50%)]">Sin registros</td></tr>
              ) : (
                data.map((row) => (
                  <tr key={row.id} className="border-t border-[hsl(43,96%,56%)]/5 hover:bg-[hsl(220,28%,12%)]/50 transition-colors">
                    <td className="px-4 py-3 text-white">{row.nombre}</td>
                    <td className="px-4 py-3 text-[hsl(45,60%,75%)]">{row.whatsapp || '—'}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[hsl(43,96%,56%)]/10 text-gold text-xs">
                        <CalendarCheck className="w-3 h-3" /> {row.servicio}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[hsl(45,60%,75%)] text-xs">{new Date(row.created_at).toLocaleString('es')}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openEdit(row)} className="p-1.5 rounded-md bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors" title="Editar">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(row.id)} className="p-1.5 rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors" title="Eliminar">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal editar */}
        {editRow && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="w-full max-w-md rounded-xl bg-[hsl(220,28%,12%)] border border-[hsl(43,96%,56%)]/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Editar registro</h3>
                <button onClick={() => setEditRow(null)} className="text-gray-400 hover:text-gold">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-[hsl(45,60%,70%)] mb-1">Nombre</label>
                  <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[hsl(220,28%,16%)] border border-[hsl(43,96%,56%)]/20 text-white text-sm focus:outline-none focus:border-gold" />
                </div>
                <div>
                  <label className="block text-xs text-[hsl(45,60%,70%)] mb-1">WhatsApp</label>
                  <input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[hsl(220,28%,16%)] border border-[hsl(43,96%,56%)]/20 text-white text-sm focus:outline-none focus:border-gold" />
                </div>
                <div>
                  <label className="block text-xs text-[hsl(45,60%,70%)] mb-1">Servicio</label>
                  <select value={form.servicio} onChange={(e) => setForm({ ...form, servicio: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[hsl(220,28%,16%)] border border-[hsl(43,96%,56%)]/20 text-white text-sm focus:outline-none focus:border-gold">
                    {opcionesServicio.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
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
