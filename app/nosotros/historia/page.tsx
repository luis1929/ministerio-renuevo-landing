import Link from 'next/link'
import { ArrowLeft, Cross } from 'lucide-react'

export default function NuestraHistoria() {
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
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Nuestra Historia</h1>
            <p className="text-[hsl(45,60%,75%)] text-sm">Los orígenes del Ministerio El Renuevo</p>
          </div>
        </div>

        <div className="section-divider mb-10" />

        <div className="prose prose-invert max-w-none">
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gold mb-3">Un Comienzo de Fe</h2>
            <p className="text-[hsl(45,50%,75%)] leading-relaxed mb-4">
              El Ministerio El Renuevo nació en el corazón de un grupo de creyentes que soñaban con un espacio
              donde la fe, la esperanza y la transformación fueran el centro de cada encuentro. Todo comenzó
              en reuniones pequeñas en hogares, donde familias enteras se congregaban para orar, estudiar la
              Palabra y adorar a Dios.
            </p>
            <p className="text-[hsl(45,50%,75%)] leading-relaxed mb-4">
              Con el paso del tiempo, esas reuniones crecieron. Lo que empezó como un grupo de estudio bíblico
              se convirtió en una comunidad vibrante de personas hambrientas de Dios. La necesidad de un lugar
              físico se hizo evidente, y fue así como se dieron los primeros pasos para establecer un ministerio
              formal.
            </p>
            <p className="text-[hsl(45,50%,75%)] leading-relaxed">
              Cada paso fue guiado por la oración y la convicción de que Dios estaba obrando. Desde la
              búsqueda de un local hasta la organización de los primeros servicios dominicales, cada detalle
              fue un testimonio de la fidelidad divina.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gold mb-3">Crecimiento y Consolidación</h2>
            <p className="text-[hsl(45,50%,75%)] leading-relaxed mb-4">
              A medida que la comunidad crecía, también lo hacía el alcance del ministerio. Se establecieron
              ministerios internos: alabanza, enseñanza, intercesión, y trabajo social. Cada área respondía
              a una necesidad específica de la congregación y la comunidad en general.
            </p>
            <p className="text-[hsl(45,50%,75%)] leading-relaxed">
              Hoy, el Ministerio El Renuevo continúa firme en su misión de llevar el mensaje de salvación
              a través de Jesucristo, sirviendo como un faro de luz en medio de la ciudad. Nuestra historia
              sigue escribiéndose, y creemos que los mejores capítulos aún están por venir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gold mb-3">Nuestra Visión a Futuro</h2>
            <p className="text-[hsl(45,50%,75%)] leading-relaxed">
              Soñamos con expansión no solo en infraestructura, sino en impacto espiritual. Queremos llegar
              a más personas, plantar iglesias, fortalecer familias y ver vidas transformadas por el poder
              del evangelio. La historia del Ministerio El Renuevo es una historia de fe en acción, y cada
              miembro es parte fundamental de este relato.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
