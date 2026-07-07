// frontend/src/components/admin/UploadTable.jsx
import { useState } from 'react';
import { Upload, CheckCircle2, FileSpreadsheet, AlertTriangle } from 'lucide-react';
import { api } from '../../lib/api.js';
import Button from '../ui/Button.jsx';
import Modal from '../ui/Modal.jsx';
import ColumnTypePicker from './ColumnTypePicker.jsx';

export default function UploadTable({ onDone }) {
  const [archivo, setArchivo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [tabla, setTabla] = useState('');
  const [columnas, setColumnas] = useState([]);
  const [cargando, setCargando] = useState(false);

  // modal: { tipo, titulo, mensaje, detalles }
  const [modal, setModal] = useState(null);
  // confirmacion previa a guardar
  const [confirmando, setConfirmando] = useState(false);
  // Configuracion de la tarjeta del indicador (se crea al cargar)
  const [meta, setMeta] = useState({ nombre_legible: '', descripcion: '', columna_valor: '', escala_invertida: true });
  const [colores, setColores] = useState(['#1A9641', '#A6D96A', '#FFFFBF', '#FDAE61', '#D7191C']);

  async function subirPreview() {
    if (!archivo) return;
    setCargando(true);
    setModal(null);
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
          etiqueta: c.original,
          // Por defecto se marca la primera columna como clave primaria.
          esId: i === 0,
        }))
      );
      setModal({
        tipo: 'info',
        titulo: 'Archivo analizado',
        mensaje: `Se detectaron ${data.totalFilas} filas y ${data.columnas.length} columnas. Revisa los tipos de cada columna, marca el ID y confirma para guardar.`,
      });
    } catch (e) {
      setModal({
        tipo: 'error',
        titulo: 'No se pudo analizar el archivo',
        mensaje: e.message,
      });
    } finally {
      setCargando(false);
    }
  }

  // Validaciones locales antes de mandar al servidor (feedback inmediato).
  function validarLocal() {
    if (!tabla || !/^[a-z][a-z0-9_]{0,62}$/.test(tabla)) {
      return 'El nombre de la tabla solo puede tener minusculas, numeros y guion bajo, y debe empezar con letra.';
    }
    if (!columnas.some((c) => c.esId)) {
      return 'Debes marcar al menos una columna como clave primaria (PK).';
    }
    const tieneEnt = columnas.some((c) => c.safe === 'cve_ent');
    const tieneMun = columnas.some((c) => c.safe === 'cve_mun');
    if (!tieneEnt || !tieneMun) {
      return 'El archivo debe incluir las columnas CVE_ENT y CVE_MUN para poder ligar cada dato a su municipio. Renombra tus columnas antes de subir.';
    }
    return null;
  }

  function intentarGuardar() {
    const err = validarLocal();
    if (err) {
      setModal({ tipo: 'error', titulo: 'Revisa la configuracion', mensaje: err });
      return;
    }
    setConfirmando(true);
  }

  async function confirmar() {
    setConfirmando(false);
    setCargando(true);
    try {
      const columnasConColor = columnas.map((c) =>
        c.safe === meta.columna_valor ? { ...c, colores, escala_invertida: meta.escala_invertida } : c
      );
      const data = await api.adminConfirm({
        archivoTmp: preview.archivoTmp,
        tabla,
        columnas: columnasConColor,
        meta: {
          nombre_legible: meta.nombre_legible || tabla.replace(/_/g, ' '),
          descripcion: meta.descripcion,
          columna_valor: meta.columna_valor,
          escala_invertida: meta.escala_invertida,
          publico: true,
        },
      });
      setPreview(null);
      setArchivo(null);
      setModal({
        tipo: 'success',
        titulo: `Tabla "${data.tabla}" ${data.accion} correctamente`,
        mensaje: 'Los datos se guardaron en la base de datos.',
        detalles:
          `Columnas agregadas: ${data.columnasAgregadas.join(', ') || 'ninguna'}\n` +
          `Filas insertadas: ${data.filasInsertadas}\n` +
          `Filas actualizadas: ${data.filasActualizadas}`,
      });
      if (onDone) onDone();
    } catch (e) {
      setModal({
        tipo: 'error',
        titulo: 'No se pudieron guardar los datos',
        mensaje: e.message,
      });
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
          Debe incluir las columnas <strong>CVE_ENT</strong> y <strong>CVE_MUN</strong>.
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

          {/* Configuracion de la tarjeta del indicador */}
          <div className="rounded-xl border border-neutral-200 bg-neutral-bg/40 p-4 space-y-4">
            <p className="text-sm font-semibold text-neutral-ink">Configuracion de la tarjeta del indicador</p>
            <p className="text-xs text-neutral-text -mt-2">
              Esta informacion crea automaticamente la tarjeta que aparece en el sitio publico.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-neutral-ink">Nombre visible</label>
                <input
                  value={meta.nombre_legible}
                  onChange={(e) => setMeta({ ...meta, nombre_legible: e.target.value })}
                  placeholder={tabla.replace(/_/g, ' ')}
                  className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-ink">Variable principal del mapa</label>
                <select
                  value={meta.columna_valor}
                  onChange={(e) => setMeta({ ...meta, columna_valor: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                >
                  <option value="">(automatico: primera numerica)</option>
                  {columnas
                    .filter((c) => !['cve_geo', 'cve_ent', 'cve_mun'].includes(c.safe))
                    .map((c) => (
                      <option key={c.safe} value={c.safe}>{c.etiqueta || c.original}</option>
                    ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-ink">Descripcion (opcional)</label>
              <textarea
                value={meta.descripcion}
                onChange={(e) => setMeta({ ...meta, descripcion: e.target.value })}
                rows={2}
                className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>

            {/* Selector de 5 colores: de menor a mayor */}
            <div>
              <label className="text-xs font-semibold text-neutral-ink">Colores del mapa (de menor a mayor valor)</label>
              <div className="mt-2 flex items-center gap-3">
                <span className="text-xs text-neutral-text">Menor</span>
                {colores.map((col, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <input
                      type="color"
                      value={col}
                      onChange={(e) => setColores(colores.map((c, j) => (j === i ? e.target.value : c)))}
                      className="h-10 w-12 cursor-pointer rounded-lg border border-neutral-300"
                    />
                    <span className="text-[10px] text-neutral-text">{i + 1}</span>
                  </div>
                ))}
                <span className="text-xs text-neutral-text">Mayor</span>
              </div>
              <p className="text-[11px] text-neutral-text mt-2">
                Ejemplo: verde en el 1 y rojo en el 5 = "mas alto peor". Aplica a la variable principal elegida.
              </p>
            </div>
          </div>

          <Button onClick={intentarGuardar} disabled={cargando} arrow>
            {cargando ? 'Guardando...' : 'Confirmar y guardar en la base de datos'}
          </Button>
        </div>
      )}

      {/* Confirmacion previa */}
      {confirmando && (
        <Modal
          tipo="info"
          titulo="Confirmar carga de datos"
          mensaje={`Se guardaran ${preview.totalFilas} filas en la tabla "${tabla}". Si la tabla ya existe, los registros con el mismo ID se actualizaran y los nuevos se agregaran. ¿Deseas continuar?`}
          onClose={() => setConfirmando(false)}
        >
          <div className="flex gap-3">
            <button
              onClick={confirmar}
              className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
            >
              Si, guardar
            </button>
            <button
              onClick={() => setConfirmando(false)}
              className="flex-1 rounded-xl border border-neutral-300 px-4 py-2.5 text-sm font-semibold text-neutral-ink hover:bg-neutral-bg"
            >
              Cancelar
            </button>
          </div>
        </Modal>
      )}

      {/* Resultado (exito / error / info) */}
      {modal && (
        <Modal
          tipo={modal.tipo}
          titulo={modal.titulo}
          mensaje={modal.mensaje}
          detalles={modal.detalles}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
