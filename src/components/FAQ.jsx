// frontend/src/components/FAQ.jsx
import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import SectionTitle from './ui/SectionTitle.jsx';

const PREGUNTAS = [
  {
    q: '¿De donde provienen los datos?',
    a: 'Se combinan imagenes satelitales, sensores remotos y fuentes oficiales, procesados con modelos de ciencia de datos para estimar indicadores territoriales.',
  },
  {
    q: '¿Como se interpretan los colores del mapa?',
    a: 'Cada indicador divide sus valores en cinco clases. La escala va de rojo a verde; en indicadores de pobreza y hambre el rojo representa los valores mas altos (peores).',
  },
  {
    q: '¿Con que frecuencia se actualizan los indicadores?',
    a: 'Los datos se administran de forma dinamica: cada vez que el equipo carga un nuevo conjunto, el mapa y los analisis se actualizan automaticamente.',
  },
  {
    q: '¿Puedo descargar los datos?',
    a: 'Si, cada indicador cuenta con su ficha tecnica y los datos pueden ponerse a disposicion para consulta y descarga.',
  },
  {
    q: '¿El sistema cubre todo el pais?',
    a: 'La cobertura es nacional a nivel de las 32 entidades federativas, con posibilidad de detalle municipal segun el indicador.',
  },
];

export default function FAQ() {
  const [abierto, setAbierto] = useState(0);
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <SectionTitle eyebrow="Preguntas frecuentes" title="Resolvemos tus dudas" center />
        <div className="space-y-3">
          {PREGUNTAS.map((p, i) => (
            <div key={i} className="rounded-xl border border-neutral-200 overflow-hidden">
              <button
                onClick={() => setAbierto(abierto === i ? -1 : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-semibold text-neutral-ink">{p.q}</span>
                {abierto === i ? <Minus size={18} className="text-primary" /> : <Plus size={18} className="text-primary" />}
              </button>
              {abierto === i && <p className="px-5 pb-5 text-neutral-text -mt-1">{p.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
