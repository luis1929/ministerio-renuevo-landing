'use client';

import { motion } from 'framer-motion';
import { Share2, Heart, Users } from 'lucide-react';

export default function SocialHub() {
  return (
    <section id="social" className="py-24 px-4 sm:px-6 lg:px-8 bg-[hsl(220,30%,8%)] relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-[hsl(43,96%,56%)]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-[hsl(43,96%,56%)]/3 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <Share2 className="w-5 h-5 text-gold" />
            <span className="text-gold text-sm font-semibold uppercase tracking-widest">Conectados</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Hub Social
          </h2>
          <div className="section-divider max-w-xs mx-auto mb-6" />
          <p className="text-[hsl(45,60%,75%)] text-lg max-w-2xl mx-auto">
            Síguenos en nuestras redes sociales y sé parte de nuestra comunidad digital. Comparte, interactúa y crece con nosotros.
          </p>
        </motion.div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            { icon: Heart, title: 'Contenido Inspirador', desc: 'Mensajes de fe y esperanza cada día' },
            { icon: Share2, title: 'Comparte la Bendición', desc: 'Lleva el mensaje a más corazones' },
            { icon: Users, title: 'Comunidad Activa', desc: 'Miles de hermanos conectados' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="w-12 h-12 bg-gold/15 rounded-xl flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-6 h-6 text-gold" />
              </div>
              <h4 className="text-white font-semibold mb-2">{item.title}</h4>
              <p className="text-[hsl(220,15%,52%)] text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-8 md:gap-16"
        >
          {[
            { value: '10K+', label: 'Seguidores' },
            { value: '500+', label: 'Publicaciones' },
            { value: '24/7', label: 'Contenido' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-gold">{stat.value}</p>
              <p className="text-[hsl(220,15%,52%)] text-sm uppercase tracking-wide">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
