// frontend/src/components/HeroStatsWidget.jsx
// Panel flotante de datos (estilo dashboard) para la portada.
const BARRAS = [40, 55, 35, 70, 48, 30, 60];

export default function HeroStatsWidget({ className = '' }) {
  return (
    <div
      className={`w-64 rounded-xl border border-white/10 bg-[#0A1A22]/80 backdrop-blur p-4 shadow-xl ${className}`}
    >
      <p className="text-[10px] uppercase tracking-wider text-white/50 mb-3">
        Tendencia nacional
      </p>

      {/* Fila de puntos con linea, tipo mini serie de tiempo */}
      <svg viewBox="0 0 220 40" className="w-full h-8 mb-3">
        <polyline
          points="5,28 35,20 65,24 95,12 125,18 155,10 185,16 215,14"
          fill="none"
          stroke="#5FE3D6"
          strokeWidth="1.4"
          opacity="0.6"
        />
        {[5, 35, 65, 95, 125, 155, 185, 215].map((x, i) => (
          <circle
            key={x}
            cx={x}
            cy={[28, 20, 24, 12, 18, 10, 16, 14][i]}
            r={i === 5 ? 3.2 : 2.4}
            fill={i === 5 ? '#FF5A4E' : '#5FE3D6'}
          />
        ))}
      </svg>

      {/* Mini barras horizontales */}
      <div className="space-y-1.5">
        {BARRAS.map((v, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-1.5 flex-1 rounded-full bg-white/10 overflow-hidden">
              <div
                className={`h-full rounded-full ${i === 3 ? 'bg-[#FF5A4E]' : 'bg-[#5FE3D6]'}`}
                style={{ width: `${v}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex justify-between text-[10px] text-white/40">
        <span>0</span>
        <span>25</span>
        <span>50</span>
        <span>75</span>
      </div>
    </div>
  );
}
