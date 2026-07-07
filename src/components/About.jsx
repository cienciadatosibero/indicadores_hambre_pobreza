// frontend/src/components/About.jsx
import { useEffect, useRef, useState } from 'react';
import SectionTitle from './ui/SectionTitle.jsx';

function useEnVista(ref) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref]);
  return visible;
}

const PARRAFOS = [
  'Este observatorio integra imagenes satelitales, sensores remotos y fuentes oficiales para estimar y monitorear indicadores de pobreza y hambre en Mexico a nivel territorial, de forma actualizable y comparable.',
  'Mediante modelos de ciencia de datos transformamos informacion compleja en mapas e indicadores claros, que permiten identificar regiones prioritarias y apoyar la toma de decisiones de politica publica.',
  'Toda la informacion se administra de forma dinamica: el equipo carga nuevos conjuntos de datos y el sistema genera automaticamente mapas y analisis por cada indicador.',
];

export default function About() {
  const ref = useRef(null);
  const visible = useEnVista(ref);

  return (
    <section id="acerca" className="py-20 md:py-28 bg-white">
      <div ref={ref} className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity .8s ease, transform .8s ease',
          }}
        >
          <SectionTitle
            eyebrow="Acerca del observatorio"
            title="Ciencia de datos al servicio del bienestar"
            center
          />
        </div>

        <div className="space-y-4 text-neutral-text leading-relaxed">
          {PARRAFOS.map((p, i) => (
            <p
              key={i}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity .8s ease ${0.15 + i * 0.15}s, transform .8s ease ${0.15 + i * 0.15}s`,
              }}
            >
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
