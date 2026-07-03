// frontend/src/components/admin/IndicatorConfig.jsx
import { useEffect, useState } from 'react';
import { Save, Settings } from 'lucide-react';
import { api } from '../../lib/api.js';
import Button from '../ui/Button.jsx';

export default function IndicatorConfig({ refreshKey, onSaved }) {
  const [tablas, setTablas] = useState([]);
  const [indicadores, setIndicadores] = useState([]);
  const [form, setForm] = useState({
    nombre_tabla: '',
    nombre_legible: '',
    descripcion: '',
    columna_geografica: '',
    columna_valor: '',
    escala_invertida: true,
    publico: true,
  });
  const [columnasDisp, setColumnasDisp] = useState([]);
  const [msg, setMsg] = useState(null);

  async function cargar() {
    const [t, ind] = await Promise.all([api.adminTablas(), api.adminIndicadores()]);
    setTablas(t);
    setIndicadores(ind);
  }
  useEffect(() => { cargar().catch((e) => setMsg(e.message)); }, [refreshKey]);

  function seleccionarTabla(nombre) {
    const t = tablas.find((x) => x.nombre === nombre);
    const cols = t ? t.columnas.filter((c) => !['created_at', 'updated_at'].includes(c)) : [];
    const existente = indicadores.find((i) => i.nombre_tabla === nombre);
    setColumnasDisp(cols);
    if (existente) {
      setForm({
        nombre_tabla: existente.nombre_tabla,
        nombre_legible: existente.nombre_legible,
        descripcion: existente.descripcion || '',
        columna_geografica: existente.columna_geografica,
        columna_valor: existente.columna_valor,
        escala_invertida: existente.escala_invertida === 1,
        publico: existente.publico === 1,
      });
    } else {
      setForm({
        nombre_tabla: nombre,
        nombre_legible: nombre,
        descripcion: '',
        columna_geografica: cols[0] || '',
        columna_valor: cols[1] || cols[0] || '',
        escala_invertida: true,
        publico: true,
      });
    }
  }

  async function guardar() {
    setMsg(null);
    try {
      await api.adminGuardarConfig(form);
      setMsg('Configuracion guardada. El indicador ya esta disponible en el sitio.');
      await cargar();
      if (onSaved) onSaved();
    } catch (e) {
      setMsg('Error: ' + e.message);
    }
  }

  const inputCls = 'w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none';

  return (
    <div>
      <h3 className="font-bold text-neutral-ink flex items-center gap-2 mb-4">
        <Settings size={18} className="text-primary" /> Configurar indicador para el mapa
      </h3>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-neutral-ink">Tabla</label>
          <select className={inputCls + ' mt-1'} value={form.nombre_tabla} onChange={(e) => seleccionarTabla(e.target.value)}>
            <option value="">— Selecciona una tabla —</option>
            {tablas.map((t) => <option key={t.nombre} value={t.nombre}>{t.nombre}</option>)}
          </select>
        </div>

        {form.nombre_tabla && (
          <>
            <div>
              <label className="text-sm font-semibold text-neutral-ink">Nombre visible</label>
              <input className={inputCls + ' mt-1'} value={form.nombre_legible}
                onChange={(e) => setForm({ ...form, nombre_legible: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-semibold text-neutral-ink">Descripcion</label>
              <textarea className={inputCls + ' mt-1'} rows={2} value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-neutral-ink">Columna geografica (estado)</label>
                <select className={inputCls + ' mt-1'} value={form.columna_geografica}
                  onChange={(e) => setForm({ ...form, columna_geografica: e.target.value })}>
                  {columnasDisp.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-neutral-ink">Columna de valor</label>
                <select className={inputCls + ' mt-1'} value={form.columna_valor}
                  onChange={(e) => setForm({ ...form, columna_valor: e.target.value })}>
                  {columnasDisp.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 text-sm text-neutral-ink">
                <input type="checkbox" checked={form.escala_invertida} className="accent-primary h-4 w-4"
                  onChange={(e) => setForm({ ...form, escala_invertida: e.target.checked })} />
                Escala invertida (rojo = valores altos)
              </label>
              <label className="flex items-center gap-2 text-sm text-neutral-ink">
                <input type="checkbox" checked={form.publico} className="accent-primary h-4 w-4"
                  onChange={(e) => setForm({ ...form, publico: e.target.checked })} />
                Publicar en el sitio
              </label>
            </div>
            <Button onClick={guardar}><Save size={16} /> Guardar configuracion</Button>
          </>
        )}
        {msg && <p className="text-sm text-neutral-text">{msg}</p>}
      </div>
    </div>
  );
}
