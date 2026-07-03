// frontend/src/components/admin/TablesManager.jsx
import { useEffect, useState } from 'react';
import { Trash2, Database, RefreshCw } from 'lucide-react';
import { api } from '../../lib/api.js';

export default function TablesManager({ refreshKey }) {
  const [tablas, setTablas] = useState([]);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);

  async function cargar() {
    setCargando(true);
    try {
      const data = await api.adminTablas();
      setTablas(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => { cargar(); }, [refreshKey]);

  async function eliminar(nombre) {
    if (!confirm(`¿Eliminar la tabla "${nombre}"? Esta accion no se puede deshacer.`)) return;
    try {
      await api.adminEliminarTabla(nombre);
      cargar();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-neutral-ink flex items-center gap-2">
          <Database size={18} className="text-primary" /> Tablas dinamicas
        </h3>
        <button onClick={cargar} className="text-sm text-neutral-text hover:text-primary flex items-center gap-1">
          <RefreshCw size={14} /> Actualizar
        </button>
      </div>
      {error && <p className="text-sm text-primary mb-3">{error}</p>}
      {cargando && <p className="text-sm text-neutral-text">Cargando...</p>}
      {!cargando && tablas.length === 0 && (
        <p className="text-sm text-neutral-text">No hay tablas dinamicas todavia. Carga un archivo Excel para crear una.</p>
      )}
      <div className="space-y-3">
        {tablas.map((t) => (
          <div key={t.nombre} className="rounded-xl border border-neutral-200 bg-white p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono font-semibold text-neutral-ink">{t.nombre}</p>
                <p className="text-xs text-neutral-text mt-1">{t.registros} registros · {t.columnas.length} columnas</p>
                <p className="text-xs text-neutral-text mt-1">{t.columnas.join(', ')}</p>
              </div>
              <button onClick={() => eliminar(t.nombre)} className="text-neutral-400 hover:text-primary" title="Eliminar">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
