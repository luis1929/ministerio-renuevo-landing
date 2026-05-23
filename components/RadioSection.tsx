'use client';

import { motion } from 'framer-motion';
import { Radio, Headphones, Mic2, Wifi } from 'lucide-react';

export default function RadioSection() {
  return (
    <section id="radio" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-gold text-sm font-semibold uppercase tracking-widest">Transmisión</span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mt-2 mb-4">
            Radio El Renuevo
          </h2>
          <div className="section-divider max-w-xs mx-auto mb-6" />
          <p className="text-[hsl(45,60%,75%)] text-lg max-w-2xl mx-auto">
            Adoración, mensajes de vida y más, transmitiendo las 24 horas del día para todo el mundo.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Player card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-8 relative overflow-hidden"
          >
            {/* Animated rings */}
            <div className="absolute -right-8 -top-8 w-40 h-40">
              <div className="absolute inset-0 border-2 border-gold/10 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
              <div className="absolute inset-4 border-2 border-gold/15 rounded-full animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
              <div className="absolute inset-8 border-2 border-gold/20 rounded-full animate-ping" style={{ animationDuration: '2s', animationDelay: '1s' }} />
            </div>

            <div className="relative">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 gold-gradient rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-600/30">
                  <Radio className="w-8 h-8 text-[hsl(220,35%,6%)]" />
                </div>
                <div>
                  <h3 className="text-white text-xl font-bold">Radio El Renuevo</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-red-400 text-sm font-medium">EN VIVO</span>
                  </div>
                </div>
              </div>

              <p className="text-[hsl(45,60%,75%)] mb-6 leading-relaxed">
                El reproductor de radio está activo en la barra inferior de la página.
                Puedes navegar por toda la web sin interrumpir la transmisión.
              </p>

              <div className="flex items-center gap-3 p-4 bg-[hsl(220,30%,8%)] rounded-xl border border-[hsl(43,96%,56%)]/15">
                <Wifi className="w-5 h-5 text-gold flex-shrink-0" />
                <div>
                  <p className="text-white text-sm font-medium">Stream continuo</p>
                  <p className="text-[hsl(220,15%,52%)] text-xs">Audio no interrumpido al navegar</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {[
              { icon: Mic2, title: 'Transmisión 24/7', desc: 'Mensajes de vida en todo momento' },
              { icon: Headphones, title: 'Alta Calidad', desc: 'Audio nítido vía AzuraCast' },
              { icon: Radio, title: 'Sin Anuncios', desc: 'Solo adoración y Palabra' },
              { icon: Wifi, title: 'Global', desc: 'Accesible desde cualquier país' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-xl p-5 hover:border-gold/30 transition-colors"
              >
                <div className="w-10 h-10 bg-gold/15 rounded-lg flex items-center justify-center mb-3">
                  <item.icon className="w-5 h-5 text-gold" />
                </div>
                <h4 className="text-white font-semibold mb-1">{item.title}</h4>
                <p className="text-[hsl(220,15%,52%)] text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
