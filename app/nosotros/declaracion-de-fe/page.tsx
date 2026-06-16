import Link from 'next/link'
import { ArrowLeft, Cross } from 'lucide-react'

export default function DeclaracionDeFe() {
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
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Declaración de Fe</h1>
            <p className="text-[hsl(45,60%,75%)] text-sm">En qué creemos como ministerio</p>
          </div>
        </div>

        <div className="section-divider mb-10" />

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gold mb-3">La Biblia</h2>
            <p className="text-[hsl(45,50%,75%)] leading-relaxed">
              Creemos que la Biblia es la Palabra inspirada, inerrante y autoritativa de Dios. Es nuestra
              única regla de fe y conducta (2 Timoteo 3:16–17; 2 Pedro 1:20–21).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gold mb-3">Dios</h2>
            <p className="text-[hsl(45,50%,75%)] leading-relaxed">
              Creemos en un solo Dios eterno, infinito y perfecto, que existe en tres personas distintas:
              Padre, Hijo y Espíritu Santo. Unidos en esencia, iguales en poder y gloria (Deuteronomio 6:4;
              Mateo 28:19; 2 Corintios 13:14).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gold mb-3">Jesucristo</h2>
            <p className="text-[hsl(45,50%,75%)] leading-relaxed">
              Creemos en la deidad de nuestro Señor Jesucristo, su nacimiento virginal, su vida sin pecado,
              sus milagros, su muerte vicaria y expiatoria, su resurrección corporal, su ascensión a la
              diestra del Padre, y su retorno personal e inminente (Juan 1:1,14; 1 Corintios 15:3–4;
              1 Tesalonicenses 4:16–17).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gold mb-3">El Espíritu Santo</h2>
            <p className="text-[hsl(45,50%,75%)] leading-relaxed">
              Creemos en la persona y obra del Espíritu Santo, quien convence de pecado, regenera, sella,
              llena, guía, capacita y transforma al creyente a la imagen de Cristo (Juan 16:8; Hechos 1:8;
              Gálatas 5:22–23).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gold mb-3">Salvación</h2>
            <p className="text-[hsl(45,50%,75%)] leading-relaxed">
              Creemos que la salvación es por gracia mediante la fe en Jesucristo, no por obras. Todo aquel
              que se arrepiente de sus pecados y confía en Cristo es una nueva creación (Efesios 2:8–9;
              Romanos 10:9–10; 2 Corintios 5:17).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gold mb-3">La Iglesia</h2>
            <p className="text-[hsl(45,50%,75%)] leading-relaxed">
              Creemos en la iglesia como el cuerpo de Cristo, compuesta por todos los creyentes. Nos
              congregamos para adorar, enseñar, tener comunión, orar y predicar el evangelio (Efesios 1:22–23;
              Hechos 2:42).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gold mb-3">Los Últimos Tiempos</h2>
            <p className="text-[hsl(45,50%,75%)] leading-relaxed">
              Creemos en la resurrección de los muertos: los justos a vida eterna y los injustos a
              condenación eterna. Esperamos el retorno de Cristo, el juicio final y la creación de un cielo
              nuevo y una tierra nueva (Apocalipsis 20:11–15; Apocalipsis 21:1–4).
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
