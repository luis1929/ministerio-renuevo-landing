'use client';

import { motion } from 'framer-motion';
import { Video, Users, Globe, ArrowRight } from 'lucide-react';

const meetings = [
  {
    name: 'Google Meet',
    description: 'Únete a nuestra reunión de oración y estudio bíblico en línea.',
    schedule: 'Miércoles 7:00 PM',
    color: 'from-blue-600/20 to-blue-800/10',
    border: 'border-blue-500/20 hover:border-blue-400/40',
    icon: Video,
    iconBg: 'bg-blue-500/20',
    iconColor: 'text-blue-400',
    url: process.env.NEXT_PUBLIC_GOOGLE_MEET_URL || '#',
    label: 'Unirse a Meet',
  },
  {
    name: 'Jitsi Meet',
    description: 'Plataforma libre y segura para nuestras conferencias virtuales.',
    schedule: 'Viernes 8:00 PM',
    color: 'from-green-600/20 to-green-800/10',
    border: 'border-green-500/20 hover:border-green-400/40',
    icon: Globe,
    iconBg: 'bg-green-500/20',
    iconColor: 'text-green-400',
    url: process.env.NEXT_PUBLIC_JITSI_URL || 'https://meet.jit.si/MinisterioElRenuevo',
    label: 'Unirse a Jitsi',
  },
];

export default function VirtualMeetings() {
  return (
    <section id="reuniones" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-gold text-sm font-semibold uppercase tracking-widest">Virtual</span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mt-2 mb-4">
            Reuniones en Línea
          </h2>
          <div className="section-divider max-w-xs mx-auto mb-6" />
          <p className="text-[hsl(45,60%,75%)] text-lg max-w-2xl mx-auto">
            Conéctate desde donde estés. La distancia no es obstáculo para crecer juntos en fe.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {meetings.map((meeting, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`rounded-2xl border ${meeting.border} bg-gradient-to-br ${meeting.color} p-8 transition-all duration-300 group relative overflow-hidden`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/2 rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-700" />

              <div className={`w-14 h-14 ${meeting.iconBg} rounded-2xl flex items-center justify-center mb-6`}>
                <meeting.icon className={`w-7 h-7 ${meeting.iconColor}`} />
              </div>

              <h3 className="text-white text-2xl font-bold mb-2">{meeting.name}</h3>
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-gold" />
                <span className="text-gold text-sm font-medium">{meeting.schedule}</span>
              </div>
              <p className="text-[hsl(45,60%,75%)] mb-6 leading-relaxed">{meeting.description}</p>

              <a
                href={meeting.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 gold-gradient text-[hsl(220,35%,6%)] font-bold px-6 py-3 rounded-full hover:opacity-90 transition-opacity shadow-md shadow-yellow-600/20 group"
              >
                {meeting.label}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
// jitsi-update-1780080226
