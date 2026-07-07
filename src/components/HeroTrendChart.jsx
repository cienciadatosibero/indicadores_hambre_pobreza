// frontend/src/components/HeroTrendChart.jsx
// Grafica inferior tipo "lollipop" con la evolucion 2010-2024, para la portada.
const ANIOS = [2010, 2012, 2014, 2016, 2018, 2020, 2022, 2024];
const VALORES = [22, 28, 30, 34, 38, 42, 33, 20];

export default function HeroTrendChart({ className = '' }) {
  const w = 760;
  const h = 90;
  const padX = 20;
  const stepX = (w - padX * 2) / (ANIOS.length - 1);
  const max = 60;
  const yFor = (v) => h - 24 - (v / max) * (h - 40);

  const puntos = ANIOS.map((a, i) => ({
    x: padX + i * stepX,
    y: yFor(VALORES[i]),
    v: VALORES[i],
    a,
  }));

  const linea = puntos.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <div className={`rounded-xl border border-white/10 bg-[#0A1A22]/70 backdrop-blur px-5 py-3 ${className}`}>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
        <polyline points={linea} fill="none" stroke="#5FE3D6" strokeWidth="1.5" opacity="0.7" />
        {puntos.map((p, i) => (
          <g key={p.a}>
            <line x1={p.x} y1={h - 20} x2={p.x} y2={p.y} stroke="#FFFFFF" strokeOpacity="0.15" strokeWidth="1" />
            <circle
              cx={p.x}
              cy={p.y}
              r={i === 5 ? 6 : 4.5}
              fill={i === 5 ? '#FF5A4E' : '#F2994A'}
              fillOpacity={i === 5 ? 1 : 0.85}
            />
            <text x={p.x} y={h - 6} textAnchor="middle" fontSize="9" fill="#FFFFFF" fillOpacity="0.55">
              {p.a}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
