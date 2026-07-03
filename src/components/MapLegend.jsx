// frontend/src/components/MapLegend.jsx
import { NO_DATA_COLOR } from '../lib/colorScale.js';

// escala: { min, max, breaks, colores, sinDato }
export default function MapLegend({ escala }) {
  if (!escala || escala.min === null) return null;
  const { min, max, breaks, colores } = escala;
  const cortes = [min, ...breaks, max];

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4">
      <p className="text-xs font-semibold text-neutral-ink mb-3">Escala de valores</p>
      <div className="flex flex-col gap-2">
        {colores.map((c, i) => (
          <div key={i} className="flex items-center gap-3 text-xs text-neutral-text">
            <span className="h-4 w-8 rounded" style={{ backgroundColor: c }} />
            <span>
              {Number(cortes[i]).toLocaleString('es-MX', { maximumFractionDigits: 2 })}
              {' – '}
              {Number(cortes[i + 1]).toLocaleString('es-MX', { maximumFractionDigits: 2 })}
            </span>
          </div>
        ))}
        <div className="flex items-center gap-3 text-xs text-neutral-text mt-1">
          <span className="h-4 w-8 rounded" style={{ backgroundColor: NO_DATA_COLOR }} />
          <span>Sin dato</span>
        </div>
      </div>
    </div>
  );
}
