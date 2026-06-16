'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Cross, Share2, Facebook, Instagram, Music2, LogIn } from 'lucide-react';
import { useInvoke } from './InvokeProvider';

const navLinks = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#reuniones', label: 'Reuniones' },
  { href: '#blog', label: 'Blog' },
  { href: '#seccion-registro', label: 'Registro' },
];

const socialLinks = [
  { icon: Facebook, url: process.env.NEXT_PUBLIC_FACEBOOK_URL || '#', label: 'Facebook' },
  { icon: Instagram, url: process.env.NEXT_PUBLIC_INSTAGRAM_URL || '#', label: 'Instagram' },
  { icon: Music2, url: process.env.NEXT_PUBLIC_TIKTOK_URL || '#', label: 'TikTok' },
];

const casaItems = [
  { href: '/nosotros/historia', label: 'Nuestra historia' },
  { href: '/nosotros/identidad', label: 'Nuestra identidad' },
  { href: '/nosotros/declaracion-de-fe', label: 'Nuestra declaración de fe' },
  { href: '/nosotros/pastores', label: 'Nuestros pastores' },
];

export default function Header() {
  const router = useRouter();
  const { invoke } = useInvoke();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [casaOpen, setCasaOpen] = useState(true); // TRUE for dev/maquetación

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = navLinks.map((l) => l.href.replace('#', ''));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && window.scrollY >= el.offsetTop - 100) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const id = href.replace('#', '');
    invoke(id);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[hsl(220,35%,6%)]/95 backdrop-blur-md shadow-lg shadow-black/30 border-b border-[hsl(43,96%,56%)]/10'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo + Title */}
             <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => handleNavClick('#inicio')}
            >
              {/*  AQUÍ ESTÁ EL CAMBIO: Reemplaza el <div> de la cruz por este <img> */}
              <img
                src="/logo.png"
                alt="Ministerio El Renuevo"
                className="w-10 h-10 md:w-11 md:h-11 rounded-full object-contain shadow-lg shadow-yellow-600/30"
              />
              
              <div>
                <p className="text-gold font-bold text-base md:text-lg leading-tight tracking-wide">
                  MINISTERIO EL RENUEVO
                </p>
                <p className="text-[hsl(43,80%,70%)] text-[10px] md:text-xs uppercase tracking-widest">
                  Comunidad de Fe
                </p>
              </div>
            </motion.div>
            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => handleNavClick('#inicio')}
                className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-md ${activeSection === 'inicio' ? 'text-gold' : 'text-[hsl(45,70%,80%)] hover:text-gold'}`}
              >
                Inicio
                {activeSection === 'inicio' && (
                  <motion.span layoutId="activeNav" className="absolute inset-x-1 -bottom-0.5 h-0.5 bg-gold rounded-full" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
                )}
              </button>

              <div className="relative">
                <button
                  onClick={() => setCasaOpen(!casaOpen)}
                  className="relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-md text-[hsl(45,70%,80%)] hover:text-gold flex items-center gap-1"
                >
                  Nuestra casa
                  <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${casaOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {casaOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 rounded-xl bg-white shadow-2xl shadow-black/30 border border-gray-200 py-2 z-50">
                    {casaItems.map((item) => (
                      <button
                        key={item.href}
                        onClick={() => { setCasaOpen(false); router.push(item.href); }}
                        className="block w-full text-left px-5 py-3 text-sm font-medium text-gray-700 hover:text-gold hover:bg-gray-50 transition-colors"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => handleNavClick('#reuniones')}
                className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-md ${activeSection === 'reuniones' ? 'text-gold' : 'text-[hsl(45,70%,80%)] hover:text-gold'}`}
              >
                Reuniones
                {activeSection === 'reuniones' && (
                  <motion.span layoutId="activeNav" className="absolute inset-x-1 -bottom-0.5 h-0.5 bg-gold rounded-full" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
                )}
              </button>

              <button
                onClick={() => handleNavClick('#blog')}
                className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-md ${activeSection === 'blog' ? 'text-gold' : 'text-[hsl(45,70%,80%)] hover:text-gold'}`}
              >
                Blog
                {activeSection === 'blog' && (
                  <motion.span layoutId="activeNav" className="absolute inset-x-1 -bottom-0.5 h-0.5 bg-gold rounded-full" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
                )}
              </button>

              <button
                onClick={() => handleNavClick('#seccion-registro')}
                className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-md ${activeSection === 'seccion-registro' ? 'text-gold' : 'text-[hsl(45,70%,80%)] hover:text-gold'}`}
              >
                Registro
                {activeSection === 'seccion-registro' && (
                  <motion.span layoutId="activeNav" className="absolute inset-x-1 -bottom-0.5 h-0.5 bg-gold rounded-full" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
                )}
              </button>
            </nav>

            {/* Desktop: Social Icons + CTA */}
            <div className="hidden md:flex items-center gap-3">
              {/* Social Icons */}
              <div className="flex items-center gap-1">
                {socialLinks.map((social, i) => (
                  <a
                    key={i}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-9 h-9 rounded-full bg-[hsl(220,28%,14%)] flex items-center justify-center text-[hsl(220,15%,52%)] hover:text-gold hover:bg-gold/15 transition-all duration-200"
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>

              {/* Login Button */}
              <button
                onClick={() => router.push('/login')}
                className="gold-gradient text-[hsl(220,35%,6%)] font-semibold text-sm px-5 py-2 rounded-full hover:opacity-90 transition-opacity shadow-md shadow-yellow-600/20 flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                Admin
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-gold p-2 rounded-md hover:bg-[hsl(220,30%,14%)] transition-colors"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 bg-[hsl(220,32%,10%)]/98 backdrop-blur-md border-b border-[hsl(43,96%,56%)]/15 md:hidden"
          >
            <nav className="flex flex-col px-4 py-4 gap-1">
              {navLinks.map((link) => {
                const sectionId = link.href.replace('#', '');
                const isActive = activeSection === sectionId;
                return (
                  <button
                    key={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[hsl(43,96%,56%)]/15 text-gold'
                        : 'text-[hsl(45,70%,80%)] hover:bg-[hsl(220,28%,18%)] hover:text-gold'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}

              {/* Nuestra casa - mobile with sub-items */}
              <div className="border-t border-[hsl(43,96%,56%)]/10 pt-2 mt-1">
                <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[hsl(43,80%,70%)]">
                  Nuestra casa
                </p>
                {casaItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => { setMobileOpen(false); router.push(item.href); }}
                    className="block w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-[hsl(45,70%,80%)] hover:bg-[hsl(220,28%,18%)] hover:text-gold transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => { setMobileOpen(false); router.push('/login'); }}
                className="mt-2 gold-gradient text-[hsl(220,35%,6%)] font-semibold text-sm px-5 py-3 rounded-full flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Admin
              </button>

              {/* Mobile Social Icons */}
              <div className="flex items-center justify-center gap-4 pt-4 mt-4 border-t border-[hsl(43,96%,56%)]/10">
                {socialLinks.map((social, i) => (
                  <a
                    key={i}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 rounded-full bg-[hsl(220,28%,14%)] flex items-center justify-center text-[hsl(220,15%,52%)] hover:text-gold hover:bg-gold/15 transition-colors"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}