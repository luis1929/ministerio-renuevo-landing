'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, CheckCircle, Loader2, User, Phone, Calendar } from 'lucide-react';
import { submitRegistration } from '@/app/actions';

const servicios = [
  'Domingo AM (10:00)',
  'Domingo PM (18:00)',
  'Miércoles (19:00)',
  'Viernes Joven (20:00)',
  'Evento Especial',
];

export default function RegistrationSection() {
  const [form, setForm] = useState({ nombre: '', whatsapp: '', servicio: servicios[0] });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    const data = new FormData();
    data.append('nombre', form.nombre);
    data.append('whatsapp', form.whatsapp);
    data.append('servicio', form.servicio);

    const result = await submitRegistration(data);
    if (result.success) {
      setStatus('success');
      setForm({ nombre: '', whatsapp: '', servicio: servicios[0] });
    } else {
      setStatus('error');
      setErrorMsg(result.error || 'Error al registrar. Intente de nuevo.');
    }
  };

  return (
    <section id="registro" className="py-24 px-4 sm:px-6 lg:px-8 bg-[hsl(220,30%,9%)] relative">
      <div className="absolute inset-0 bg-gradient-to-br from-gold/3 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-gold text-sm font-semibold uppercase tracking-widest">Asistencia</span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mt-2 mb-6">
              Registra tu<br />
              <span className="text-gold">Visita</span>
            </h2>
            <div className="section-divider max-w-xs mb-6" />
            <p className="text-[hsl(45,60%,75%)] text-lg mb-8 leading-relaxed">
              Tu presencia es importante para nosotros. Regístrate para que podamos darte la bienvenida y mantenerte informado sobre nuestras actividades.
            </p>

            <div className="space-y-4">
              {[
                { icon: User, text: 'Registro seguro y confidencial' },
                { icon: Phone, text: 'Recibirás información por WhatsApp' },
                { icon: Calendar, text: 'Notificación de próximos eventos' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 bg-gold/15 rounded-full flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-gold" />
                  </div>
                  <span className="text-[hsl(45,60%,75%)]">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-8"
          >
            {status === 'success' ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-8"
              >
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-white text-2xl font-bold mb-2">Registro Exitoso</h3>
                <p className="text-[hsl(45,60%,75%)] mb-6">
                  Gracias por registrarte. Te esperamos con los brazos abiertos.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="text-gold hover:text-gold-light underline text-sm"
                >
                  Registrar otro
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 gold-gradient rounded-xl flex items-center justify-center">
                    <ClipboardList className="w-5 h-5 text-[hsl(220,35%,6%)]" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">Registro de Visita</h3>
                    <p className="text-[hsl(220,15%,52%)] text-sm">Completa el formulario</p>
                  </div>
                </div>

                {/* Nombre */}
                <div>
                  <label className="block text-[hsl(45,70%,80%)] text-sm font-medium mb-2">
                    Nombre Completo <span className="text-gold">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(220,15%,52%)]" />
                    <input
                      type="text"
                      required
                      value={form.nombre}
                      onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                      placeholder="Tu nombre completo"
                      className="w-full bg-[hsl(220,30%,8%)] border border-[hsl(220,20%,22%)] focus:border-gold rounded-xl pl-10 pr-4 py-3 text-white placeholder-[hsl(220,15%,40%)] outline-none transition-colors text-sm"
                    />
                  </div>
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="block text-[hsl(45,70%,80%)] text-sm font-medium mb-2">
                    WhatsApp <span className="text-gold">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(220,15%,52%)]" />
                    <input
                      type="tel"
                      required
                      value={form.whatsapp}
                      onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                      placeholder="+1 234 567 8900"
                      className="w-full bg-[hsl(220,30%,8%)] border border-[hsl(220,20%,22%)] focus:border-gold rounded-xl pl-10 pr-4 py-3 text-white placeholder-[hsl(220,15%,40%)] outline-none transition-colors text-sm"
                    />
                  </div>
                </div>

                {/* Servicio */}
                <div>
                  <label className="block text-[hsl(45,70%,80%)] text-sm font-medium mb-2">
                    Servicio <span className="text-gold">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(220,15%,52%)]" />
                    <select
                      required
                      value={form.servicio}
                      onChange={(e) => setForm({ ...form, servicio: e.target.value })}
                      className="w-full bg-[hsl(220,30%,8%)] border border-[hsl(220,20%,22%)] focus:border-gold rounded-xl pl-10 pr-4 py-3 text-white outline-none transition-colors text-sm appearance-none cursor-pointer"
                    >
                      {servicios.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {errorMsg && (
                  <p className="text-red-400 text-sm bg-red-900/20 border border-red-800/40 rounded-lg px-3 py-2">
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full gold-gradient text-[hsl(220,35%,6%)] font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60 shadow-lg shadow-yellow-600/20"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Registrando...
                    </>
                  ) : (
                    <>
                      <ClipboardList className="w-5 h-5" />
                      Confirmar Registro
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
