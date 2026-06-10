'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Video, Globe, ArrowRight } from 'lucide-react'
import JitsiModal from './JitsiModal' // 👈 Nuevo import

export default function VirtualMeetings() {
  const [jitsiOpen, setJitsiOpen] = useState(false)

  return (
    <>
      <section id="reuniones" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* ... header existente ... */}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* TARJETA JITSI ACTUALIZADA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-green-500/20 hover:border-green-400/40 bg-gradient-to-br from-green-600/20 to-green-800/10 p-8 transition-all duration-300 group relative overflow-hidden cursor-pointer"
              onClick={() => setJitsiOpen(true)}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/2 rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-700" />
              <div className="w-14 h-14 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6">
                <Globe className="w-7 h-7 text-green-400" />
              </div>
              <h3 className="text-white text-2xl font-bold mb-2">Jitsi Meet</h3>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-gold text-sm font-medium">Viernes 8:00 PM</span>
              </div>
              <p className="text-[hsl(45,60%,75%)] mb-6 leading-relaxed">
                Plataforma libre y segura. Sin cuentas, sin límites de tiempo.
              </p>
              <button className="inline-flex items-center gap-2 gold-gradient text-[hsl(220,35%,6%)] font-bold px-6 py-3 rounded-full hover:opacity-90 transition-opacity shadow-md shadow-yellow-600/20 group">
                Unirse ahora
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            {/* ... tarjeta Google Meet existente ... */}
          </div>
        </div>
      </section>

      {/* Modal Jitsi */}
      <JitsiModal isOpen={jitsiOpen} onClose={() => setJitsiOpen(false)} />
    </>
  )
}