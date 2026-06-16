'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin, X, ArrowRight, AlertCircle } from 'lucide-react'

type EventItem = {
  id: string
  tipo: string
  titulo: string
  descripcion_corta: string
  descripcion_larga: string
  fecha: string
  hora: string
  lugar: string
  imagen: string
  activo?: boolean
}

const tipoConfig: Record<string, { label: string; color: string }> = {
  Evento: { label: 'Evento', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  Noticia: { label: 'Noticia', color: 'bg-green-500/20 text-green-300 border-green-500/30' },
  Campaña: { label: 'Campaña', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
}

function EventModal({ event, onClose }: { event: EventItem; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const config = tipoConfig[event.tipo] || tipoConfig.Evento
  const fechaObj = new Date(event.fecha)
  const fechaFormateada = fechaObj.toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-2xl rounded-2xl bg-[hsl(220,28%,12%)] border border-[hsl(43,96%,56%)]/20 overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="relative h-48 sm:h-64">
          {event.imagen ? (
            <img src={event.imagen} alt={event.titulo} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[hsl(220,28%,16%)] to-[hsl(220,35%,6%)] flex items-center justify-center">
              <Calendar className="w-16 h-16 text-[hsl(45,60%,20%)]" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,28%,12%)] via-transparent to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-4">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${config.color}`}>
              {config.label}
            </span>
          </div>
        </div>
        <div className="p-6 sm:p-8">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">{event.titulo}</h3>
          <p className="text-[hsl(45,60%,75%)] leading-relaxed mb-6">{event.descripcion_larga}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[hsl(220,28%,16%)] border border-[hsl(43,96%,56%)]/10">
              <Calendar className="w-5 h-5 text-gold flex-shrink-0" />
              <div>
                <p className="text-[10px] text-[hsl(45,60%,50%)] uppercase tracking-wider">Fecha</p>
                <p className="text-white text-sm font-medium">{fechaFormateada}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[hsl(220,28%,16%)] border border-[hsl(43,96%,56%)]/10">
              <Clock className="w-5 h-5 text-gold flex-shrink-0" />
              <div>
                <p className="text-[10px] text-[hsl(45,60%,50%)] uppercase tracking-wider">Hora</p>
                <p className="text-white text-sm font-medium">{event.hora}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[hsl(220,28%,16%)] border border-[hsl(43,96%,56%)]/10">
              <MapPin className="w-5 h-5 text-gold flex-shrink-0" />
              <div>
                <p className="text-[10px] text-[hsl(45,60%,50%)] uppercase tracking-wider">Lugar</p>
                <p className="text-white text-sm font-medium truncate">{event.lugar}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="gold-gradient text-[hsl(220,35%,6%)] font-semibold px-6 py-3 rounded-xl text-sm flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              Cerrar
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function NewsCarousel({ events: initialEvents }: { events: EventItem[] }) {
  const [events, setEvents] = useState<EventItem[]>(initialEvents)
  const [current, setCurrent] = useState(0)
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    setEvents(initialEvents)
  }, [initialEvents])

  const startAutoPlay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % events.length)
    }, 5000)
  }, [events.length])

  useEffect(() => {
    if (events.length <= 1 || isPaused) {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }
    startAutoPlay()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [events.length, isPaused, startAutoPlay])

  if (events.length === 0) {
    return (
      <section id="eventos" className="py-24 px-4 sm:px-6 lg:px-8 bg-[hsl(220,35%,6%)]">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-gold text-sm font-semibold uppercase tracking-widest">Próximos Eventos</span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mt-2 mb-8">News & Eventos</h2>
          <div className="flex flex-col items-center gap-3 py-16 text-[hsl(45,60%,50%)]">
            <AlertCircle className="w-12 h-12" />
            <p className="text-lg">No hay próximos eventos programados.</p>
            <p className="text-sm">Vuelve pronto para conocer nuestras actividades.</p>
          </div>
        </div>
      </section>
    )
  }

  const event = events[current]
  const config = tipoConfig[event.tipo] || tipoConfig.Evento
  const fechaObj = new Date(event.fecha)
  const fechaFormateada = fechaObj.toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <section id="eventos" className="py-24 px-4 sm:px-6 lg:px-8 bg-[hsl(220,35%,6%)]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-gold text-sm font-semibold uppercase tracking-widest">Próximos Eventos</span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mt-2 mb-4">News & Eventos</h2>
          <div className="section-divider max-w-xs mx-auto" />
        </div>

        <div
          className="relative rounded-2xl overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={event.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="relative h-[400px] sm:h-[500px] lg:h-[550px]"
            >
              {event.imagen ? (
                <img
                  src={event.imagen}
                  alt={event.titulo}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[hsl(220,28%,16%)] to-[hsl(220,35%,6%)] flex items-center justify-center">
                  <Calendar className="w-20 h-20 text-[hsl(45,60%,20%)]" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,35%,6%)] via-[hsl(220,35%,6%)]/30 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[hsl(220,35%,6%)]/80 via-transparent to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 lg:p-14">
                <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border mb-4 ${config.color}`}>
                  {config.label}
                </span>
                <h3 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-3 max-w-3xl">
                  {event.titulo}
                </h3>
                <p className="text-[hsl(45,60%,80%)] text-base sm:text-lg mb-4 max-w-2xl line-clamp-2">
                  {event.descripcion_corta}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-[hsl(45,60%,70%)] mb-6">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-gold" /> {fechaFormateada}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-gold" /> {event.hora}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-gold" /> {event.lugar}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedEvent(event)}
                  className="gold-gradient text-[hsl(220,35%,6%)] font-bold px-6 py-3 rounded-xl flex items-center gap-2 text-sm shadow-lg shadow-yellow-600/20 hover:shadow-yellow-600/30 transition-shadow"
                >
                  Ver más <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>

          {events.length > 1 && (
            <>
              <button
                onClick={() => setCurrent((prev) => (prev - 1 + events.length) % events.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-gold/30 hover:text-gold transition-all border border-white/10"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={() => setCurrent((prev) => (prev + 1) % events.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-gold/30 hover:text-gold transition-all border border-white/10"
                aria-label="Siguiente"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </>
          )}
        </div>

        {events.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            {events.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`transition-all duration-300 rounded-full ${
                  i === current
                    ? 'w-8 h-2.5 bg-gold'
                    : 'w-2.5 h-2.5 bg-[hsl(45,60%,30%)] hover:bg-[hsl(45,60%,50%)]'
                }`}
                aria-label={`Ir al evento ${i + 1}`}
              />
            ))}
          </div>
        )}

        {events.length > 1 && (
          <p className="text-center text-xs text-[hsl(45,60%,40%)] mt-3">
            {isPaused ? '⏸ Pausado' : `● Auto ● ${current + 1} / ${events.length}`}
          </p>
        )}
      </div>

      <AnimatePresence>
        {selectedEvent && (
          <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}
