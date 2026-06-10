'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, CreditCard, DollarSign, Building, Smartphone, Globe } from 'lucide-react';

// Datos reales extraídos de tu imagen
const donationMethods = [
  {
    name: 'Zelle',
    icon: <ZelleIcon className="w-8 h-8" />,
    value: 'M.Elrenuevo@gmail.com',
    color: 'bg-purple-900/30 border-purple-500/30 text-purple-300',
    iconColor: 'text-purple-500'
  },
  {
    name: 'PayPal',
    icon: <DollarSign className="w-8 h-8 text-blue-500" />,
    value: 'M.Elrenuevo@gmail.com',
    color: 'bg-blue-900/30 border-blue-500/30 text-blue-300',
    iconColor: 'text-blue-500'
  },
  {
    name: 'Cash App',
    icon: <DollarSign className="w-8 h-8 text-green-500" />,
    value: '$Ministerioelrenuevo',
    color: 'bg-green-900/30 border-green-500/30 text-green-300',
    iconColor: 'text-green-500'
  },
  {
    name: 'Bancolombia',
    icon: <Building className="w-8 h-8 text-yellow-500" />,
    value: '487-0000-144-26',
    color: 'bg-yellow-900/30 border-yellow-500/30 text-yellow-300',
    iconColor: 'text-yellow-500'
  },
  {
    name: 'Square',
    icon: <CreditCard className="w-8 h-8 text-white" />,
    value: '(Pastor Haim)',
    color: 'bg-gray-800/50 border-gray-600/30 text-gray-300',
    iconColor: 'text-white'
  }
];

function ZelleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.5 2C6.5 2 2 6.5 2 12.5S6.5 23 12.5 23 23 18.5 23 12.5 18.5 2 12.5 2zm3.5 13h-5l3.5-4-3.5-4h5l-3.5 4 3.5 4z" />
    </svg>
  );
}

export default function DonationsSection() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="donaciones" className="py-24 px-4 sm:px-6 lg:px-8 bg-[hsl(220,35%,6%)]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
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
            "Honra a Jehová con tus bienes, Y con las primicias de todos tus frutos; 
            Y serán llenos tus graneros con abundancia, Y tus lagares rebosarán de mosto."
          </p>
          <p className="text-gold font-bold mt-2">— PROVERBIOS 3:9-10 —</p>
        </motion.div>

        {/* Grid de Métodos de Pago */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {donationMethods.map((method, index) => (
            <motion.div
              key={method.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 rounded-xl border backdrop-blur-sm flex flex-col justify-between h-full group hover:scale-[1.02] transition-transform duration-300 ${method.color}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-white/10 ${method.iconColor}`}>
                    {method.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white">{method.name}</h3>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-400 mb-1">Datos para transferir:</p>
                <div className="flex items-center justify-between bg-black/30 p-3 rounded-lg border border-white/5">
                  <span className="font-mono text-white font-medium truncate pr-2">{method.value}</span>
                  <button
                    onClick={() => handleCopy(method.value, method.name)}
                    className="flex-shrink-0 p-2 hover:bg-white/10 rounded-full transition-colors group-hover:text-gold"
                    aria-label="Copiar"
                  >
                    {copiedId === method.name ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Nota al pie */}
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