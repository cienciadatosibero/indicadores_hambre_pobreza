// frontend/src/components/admin/TablesManager.jsx
import { useEffect, useState } from 'react';
import { Trash2, Database, RefreshCw } from 'lucide-react';
import { api } from '../../lib/api.js';
import Modal from '../ui/Modal.jsx';

export default function TablesManager({ refreshKey }) {
  const [tablas, setTablas] = useState([]);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [porEliminar, setPorEliminar] = useState(null); // nombre de tabla
  const [modal, setModal] = useState(null);

  async function cargar() {
    setCargando(true);
    try {
      setTablas(await api.adminTablas());
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => { cargar(); }, [refreshKey]);

  async function confirmarEliminar() {
    const nombre = porEliminar;
    setPorEliminar(null);
    try {
      await api.adminEliminarTabla(nombre);
      setModal({ tipo: 'success', titulo: 'Tabla eliminada', mensaje: `Se elimino "${nombre}" junto con sus etiquetas y su tarjeta de indicador.` });
      cargar();
    } catch (e) {
      setModal({ tipo: 'error', titulo: 'No se pudo eliminar', mensaje: e.message });
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-neutral-ink flex items-center gap-2">
          <Database size={18} className="text-primary" /> Tablas de datos
        </h3>
        <button onClick={cargar} className="text-sm text-neutral-text hover:text-primary flex items-center gap-1">
          <RefreshCw size={14} /> Actualizar
        </button>
      </div>
      {error && <p className="text-sm text-primary mb-3">{error}</p>}
      {cargando && <p className="text-sm text-neutral-text">Cargando...</p>}
      {!cargando && tablas.length === 0 && (
        <p className="text-sm text-neutral-text">No hay tablas de datos todavia. Carga un archivo Excel para crear una.</p>
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
              <button onClick={() => setPorEliminar(t.nombre)} className="text-neutral-400 hover:text-primary" title="Eliminar">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {porEliminar && (
        <Modal
          tipo="error"
          titulo="Eliminar tabla"
          mensaje={`¿Seguro que deseas eliminar la tabla "${porEliminar}"? Se borraran sus datos, sus etiquetas del diccionario y su tarjeta de indicador. Esta accion no se puede deshacer.`}
          onClose={() => setPorEliminar(null)}
        >
          <div className="flex gap-3">
            <button onClick={confirmarEliminar} className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark">
              Si, eliminar
            </button>
            <button onClick={() => setPorEliminar(null)} className="flex-1 rounded-xl border border-neutral-300 px-4 py-2.5 text-sm font-semibold text-neutral-ink hover:bg-neutral-bg">
              Cancelar
            </button>
          </div>
        </Modal>
      )}

      {modal && <Modal {...modal} onClose={() => setModal(null)} />}
    </div>
  );
}
