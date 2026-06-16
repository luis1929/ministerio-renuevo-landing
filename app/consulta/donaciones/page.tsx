'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, RefreshCw, Pencil, Trash2, X, Loader2, Plus, DollarSign, ChevronUp, ChevronDown } from 'lucide-react'
import type { Donacion } from '@/lib/supabase-admin'

const iconOptions = ['zelle', 'paypal', 'cashapp', 'bancolombia', 'square', 'generic']

const formDefault = { metodo: '', valor: '', icono: 'generic', activo: true, orden: 0 }

export default function ConsultaDonaciones() {
  const [data, setData] = useState<Donacion[]>([])
  const [loading, setLoading] = useState(true)
  const [editRow, setEditRow] = useState<Donacion | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState(formDefault)
  const [saving, setSaving] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/donaciones')
      const json = await res.json()
      if (json.data) setData(json.data)
    } catch {} finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  function openEdit(row: Donacion) {
    setEditRow(row)
    setCreating(false)
    setForm({ metodo: row.metodo, valor: row.valor, icono: row.icono, activo: row.activo, orden: row.orden })
  }

  function openNew() {
    setEditRow(null)
    setCreating(true)
    setForm({ ...formDefault, orden: data.length })
  }

  async function handleSave() {
    setSaving(true)
    try {
      if (creating) {
        await fetch('/api/donaciones', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
      } else if (editRow) {
        await fetch('/api/donaciones', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editRow.id, ...form }),
        })
      }
      setCreating(false)
      setEditRow(null)
      load()
    } catch {} finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este método de donación?')) return
    try {
      await fetch(`/api/donaciones?id=${id}`, { method: 'DELETE' })
      load()
    } catch {}
  }

  async function handleMove(id: string, direction: 'up' | 'down') {
    const idx = data.findIndex((d) => d.id === id)
    if (idx === -1) return
    const target = direction === 'up' ? idx - 1 : idx + 1
    if (target < 0 || target >= data.length) return

    const current = data[idx]
    const neighbor = data[target]

    await Promise.all([
      fetch('/api/donaciones', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: current.id, orden: neighbor.orden }),
      }),
      fetch('/api/donaciones', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: neighbor.id, orden: current.orden }),
      }),
    ])

    load()
  }

  return (
    <div className="min-h-screen bg-[hsl(220,35%,6%)]">
      <div className="max-w-5xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/consulta" className="p-2 rounded-lg bg-[hsl(220,28%,14%)] text-gray-400 hover:text-gold hover:bg-[hsl(220,28%,18%)] transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">Donaciones</h1>
            <p className="text-sm text-[hsl(45,60%,75%)]">Métodos de donación configurados</p>
          </div>
          <button onClick={load} className="p-2 rounded-lg bg-[hsl(220,28%,14%)] text-gray-400 hover:text-gold transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={openNew} className="gold-gradient text-[hsl(220,35%,6%)] text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> Nuevo método
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
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[hsl(43,96%,56%)]/10 flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-gold" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{row.metodo}</h3>
                      <p className="text-xs text-[hsl(45,60%,70%)] font-mono">{row.valor}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => handleMove(row.id, 'up')} className="p-1.5 rounded-md bg-[hsl(220,28%,16%)] text-gray-400 hover:text-gold transition-colors" title="Subir">
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleMove(row.id, 'down')} className="p-1.5 rounded-md bg-[hsl(220,28%,16%)] text-gray-400 hover:text-gold transition-colors" title="Bajar">
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
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
                <div className="flex gap-2 mt-1 ml-11">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[hsl(220,28%,16%)] text-[hsl(45,60%,60%)]">{row.icono}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[hsl(220,28%,16%)] text-[hsl(45,60%,60%)]">Orden: {row.orden}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal crear/editar */}
        {(creating || editRow) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="w-full max-w-lg rounded-xl bg-[hsl(220,28%,12%)] border border-[hsl(43,96%,56%)]/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">{creating ? 'Nuevo método de donación' : 'Editar método de donación'}</h3>
                <button onClick={() => { setCreating(false); setEditRow(null) }} className="text-gray-400 hover:text-gold">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-[hsl(45,60%,70%)] mb-1">Método</label>
                  <input value={form.metodo} onChange={(e) => setForm({ ...form, metodo: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[hsl(220,28%,16%)] border border-[hsl(43,96%,56%)]/20 text-white text-sm focus:outline-none focus:border-gold" />
                </div>
                <div>
                  <label className="block text-xs text-[hsl(45,60%,70%)] mb-1">Valor / Dato para transferir</label>
                  <input value={form.valor} onChange={(e) => setForm({ ...form, valor: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[hsl(220,28%,16%)] border border-[hsl(43,96%,56%)]/20 text-white text-sm focus:outline-none focus:border-gold" />
                </div>
                <div>
                  <label className="block text-xs text-[hsl(45,60%,70%)] mb-1">Icono</label>
                  <select value={form.icono} onChange={(e) => setForm({ ...form, icono: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[hsl(220,28%,16%)] border border-[hsl(43,96%,56%)]/20 text-white text-sm focus:outline-none focus:border-gold">
                    {iconOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[hsl(45,60%,70%)] mb-1">Orden</label>
                  <input type="number" value={form.orden} onChange={(e) => setForm({ ...form, orden: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-lg bg-[hsl(220,28%,16%)] border border-[hsl(43,96%,56%)]/20 text-white text-sm focus:outline-none focus:border-gold" />
                </div>
                <label className="flex items-center gap-2 text-sm text-[hsl(45,60%,80%)]">
                  <input type="checkbox" checked={form.activo} onChange={(e) => setForm({ ...form, activo: e.target.checked })}
                    className="rounded border-[hsl(43,96%,56%)]/30 bg-[hsl(220,28%,16%)] text-gold focus:ring-gold" />
                  Activo
                </label>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => { setCreating(false); setEditRow(null) }} className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white transition-colors">Cancelar</button>
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
