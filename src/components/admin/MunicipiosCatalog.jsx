// frontend/src/components/admin/MunicipiosCatalog.jsx
// Administracion del catalogo geografico: entidades (estados) y municipios.
import { useEffect, useState } from 'react';
import { api } from '../../lib/api.js';

function EstadosAdmin() {
  const [estados, setEstados] = useState([]);
  const [editando, setEditando] = useState(null); // { cve, nombre }
  const [msg, setMsg] = useState('');

  useEffect(() => { api.catalogoEstados().then(setEstados).catch(() => {}); }, []);

  async function guardar() {
    try {
      await api.adminRenombrarEstado(editando.cve, editando.nombre);
      setMsg('Entidad actualizada');
      setEditando(null);
      api.catalogoEstados().then(setEstados).catch(() => {});
      setTimeout(() => setMsg(''), 2500);
    } catch (e) { setMsg(e.message); }
  }

  return (
    <div className="mb-8">
      <h3 className="font-bold text-neutral-ink mb-2">Entidades (estados)</h3>
      <p className="text-xs text-neutral-text mb-3">
        Las 32 entidades del catalogo. Puedes editar su nombre; los municipios y los datos se enlazan por CVE_ENT.
      </p>
      {msg && <p className="text-xs text-primary mb-2">{msg}</p>}
      <div className="overflow-auto max-h-72 rounded-xl border border-neutral-200">
        <table className="w-full text-xs">
          <thead className="bg-neutral-bg sticky top-0">
            <tr>
              <th className="px-3 py-2 text-left font-semibold">CVE_ENT</th>
              <th className="px-3 py-2 text-left font-semibold">Nombre</th>
              <th className="px-3 py-2 text-right font-semibold">Accion</th>
            </tr>
          </thead>
          <tbody>
            {estados.map((e) => (
              <tr key={e.cve_ent} className="border-t border-neutral-200">
                <td className="px-3 py-2 font-mono">{String(e.cve_ent).padStart(2, '0')}</td>
                <td className="px-3 py-2">
                  {editando && editando.cve === e.cve_ent ? (
                    <input
                      value={editando.nombre}
                      onChange={(ev) => setEditando({ ...editando, nombre: ev.target.value })}
                      className="rounded-lg border border-neutral-300 px-2 py-1 focus:border-primary focus:outline-none"
                    />
                  ) : e.nom_ent}
                </td>
                <td className="px-3 py-2 text-right">
                  {editando && editando.cve === e.cve_ent ? (
                    <>
                      <button onClick={guardar} className="text-primary font-semibold mr-2">Guardar</button>
                      <button onClick={() => setEditando(null)} className="text-neutral-text">Cancelar</button>
                    </>
                  ) : (
                    <button
                      onClick={() => setEditando({ cve: e.cve_ent, nombre: e.nom_ent })}
                      className="text-primary font-semibold"
                    >
                      Editar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function MunicipiosCatalog() {
  const [entidades, setEntidades] = useState([]);
  const [entidad, setEntidad] = useState('');
  const [q, setQ] = useState('');
  const [municipios, setMunicipios] = useState([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => { api.adminEntidades().then(setEntidades).catch(() => {}); }, []);

  useEffect(() => {
    setCargando(true);
    api.adminMunicipios({ entidad: entidad || undefined, q: q || undefined, limit: 200 })
      .then(setMunicipios)
      .catch(() => setMunicipios([]))
      .finally(() => setCargando(false));
  }, [entidad, q]);

  return (
    <div>
      <EstadosAdmin />

      <h3 className="font-bold text-neutral-ink mb-2">Municipios</h3>
      <p className="text-xs text-neutral-text mb-3">
        Catalogo oficial de municipios. Los datos que cargues se validan contra este catalogo usando CVE_ENT + CVE_MUN.
      </p>
      <div className="flex flex-wrap gap-2 mb-3">
        <select
          value={entidad}
          onChange={(e) => setEntidad(e.target.value)}
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
        >
          <option value="">Todas las entidades</option>
          {entidades.map((e) => (
            <option key={e.cve_ent} value={e.cve_ent}>{e.nom_ent}</option>
          ))}
        </select>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar municipio..."
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
        />
      </div>

      {cargando ? (
        <p className="text-sm text-neutral-text">Cargando...</p>
      ) : (
        <div className="overflow-auto max-h-96 rounded-xl border border-neutral-200">
          <table className="w-full text-xs">
            <thead className="bg-neutral-bg sticky top-0">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">CVE_GEO</th>
                <th className="px-3 py-2 text-left font-semibold">CVE_ENT</th>
                <th className="px-3 py-2 text-left font-semibold">CVE_MUN</th>
                <th className="px-3 py-2 text-left font-semibold">Municipio</th>
                <th className="px-3 py-2 text-left font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody>
              {municipios.map((m) => (
                <tr key={m.cve_geo} className="border-t border-neutral-200">
                  <td className="px-3 py-2 font-mono">{m.cve_geo}</td>
                  <td className="px-3 py-2">{m.cve_ent}</td>
                  <td className="px-3 py-2">{m.cve_mun}</td>
                  <td className="px-3 py-2 font-medium text-neutral-ink">{m.nom_mun}</td>
                  <td className="px-3 py-2 text-neutral-text">{m.nom_ent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
