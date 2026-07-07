// frontend/src/components/admin/VariablesConfig.jsx
// Editor por VARIABLE: etiqueta legible y direccion de colores del mapa.
import { useEffect, useState } from 'react';
import { api } from '../../lib/api.js';
import Button from '../ui/Button.jsx';
import Modal from '../ui/Modal.jsx';

export default function VariablesConfig() {
  const [tablas, setTablas] = useState([]);
  const [tabla, setTabla] = useState('');
  const [vars, setVars] = useState([]);
  const [modal, setModal] = useState(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => { api.adminTablas().then(setTablas).catch(() => {}); }, []);
  useEffect(() => {
    if (!tabla) { setVars([]); return; }
    api.adminVariablesGet(tabla).then(setVars).catch((e) => setModal({ tipo: 'error', titulo: 'Error', mensaje: e.message }));
  }, [tabla]);

  const setCampo = (i, campo, valor) =>
    setVars(vars.map((v, j) => (j === i ? { ...v, [campo]: valor } : v)));

  const PALETA_DEFECTO = ['#1A9641', '#A6D96A', '#FFFFBF', '#FDAE61', '#D7191C'];
  const coloresDe = (v) => {
    if (v.colores) return String(v.colores).split(',').map((c) => c.trim());
    return PALETA_DEFECTO;
  };
  const setColor = (i, ci, valor) => {
    const arr = [...coloresDe(vars[i])];
    arr[ci] = valor;
    setCampo(i, 'colores', arr.join(','));
  };

  async function guardar() {
    setGuardando(true);
    try {
      await api.adminVariablesSave(tabla, vars);
      setModal({ tipo: 'success', titulo: 'Guardado', mensaje: 'Las etiquetas y colores por variable se actualizaron.' });
    } catch (e) {
      setModal({ tipo: 'error', titulo: 'No se pudo guardar', mensaje: e.message });
    } finally { setGuardando(false); }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-neutral-text">
        Define para cada variable de la tabla su <strong>texto legible</strong> (como se muestra en el sitio)
        y la <strong>direccion de colores</strong> del mapa: rojo para valores altos (pobreza, carencias)
        o verde para valores altos (logros). "Heredar" usa la configuracion general del indicador.
      </p>
      <select value={tabla} onChange={(e) => setTabla(e.target.value)}
        className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none">
        <option value="">Elige una tabla...</option>
        {tablas.map((t) => <option key={t.nombre || t} value={t.nombre || t}>{t.nombre || t}</option>)}
      </select>

      {tabla && vars.length === 0 && (
        <p className="text-sm text-neutral-text">No hay variables registradas en el diccionario para esta tabla.
          Se llenan automaticamente al subir el archivo, o ejecutando el seed del catalogo.</p>
      )}

      {vars.length > 0 && (
        <>
          <div className="overflow-auto max-h-[30rem] rounded-xl border border-neutral-200">
            <table className="w-full text-xs min-w-max">
              <thead className="bg-neutral-bg sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">Columna</th>
                  <th className="px-3 py-2 text-left font-semibold">Texto legible</th>
                  <th className="px-3 py-2 text-left font-semibold">Colores del mapa (menor → mayor)</th>
                </tr>
              </thead>
              <tbody>
                {vars.map((v, i) => (
                  <tr key={v.columna} className="border-t border-neutral-200">
                    <td className="px-3 py-2 font-mono whitespace-nowrap">{v.columna}</td>
                    <td className="px-3 py-2">
                      <input value={v.etiqueta || ''} onChange={(e) => setCampo(i, 'etiqueta', e.target.value)}
                        className="w-72 rounded-lg border border-neutral-300 px-2 py-1.5 focus:border-primary focus:outline-none" />
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1">
                        {coloresDe(v).map((col, ci) => (
                          <input
                            key={ci}
                            type="color"
                            value={col}
                            onChange={(e) => setColor(i, ci, e.target.value)}
                            className="h-8 w-8 cursor-pointer rounded border border-neutral-300"
                            title={`Nivel ${ci + 1}`}
                          />
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Button onClick={guardar} disabled={guardando}>{guardando ? 'Guardando...' : 'Guardar cambios'}</Button>
        </>
      )}

      {modal && <Modal {...modal} onClose={() => setModal(null)} />}
    </div>
  );
}
