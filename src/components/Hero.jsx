// frontend/src/components/Hero.jsx
import { Satellite, ShieldCheck, TrendingUp } from 'lucide-react';
import Button from './ui/Button.jsx';
import HeroMap from './HeroMap.jsx';

const VALORES = [
  { icon: Satellite, title: 'Datos satelitales', desc: 'Imagenes y sensores remotos como fuente.' },
  { icon: TrendingUp, title: 'Tiempo real', desc: 'Indicadores actualizables y comparables.' },
  { icon: ShieldCheck, title: 'Transparencia', desc: 'Metodologia abierta y reproducible.' },
];

export default function Hero() {
  return (
    <>
      <section
        id="inicio"
        className="relative isolate overflow-hidden bg-[#081821]"
      >
        {/* Mapa animado de fondo (ocupa toda la seccion) */}
        <div className="absolute inset-0 lg:left-[30%]">
          <HeroMap />
        </div>

        {/* Velo que funde el mapa hacia el texto, adaptable:
            en movil cubre casi todo para legibilidad; en desktop solo la izquierda. */}
        <div className="pointer-events-none absolute inset-0 bg-white/70 lg:bg-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white from-10% via-white/70 via-40% to-transparent to-70% hidden lg:block" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white via-white/60 to-transparent lg:hidden" />

        {/* Contenido */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-xl pt-28 pb-40 sm:pb-48 lg:py-40 hm-fade-up">
            <p className="eyebrow mb-4">Observatorio de datos</p>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-neutral-ink">
              Datos que <span className="text-primary">transforman</span> el combate a la pobreza y el hambre
            </h1>
            <p className="mt-5 text-base sm:text-lg text-neutral-text max-w-lg">
              Monitoreo de la pobreza y el hambre en tiempo real en Mexico mediante ciencia de
              datos e imagenes satelitales. Explora indicadores estado por estado en mapas
              interactivos.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button arrow onClick={() => document.getElementById('indicadores')?.scrollIntoView()}>
                Explorar indicadores
              </Button>
              <Button variant="outline" onClick={() => document.getElementById('acerca')?.scrollIntoView()}>
                Conoce el proyecto
              </Button>
            </div>
          </div>
        </div>
      </section>
{/* 
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid gap-6 sm:grid-cols-3 bg-white">
        {VALORES.map((v) => (
          <div key={v.title} className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <v.icon size={22} />
            </span>
            <div>
              <p className="font-semibold text-neutral-ink">{v.title}</p>
              <p className="text-sm text-neutral-text">{v.desc}</p>
            </div>
          </div>
        ))}
      </div> */}
    </>
  );
}
