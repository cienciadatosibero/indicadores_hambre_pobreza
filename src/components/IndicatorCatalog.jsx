// frontend/src/components/IndicatorCatalog.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map as MapIcon, ArrowRight, Database, Hash } from 'lucide-react';
import { api } from '../lib/api.js';
import SectionTitle from './ui/SectionTitle.jsx';
import Card from './ui/Card.jsx';
import Button from './ui/Button.jsx';

export default function IndicatorCatalog() {
  const [indicadores, setIndicadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.indicadores()
      .then((data) => setIndicadores(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="indicadores" className="py-20 md:py-28 bg-neutral-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionTitle
          eyebrow="Indicadores"
          title="Explora los indicadores en el mapa de Mexico"
          subtitle="Cada base de datos publicada genera una tarjeta. Entra para ver su mapa territorial y sus graficas de analisis."
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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {indicadores.map((ind) => (
              <div
                key={ind.nombre_tabla}
                className="group flex flex-col rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                  <MapIcon size={22} />
                </span>

                <h3 className="font-bold text-neutral-ink leading-snug">{ind.nombre_legible}</h3>
                {ind.descripcion && (
                  <p className="text-sm text-neutral-text mt-2 line-clamp-3">{ind.descripcion}</p>
                )}

                {/* Info generada de la base de datos */}
                <div className="mt-4 space-y-1.5 text-xs text-neutral-text">
                  <p className="flex items-center gap-2">
                    <Database size={13} className="text-primary/70" />
                    Tabla: <span className="font-mono">{ind.nombre_tabla}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Hash size={13} className="text-primary/70" />
                    Variable: <span className="font-medium">{ind.columna_valor}</span>
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100">
                  <Button
                    arrow
                    className="w-full justify-center"
                    onClick={() => navigate(`/indicador/${ind.nombre_tabla}`)}
                  >
                    Ver indicadores
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
