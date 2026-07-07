// frontend/src/components/Downloads.jsx
import { useEffect, useState } from 'react';
import { Download, Database, FileSpreadsheet } from 'lucide-react';
import { api } from '../lib/api.js';
import SectionTitle from './ui/SectionTitle.jsx';
import Card from './ui/Card.jsx';
import Button from './ui/Button.jsx';

export default function Downloads() {
  const [indicadores, setIndicadores] = useState([]);

  useEffect(() => {
    api.indicadores().then(setIndicadores).catch(() => setIndicadores([]));
  }, []);

  return (
    <section id="descargas" className="py-20 md:py-28 bg-neutral-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionTitle
          eyebrow="Repositorio de datos"
          title="Descarga la informacion del observatorio"
          subtitle="Todos los indicadores publicados y el catalogo geografico oficial estan disponibles para consulta y descarga en formato CSV."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FileSpreadsheet size={20} />
              </span>
              <h3 className="font-bold text-neutral-ink">Indicadores publicados</h3>
            </div>

            {indicadores.length === 0 && (
              <p className="text-sm text-neutral-text">
                Aun no hay indicadores publicados para descargar.
              </p>
            )}

            <div className="space-y-3">
              {indicadores.map((ind) => (
                <div
                  key={ind.nombre_tabla}
                  className="flex items-center justify-between gap-4 rounded-xl border border-neutral-200 p-4"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-neutral-ink text-sm truncate">{ind.nombre_legible}</p>
                    <p className="text-xs text-neutral-text line-clamp-1">{ind.descripcion}</p>
                  </div>
                  <a href={api.urlDescargaIndicador(ind.nombre_tabla)}>
                    <Button variant="outline" className="shrink-0">
                      <Download size={16} /> CSV
                    </Button>
                  </a>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Database size={20} />
              </span>
              <h3 className="font-bold text-neutral-ink">Catalogo geografico</h3>
            </div>
            <p className="text-sm text-neutral-text mb-5">
              Claves y nombres oficiales (INEGI) de las 32 entidades y sus municipios, usadas
              para referenciar cada dato del observatorio.
            </p>
            <a href={api.urlDescargaCatalogo()}>
              <Button className="w-full justify-center">
                <Download size={16} /> Descargar catalogo (CSV)
              </Button>
            </a>
          </Card>
        </div>
      </div>
    </section>
  );
}
