'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, CreditCard, DollarSign, Building, Smartphone, Globe } from 'lucide-react';
import type { Donacion } from '@/lib/supabase-admin';

function ZelleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.5 2C6.5 2 2 6.5 2 12.5S6.5 23 12.5 23 23 18.5 23 12.5 18.5 2 12.5 2zm3.5 13h-5l3.5-4-3.5-4h5l-3.5 4 3.5 4z" />
    </svg>
  );
}

const iconMap: Record<string, { icon: React.ElementType; colors: string; iconColor: string }> = {
  zelle: {
    icon: ZelleIcon,
    colors: 'bg-purple-900/30 border-purple-500/30 text-purple-300',
    iconColor: 'text-purple-500',
  },
  paypal: {
    icon: DollarSign,
    colors: 'bg-blue-900/30 border-blue-500/30 text-blue-300',
    iconColor: 'text-blue-500',
  },
  cashapp: {
    icon: DollarSign,
    colors: 'bg-green-900/30 border-green-500/30 text-green-300',
    iconColor: 'text-green-500',
  },
  bancolombia: {
    icon: Building,
    colors: 'bg-yellow-900/30 border-yellow-500/30 text-yellow-300',
    iconColor: 'text-yellow-500',
  },
  square: {
    icon: CreditCard,
    colors: 'bg-gray-800/50 border-gray-600/30 text-gray-300',
    iconColor: 'text-white',
  },
  generic: {
    icon: Globe,
    colors: 'bg-teal-900/30 border-teal-500/30 text-teal-300',
    iconColor: 'text-teal-500',
  },
};

export default function DonationsSection() {
  const [donationMethods, setDonationMethods] = useState<Donacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/donaciones');
        const json = await res.json();
        if (json.data) setDonationMethods(json.data.filter((d: Donacion) => d.activo));
      } catch {
        setDonationMethods([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="donaciones" className="py-24 px-4 sm:px-6 lg:px-8 bg-[hsl(220,35%,6%)]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-gold text-sm font-semibold uppercase tracking-widest">Generosidad</span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mt-2 mb-4">
            Diezmos, Ofrendas y Primicias
          </h2>
          <div className="section-divider max-w-xs mx-auto mb-6" />
          <p className="text-[hsl(45,60%,75%)] text-lg max-w-3xl mx-auto font-serif italic">
            &ldquo;Honra a Jehová con tus bienes, Y con las primicias de todos tus frutos;
            Y serán llenos tus graneros con abundancia, Y tus lagares rebosarán de mosto.&rdquo;
          </p>
          <p className="text-gold font-bold mt-2">&mdash; PROVERBIOS 3:9-10 &mdash;</p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {donationMethods.map((method, index) => {
              const style = iconMap[method.icono] || iconMap.generic;
              const Icon = style.icon;
              return (
                <motion.div
                  key={method.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-6 rounded-xl border backdrop-blur-sm flex flex-col justify-between h-full group hover:scale-[1.02] transition-transform duration-300 ${style.colors}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-white/10 ${style.iconColor}`}>
                        <Icon className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold text-white">{method.metodo}</h3>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm text-gray-400 mb-1">Datos para transferir:</p>
                    <div className="flex items-center justify-between bg-black/30 p-3 rounded-lg border border-white/5">
                      <span className="font-mono text-white font-medium truncate pr-2">{method.valor}</span>
                      <button
                        onClick={() => handleCopy(method.valor, method.id)}
                        className="flex-shrink-0 p-2 hover:bg-white/10 rounded-full transition-colors group-hover:text-gold"
                        aria-label="Copiar"
                      >
                        {copiedId === method.id ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12 text-gray-500 text-sm"
        >
          <p>Si necesitas ayuda con tu donación, contáctanos directamente.</p>
        </motion.div>
      </div>
    </section>
  );
}
