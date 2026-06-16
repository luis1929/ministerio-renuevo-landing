'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, ClipboardList } from 'lucide-react';
import { useInvoke } from './InvokeProvider';

const fallbackSlides = [
  {
    id: '1',
    title: 'Bienvenidos a El Renuevo',
    subtitle: 'Fe que transforma vidas',
    description: 'Un espacio donde la Palabra de Dios cobra vida. Juntos crecemos en fe, esperanza y amor.',
    image: 'https://images.pexels.com/photos/8468470/pexels-photo-8468470.jpeg?auto=compress&cs=tinysrgb&w=1600',
    fecha: '2026-06-14',
    hora: '10:00 AM',
    lugar: 'Cra 54 # 72-10, Barranquilla',
    cta1: { label: 'REGISTRAR ASISTENCIA', href: '#registro' },
  },
  {
    id: '2',
    title: 'Servicio Dominical',
    subtitle: 'Cada domingo a las 10:00 AM',
    description: 'Experiencias de adoración que tocan el corazón. Ven con tu familia y encuentra la paz que tanto buscas.',
    image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1600',
    fecha: '2026-06-15',
    hora: '10:00 AM',
    lugar: 'Cl. 85 # 42-10, Barranquilla',
    cta1: { label: 'REGISTRAR ASISTENCIA', href: '#registro' },
    cta2: { label: 'REUNIÓN VIRTUAL', href: '#reuniones' },
  },
  {
    id: '3',
    title: 'Radio El Renuevo',
    subtitle: 'Transmitiendo 24/7',
    description: 'Música de adoración, mensajes de vida y más. Sintonízanos desde cualquier lugar del mundo.',
    image: 'https://images.pexels.com/photos/3394939/pexels-photo-3394939.jpeg?auto=compress&cs=tinysrgb&w=1600',
    fecha: '',
    hora: '',
    lugar: '',
    cta1: { label: 'ESCUCHAR RADIO', href: '#radio' },
    cta2: { label: 'OFRENDAR', href: '#donaciones' },
  },
];

type Slide = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image_url: string;
  cta1_label: string;
  cta1_href: string;
  cta2_label: string;
  cta2_href: string;
  fecha: string | null;
  hora: string | null;
  lugar: string | null;
  activo: boolean;
};

export default function HeroCarousel() {
  const { invoke } = useInvoke();
  const [slides, setSlides] = useState<Slide[]>([]);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    fetch('/api/carousel')
      .then((r) => r.json())
      .then((json) => {
        if (json.data && json.data.length > 0) {
          const active = json.data.filter((s: Slide) => s.activo);
          if (active.length > 0) setSlides(active);
        }
      })
      .catch(() => {});
  }, []);

  const displaySlides = slides.length > 0 ? slides : fallbackSlides;

  useEffect(() => {
    if (displaySlides.length <= 1) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % displaySlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [displaySlides.length]);

  const goTo = (idx: number) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
  };

  const prev = () => {
    setDirection(-1);
    setCurrent((c) => (c - 1 + displaySlides.length) % displaySlides.length);
  };

  const next = () => {
    setDirection(1);
    setCurrent((c) => (c + 1) % displaySlides.length);
  };

  const handleCTA = (href: string) => {
    const id = href.replace('#', '');
    invoke(id);
  };

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  const currentSlide = displaySlides[current];
  if (!currentSlide) return null;
  const isApi = slides.length > 0;
  const slide: Record<string, any> = currentSlide as any;

  const imageUrl = isApi ? slide.image_url : slide.image;
  const cta1Label = isApi ? slide.cta1_label : slide.cta1?.label;
  const cta1Href = isApi ? slide.cta1_href : slide.cta1?.href;
  const cta2Label = isApi ? slide.cta2_label : slide.cta2?.label;
  const cta2Href = isApi ? slide.cta2_href : slide.cta2?.href;
  const fecha = slide.fecha;
  const hora = slide.hora;
  const lugar = slide.lugar;

  return (
    <section id="inicio" className="relative h-screen min-h-[600px] overflow-hidden">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0">
            <img
              src={imageUrl}
              alt={currentSlide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220,35%,6%)]/60 via-[hsl(220,35%,6%)]/40 to-[hsl(220,35%,6%)]/85" />
            <div className="absolute inset-0 bg-gradient-to-r from-[hsl(220,35%,6%)]/70 via-transparent to-transparent" />
          </div>

          <div className="relative h-full flex flex-col justify-center px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="max-w-2xl"
            >
              <span className="inline-block text-gold text-sm font-semibold uppercase tracking-widest mb-3 border border-gold/30 px-3 py-1 rounded-full">
                {currentSlide.subtitle}
              </span>
              {fecha && (
                <div className="mb-4 inline-flex flex-wrap items-center gap-x-2 gap-y-1 bg-gold/15 border border-gold/30 rounded-2xl px-4 py-2 text-gold text-sm font-semibold max-w-2xl">
                  <span className="w-2 h-2 rounded-full bg-gold animate-pulse shrink-0" />
                  <span>PRÓXIMAMENTE</span>
                  <span className="text-gold/60">·</span>
                  <span>{new Date(fecha + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()}</span>
                  {hora && <><span className="text-gold/60">·</span><span>{hora}</span></>}
                  {lugar && (
                    <>
                      <span className="text-gold/60">·</span>
                      <a
                        href={'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(lugar)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-gold hover:text-white transition-colors underline underline-offset-2"
                      >
                        📍 {lugar}
                      </a>
                    </>
                  )}
                </div>
              )}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
                {currentSlide.title}
              </h1>
              <p className="text-[hsl(45,60%,80%)] text-lg mb-8 leading-relaxed">
                {currentSlide.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleCTA(cta1Href)}
                  className="border-2 border-gold/60 text-gold font-bold px-8 py-4 rounded-full flex items-center justify-center gap-2 hover:bg-gold/10 transition-colors backdrop-blur-sm"
                >
                  <ClipboardList className="w-5 h-5" />
                  {cta1Label}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleCTA(cta2Href)}
                  className="border-2 border-gold/60 text-gold font-bold px-8 py-4 rounded-full flex items-center justify-center gap-2 hover:bg-gold/10 transition-colors backdrop-blur-sm"
                >
                  <Heart className="w-5 h-5" />
                  {cta2Label}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full glass-card flex items-center justify-center text-gold hover:bg-gold/20 transition-colors"
        aria-label="Anterior"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full glass-card flex items-center justify-center text-gold hover:bg-gold/20 transition-colors"
        aria-label="Siguiente"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-3">
        {displaySlides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`transition-all duration-300 rounded-full ${
              i === current ? 'w-8 h-2 bg-gold' : 'w-2 h-2 bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Ir a slide ${i + 1}`}
          />
        ))}
      </div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 right-8 z-10 hidden md:flex flex-col items-center gap-2"
      >
        <span className="text-gold/60 text-xs uppercase tracking-widest rotate-90">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-gold/60 to-transparent" />
      </motion.div>
    </section>
  );
}
