import Link from 'next/link'
import { ArrowLeft, Cross } from 'lucide-react'

export default function NuestrosPastores() {
  return (
    <div className="min-h-screen bg-[hsl(220,35%,6%)]">
      <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-[hsl(45,60%,50%)] hover:text-gold transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center">
            <Cross className="w-6 h-6 text-[hsl(220,35%,6%)]" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Nuestros Pastores</h1>
            <p className="text-[hsl(45,60%,75%)] text-sm">El liderazgo pastoral de nuestra iglesia</p>
          </div>
        </div>

        <div className="section-divider mb-10" />

        <div className="space-y-10">
          <section>
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-32 h-32 rounded-xl bg-[hsl(220,28%,14%)] border border-[hsl(43,96%,56%)]/10 flex items-center justify-center flex-shrink-0">
                <Cross className="w-10 h-10 text-gold/50" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Pastor Juan Pérez</h2>
                <p className="text-gold text-sm font-medium mb-3">Pastor Fundador</p>
                <p className="text-[hsl(45,50%,75%)] leading-relaxed">
                  El Pastor Juan Pérez es el fundador del Ministerio El Renuevo. Con una visión clara de
                  restaurar vidas y familias, ha pastoreado la congregación desde sus inicios. Su pasión
                  por la predicación expositiva y el discipulado ha sido fundamental para el crecimiento
                  espiritual de la iglesia. Es graduado del Seminario Teológico y cuenta con más de 20
                  años de experiencia ministerial.
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-32 h-32 rounded-xl bg-[hsl(220,28%,14%)] border border-[hsl(43,96%,56%)/10] flex items-center justify-center flex-shrink-0">
                <Cross className="w-10 h-10 text-gold/50" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Pastora María Gómez</h2>
                <p className="text-gold text-sm font-medium mb-3">Co-Pastora</p>
                <p className="text-[hsl(45,50%,75%)] leading-relaxed">
                  La Pastora María Gómez ha servido junto a su esposo en el ministerio desde el primer día.
                  Su corazón por las mujeres, los jóvenes y la intercesión ha marcado profundamente la vida
                  de la iglesia. Lidera el ministerio de oración y consejería, y es reconocida por su
                  sensibilidad espiritual y su amor por la enseñanza bíblica.
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-32 h-32 rounded-xl bg-[hsl(220,28%,14%)] border border-[hsl(43,96%,56%)/10] flex items-center justify-center flex-shrink-0">
                <Cross className="w-10 h-10 text-gold/50" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Pastor David Martínez</h2>
                <p className="text-gold text-sm font-medium mb-3">Pastor de Jóvenes y Alabanza</p>
                <p className="text-[hsl(45,50%,75%)] leading-relaxed">
                  El Pastor David Martínez lidera el ministerio de jóvenes y el equipo de alabanza. Con
                  un enfoque contemporáneo pero fundamentado en la Palabra, ha logrado conectar con las
                  nuevas generaciones. Es músico, compositor y tiene un profundo deseo de ver a los jóvenes
                  caminar en santidad y propósito.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
