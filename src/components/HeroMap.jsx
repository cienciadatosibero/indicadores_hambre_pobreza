// frontend/src/components/HeroMap.jsx
// Mapa animado de Mexico en SVG puro (ligero, responsivo, sin imagen ni WebGL).
// Los estados se dibujan solos con un trazo que "aparece" al cargar, y sobre
// ellos laten burbujas de datos cuyo tamaño refleja el valor del indicador
// publico mas reciente por estado.
import { useEffect, useMemo, useState } from 'react';
import mapa from '../assets/mexicoMapPaths.json';
import { api } from '../lib/api.js';
import { normalizeName } from '../lib/colorScale.js';

const CENTROIDS = Object.fromEntries(
  Object.entries(mapa.centroids).map(([k, v]) => [normalizeName(k), v])
);

// Puntos de respaldo (intensidad t entre 0 y 1) si aun no hay datos cargados.
const RESPALDO = [
  ['Ciudad de México', 1.0], ['México', 0.85], ['Oaxaca', 0.8], ['Veracruz', 0.7],
  ['Chiapas', 0.72], ['Guerrero', 0.68], ['Puebla', 0.55], ['Jalisco', 0.5],
  ['Nuevo León', 0.45], ['Yucatán', 0.4], ['Chihuahua', 0.38], ['Baja California', 0.3],
  ['Sonora', 0.32], ['Michoacán', 0.5], ['Tabasco', 0.6],
];

function useBurbujas() {
  const [estado, setEstado] = useState({ puntos: null, titulo: null });
  useEffect(() => {
    let vivo = true;
    api.indicadores().then(async (lista) => {
      if (!vivo || !lista.length) return;
      const m = await api.datosMapa(lista[0].nombre_tabla);
      if (!vivo) return;
      const vals = m.datos.map((d) => d.valor).filter((v) => v !== null);
      const min = Math.min(...vals), max = Math.max(...vals);
      const puntos = m.datos
        .map((d) => {
          const c = CENTROIDS[normalizeName(d.geo)];
          if (!c) return null;
          const t = max === min || d.valor === null ? 0.5 : (d.valor - min) / (max - min);
          return { nombre: d.geo, valor: d.valor, x: c[0], y: c[1], t };
        })
        .filter(Boolean)
        .sort((a, b) => b.t - a.t);
      setEstado({ puntos, titulo: m.indicador.nombre_legible });
    }).catch(() => {});
    return () => { vivo = false; };
  }, []);
  return estado;
}

export default function HeroMap() {
  const { puntos, titulo } = useBurbujas();
  const [montado, setMontado] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMontado(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const burbujas = useMemo(() => {
    if (puntos && puntos.length) return puntos;
    return RESPALDO.map(([nombre, t]) => {
      const c = CENTROIDS[normalizeName(nombre)];
      return c ? { nombre, valor: null, x: c[0], y: c[1], t } : null;
    }).filter(Boolean);
  }, [puntos]);

  return (
    <div className="relative h-full w-full">
      <svg
        viewBox={mapa.viewBox}
        preserveAspectRatio="xMidYMid meet"
        className="h-full w-full"
      >
        <defs>
          <linearGradient id="hmEstado" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1B5C6B" />
            <stop offset="100%" stopColor="#0E3A46" />
          </linearGradient>
          <radialGradient id="hmGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF5A4E" stopOpacity="0.55" />
            <stop offset="55%" stopColor="#FF5A4E" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#FF5A4E" stopOpacity="0" />
          </radialGradient>
          <filter id="hmSoft" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Estados */}
        <g filter="url(#hmSoft)">
          {mapa.paths.map((p, i) => (
            <path
              key={p.name}
              d={p.d}
              fill="url(#hmEstado)"
              stroke="#7FF3E9"
              strokeWidth="1"
              strokeLinejoin="round"
              className="hm-state"
              style={{
                opacity: montado ? 1 : 0,
                transform: montado ? 'translateY(0)' : 'translateY(10px)',
                transition: `opacity .7s ease ${(i % 32) * 0.025}s, transform .7s ease ${(i % 32) * 0.025}s`,
              }}
            />
          ))}
        </g>

        {/* Burbujas de datos */}
        {montado && burbujas.map((b, i) => {
          const r = 6 + b.t * 26;
          return (
            <g key={b.nombre} transform={`translate(${b.x},${b.y})`}>
              <title>{b.valor != null ? `${b.nombre}: ${b.valor.toLocaleString('es-MX')}` : b.nombre}</title>
              <circle r={r} fill="url(#hmGlow)" className="hm-pulse" style={{ animationDelay: `${(i % 6) * 0.35}s` }} />
              <circle r={Math.max(2.5, r * 0.28)} fill="#FF3B30" />
              <circle r={Math.max(2.5, r * 0.28)} fill="#FF3B30" opacity="0.6" className="hm-pulse" style={{ animationDelay: `${(i % 6) * 0.35}s` }} />
            </g>
          );
        })}
      </svg>

      {titulo && (
        <p className="pointer-events-none absolute bottom-3 right-4 text-xs font-medium text-white/70">
          {titulo}
        </p>
      )}
    </div>
  );
}
