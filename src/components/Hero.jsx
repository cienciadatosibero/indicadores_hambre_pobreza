// frontend/src/components/Hero.jsx
import { Satellite, ShieldCheck, TrendingUp } from 'lucide-react';
import Button from './ui/Button.jsx';

const VALORES = [
  { icon: Satellite, title: 'Datos satelitales', desc: 'Imagenes y sensores remotos como fuente.' },
  { icon: TrendingUp, title: 'Tiempo real', desc: 'Indicadores actualizables y comparables.' },
  { icon: ShieldCheck, title: 'Transparencia', desc: 'Metodologia abierta y reproducible.' },
];

export default function Hero() {
  return (
    <section id="inicio" className="relative pt-28 pb-20 bg-gradient-to-b from-white to-neutral-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="eyebrow mb-4">Observatorio de datos</p>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-neutral-ink">
            Datos que <span className="text-primary">transforman</span> el combate a la pobreza y el hambre
          </h1>
          <p className="mt-5 text-lg text-neutral-text max-w-xl">
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

        <div className="relative">
          <div className="rounded-2xl border border-neutral-200 bg-white shadow-lg p-6">
            <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-primary/10 via-neutral-bg to-[#A6D96A]/20 flex items-center justify-center">
              <Satellite size={72} className="text-primary/60" />
            </div>
            <p className="mt-4 text-sm text-neutral-text text-center">
              Mapa coropletico interactivo del territorio mexicano
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-16 grid gap-6 sm:grid-cols-3">
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
      </div>
    </section>
  );
}
