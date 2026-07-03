// frontend/src/components/Stats.jsx
import { Map, Database, Layers, Activity } from 'lucide-react';

const STATS = [
  { icon: Map, value: '32', label: 'Entidades federativas' },
  { icon: Database, value: '100%', label: 'Datos administrables' },
  { icon: Layers, value: '5', label: 'Clases en la escala de color' },
  { icon: Activity, value: '24/7', label: 'Monitoreo continuo' },
];

export default function Stats() {
  return (
    <section className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid grid-cols-2 lg:grid-cols-4 gap-8">
        {STATS.map((s) => (
          <div key={s.label} className="text-center">
            <s.icon size={28} className="mx-auto mb-3 text-white/80" />
            <p className="text-4xl font-extrabold">{s.value}</p>
            <p className="mt-1 text-sm text-white/80">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
