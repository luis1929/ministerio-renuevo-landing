'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Cross, Share2, Facebook, Instagram, Music2 } from 'lucide-react';

const navLinks = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#radio', label: 'Radio' },
  { href: '#blog', label: 'Blog' },
  { href: '#registro', label: 'Registro' },
  { href: '#donaciones', label: 'Donaciones' },
  { href: '#social', label: 'Social' },
];

const socialLinks = [
  { icon: Facebook, url: process.env.NEXT_PUBLIC_FACEBOOK_URL || '#', label: 'Facebook' },
  { icon: Instagram, url: process.env.NEXT_PUBLIC_INSTAGRAM_URL || '#', label: 'Instagram' },
  { icon: Music2, url: process.env.NEXT_PUBLIC_TIKTOK_URL || '#', label: 'TikTok' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');
  const [mobileOpen, setMobileOpen] = useState(false);

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
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
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
              {navLinks.map((link) => {
                const sectionId = link.href.replace('#', '');
                const isActive = activeSection === sectionId;
                return (
                  <button
                    key={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-md ${
                      isActive
                        ? 'text-gold'
                        : 'text-[hsl(45,70%,80%)] hover:text-gold'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="activeNav"
                        className="absolute inset-x-1 -bottom-0.5 h-0.5 bg-gold rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
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

              {/* CTA Button */}
              <button
                onClick={() => handleNavClick('#registro')}
                className="gold-gradient text-[hsl(220,35%,6%)] font-semibold text-sm px-5 py-2 rounded-full hover:opacity-90 transition-opacity shadow-md shadow-yellow-600/20"
              >
                Registrarse
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

              <button
                onClick={() => handleNavClick('#registro')}
                className="mt-2 gold-gradient text-[hsl(220,35%,6%)] font-semibold text-sm px-5 py-3 rounded-full"
              >
                Registrarse ahora
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