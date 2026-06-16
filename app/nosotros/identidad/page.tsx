import Link from 'next/link'
import { ArrowLeft, Cross } from 'lucide-react'

export default function NuestraIdentidad() {
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
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Nuestra Identidad</h1>
            <p className="text-[hsl(45,60%,75%)] text-sm">Quiénes somos y qué nos define</p>
          </div>
        </div>

        <div className="section-divider mb-10" />

        <div className="prose prose-invert max-w-none">
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gold mb-3">Nuestra Esencia</h2>
            <p className="text-[hsl(45,50%,75%)] leading-relaxed mb-4">
              El Ministerio El Renuevo es una comunidad de fe fundamentada en Jesucristo como único Señor y
              Salvador. Nos identificamos como una iglesia cristiana evangélica comprometida con la verdad
              de la Biblia, la centralidad de la oración y la urgencia de llevar el evangelio a toda persona.
            </p>
            <p className="text-[hsl(45,50%,75%)] leading-relaxed">
              Nuestra identidad no se encuentra en un edificio ni en una denominación, sino en Cristo.
              Somos una familia espiritual donde cada persona es valorada, amada y animada a crecer en su
              relación con Dios.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gold mb-3">Nuestra Visión</h2>
            <p className="text-[hsl(45,50%,75%)] leading-relaxed mb-4">
              Ser una iglesia que transforma su comunidad mediante el amor de Cristo, discipulando a las
              nuevas generaciones y fortaleciendo a las familias para que sean agentes de cambio en la
              sociedad.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gold mb-3">Nuestra Misión</h2>
            <p className="text-[hsl(45,50%,75%)] leading-relaxed mb-4">
              Predicar el evangelio de Jesucristo con poder, hacer discípulos en todas las naciones, y
              proveer un espacio de adoración, enseñanza y comunidad donde el Espíritu Santo se manifieste
              y las vidas sean restauradas.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gold mb-3">Nuestros Valores</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { titulo: 'Fe', desc: 'Creemos en la fe como fundamento de nuestra relación con Dios y como motor de nuestra vida cristiana.' },
                { titulo: 'Amor', desc: 'El amor incondicional es el sello distintivo de nuestra comunidad, reflejando el amor de Cristo.' },
                { titulo: 'Unidad', desc: 'Valoramos la unidad del cuerpo de Cristo por encima de diferencias personales.' },
                { titulo: 'Servicio', desc: 'Servimos con humildad, siguiendo el ejemplo de Jesús.' },
                { titulo: 'Santidad', desc: 'Buscamos una vida santa que honre a Dios en todo lo que hacemos.' },
                { titulo: 'Excelencia', desc: 'Ofrecemos lo mejor de nosotros para la gloria de Dios.' },
              ].map((v) => (
                <div key={v.titulo} className="rounded-xl bg-[hsl(220,28%,12%)] border border-[hsl(43,96%,56%)]/10 p-4">
                  <h3 className="text-gold font-semibold mb-1">{v.titulo}</h3>
                  <p className="text-sm text-[hsl(45,50%,70%)]">{v.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
