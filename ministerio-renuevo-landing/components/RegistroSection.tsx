'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import {
  UserPlus,
  CalendarCheck,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
  User,
  Phone,
  Mail,
  MapPin,
  Church,
  MessageSquare,
} from 'lucide-react';

const servicios = [
  'Culto Dominical (10:00 AM)',
  'Estudio Bíblico (Miércoles)',
  'Oración (Viernes)',
  'Evento Especial',
  'Primera Visita',
];

interface FormStatus {
  state: 'idle' | 'loading' | 'success' | 'error';
  message: string;
}

const initialFieles = {
  nombre: '',
  email: '',
  whatsapp: '',
  ciudad: '',
  ministerio: '',
  notas: '',
};

const initialRegistraciones = {
  nombre: '',
  whatsapp: '',
  servicio: '',
};

export default function RegistroSection() {
  const [tab, setTab] = useState<'fieles' | 'registraciones'>('fieles');

  const [fielesForm, setFielesForm] = useState(initialFieles);
  const [fielesStatus, setFielesStatus] = useState<FormStatus>({ state: 'idle', message: '' });

  const [registracionesForm, setRegistracionesForm] = useState(initialRegistraciones);
  const [registracionesStatus, setRegistracionesStatus] = useState<FormStatus>({ state: 'idle', message: '' });

  const handleFielesChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFielesForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegistracionesChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setRegistracionesForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFielesSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFielesStatus({ state: 'loading', message: '' });

    try {
      const res = await fetch('/api/fieles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fielesForm),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al registrar');
      }

      setFielesStatus({ state: 'success', message: data.message });
      setFielesForm(initialFieles);
    } catch (err) {
      setFielesStatus({
        state: 'error',
        message: err instanceof Error ? err.message : 'Error inesperado',
      });
    }
  };

  const handleRegistracionesSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setRegistracionesStatus({ state: 'loading', message: '' });

    try {
      const res = await fetch('/api/registraciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registracionesForm),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al registrar');
      }

      setRegistracionesStatus({ state: 'success', message: data.message });
      setRegistracionesForm(initialRegistraciones);
    } catch (err) {
      setRegistracionesStatus({
        state: 'error',
        message: err instanceof Error ? err.message : 'Error inesperado',
      });
    }
  };

  const renderAlert = (status: FormStatus) => {
    if (status.state === 'error') {
      return (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {status.message}
        </div>
      );
    }
    if (status.state === 'success') {
      return (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-300 text-sm">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          {status.message}
        </div>
      );
    }
    return null;
  };

  return (
    <section id="registro" className="py-24 px-4 sm:px-6 lg:px-8 bg-[hsl(220,35%,4%)]">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-gold text-sm font-semibold uppercase tracking-widest">Comunidad</span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mt-2 mb-4">
            Conéctate con Nosotros
          </h2>
          <div className="section-divider max-w-xs mx-auto mb-6" />
          <p className="text-[hsl(45,60%,75%)] text-lg max-w-2xl mx-auto">
            Regístrate como miembro de nuestra comunidad o confirma tu asistencia a los servicios.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1 rounded-xl bg-[hsl(220,28%,10%)] border border-[hsl(43,96%,56%)]/15">
            <button
              onClick={() => setTab('fieles')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                tab === 'fieles'
                  ? 'gold-gradient text-[hsl(220,35%,6%)] shadow-md shadow-yellow-600/25'
                  : 'text-[hsl(45,60%,80%)] hover:text-gold hover:bg-gold/10'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              Nuevo Miembro
            </button>
            <button
              onClick={() => setTab('registraciones')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                tab === 'registraciones'
                  ? 'gold-gradient text-[hsl(220,35%,6%)] shadow-md shadow-yellow-600/25'
                  : 'text-[hsl(45,60%,80%)] hover:text-gold hover:bg-gold/10'
              }`}
            >
              <CalendarCheck className="w-4 h-4" />
              Asistencia a Servicio
            </button>
          </div>
        </div>

        {/* Formulario: Fieles */}
        {tab === 'fieles' && (
          <motion.div
            key="fieles"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl mx-auto"
          >
            {fielesStatus.state === 'success' ? (
              <div className="flex flex-col items-center gap-4 p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">¡Bienvenido a la familia!</h3>
                <p className="text-[hsl(45,60%,75%)]">Tu registro como miembro ha sido exitoso.</p>
                <button
                  onClick={() => setFielesStatus({ state: 'idle', message: '' })}
                  className="mt-4 text-gold hover:text-yellow-400 text-sm font-medium transition-colors"
                >
                  Registrar otro miembro
                </button>
              </div>
            ) : (
              <form onSubmit={handleFielesSubmit} className="space-y-5">
                <div>
                  <label htmlFor="fieles-nombre" className="block text-sm font-medium text-[hsl(45,60%,80%)] mb-1.5">
                    <User className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
                    Nombre completo <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="fieles-nombre"
                    name="nombre"
                    type="text"
                    required
                    value={fielesForm.nombre}
                    onChange={handleFielesChange}
                    placeholder="Tu nombre"
                    className="w-full px-4 py-3 rounded-lg bg-[hsl(220,28%,10%)] border border-[hsl(43,96%,56%)]/20 text-white placeholder:text-gray-500 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/50 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="fieles-email" className="block text-sm font-medium text-[hsl(45,60%,80%)] mb-1.5">
                      <Mail className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
                      Correo electrónico <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="fieles-email"
                      name="email"
                      type="email"
                      required
                      value={fielesForm.email}
                      onChange={handleFielesChange}
                      placeholder="correo@ejemplo.com"
                      className="w-full px-4 py-3 rounded-lg bg-[hsl(220,28%,10%)] border border-[hsl(43,96%,56%)]/20 text-white placeholder:text-gray-500 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="fieles-whatsapp" className="block text-sm font-medium text-[hsl(45,60%,80%)] mb-1.5">
                      <Phone className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
                      WhatsApp
                    </label>
                    <input
                      id="fieles-whatsapp"
                      name="whatsapp"
                      type="tel"
                      value={fielesForm.whatsapp}
                      onChange={handleFielesChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-3 rounded-lg bg-[hsl(220,28%,10%)] border border-[hsl(43,96%,56%)]/20 text-white placeholder:text-gray-500 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="fieles-ciudad" className="block text-sm font-medium text-[hsl(45,60%,80%)] mb-1.5">
                      <MapPin className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
                      Ciudad
                    </label>
                    <input
                      id="fieles-ciudad"
                      name="ciudad"
                      type="text"
                      value={fielesForm.ciudad}
                      onChange={handleFielesChange}
                      placeholder="Tu ciudad"
                      className="w-full px-4 py-3 rounded-lg bg-[hsl(220,28%,10%)] border border-[hsl(43,96%,56%)]/20 text-white placeholder:text-gray-500 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="fieles-ministerio" className="block text-sm font-medium text-[hsl(45,60%,80%)] mb-1.5">
                      <Church className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
                      Ministerio de interés
                    </label>
                    <input
                      id="fieles-ministerio"
                      name="ministerio"
                      type="text"
                      value={fielesForm.ministerio}
                      onChange={handleFielesChange}
                      placeholder="Ej: Alabanza, Juventud, etc."
                      className="w-full px-4 py-3 rounded-lg bg-[hsl(220,28%,10%)] border border-[hsl(43,96%,56%)]/20 text-white placeholder:text-gray-500 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/50 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="fieles-notas" className="block text-sm font-medium text-[hsl(45,60%,80%)] mb-1.5">
                    <MessageSquare className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
                    Notas o comentarios
                  </label>
                  <textarea
                    id="fieles-notas"
                    name="notas"
                    rows={3}
                    value={fielesForm.notas}
                    onChange={handleFielesChange}
                    placeholder="¿Algo que quieras compartir?"
                    className="w-full px-4 py-3 rounded-lg bg-[hsl(220,28%,10%)] border border-[hsl(43,96%,56%)]/20 text-white placeholder:text-gray-500 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/50 transition-colors resize-none"
                  />
                </div>

                {renderAlert(fielesStatus)}

                <button
                  type="submit"
                  disabled={fielesStatus.state === 'loading'}
                  className="w-full gold-gradient text-[hsl(220,35%,6%)] font-bold px-8 py-4 rounded-full flex items-center justify-center gap-2 shadow-lg shadow-yellow-600/25 hover:shadow-yellow-600/40 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {fielesStatus.state === 'loading' ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Registrando...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Registrarme como miembro
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        )}

        {/* Formulario: Registraciones */}
        {tab === 'registraciones' && (
          <motion.div
            key="registraciones"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl mx-auto"
          >
            {registracionesStatus.state === 'success' ? (
              <div className="flex flex-col items-center gap-4 p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">¡Asistencia registrada!</h3>
                <p className="text-[hsl(45,60%,75%)]">Te esperamos con gusto. ¡Dios te bendiga!</p>
                <button
                  onClick={() => setRegistracionesStatus({ state: 'idle', message: '' })}
                  className="mt-4 text-gold hover:text-yellow-400 text-sm font-medium transition-colors"
                >
                  Registrar otra asistencia
                </button>
              </div>
            ) : (
              <form onSubmit={handleRegistracionesSubmit} className="space-y-5">
                <div>
                  <label htmlFor="reg-nombre" className="block text-sm font-medium text-[hsl(45,60%,80%)] mb-1.5">
                    <User className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
                    Nombre completo <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="reg-nombre"
                    name="nombre"
                    type="text"
                    required
                    value={registracionesForm.nombre}
                    onChange={handleRegistracionesChange}
                    placeholder="Tu nombre"
                    className="w-full px-4 py-3 rounded-lg bg-[hsl(220,28%,10%)] border border-[hsl(43,96%,56%)]/20 text-white placeholder:text-gray-500 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/50 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="reg-whatsapp" className="block text-sm font-medium text-[hsl(45,60%,80%)] mb-1.5">
                    <Phone className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
                    WhatsApp
                  </label>
                  <input
                    id="reg-whatsapp"
                    name="whatsapp"
                    type="tel"
                    value={registracionesForm.whatsapp}
                    onChange={handleRegistracionesChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-3 rounded-lg bg-[hsl(220,28%,10%)] border border-[hsl(43,96%,56%)]/20 text-white placeholder:text-gray-500 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/50 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="reg-servicio" className="block text-sm font-medium text-[hsl(45,60%,80%)] mb-1.5">
                    <CalendarCheck className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
                    Servicio <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="reg-servicio"
                    name="servicio"
                    required
                    value={registracionesForm.servicio}
                    onChange={handleRegistracionesChange}
                    className="w-full px-4 py-3 rounded-lg bg-[hsl(220,28%,10%)] border border-[hsl(43,96%,56%)]/20 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/50 transition-colors"
                  >
                    <option value="">Selecciona un servicio</option>
                    {servicios.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {renderAlert(registracionesStatus)}

                <button
                  type="submit"
                  disabled={registracionesStatus.state === 'loading'}
                  className="w-full gold-gradient text-[hsl(220,35%,6%)] font-bold px-8 py-4 rounded-full flex items-center justify-center gap-2 shadow-lg shadow-yellow-600/25 hover:shadow-yellow-600/40 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {registracionesStatus.state === 'loading' ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Registrando...
                    </>
                  ) : (
                    <>
                      <CalendarCheck className="w-5 h-5" />
                      Confirmar asistencia
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
