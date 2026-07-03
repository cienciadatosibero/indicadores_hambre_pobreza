// frontend/src/components/admin/UploadTable.jsx
import { useState } from 'react';
import { Upload, CheckCircle2, FileSpreadsheet } from 'lucide-react';
import { api } from '../../lib/api.js';
import Button from '../ui/Button.jsx';
import ColumnTypePicker from './ColumnTypePicker.jsx';

export default function UploadTable({ onDone }) {
  const [archivo, setArchivo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [tabla, setTabla] = useState('');
  const [columnas, setColumnas] = useState([]);
  const [resumen, setResumen] = useState(null);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  async function subirPreview() {
    if (!archivo) return;
    setCargando(true);
    setError(null);
    setResumen(null);
    try {
      const fd = new FormData();
      fd.append('archivo', archivo);
      const data = await api.adminPreview(fd);
      setPreview(data);
      setTabla(data.tablaSugerida);
      setColumnas(
        data.columnas.map((c, i) => ({
          original: c.original,
          safe: c.safe,
          tipo: c.tipoSugerido,
          esId: i === 0, // por defecto la primera columna es el id
        }))
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }

  async function confirmar() {
    setCargando(true);
    setError(null);
    try {
      const data = await api.adminConfirm({
        archivoTmp: preview.archivoTmp,
        tabla,
        columnas,
      });
      setResumen(data);
      setPreview(null);
      setArchivo(null);
      if (onDone) onDone();
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center">
        <FileSpreadsheet size={40} className="mx-auto text-primary mb-3" />
        <p className="text-neutral-ink font-semibold">Cargar archivo Excel o CSV</p>
        <p className="text-sm text-neutral-text mt-1 mb-4">
          El nombre del archivo sera el nombre de la tabla. La primera fila define las columnas.
        </p>
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={(e) => setArchivo(e.target.files[0])}
          className="block mx-auto text-sm text-neutral-text file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-white file:text-sm file:font-semibold"
        />
        {archivo && (
          <div className="mt-4">
            <Button onClick={subirPreview} disabled={cargando}>
              <Upload size={16} /> {cargando ? 'Procesando...' : 'Analizar archivo'}
            </Button>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-primary">{error}</p>}

      {resumen && (
        <div className="rounded-xl border border-[#A6D96A] bg-[#A6D96A]/10 p-5">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={20} className="text-[#1A9641]" />
            <p className="font-semibold text-neutral-ink">
              Tabla "{resumen.tabla}" {resumen.accion} correctamente
            </p>
          </div>
          <ul className="text-sm text-neutral-text space-y-1">
            <li>Columnas agregadas: {resumen.columnasAgregadas.join(', ') || 'ninguna'}</li>
            <li>Filas insertadas: {resumen.filasInsertadas}</li>
            <li>Filas actualizadas: {resumen.filasActualizadas}</li>
          </ul>
        </div>
      )}

      {preview && (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-neutral-ink">Nombre de la tabla</label>
            <input
              value={tabla}
              onChange={(e) => setTabla(e.target.value)}
              className="mt-1 w-full max-w-sm rounded-xl border border-neutral-300 px-4 py-2.5 text-sm font-mono focus:border-primary focus:outline-none"
            />
            <p className="text-xs text-neutral-text mt-1">
              Solo minusculas, numeros y guion bajo. {preview.totalFilas} filas detectadas.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-neutral-ink mb-2">
              Define el tipo de cada columna y marca cual es el ID
            </p>
            <ColumnTypePicker columnas={columnas} setColumnas={setColumnas} />
          </div>

          <div>
            <p className="text-sm font-semibold text-neutral-ink mb-2">Vista previa de datos</p>
            <div className="overflow-x-auto rounded-xl border border-neutral-200">
              <table className="w-full text-xs">
                <thead className="bg-neutral-bg">
                  <tr>
                    {columnas.map((c) => (
                      <th key={c.safe} className="px-3 py-2 text-left font-semibold text-neutral-ink">{c.original}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.muestra.map((fila, i) => (
                    <tr key={i} className="border-t border-neutral-200">
                      {columnas.map((c) => (
                        <td key={c.safe} className="px-3 py-2 text-neutral-text">
                          {fila[c.safe] === null || fila[c.safe] === undefined ? '—' : String(fila[c.safe])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Button onClick={confirmar} disabled={cargando} arrow>
            {cargando ? 'Guardando...' : 'Confirmar y guardar en la base de datos'}
          </Button>
        </div>
      )}
    </div>
  );
}
