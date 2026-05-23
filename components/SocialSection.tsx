'use client';

import { motion } from 'framer-motion';
import { Facebook, Instagram, Music2, Heart, ArrowUpRight, Sparkles } from 'lucide-react';

const socials = [
  {
    name: 'Facebook',
    handle: '@MinisterioElRenuevo',
    desc: 'Transmisiones en vivo, eventos y comunidad',
    icon: Facebook,
    gradient: 'from-blue-600 to-blue-800',
    bg: 'bg-blue-500/10',
    color: 'text-blue-400',
    border: 'border-blue-500/20 hover:border-blue-400/40',
    url: process.env.NEXT_PUBLIC_FACEBOOK_URL || 'https://facebook.com',
  },
  {
    name: 'Instagram',
    handle: '@elrenuevo_min',
    desc: 'Historias de fe, reflexiones y más',
    icon: Instagram,
    gradient: 'from-pink-500 via-purple-500 to-orange-400',
    bg: 'bg-pink-500/10',
    color: 'text-pink-400',
    border: 'border-pink-500/20 hover:border-pink-400/40',
    url: process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://instagram.com',
  },
  {
    name: 'TikTok',
    handle: '@elrenuevooficial',
    desc: 'Videos inspiradores y adoración',
    icon: Music2,
    gradient: 'from-gray-900 via-gray-800 to-gray-700',
    bg: 'bg-gray-500/10',
    color: 'text-gray-300',
    border: 'border-gray-500/20 hover:border-gray-400/40',
    url: process.env.NEXT_PUBLIC_TIKTOK_URL || 'https://tiktok.com',
  },
];

export default function SocialSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[hsl(43,96%,56%)]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-gold" />
            <span className="text-gold text-sm font-semibold uppercase tracking-widest">Comunidad</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Comunidad El Renuevo
          </h2>
          <div className="section-divider max-w-xs mx-auto mb-6" />
          <p className="text-[hsl(45,60%,75%)] text-lg max-w-2xl mx-auto">
            Únete a nuestra familia digital. Síguenos, comparte y crece con nosotros en cada plataforma.
          </p>
        </motion.div>

        {/* Social Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {socials.map((social, i) => (
            <motion.a
              key={i}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              whileHover={{ y: -8 }}
              className={`glass-card rounded-2xl p-8 border ${social.border} transition-all duration-300 group relative overflow-hidden`}
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${social.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

              {/* Icon */}
              <div className={`w-16 h-16 ${social.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <social.icon className={`w-8 h-8 ${social.color}`} />
              </div>

              {/* Content */}
              <h3 className="text-white text-2xl font-bold mb-1 group-hover:text-gold transition-colors">
                {social.name}
              </h3>
              <p className={`${social.color} font-medium text-sm mb-3`}>{social.handle}</p>
              <p className="text-[hsl(45,50%,70%)] text-sm leading-relaxed mb-6">{social.desc}</p>

              {/* CTA */}
              <div className="flex items-center gap-2 text-gold font-semibold text-sm">
                <Heart className="w-4 h-4" />
                <span>Seguir</span>
                <ArrowUpRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </motion.a>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="glass-card inline-flex items-center gap-4 px-6 py-4 rounded-full border border-gold/20">
            <Heart className="w-5 h-5 text-gold animate-pulse" />
            <span className="text-[hsl(45,70%,80%)]">
              <strong className="text-white">Comparte</strong> la bendición con tu familia y amigos
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
