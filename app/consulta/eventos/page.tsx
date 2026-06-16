'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { ArrowLeft, RefreshCw, Pencil, Trash2, X, Loader2, Plus, Upload, Calendar, Eye, EyeOff } from 'lucide-react'
import type { Evento } from '@/lib/supabase-admin'

const tipoOptions = ['Evento', 'Noticia', 'Campaña']

const formDefault = {
  tipo: 'Evento', titulo: '', descripcion_corta: '', descripcion_larga: '',
  fecha: '', hora: '', lugar: '', imagen: '', activo: true, orden: 0,
}

export default function ConsultaEventos() {
  const [data, setData] = useState<Evento[]>([])
  const [loading, setLoading] = useState(true)
  const [editRow, setEditRow] = useState<Evento | null>(null)
  const [creating, setCreating] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState(formDefault)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/eventos')
      const json = await res.json()
      if (json.data) setData(json.data)
    } catch {} finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  function openEdit(row: Evento) {
    setEditRow(row)
    setCreating(false)
    setForm({
      tipo: row.tipo, titulo: row.titulo,
      descripcion_corta: row.descripcion_corta,
      descripcion_larga: row.descripcion_larga,
      fecha: row.fecha, hora: row.hora, lugar: row.lugar,
      imagen: row.imagen, activo: row.activo, orden: row.orden,
    })
  }

  function openNew() {
    setEditRow(null)
    setCreating(true)
    setForm({ ...formDefault, orden: data.length })
  }

  async function handleUpload(file: File) {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('bucket', 'eventos')
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const json = await res.json()
      if (json.url) setForm({ ...form, imagen: json.url })
    } catch {} finally {
      setUploading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      const method = creating ? 'POST' : 'PATCH'
      const body = creating ? form : { id: editRow!.id, ...form }
      await fetch('/api/eventos', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      setCreating(false); setEditRow(null); load()
    } catch {} finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este evento?')) return
    try {
      await fetch(`/api/eventos?id=${id}`, { method: 'DELETE' })
      load()
    } catch {}
  }

  const modalOpen = creating || editRow

  return (
    <div className="min-h-screen bg-[hsl(220,35%,6%)]">
      <div className="max-w-6xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/consulta" className="p-2 rounded-lg bg-[hsl(220,28%,14%)] text-gray-400 hover:text-gold hover:bg-[hsl(220,28%,18%)] transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">Eventos</h1>
            <p className="text-sm text-[hsl(45,60%,75%)]">Próximos eventos, noticias y campañas</p>
          </div>
          <button onClick={load} className="p-2 rounded-lg bg-[hsl(220,28%,14%)] text-gray-400 hover:text-gold transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={openNew} className="gold-gradient text-[hsl(220,35%,6%)] text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> Nuevo evento
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <p className="col-span-full text-center py-16 text-[hsl(45,60%,50%)]">Cargando...</p>
          ) : data.length === 0 ? (
            <p className="col-span-full text-center py-16 text-[hsl(45,60%,50%)]">Sin registros</p>
          ) : (
            data.map((row) => {
              const fechaObj = new Date(row.fecha)
              const isPast = fechaObj < new Date(new Date().toDateString())
              return (
                <div key={row.id} className={`rounded-xl bg-[hsl(220,28%,12%)] border overflow-hidden transition-colors ${isPast ? 'border-red-500/10 opacity-60' : 'border-[hsl(43,96%,56%)]/10'}`}>
                  <div className="h-36 overflow-hidden">
                    {row.imagen ? (
                      <img src={row.imagen} alt={row.titulo} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[hsl(220,28%,16%)] text-[hsl(45,60%,40%)] text-xs">Sin imagen</div>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${
                            row.tipo === 'Evento' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                            row.tipo === 'Noticia' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                            'bg-purple-500/20 text-purple-300 border-purple-500/30'
                          }`}>{row.tipo}</span>
                          {isPast && <span className="text-[10px] text-red-400">Pasado</span>}
                        </div>
                        <h3 className="text-white font-semibold text-sm truncate">{row.titulo}</h3>
                        <p className="text-xs text-[hsl(45,60%,60%)] truncate">{row.descripcion_corta}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Calendar className="w-3 h-3 text-gold" />
                      <span className="text-xs text-[hsl(45,60%,70%)]">{fechaObj.toLocaleDateString('es')}</span>
                      {row.activo ? <Eye className="w-3 h-3 text-green-400 ml-auto" /> : <EyeOff className="w-3 h-3 text-red-400 ml-auto" />}
                    </div>
                    <div className="flex items-center gap-1.5 mt-2">
                      <button onClick={() => openEdit(row)} className="p-1 rounded-md bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors" title="Editar">
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button onClick={() => handleDelete(row.id)} className="p-1 rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors" title="Eliminar">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="w-full max-w-2xl rounded-xl bg-[hsl(220,28%,12%)] border border-[hsl(43,96%,56%)]/20 p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">{creating ? 'Nuevo evento' : 'Editar evento'}</h3>
                <button onClick={() => { setCreating(false); setEditRow(null) }} className="text-gray-400 hover:text-gold">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[hsl(45,60%,70%)] mb-1">Tipo</label>
                    <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[hsl(220,28%,16%)] border border-[hsl(43,96%,56%)]/20 text-white text-sm focus:outline-none focus:border-gold">
                      {tipoOptions.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-[hsl(45,60%,70%)] mb-1">Orden</label>
                    <input type="number" value={form.orden} onChange={(e) => setForm({ ...form, orden: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-lg bg-[hsl(220,28%,16%)] border border-[hsl(43,96%,56%)]/20 text-white text-sm focus:outline-none focus:border-gold" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-[hsl(45,60%,70%)] mb-1">Título</label>
                  <input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[hsl(220,28%,16%)] border border-[hsl(43,96%,56%)]/20 text-white text-sm focus:outline-none focus:border-gold" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[hsl(45,60%,70%)] mb-1">Fecha</label>
                    <input type="date" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[hsl(220,28%,16%)] border border-[hsl(43,96%,56%)]/20 text-white text-sm focus:outline-none focus:border-gold" />
                  </div>
                  <div>
                    <label className="block text-xs text-[hsl(45,60%,70%)] mb-1">Hora</label>
                    <input value={form.hora} onChange={(e) => setForm({ ...form, hora: e.target.value })}
                      placeholder="Ej: 7:00 PM"
                      className="w-full px-3 py-2 rounded-lg bg-[hsl(220,28%,16%)] border border-[hsl(43,96%,56%)]/20 text-white text-sm focus:outline-none focus:border-gold" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-[hsl(45,60%,70%)] mb-1">Lugar</label>
                  <input value={form.lugar} onChange={(e) => setForm({ ...form, lugar: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[hsl(220,28%,16%)] border border-[hsl(43,96%,56%)]/20 text-white text-sm focus:outline-none focus:border-gold" />
                </div>
                <div>
                  <label className="block text-xs text-[hsl(45,60%,70%)] mb-1">Descripción corta</label>
                  <textarea value={form.descripcion_corta} onChange={(e) => setForm({ ...form, descripcion_corta: e.target.value })} rows={2}
                    className="w-full px-3 py-2 rounded-lg bg-[hsl(220,28%,16%)] border border-[hsl(43,96%,56%)]/20 text-white text-sm focus:outline-none focus:border-gold resize-none" />
                </div>
                <div>
                  <label className="block text-xs text-[hsl(45,60%,70%)] mb-1">Descripción larga</label>
                  <textarea value={form.descripcion_larga} onChange={(e) => setForm({ ...form, descripcion_larga: e.target.value })} rows={4}
                    className="w-full px-3 py-2 rounded-lg bg-[hsl(220,28%,16%)] border border-[hsl(43,96%,56%)]/20 text-white text-sm focus:outline-none focus:border-gold resize-none" />
                </div>
                <div>
                  <label className="block text-xs text-[hsl(45,60%,70%)] mb-1">Imagen</label>
                  <div className="flex gap-2">
                    <input value={form.imagen} onChange={(e) => setForm({ ...form, imagen: e.target.value })}
                      placeholder="URL de la imagen..."
                      className="flex-1 px-3 py-2 rounded-lg bg-[hsl(220,28%,16%)] border border-[hsl(43,96%,56%)]/20 text-white text-sm focus:outline-none focus:border-gold" />
                    <input type="file" ref={fileRef} accept="image/*" className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
                    <button onClick={() => fileRef.current?.click()} disabled={uploading}
                      className="px-3 py-2 rounded-lg bg-[hsl(220,28%,16%)] border border-[hsl(43,96%,56%)]/20 text-gray-400 hover:text-gold hover:border-gold/40 transition-colors disabled:opacity-50">
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    </button>
                  </div>
                  {form.imagen && (
                    <img src={form.imagen} alt="preview" className="mt-2 h-24 rounded-lg object-cover border border-[hsl(43,96%,56%)]/10" />
                  )}
                </div>
                <label className="flex items-center gap-2 text-sm text-[hsl(45,60%,80%)]">
                  <input type="checkbox" checked={form.activo} onChange={(e) => setForm({ ...form, activo: e.target.checked })}
                    className="rounded border-[hsl(43,96%,56%)]/30 bg-[hsl(220,28%,16%)] text-gold focus:ring-gold" />
                  Activo
                </label>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => { setCreating(false); setEditRow(null) }}
                  className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white transition-colors">Cancelar</button>
                <button onClick={handleSave} disabled={saving}
                  className="px-4 py-2 rounded-lg text-sm font-medium gold-gradient text-[hsl(220,35%,6%)] flex items-center gap-2 disabled:opacity-60">
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {creating ? 'Crear' : 'Guardar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
