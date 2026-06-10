'use client';

import { Cross, Mail, Phone, MapPin, Facebook, Youtube, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[hsl(220,35%,4%)] border-t border-[hsl(43,96%,56%)]/15 pt-16 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center shadow-lg shadow-yellow-600/30">
                <Cross className="w-6 h-6 text-[hsl(220,35%,6%)]" />
              </div>
              <div>
                <p className="text-gold font-bold text-xl leading-tight">EL RENUEVO</p>
                <p className="text-[hsl(220,15%,52%)] text-xs uppercase tracking-widest">Ministerio</p>
              </div>
            </div>
            <p className="text-[hsl(45,50%,70%)] text-sm leading-relaxed max-w-xs mb-6">
              Un espacio de fe, esperanza y transformación donde cada vida encuentra su propósito en Dios.
            </p>
            <div className="flex gap-4">
              {[Facebook, Youtube, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full bg-[hsl(220,28%,14%)] flex items-center justify-center text-[hsl(220,15%,52%)] hover:text-gold hover:bg-gold/15 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Navegación</h4>
            <ul className="space-y-2">
              {['Inicio', 'Radio', 'Blog', 'Registro', 'Donaciones'].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="text-[hsl(45,50%,70%)] hover:text-gold transition-colors text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-[hsl(45,50%,70%)]">
                <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <span>Tu Ciudad, País</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-[hsl(45,50%,70%)]">
                <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                <span>+1 (234) 567-8900</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-[hsl(45,50%,70%)]">
                <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                <span>info@elrenuevo.org</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="section-divider mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[hsl(220,15%,40%)] text-sm">
            © {new Date().getFullYear()} Ministerio El Renuevo. Todos los derechos reservados.
          </p>
          <p className="text-[hsl(220,15%,40%)] text-sm">
            "Porque de tal manera amó Dios al mundo..." — Juan 3:16
          </p>
        </div>
      </div>
    </footer>
  );
}
