// frontend/src/components/AboutChart.jsx
// Grafica de indicadores representativa para la seccion "Acerca de".
// Barras horizontales que crecen al entrar en vista (animacion por scroll).
// Si hay un indicador publico cargado, usa sus estados con mayor valor;
// si no, muestra un conjunto de ejemplo con indicadores tipicos.
import { useEffect, useRef, useState } from 'react';
import { api } from '../lib/api.js';

const EJEMPLO = {
  titulo: 'Indicadores de carencia social (ejemplo)',
  unidad: '% de la poblacion',
  filas: [
    { etiqueta: 'Rezago educativo', valor: 19 },
    { etiqueta: 'Acceso a salud', valor: 28 },
    { etiqueta: 'Seguridad social', valor: 52 },
    { etiqueta: 'Calidad de vivienda', valor: 11 },
    { etiqueta: 'Servicios basicos', valor: 17 },
    { etiqueta: 'Acceso a alimentacion', valor: 22 },
  ],
};

function useEnVista(ref) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { threshold: 0.35 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref]);
  return visible;
}

export default function AboutChart() {
  const ref = useRef(null);
  const visible = useEnVista(ref);
  const [data, setData] = useState(EJEMPLO);

  useEffect(() => {
    let vivo = true;
    api.indicadores().then(async (lista) => {
      if (!vivo || !lista.length) return;
      const ind = lista[0];
      const m = await api.datosMapa(ind.nombre_tabla);
      if (!vivo) return;
      const filas = m.datos
        .filter((d) => d.valor !== null)
        .sort((a, b) => b.valor - a.valor)
        .slice(0, 6)
        .map((d) => ({ etiqueta: d.geo, valor: d.valor }));
      if (filas.length) {
        setData({
          titulo: ind.nombre_legible,
          unidad: ind.columna_valor,
          filas,
        });
      }
    }).catch(() => {});
    return () => { vivo = false; };
  }, []);

  const max = Math.max(...data.filas.map((f) => f.valor), 1);

  return (
    <div
      ref={ref}
      className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-lg"
    >
      <p className="eyebrow mb-1">Indicadores</p>
      <h3 className="font-bold text-neutral-ink mb-1 leading-snug">{data.titulo}</h3>
      <p className="text-xs text-neutral-text mb-6">{data.unidad}</p>

      <div className="space-y-4">
        {data.filas.map((f, i) => {
          const pct = (f.valor / max) * 100;
          return (
            <div key={f.etiqueta}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-neutral-ink truncate pr-2">{f.etiqueta}</span>
                <span className="text-neutral-text tabular-nums">
                  {typeof f.valor === 'number' ? f.valor.toLocaleString('es-MX') : f.valor}
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-neutral-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-primary-light"
                  style={{
                    width: visible ? `${pct}%` : '0%',
                    transition: `width 1s cubic-bezier(.22,1,.36,1) ${i * 0.1}s`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-xs text-neutral-text">
        Los valores se actualizan automaticamente conforme el equipo publica nuevos
        conjuntos de datos.
      </p>
    </div>
  );
}
