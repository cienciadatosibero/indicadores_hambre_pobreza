// frontend/src/components/About.jsx
import { Satellite } from 'lucide-react';
import SectionTitle from './ui/SectionTitle.jsx';

export default function About() {
  return (
    <section id="acerca" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
        <div className="rounded-2xl bg-neutral-bg border border-neutral-200 aspect-[4/3] flex items-center justify-center">
          <Satellite size={96} className="text-primary/40" />
        </div>
        <div>
          <SectionTitle
            eyebrow="Acerca del observatorio"
            title="Ciencia de datos al servicio del bienestar"
          />
          <div className="space-y-4 text-neutral-text leading-relaxed">
            <p>
              Este observatorio integra imagenes satelitales, sensores remotos y fuentes
              oficiales para estimar y monitorear indicadores de pobreza y hambre en Mexico
              a nivel territorial, de forma actualizable y comparable.
            </p>
            <p>
              Mediante modelos de ciencia de datos transformamos informacion compleja en
              mapas e indicadores claros, que permiten identificar regiones prioritarias y
              apoyar la toma de decisiones de politica publica.
            </p>
            <p>
              Toda la informacion se administra de forma dinamica: el equipo carga nuevos
              conjuntos de datos y el sistema genera automaticamente mapas y analisis por
              cada indicador.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
