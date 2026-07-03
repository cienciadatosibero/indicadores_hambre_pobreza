// frontend/src/components/ChartsPanel.jsx
import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  LineChart, Line,
} from 'recharts';
import { api } from '../lib/api.js';

export default function ChartsPanel({ tabla }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [colSel, setColSel] = useState(null);

  useEffect(() => {
    setData(null);
    setError(null);
    api.analytics(tabla)
      .then((d) => {
        setData(d);
        setColSel(d.numericas[0] || null);
      })
      .catch((e) => setError(e.message));
  }, [tabla]);

  if (error) return <p className="text-primary text-sm">No se pudo cargar el analisis: {error}</p>;
  if (!data) return <p className="text-neutral-text text-sm">Analizando datos...</p>;
  if (!data.numericas.length) return <p className="text-neutral-text text-sm">Esta tabla no tiene columnas numericas para graficar.</p>;

  const resumen = colSel ? data.resumen[colSel] : null;

  // Ordena por valor para un ranking claro (top 15 para legibilidad).
  const chartData = data.filas
    .map((f) => ({ etiqueta: String(f[data.etiqueta]), valor: Number(f[colSel]) }))
    .filter((d) => !Number.isNaN(d.valor))
    .sort((a, b) => b.valor - a.valor)
    .slice(0, 15);

  const hayTemporal = data.numericas.includes('anio') || data.columnas.includes('anio');

  return (
    <div className="space-y-6">
      {/* Selector de columna numerica */}
      <div className="flex flex-wrap gap-2">
        {data.numericas.map((c) => (
          <button
            key={c}
            onClick={() => setColSel(c)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              colSel === c ? 'bg-primary text-white' : 'bg-neutral-bg text-neutral-text hover:bg-neutral-200'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Tarjetas resumen */}
      {resumen && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            ['Minimo', resumen.min],
            ['Maximo', resumen.max],
            ['Promedio', resumen.promedio],
            ['Registros', resumen.conteo],
          ].map(([label, val]) => (
            <div key={label} className="rounded-xl bg-neutral-bg p-3 text-center">
              <p className="text-xs text-neutral-text">{label}</p>
              <p className="text-lg font-bold text-neutral-ink">
                {Number(val).toLocaleString('es-MX', { maximumFractionDigits: 2 })}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Grafica de barras (ranking) */}
      <div>
        <p className="text-sm font-semibold text-neutral-ink mb-2">Ranking por {data.etiqueta}</p>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData} margin={{ bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="etiqueta" angle={-45} textAnchor="end" interval={0} tick={{ fontSize: 11 }} height={70} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="valor" fill="#C8102E" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Linea si hay columna temporal */}
      {hayTemporal && (
        <div>
          <p className="text-sm font-semibold text-neutral-ink mb-2">Tendencia</p>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={[...chartData].reverse()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="etiqueta" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="valor" stroke="#C8102E" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
