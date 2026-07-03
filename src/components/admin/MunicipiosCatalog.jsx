// frontend/src/components/admin/MunicipiosCatalog.jsx
import { useEffect, useState, useCallback } from 'react';
import { MapPin, Search } from 'lucide-react';
import { api } from '../../lib/api.js';

const PAGE = 100;

export default function MunicipiosCatalog() {
  const [entidades, setEntidades] = useState([]);
  const [entidad, setEntidad] = useState('');
  const [q, setQ] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [offset, setOffset] = useState(0);
  const [data, setData] = useState({ total: 0, rows: [] });
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    api.adminEntidades()
      .then(setEntidades)
      .catch((e) => setError(e.message));
  }, []);

  const cargar = useCallback(() => {
    setCargando(true);
    api.adminMunicipios({ entidad: entidad || undefined, q: busqueda || undefined, limit: PAGE, offset })
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  }, [entidad, busqueda, offset]);

  useEffect(() => { cargar(); }, [cargar]);

  function aplicarBusqueda(e) {
    e.preventDefault();
    setOffset(0);
    setBusqueda(q.trim());
  }

  function cambiarEntidad(v) {
    setOffset(0);
    setEntidad(v);
  }

  const totalPaginas = Math.max(1, Math.ceil(data.total / PAGE));
  const paginaActual = Math.floor(offset / PAGE) + 1;

  return (
    <div>
      <h3 className="font-bold text-neutral-ink flex items-center gap-2 mb-1">
        <MapPin size={18} className="text-primary" /> Catalogo de municipios
      </h3>
      <p className="text-sm text-neutral-text mb-4">
        {data.total.toLocaleString('es-MX')} municipios registrados (fuente INEGI).
      </p>

      {error && <p className="text-sm text-primary mb-3">{error}</p>}

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <select
          value={entidad}
          onChange={(e) => cambiarEntidad(e.target.value)}
          className="rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="">Todas las entidades</option>
          {entidades.map((ent) => (
            <option key={ent.cve_ent} value={ent.cve_ent}>{ent.nom_ent}</option>
          ))}
        </select>

        <form onSubmit={aplicarBusqueda} className="flex flex-1 gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-text" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar municipio, entidad o clave..."
              className="w-full rounded-xl border border-neutral-200 pl-9 pr-3 py-2 text-sm text-neutral-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <button type="submit" className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white">
            Buscar
          </button>
        </form>
      </div>

      <div className="overflow-x-auto rounded-xl border border-neutral-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-neutral-bg text-left text-neutral-text">
              <th className="px-4 py-2.5 font-semibold">Clave geo</th>
              <th className="px-4 py-2.5 font-semibold">Cve. Ent</th>
              <th className="px-4 py-2.5 font-semibold">Entidad</th>
              <th className="px-4 py-2.5 font-semibold">Cve. Mun</th>
              <th className="px-4 py-2.5 font-semibold">Municipio</th>
            </tr>
          </thead>
          <tbody>
            {cargando && (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-neutral-text">Cargando...</td></tr>
            )}
            {!cargando && data.rows.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-neutral-text">Sin resultados.</td></tr>
            )}
            {!cargando && data.rows.map((m) => (
              <tr key={m.id} className="border-t border-neutral-200 hover:bg-neutral-bg">
                <td className="px-4 py-2.5 font-mono text-neutral-ink">{m.cve_geo}</td>
                <td className="px-4 py-2.5 text-neutral-text">{m.cve_ent}</td>
                <td className="px-4 py-2.5 text-neutral-ink">{m.nom_ent}</td>
                <td className="px-4 py-2.5 text-neutral-text">{m.cve_mun}</td>
                <td className="px-4 py-2.5 text-neutral-ink">{m.nom_mun}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.total > PAGE && (
        <div className="flex items-center justify-between mt-4 text-sm">
          <button
            onClick={() => setOffset((o) => Math.max(0, o - PAGE))}
            disabled={offset === 0}
            className="rounded-xl border border-neutral-200 px-4 py-2 font-medium text-neutral-ink disabled:opacity-40"
          >
            Anterior
          </button>
          <span className="text-neutral-text">Pagina {paginaActual} de {totalPaginas}</span>
          <button
            onClick={() => setOffset((o) => o + PAGE)}
            disabled={paginaActual >= totalPaginas}
            className="rounded-xl border border-neutral-200 px-4 py-2 font-medium text-neutral-ink disabled:opacity-40"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
