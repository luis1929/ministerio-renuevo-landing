'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { ArrowLeft, RefreshCw, Pencil, Trash2, X, Loader2, Plus, Upload, Eye, EyeOff, GripVertical } from 'lucide-react'
import type { CarouselSlide } from '@/lib/supabase-admin'

export default function ConsultaCarousel() {
  const [data, setData] = useState<CarouselSlide[]>([])
  const [loading, setLoading] = useState(true)
  const [editRow, setEditRow] = useState<CarouselSlide | null>(null)
  const [creating, setCreating] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const formDefault = {
    title: '', subtitle: '', description: '', image_url: '',
    cta1_label: 'REGISTRAR ASISTENCIA', cta1_href: '#registro',
    cta2_label: 'OFRENDAR', cta2_href: '#donaciones',
    fecha: '', hora: '', lugar: '', orden: 0, activo: true,
  }
  const [form, setForm] = useState(formDefault)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/carousel')
      const json = await res.json()
      if (json.data) setData(json.data)
    } catch {} finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  function openEdit(row: CarouselSlide) {
    setEditRow(row)
    setForm({
      title: row.title, subtitle: row.subtitle, description: row.description,
      image_url: row.image_url, cta1_label: row.cta1_label, cta1_href: row.cta1_href,
      cta2_label: row.cta2_label, cta2_href: row.cta2_href,
      fecha: row.fecha || '', hora: row.hora || '', lugar: row.lugar || '', orden: row.orden, activo: row.activo,
    })
    setCreating(false)
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
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const json = await res.json()
      if (json.url) setForm({ ...form, image_url: json.url })
    } catch {} finally {
      setUploading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      const url = creating ? '/api/carousel' : '/api/carousel'
      const method = creating ? 'POST' : 'PATCH'
      const body = creating ? form : { id: editRow!.id, ...form }

      await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      setCreating(false); setEditRow(null); load()
    } catch {} finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este slide?')) return
    try {
      await fetch(`/api/carousel?id=${id}`, { method: 'DELETE' })
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
            <h1 className="text-2xl font-bold text-white">Carrusel</h1>
            <p className="text-sm text-[hsl(45,60%,75%)]">Slides del hero principal</p>
          </div>
          <button onClick={load} className="p-2 rounded-lg bg-[hsl(220,28%,14%)] text-gray-400 hover:text-gold transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={openNew} className="gold-gradient text-[hsl(220,35%,6%)] text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> Nuevo slide
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <p className="col-span-full text-center py-16 text-[hsl(45,60%,50%)]">Cargando...</p>
          ) : data.length === 0 ? (
            <p className="col-span-full text-center py-16 text-[hsl(45,60%,50%)]">Sin slides</p>
          ) : (
            data.map((row) => (
              <div key={row.id} className={`rounded-xl bg-[hsl(220,28%,12%)] border overflow-hidden transition-colors ${row.activo ? 'border-[hsl(43,96%,56%)]/10' : 'border-[hsl(43,96%,56%)]/5 opacity-60'}`}>
                <div className="h-36 overflow-hidden">
                  <img src={row.image_url} alt={row.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-sm truncate">{row.title}</h3>
                      <p className="text-xs text-[hsl(45,60%,60%)] truncate">{row.subtitle}</p>
                    </div>
                    <span className="text-[10px] text-[hsl(45,60%,40%)] flex-shrink-0">#{row.orden}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {row.activo ? <Eye className="w-3 h-3 text-green-400" /> : <EyeOff className="w-3 h-3 text-red-400" />}
                    <button onClick={() => openEdit(row)} className="p-1 rounded-md bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors ml-auto" title="Editar">
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button onClick={() => handleDelete(row.id)} className="p-1 rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors" title="Eliminar">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="w-full max-w-2xl rounded-xl bg-[hsl(220,28%,12%)] border border-[hsl(43,96%,56%)]/20 p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">{creating ? 'Nuevo slide' : 'Editar slide'}</h3>
                <button onClick={() => { setCreating(false); setEditRow(null) }} className="text-gray-400 hover:text-gold">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-xs text-[hsl(45,60%,70%)] mb-1">Título</label>
                    <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[hsl(220,28%,16%)] border border-[hsl(43,96%,56%)]/20 text-white text-sm focus:outline-none focus:border-gold" />
                  </div>
                  <div className="w-24">
                    <label className="block text-xs text-[hsl(45,60%,70%)] mb-1">Orden</label>
                    <input type="number" value={form.orden} onChange={(e) => setForm({ ...form, orden: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-lg bg-[hsl(220,28%,16%)] border border-[hsl(43,96%,56%)]/20 text-white text-sm focus:outline-none focus:border-gold" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-[hsl(45,60%,70%)] mb-1">Subtítulo</label>
                  <input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[hsl(220,28%,16%)] border border-[hsl(43,96%,56%)]/20 text-white text-sm focus:outline-none focus:border-gold" />
                </div>
                <div>
                  <label className="block text-xs text-[hsl(45,60%,70%)] mb-1">Descripción</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2}
                    className="w-full px-3 py-2 rounded-lg bg-[hsl(220,28%,16%)] border border-[hsl(43,96%,56%)]/20 text-white text-sm focus:outline-none focus:border-gold resize-none" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-[hsl(45,60%,70%)] mb-1">Fecha del evento</label>
                    <input type="date" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[hsl(220,28%,16%)] border border-[hsl(43,96%,56%)]/20 text-white text-sm focus:outline-none focus:border-gold" />
                  </div>
                  <div>
                    <label className="block text-xs text-[hsl(45,60%,70%)] mb-1">Hora</label>
                    <input type="text" value={form.hora} onChange={(e) => setForm({ ...form, hora: e.target.value })}
                      placeholder="Ej: 10:00 AM" className="w-full px-3 py-2 rounded-lg bg-[hsl(220,28%,16%)] border border-[hsl(43,96%,56%)]/20 text-white text-sm focus:outline-none focus:border-gold" />
                  </div>
                  <div>
                    <label className="block text-xs text-[hsl(45,60%,70%)] mb-1">Dirección exacta</label>
                    <input type="text" value={form.lugar} onChange={(e) => setForm({ ...form, lugar: e.target.value })}
                      placeholder="Ej: Cra 54 # 72-10, Barranquilla" className="w-full px-3 py-2 rounded-lg bg-[hsl(220,28%,16%)] border border-[hsl(43,96%,56%)]/20 text-white text-sm focus:outline-none focus:border-gold" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-[hsl(45,60%,70%)] mb-1">Imagen</label>
                  <div className="flex gap-2">
                    <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                      placeholder="URL de la imagen..."
                      className="flex-1 px-3 py-2 rounded-lg bg-[hsl(220,28%,16%)] border border-[hsl(43,96%,56%)]/20 text-white text-sm focus:outline-none focus:border-gold" />
                    <input type="file" ref={fileRef} accept="image/*" className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
                    <button onClick={() => fileRef.current?.click()} disabled={uploading}
                      className="px-3 py-2 rounded-lg bg-[hsl(220,28%,16%)] border border-[hsl(43,96%,56%)]/20 text-gray-400 hover:text-gold hover:border-gold/40 transition-colors disabled:opacity-50">
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    </button>
                  </div>
                  {form.image_url && (
                    <img src={form.image_url} alt="preview" className="mt-2 h-24 rounded-lg object-cover border border-[hsl(43,96%,56%)]/10" />
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[hsl(45,60%,70%)] mb-1">Botón 1 - Texto</label>
                    <input value={form.cta1_label} onChange={(e) => setForm({ ...form, cta1_label: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[hsl(220,28%,16%)] border border-[hsl(43,96%,56%)]/20 text-white text-sm focus:outline-none focus:border-gold" />
                  </div>
                  <div>
                    <label className="block text-xs text-[hsl(45,60%,70%)] mb-1">Botón 1 - Link</label>
                    <input value={form.cta1_href} onChange={(e) => setForm({ ...form, cta1_href: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[hsl(220,28%,16%)] border border-[hsl(43,96%,56%)]/20 text-white text-sm focus:outline-none focus:border-gold" />
                  </div>
                  <div>
                    <label className="block text-xs text-[hsl(45,60%,70%)] mb-1">Botón 2 - Texto</label>
                    <input value={form.cta2_label} onChange={(e) => setForm({ ...form, cta2_label: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[hsl(220,28%,16%)] border border-[hsl(43,96%,56%)]/20 text-white text-sm focus:outline-none focus:border-gold" />
                  </div>
                  <div>
                    <label className="block text-xs text-[hsl(45,60%,70%)] mb-1">Botón 2 - Link</label>
                    <input value={form.cta2_href} onChange={(e) => setForm({ ...form, cta2_href: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[hsl(220,28%,16%)] border border-[hsl(43,96%,56%)]/20 text-white text-sm focus:outline-none focus:border-gold" />
                  </div>
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
