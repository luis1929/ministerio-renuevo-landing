'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, RefreshCw, Pencil, Trash2, X, Loader2, Mail, Phone, MapPin, Church, User } from 'lucide-react'
import type { Fiel } from '@/lib/supabase-admin'

export default function ConsultaFieles() {
  const [data, setData] = useState<Fiel[]>([])
  const [loading, setLoading] = useState(true)
  const [editRow, setEditRow] = useState<Fiel | null>(null)
  const [form, setForm] = useState({ nombre: '', email: '', whatsapp: '', ciudad: '', ministerio: '', notas: '', activo: true })
  const [saving, setSaving] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/fieles')
      const json = await res.json()
      if (json.data) setData(json.data)
    } catch {} finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  function openEdit(row: Fiel) {
    setEditRow(row)
    setForm({ nombre: row.nombre, email: row.email, whatsapp: row.whatsapp || '', ciudad: row.ciudad || '', ministerio: row.ministerio || '', notas: row.notas || '', activo: row.activo })
  }

  async function handleSave() {
    if (!editRow) return
    setSaving(true)
    try {
      await fetch('/api/fieles', {
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
    if (!confirm('¿Eliminar este fiel?')) return
    try {
      await fetch(`/api/fieles?id=${id}`, { method: 'DELETE' })
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
            <h1 className="text-2xl font-bold text-white">Fieles</h1>
            <p className="text-sm text-[hsl(45,60%,75%)]">Miembros registrados de la comunidad</p>
          </div>
          <button onClick={load} className="p-2 rounded-lg bg-[hsl(220,28%,14%)] text-gray-400 hover:text-gold transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="grid gap-3">
          {loading ? (
            <p className="text-center py-16 text-[hsl(45,60%,50%)]">Cargando...</p>
          ) : data.length === 0 ? (
            <p className="text-center py-16 text-[hsl(45,60%,50%)]">Sin registros</p>
          ) : (
            data.map((row) => (
              <div key={row.id} className="rounded-xl bg-[hsl(220,28%,12%)] border border-[hsl(43,96%,56%)]/10 p-4 hover:border-[hsl(43,96%,56%)]/20 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[hsl(43,96%,56%)]/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-gold" />
                    </div>
                    <h3 className="text-white font-semibold">{row.nombre}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${row.activo ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                      {row.activo ? 'Activo' : 'Inactivo'}
                    </span>
                    <button onClick={() => openEdit(row)} className="p-1.5 rounded-md bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors" title="Editar">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(row.id)} className="p-1.5 rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors" title="Eliminar">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[hsl(45,60%,70%)] ml-10">
                  <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {row.email}</span>
                  {row.whatsapp && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {row.whatsapp}</span>}
                  {row.ciudad && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {row.ciudad}</span>}
                  {row.ministerio && <span className="flex items-center gap-1"><Church className="w-3 h-3" /> {row.ministerio}</span>}
                </div>
                {row.notas && <p className="mt-1 text-xs text-[hsl(45,60%,60%)] italic ml-10">{row.notas}</p>}
                <p className="mt-2 text-[10px] text-[hsl(45,60%,40%)] ml-10">Registrado: {new Date(row.fecha_registro).toLocaleString('es')}</p>
              </div>
            ))
          )}
        </div>

        {/* Modal editar */}
        {editRow && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="w-full max-w-lg rounded-xl bg-[hsl(220,28%,12%)] border border-[hsl(43,96%,56%)]/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Editar fiel</h3>
                <button onClick={() => setEditRow(null)} className="text-gray-400 hover:text-gold">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-[hsl(45,60%,70%)] mb-1">Nombre</label>
                  <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[hsl(220,28%,16%)] border border-[hsl(43,96%,56%)]/20 text-white text-sm focus:outline-none focus:border-gold" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[hsl(45,60%,70%)] mb-1">Email</label>
                    <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[hsl(220,28%,16%)] border border-[hsl(43,96%,56%)]/20 text-white text-sm focus:outline-none focus:border-gold" />
                  </div>
                  <div>
                    <label className="block text-xs text-[hsl(45,60%,70%)] mb-1">WhatsApp</label>
                    <input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[hsl(220,28%,16%)] border border-[hsl(43,96%,56%)]/20 text-white text-sm focus:outline-none focus:border-gold" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[hsl(45,60%,70%)] mb-1">Ciudad</label>
                    <input value={form.ciudad} onChange={(e) => setForm({ ...form, ciudad: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[hsl(220,28%,16%)] border border-[hsl(43,96%,56%)]/20 text-white text-sm focus:outline-none focus:border-gold" />
                  </div>
                  <div>
                    <label className="block text-xs text-[hsl(45,60%,70%)] mb-1">Ministerio</label>
                    <input value={form.ministerio} onChange={(e) => setForm({ ...form, ministerio: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[hsl(220,28%,16%)] border border-[hsl(43,96%,56%)]/20 text-white text-sm focus:outline-none focus:border-gold" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-[hsl(45,60%,70%)] mb-1">Notas</label>
                  <textarea value={form.notas} onChange={(e) => setForm({ ...form, notas: e.target.value })} rows={2}
                    className="w-full px-3 py-2 rounded-lg bg-[hsl(220,28%,16%)] border border-[hsl(43,96%,56%)]/20 text-white text-sm focus:outline-none focus:border-gold resize-none" />
                </div>
                <label className="flex items-center gap-2 text-sm text-[hsl(45,60%,80%)]">
                  <input type="checkbox" checked={form.activo} onChange={(e) => setForm({ ...form, activo: e.target.checked })}
                    className="rounded border-[hsl(43,96%,56%)]/30 bg-[hsl(220,28%,16%)] text-gold focus:ring-gold" />
                  Activo
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
