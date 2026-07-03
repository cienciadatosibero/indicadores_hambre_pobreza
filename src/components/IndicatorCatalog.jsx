// frontend/src/components/IndicatorCatalog.jsx
import { useEffect, useState } from 'react';
import { BarChart2, Map as MapIcon, ChevronRight } from 'lucide-react';
import { api } from '../lib/api.js';
import SectionTitle from './ui/SectionTitle.jsx';
import Card from './ui/Card.jsx';
import MexicoMap from './MexicoMap.jsx';
import MapLegend from './MapLegend.jsx';
import ChartsPanel from './ChartsPanel.jsx';

export default function IndicatorCatalog() {
  const [indicadores, setIndicadores] = useState([]);
  const [seleccion, setSeleccion] = useState(null);
  const [mapa, setMapa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.indicadores()
      .then((data) => {
        setIndicadores(data);
        if (data.length) seleccionar(data[0].nombre_tabla);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function seleccionar(tabla) {
    setSeleccion(tabla);
    setMapa(null);
    try {
      const data = await api.datosMapa(tabla);
      setMapa(data);
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <section id="indicadores" className="py-20 md:py-28 bg-neutral-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionTitle
          eyebrow="Indicadores"
          title="Explora los indicadores en el mapa de Mexico"
          subtitle="Selecciona un indicador para visualizar su distribucion territorial y su analisis de datos."
        />

        {loading && <p className="text-neutral-text">Cargando indicadores...</p>}
        {error && <p className="text-primary">Aviso: {error}</p>}

        {!loading && indicadores.length === 0 && (
          <Card className="text-center">
            <p className="text-neutral-text">
              Aun no hay indicadores publicados. El administrador puede cargar datos desde el
              panel de administracion para que aparezcan aqui.
            </p>
          </Card>
        )}

        {indicadores.length > 0 && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Lista de indicadores */}
            <div className="space-y-3">
              {indicadores.map((ind) => (
                <button
                  key={ind.nombre_tabla}
                  onClick={() => seleccionar(ind.nombre_tabla)}
                  className={`w-full text-left rounded-xl border p-4 transition-all duration-300 ${
                    seleccion === ind.nombre_tabla
                      ? 'border-primary bg-white shadow-md'
                      : 'border-neutral-200 bg-white hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <MapIcon size={18} />
                      </span>
                      <div>
                        <p className="font-semibold text-neutral-ink text-sm">{ind.nombre_legible}</p>
                        <p className="text-xs text-neutral-text line-clamp-1">{ind.descripcion}</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-neutral-400" />
                  </div>
                </button>
              ))}
            </div>

            {/* Mapa + leyenda */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                {!mapa && <p className="text-neutral-text">Cargando mapa...</p>}
                {mapa && (
                  <div className="grid md:grid-cols-[1fr_200px] gap-4 items-start">
                    <MexicoMap datos={mapa.datos} />
                    <div className="space-y-3">
                      <div>
                        <p className="eyebrow mb-1">{mapa.indicador.columna_valor}</p>
                        <h3 className="font-bold text-neutral-ink">{mapa.indicador.nombre_legible}</h3>
                      </div>
                      <MapLegend escala={mapa.escala} />
                      {mapa.escala.invertida && (
                        <p className="text-xs text-neutral-text">
                          Escala invertida: el rojo indica los valores mas altos.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </Card>

              {seleccion && (
                <Card>
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart2 size={18} className="text-primary" />
                    <h3 className="font-bold text-neutral-ink">Analisis de datos</h3>
                  </div>
                  <ChartsPanel tabla={seleccion} />
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
