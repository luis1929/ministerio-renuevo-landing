'use client';

import { motion } from 'framer-motion';
import { Heart, CreditCard, Smartphone, Globe, Shield, ArrowRight } from 'lucide-react';

const methods = [
  {
    icon: CreditCard,
    title: 'Transferencia Bancaria',
    desc: 'Banco: Ejemplo\nCuenta: XXXX-XXXX',
    bg: 'bg-blue-500/15',
    color: 'text-blue-400',
    border: 'border-blue-500/20',
  },
  {
    icon: Smartphone,
    title: 'Nequi / Daviplata',
    desc: 'Cel: +57 XXX XXX XXXX\nA nombre del ministerio',
    bg: 'bg-pink-500/15',
    color: 'text-pink-400',
    border: 'border-pink-500/20',
  },
  {
    icon: Globe,
    title: 'PayPal Internacional',
    desc: 'Para ofrendas desde el exterior',
    bg: 'bg-sky-500/15',
    color: 'text-sky-400',
    border: 'border-sky-500/20',
  },
];

export default function DonationsSection() {
  return (
    <section id="donaciones" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Gold glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-gold/4 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-gold text-sm font-semibold uppercase tracking-widest">Ofrendas</span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mt-2 mb-4">
            Apoya el Ministerio
          </h2>
          <div className="section-divider max-w-xs mx-auto mb-6" />
          <p className="text-[hsl(45,60%,75%)] text-lg max-w-2xl mx-auto">
            Tu ofrenda hace posible que el mensaje de salvación llegue a más corazones.
            Cada semilla siembra esperanza.
          </p>
        </motion.div>

        {/* Scripture */}
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 max-w-xl mx-auto"
        >
          <p className="text-[hsl(45,70%,80%)] text-xl italic leading-relaxed">
            "El que siembra escasamente, también segará escasamente; pero el que siembra generosamente, también segará generosamente."
          </p>
          <cite className="text-gold text-sm mt-3 block not-italic font-semibold">
            — 2 Corintios 9:6
          </cite>
        </motion.blockquote>

        {/* Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {methods.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className={`glass-card rounded-2xl p-6 border ${m.border} hover:scale-105 transition-transform duration-300`}
            >
              <div className={`w-12 h-12 ${m.bg} rounded-xl flex items-center justify-center mb-4`}>
                <m.icon className={`w-6 h-6 ${m.color}`} />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{m.title}</h3>
              <p className="text-[hsl(45,50%,70%)] text-sm whitespace-pre-line leading-relaxed">
                {m.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex flex-col items-center gap-6 glass-card rounded-3xl px-12 py-10 border border-gold/20">
            <div className="w-16 h-16 gold-gradient rounded-full flex items-center justify-center shadow-lg shadow-yellow-600/30">
              <Heart className="w-8 h-8 text-[hsl(220,35%,6%)]" />
            </div>
            <div>
              <h3 className="text-white text-2xl font-bold mb-2">Dar con Fe</h3>
              <p className="text-[hsl(45,60%,75%)] max-w-sm">
                Cada ofrenda es un acto de adoración. Gracias por ser parte de esta misión.
              </p>
            </div>
            <a
              href="#"
              className="gold-gradient text-[hsl(220,35%,6%)] font-bold px-10 py-4 rounded-full flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-yellow-600/25"
            >
              <Heart className="w-5 h-5" />
              Dar mi Ofrenda
              <ArrowRight className="w-5 h-5" />
            </a>
            <div className="flex items-center gap-2 text-[hsl(220,15%,52%)] text-xs">
              <Shield className="w-4 h-4" />
              <span>Transacción segura y confidencial</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
