// frontend/src/pages/IndicadorDetalle.jsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  LineChart, Line, Cell, Legend, ScatterChart, Scatter, ZAxis,
} from 'recharts';
import { ArrowLeft, Map as MapIcon, BarChart2, TrendingUp, PieChart as PieIcon, Download, ChevronDown, FileSpreadsheet, FileText } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { api } from '../lib/api.js';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import Card from '../components/ui/Card.jsx';
import Collapsible from '../components/ui/Collapsible.jsx';
import SearchSelect from '../components/ui/SearchSelect.jsx';
import MunicipalMap from '../components/MunicipalMap.jsx';
import MapLegend from '../components/MapLegend.jsx';

const LINE_COLORS = ['#C8102E', '#2F80ED', '#1A9641', '#F2994A', '#9B51E0', '#00A3A3', '#EB5757', '#6FCF97'];

function anioDe(col) { const m = String(col).match(/(19|20)\d{2}/); return m ? Number(m[0]) : null; }
function baseDe(col) { return String(col).replace(/_?(19|20)\d{2}/, ''); }
function prettify(col) { return String(col).replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()); }
const geoDe = (v) => String(v ?? '').replace(/\D/g, '').padStart(5, '0');

// Selector con checkboxes (multi).
function MultiCheck({ opciones, seleccion, onChange, et, label }) {
  const [abierto, setAbierto] = useState(false);
  const [filtro, setFiltro] = useState('');
  const ref = useRef(null);
  useEffect(() => {
    const cerrar = (e) => { if (ref.current && !ref.current.contains(e.target)) setAbierto(false); };
    document.addEventListener('mousedown', cerrar);
    return () => document.removeEventListener('mousedown', cerrar);
  }, []);
  const opcionesFiltradas = filtro
    ? opciones.filter((o) => (et ? et(o.label) : o.label).toLowerCase().includes(filtro.toLowerCase()))
    : opciones;
  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setAbierto((a) => !a)}
        className="flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-ink hover:border-primary">
        {label}: <span className="font-bold text-primary">{seleccion.length}</span>
        <ChevronDown size={15} className={abierto ? 'rotate-180' : ''} />
      </button>
      {abierto && (
        <div className="absolute z-30 mt-2 w-[26rem] max-w-[90vw] h-72 overflow-y-auto rounded-xl border border-neutral-200 bg-white p-2 shadow-xl">
          <div className="mb-1 flex items-center gap-2 border-b border-neutral-100 px-1 pb-2">
            <input
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              placeholder="Buscar..."
              className="w-full text-sm focus:outline-none"
            />
          </div>
          {opcionesFiltradas.length === 0 && <p className="px-2 py-2 text-xs text-neutral-text">Sin resultados</p>}
          {opcionesFiltradas.map((o) => {
            const activa = seleccion.includes(o.value);
            return (
              <label key={o.value} className="flex items-start gap-2 rounded-lg px-2 py-1.5 text-xs hover:bg-neutral-bg cursor-pointer">
                <input type="checkbox" checked={activa}
                  onChange={() => onChange(activa ? seleccion.filter((x) => x !== o.value) : [...seleccion, o.value])}
                  className="accent-primary mt-0.5" />
                <span>{et ? et(o.label) : o.label}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function IndicadorDetalle() {
  const { tabla } = useParams();
  const [mapa, setMapa] = useState(null);
  const [analisis, setAnalisis] = useState(null);
  const [error, setError] = useState(null);
  const [variableSel, setVariableSel] = useState('');

  // catalogo geografico
  const [estadosCat, setEstadosCat] = useState([]);
  const [muniCat, setMuniCat] = useState([]);

  // filtros del mapa
  const [mapaEnt, setMapaEnt] = useState('');   // '' = nacional
  const [mapaMun, setMapaMun] = useState('');

  // ranking
  const [rankingEstado, setRankingEstado] = useState('');
  // tendencia (multi-serie): metricas + estados + municipios (todos con checks)
  const [tendMetricas, setTendMetricas] = useState([]);
  const [tendEstados, setTendEstados] = useState([]);      // ['09','15',...]
  const [tendMunicipios, setTendMunicipios] = useState([]); // ['09007',...]
  // distribucion: filtro estado + municipios
  const [distEstado, setDistEstado] = useState('');
  const [distMunicipios, setDistMunicipios] = useState([]);
  // correlacion: filtro estado + municipios
  const [corrEstado, setCorrEstado] = useState('');
  const [corrMunicipios, setCorrMunicipios] = useState([]);
  // tabla comparativa
  const [tablaEstado, setTablaEstado] = useState('');
  const [compSel, setCompSel] = useState([]);
  // correlacion (scatter entre dos variables)
  const [corrX, setCorrX] = useState('');
  const [corrY, setCorrY] = useState('');

  useEffect(() => {
    setMapa(null); setAnalisis(null); setError(null); setVariableSel('');
    setMapaEnt(''); setMapaMun(''); setRankingEstado('');
    setTendMetricas([]); setTendEstados([]); setTendMunicipios([]);
    setDistEstado(''); setDistMunicipios([]); setCorrEstado(''); setCorrMunicipios([]);
    setTablaEstado(''); setCompSel([]); setCorrX(''); setCorrY('');
    api.datosMapa(tabla).then(setMapa).catch((e) => setError(e.message));
    api.analytics(tabla).then(setAnalisis).catch((e) => setError(e.message));
    api.catalogoEstados().then(setEstadosCat).catch(() => {});
    api.catalogoMunicipiosTodos().then(setMuniCat).catch(() => {});
  }, [tabla]);

  useEffect(() => {
    if (!variableSel) return;
    api.datosMapa(tabla, variableSel).then(setMapa).catch((e) => setError(e.message));
  }, [tabla, variableSel]);

  const etiquetas = (mapa && mapa.etiquetas) || (analisis && analisis.etiquetas) || {};
  const et = (col) => etiquetas[col] || prettify(col);

  // opciones de estados (con nombre real del catalogo)
  const estadoOpts = useMemo(() => {
    const base = [{ value: '', label: 'Nacional (todo México)' }];
    return base.concat(
      estadosCat.map((e) => ({ value: String(e.cve_ent).padStart(2, '0'), label: e.nom_ent }))
    );
  }, [estadosCat]);

  // municipios del estado elegido (para el mapa)
  const muniOptsMapa = useMemo(() => {
    if (!mapaEnt) return [];
    return [{ value: '', label: 'Todos los municipios' }].concat(
      muniCat.filter((m) => String(m.cve_ent).padStart(2, '0') === mapaEnt)
        .map((m) => ({ value: m.cve_geo, label: m.nom_mun }))
    );
  }, [muniCat, mapaEnt]);

  const series = useMemo(() => {
    if (!analisis) return {};
    const g = {};
    for (const col of analisis.numericas) {
      const a = anioDe(col); if (a === null) continue;
      (g[baseDe(col)] = g[baseDe(col)] || []).push({ col, anio: a });
    }
    Object.values(g).forEach((arr) => arr.sort((x, y) => x.anio - y.anio));
    return g;
  }, [analisis]);

  // Opciones de estados para checks (sin "Nacional"; nacional = ninguno marcado).
  const estadoCheckOpts = useMemo(
    () => estadosCat.map((e) => ({ value: String(e.cve_ent).padStart(2, '0'), label: e.nom_ent })),
    [estadosCat]
  );

  // Municipios disponibles filtrados por un conjunto de estados marcados.
  const municipiosDe = (estadosSel) => {
    if (!estadosSel.length) return [];
    return muniCat
      .filter((m) => estadosSel.includes(String(m.cve_ent).padStart(2, '0')))
      .map((m) => ({ value: m.cve_geo, label: `${m.nom_mun} (${m.nom_ent || ''})` }));
  };

  if (error) {
    return (<><Header /><div className="max-w-3xl mx-auto px-4 py-32 text-center">
      <p className="text-primary">No se pudo cargar el indicador: {error}</p>
      <Link to="/#indicadores" className="text-primary underline mt-4 inline-block">Volver</Link>
    </div><Footer /></>);
  }

  const cargando = !mapa || !analisis;
  const variableActiva = variableSel || (mapa ? (mapa.variable || mapa.indicador.columna_valor) : '');

  // ------- Ranking -------
  const ranking = useMemo(() => {
    if (!mapa) return [];
    const conDato = mapa.datos.filter((d) => d.valor !== null && d.valor !== undefined);
    if (!rankingEstado) {
      const acc = new Map();
      for (const d of conDato) {
        const ce = geoDe(d.geo).slice(0, 2);
        const a = acc.get(ce) || { s: 0, n: 0, nombre: d.estado || `Entidad ${ce}` };
        a.s += Number(d.valor); a.n++; acc.set(ce, a);
      }
      return [...acc.values()].map((a) => ({ nombre: a.nombre, valor: Number((a.s / a.n).toFixed(2)) }))
        .sort((x, y) => y.valor - x.valor);
    }
    return conDato.filter((d) => geoDe(d.geo).slice(0, 2) === rankingEstado)
      .sort((a, b) => b.valor - a.valor).slice(0, 20)
      .map((d) => ({ nombre: d.nombre || geoDe(d.geo), valor: d.valor }));
  }, [mapa, rankingEstado]);

  // ------- Tendencia multi-serie (metricas x territorios) -------
  const tendData = useMemo(() => {
    if (!analisis || !mapa || !tendMetricas.length) return { rows: [], keys: [] };
    const geoCol = mapa.indicador.columna_geografica;
    const anios = ['2010', '2015', '2020'];
    const keys = [];
    const rowsByYear = Object.fromEntries(anios.map((a) => [a, { anio: a }]));

    // Territorios a graficar (regla: estado O municipio, no ambos a la vez):
    // - Si hay municipios marcados -> solo esos municipios (una serie c/u).
    // - Si no, pero hay estados marcados -> promedio de cada estado.
    // - Si no hay nada -> Nacional.
    const territorios = [];
    if (tendMunicipios.length) {
      for (const g of tendMunicipios) {
        const d = mapa.datos.find((x) => geoDe(x.geo) === g);
        const m = muniCat.find((x) => x.cve_geo === g);
        const nombre = (d && d.nombre) || (m && m.nom_mun) || `Municipio ${g}`;
        territorios.push({ etTerr: nombre, filtro: (f) => geoDe(f[geoCol]) === g });
      }
    } else if (tendEstados.length) {
      for (const ce of tendEstados) {
        const e = estadosCat.find((x) => String(x.cve_ent).padStart(2, '0') === ce);
        territorios.push({ etTerr: e ? e.nom_ent : `Estado ${ce}`, filtro: (f) => geoDe(f[geoCol]).slice(0, 2) === ce });
      }
    } else {
      territorios.push({ etTerr: 'Nacional', filtro: () => true });
    }

    for (const base of tendMetricas) {
      const cols = series[base] || [];
      for (const terr of territorios) {
        const filas = analisis.filas.filter(terr.filtro);
        const key = `${prettify(base)} · ${terr.etTerr}`;
        keys.push(key);
        for (const { col, anio } of cols) {
          const nums = filas.map((f) => Number(f[col])).filter((n) => !Number.isNaN(n));
          const prom = nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : null;
          if (rowsByYear[String(anio)]) rowsByYear[String(anio)][key] = prom === null ? null : Number(prom.toFixed(2));
        }
      }
    }
    return { rows: anios.map((a) => rowsByYear[a]), keys };
  }, [analisis, mapa, tendMetricas, tendEstados, tendMunicipios, series, estadosCat, muniCat]);

  // ------- Distribucion (filtrable por estado/municipios) -------
  const distribucion = useMemo(() => {
    if (!mapa || !mapa.escala || mapa.escala.min === null) return [];
    const { min, max, colores } = mapa.escala;
    const paso = (max - min) / 5 || 1;
    const b = new Array(5).fill(0);
    const datosF = mapa.datos.filter((d) => {
      const g = geoDe(d.geo);
      if (distMunicipios.length) return distMunicipios.includes(g);
      if (distEstado) return g.slice(0, 2) === distEstado;
      return true;
    });
    for (const d of datosF) {
      if (d.valor === null || d.valor === undefined) continue;
      let i = Math.floor((Number(d.valor) - min) / paso);
      if (i > 4) i = 4; if (i < 0) i = 0; b[i]++;
    }
    const fmt = (v) => Number(v).toLocaleString('es-MX', { maximumFractionDigits: 1 });
    return b.map((n, i) => ({ rango: `${fmt(min + paso * i)} – ${fmt(min + paso * (i + 1))}`, municipios: n, color: colores[i] }));
  }, [mapa, distEstado, distMunicipios]);

  // ------- Correlacion (dispersion entre dos variables) -------
  const correlacion = useMemo(() => {
    if (!analisis || !mapa || !corrX || !corrY) return { puntos: [], r: null };
    const geoCol = mapa.indicador.columna_geografica;
    const nombrePorGeo = {};
    for (const d of mapa.datos) nombrePorGeo[geoDe(d.geo)] = d.nombre;
    const puntos = [];
    for (const f of analisis.filas) {
      const g = geoDe(f[geoCol]);
      if (corrMunicipios.length) { if (!corrMunicipios.includes(g)) continue; }
      else if (corrEstado) { if (g.slice(0, 2) !== corrEstado) continue; }
      const x = Number(f[corrX]); const y = Number(f[corrY]);
      if (Number.isNaN(x) || Number.isNaN(y)) continue;
      puntos.push({ x, y, nombre: nombrePorGeo[geoDe(f[geoCol])] || geoDe(f[geoCol]) });
    }
    // coeficiente de Pearson
    let r = null;
    if (puntos.length > 2) {
      const n = puntos.length;
      const sx = puntos.reduce((a, p) => a + p.x, 0);
      const sy = puntos.reduce((a, p) => a + p.y, 0);
      const sxy = puntos.reduce((a, p) => a + p.x * p.y, 0);
      const sx2 = puntos.reduce((a, p) => a + p.x * p.x, 0);
      const sy2 = puntos.reduce((a, p) => a + p.y * p.y, 0);
      const num = n * sxy - sx * sy;
      const den = Math.sqrt((n * sx2 - sx * sx) * (n * sy2 - sy * sy));
      r = den === 0 ? null : Number((num / den).toFixed(3));
    }
    return { puntos, r };
  }, [analisis, mapa, corrX, corrY, corrEstado, corrMunicipios]);

  // ------- Tabla comparativa -------
  const tablaFilas = useMemo(() => {
    if (!analisis || !mapa || !compSel.length) return [];
    const geoCol = mapa.indicador.columna_geografica;
    const nombrePorGeo = {};
    for (const d of mapa.datos) nombrePorGeo[geoDe(d.geo)] = { nombre: d.nombre, estado: d.estado };
    return analisis.filas
      .filter((f) => !tablaEstado || geoDe(f[geoCol]).slice(0, 2) === tablaEstado)
      .filter((f) => f[compSel[0]] !== null && f[compSel[0]] !== undefined)
      .sort((a, b) => Number(b[compSel[0]]) - Number(a[compSel[0]]))
      .map((f) => {
        const g = geoDe(f[geoCol]); const info = nombrePorGeo[g] || {};
        const row = { Municipio: info.nombre || g, Estado: info.estado || '' };
        compSel.forEach((c) => { row[et(c)] = f[c] === null || f[c] === undefined ? '' : Number(f[c]); });
        return row;
      });
  }, [analisis, mapa, compSel, tablaEstado]);

  function exportExcel() {
    const ws = XLSX.utils.json_to_sheet(tablaFilas);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Comparativa');
    XLSX.writeFile(wb, `${tabla}_comparativa.xlsx`);
  }
  function exportPDF() {
    const doc = new jsPDF({ orientation: 'landscape' });
    doc.setFillColor(200, 16, 46); doc.rect(0, 0, doc.internal.pageSize.getWidth(), 18, 'F');
    doc.setTextColor(255); doc.setFontSize(13);
    doc.text('Observatorio de Pobreza y Hambre', 14, 12);
    doc.setTextColor(60); doc.setFontSize(10);
    doc.text(mapa.indicador.nombre_legible || tabla, 14, 26);
    const cols = ['Municipio', 'Estado', ...compSel.map((c) => et(c))];
    const rows = tablaFilas.map((r) => cols.map((c) => (typeof r[c] === 'number' ? r[c].toLocaleString('es-MX') : r[c] || '')));
    autoTable(doc, { head: [cols], body: rows, startY: 32, styles: { fontSize: 7 }, headStyles: { fillColor: [200, 16, 46] } });
    doc.save(`${tabla}_comparativa.pdf`);
  }

  return (
    <>
      <Header />
      <main className="pt-24 pb-20 bg-neutral-bg min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Link to="/#indicadores" className="inline-flex items-center gap-2 text-sm text-neutral-text hover:text-primary mb-6">
            <ArrowLeft size={16} /> Volver a indicadores
          </Link>

          {cargando && <p className="text-neutral-text">Cargando indicador...</p>}

          {!cargando && (
            <>
              <div className="mb-8">
                <p className="eyebrow mb-1">{et(variableActiva)}</p>
                <h1 className="text-3xl font-extrabold text-neutral-ink">{mapa.indicador.nombre_legible}</h1>
                {mapa.indicador.descripcion && <p className="text-neutral-text mt-2 max-w-2xl">{mapa.indicador.descripcion}</p>}
                <a href={api.urlDescargaIndicador(tabla)} className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-primary hover:underline">
                  <Download size={16} /> Descargar datos (CSV)
                </a>
              </div>

              {/* MAPA */}
              <Collapsible titulo="Distribucion territorial" icon={MapIcon} defaultOpen
                info="Mapa coropletico: cada municipio se pinta segun su valor en la variable elegida. Sirve para ver patrones geograficos —donde se concentran los valores altos o bajos— y comparar regiones de un vistazo.">
                <div className="flex flex-wrap items-end gap-3 mb-3">
                  <div>
                    <label className="text-xs font-semibold text-neutral-ink block mb-1">Variable</label>
                    <div className="w-72">
                      <SearchSelect
                        opciones={analisis.numericas.map((c) => ({ value: c, label: et(c) }))}
                        value={variableActiva}
                        onChange={setVariableSel}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-neutral-ink block mb-1">Estado</label>
                    <div className="w-56">
                      <SearchSelect opciones={estadoOpts} value={mapaEnt}
                        onChange={(v) => { setMapaEnt(v); setMapaMun(''); }} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-neutral-ink block mb-1">Municipio</label>
                    <div className="w-56">
                      <SearchSelect opciones={muniOptsMapa} value={mapaMun} onChange={setMapaMun}
                        disabled={!mapaEnt} placeholder={mapaEnt ? 'Todos' : 'Elige un estado primero'} />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-neutral-text mb-3">
                  Selecciona la variable a mapear. Filtra por estado para ver solo sus municipios; con "Nacional"
                  se muestra todo el pais. Pasa el cursor sobre un municipio para ver su valor.
                </p>
                <div className="grid md:grid-cols-[1fr_200px] gap-4 items-start">
                  <MunicipalMap datos={mapa.datos} variableLabel={et(variableActiva)} filtroEnt={mapaEnt} filtroMun={mapaMun} />
                  <MapLegend escala={mapa.escala} />
                </div>
              </Collapsible>

              {/* RANKING */}
              <Collapsible titulo="Ranking" icon={BarChart2} defaultOpen={false}
                info="Ordena las entidades o municipios de mayor a menor valor. Util para identificar rapidamente los casos extremos: quienes encabezan y quienes quedan al final en la variable seleccionada.">
                <div className="flex flex-wrap items-center justify-end gap-2 mb-1">
                  <div className="w-56">
                    <SearchSelect opciones={estadoOpts.map((o) => o.value === '' ? { value: '', label: 'Todos (por estado)' } : o)}
                      value={rankingEstado} onChange={setRankingEstado} />
                  </div>
                </div>
                <p className="text-xs text-neutral-text mb-3">
                  {rankingEstado ? 'Los 20 municipios con mayor valor del estado seleccionado.'
                    : 'Promedio de la variable del mapa por estado (32 entidades). Elige un estado para ver sus municipios.'}
                </p>
                <ResponsiveContainer width="100%" height={rankingEstado ? 520 : 640}>
                  <BarChart data={ranking} layout="vertical" margin={{ left: 40, right: 12 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" fontSize={11} />
                    <YAxis type="category" dataKey="nombre" width={150} fontSize={10} interval={0} />
                    <Tooltip formatter={(v) => Number(v).toLocaleString('es-MX')} />
                    <Bar dataKey="valor" name={et(variableActiva)} fill="#C8102E" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Collapsible>

              {/* TENDENCIA */}
              <Collapsible titulo="Tendencia por año" icon={TrendingUp} defaultOpen={false}
                info="Muestra la evolucion 2010-2015-2020. Al combinar metricas y territorios puedes comparar trayectorias: si un fenomeno mejora o empeora con el tiempo y como se diferencian estados o municipios entre si.">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <MultiCheck label="Metricas"
                    opciones={Object.keys(series).map((b) => ({ value: b, label: b }))}
                    seleccion={tendMetricas} onChange={setTendMetricas} et={(l) => prettify(l)} />
                  <MultiCheck label="Estados"
                    opciones={estadoCheckOpts} seleccion={tendEstados}
                    onChange={(sel) => { setTendEstados(sel); setTendMunicipios(tendMunicipios.filter((g) => sel.includes(g.slice(0, 2)))); }} />
                  <MultiCheck label="Municipios"
                    opciones={municipiosDe(tendEstados)} seleccion={tendMunicipios} onChange={setTendMunicipios} />
                </div>
                <p className="text-xs text-neutral-text mb-3">
                  Marca una o varias metricas. {tendMunicipios.length
                    ? 'Modo municipal: se grafica cada municipio marcado (el promedio del estado no se dibuja).'
                    : tendEstados.length
                      ? 'Modo estatal: se grafica el promedio de cada estado marcado. Marca municipios para cambiar a modo municipal.'
                      : 'Sin estados marcados se muestra el promedio nacional.'}
                </p>
                <ResponsiveContainer width="100%" height={380}>
                  <LineChart data={tendData.rows}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="anio" fontSize={11} />
                    <YAxis fontSize={11} />
                    <Tooltip formatter={(v) => Number(v).toLocaleString('es-MX')} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    {tendData.keys.map((k, i) => (
                      <Line key={k} type="monotone" dataKey={k} stroke={LINE_COLORS[i % LINE_COLORS.length]} strokeWidth={2} dot={{ r: 3 }} connectNulls />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
                {!tendMetricas.length && (
                  <p className="text-xs text-neutral-text mt-2">Marca al menos una metrica para trazar lineas.</p>
                )}
              </Collapsible>

              {/* DISTRIBUCION */}
              <Collapsible titulo="Distribucion por rangos" icon={PieIcon} defaultOpen={false}
                info="Histograma: cuenta cuantos municipios caen en cada rango de valores. Revela la forma de la distribucion —si la mayoria se concentra en valores bajos, altos, o si hay dispersion— mas alla del promedio.">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <div className="w-56">
                    <SearchSelect opciones={estadoOpts.map((o) => o.value === '' ? { value: '', label: 'Todos los estados' } : o)}
                      value={distEstado} onChange={(v) => { setDistEstado(v); setDistMunicipios([]); }} />
                  </div>
                  <MultiCheck label="Municipios"
                    opciones={distEstado ? municipiosDe([distEstado]) : []} seleccion={distMunicipios} onChange={setDistMunicipios} />
                </div>
                <p className="text-xs text-neutral-text mb-3">
                  Cuantos municipios caen en cada rango de valores de la variable del mapa. Filtra por estado
                  o municipios especificos. Cada barra usa el color con el que ese rango se pinta en el mapa.
                </p>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={distribucion} margin={{ left: 8, right: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="rango" fontSize={11} />
                    <YAxis fontSize={11} allowDecimals={false} />
                    <Tooltip formatter={(v) => `${Number(v).toLocaleString('es-MX')} municipios`} />
                    <Bar dataKey="municipios" radius={[6, 6, 0, 0]}>
                      {distribucion.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Collapsible>

              {/* CORRELACION */}
              <Collapsible titulo="Correlacion entre dos variables" icon={TrendingUp} defaultOpen={false}
                info="Diagrama de dispersion: cada punto es un municipio, ubicado segun sus valores en las dos variables elegidas. Sirve para ver si dos fenomenos se relacionan (p. ej. mas rezago educativo junto con mas pobreza). El coeficiente r va de -1 a 1: cercano a 1 o -1 indica relacion fuerte; cercano a 0, poca relacion.">
                <div className="flex flex-wrap items-end gap-3 mb-3">
                  <div>
                    <label className="text-xs font-semibold text-neutral-ink block mb-1">Variable X (horizontal)</label>
                    <div className="w-64">
                      <SearchSelect opciones={analisis.numericas.map((c) => ({ value: c, label: et(c) }))}
                        value={corrX} onChange={setCorrX} placeholder="Elige variable..." />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-neutral-ink block mb-1">Variable Y (vertical)</label>
                    <div className="w-64">
                      <SearchSelect opciones={analisis.numericas.map((c) => ({ value: c, label: et(c) }))}
                        value={corrY} onChange={setCorrY} placeholder="Elige variable..." />
                    </div>
                  </div>
                  {correlacion.r !== null && (
                    <div className="rounded-lg bg-neutral-bg px-4 py-2">
                      <p className="text-xs text-neutral-text">Coeficiente r</p>
                      <p className="text-lg font-bold text-primary">{correlacion.r}</p>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <div className="w-56">
                    <SearchSelect opciones={estadoOpts.map((o) => o.value === '' ? { value: '', label: 'Todos los estados' } : o)}
                      value={corrEstado} onChange={(v) => { setCorrEstado(v); setCorrMunicipios([]); }} />
                  </div>
                  <MultiCheck label="Municipios"
                    opciones={corrEstado ? municipiosDe([corrEstado]) : []} seleccion={corrMunicipios} onChange={setCorrMunicipios} />
                </div>
                {corrX && corrY ? (
                  <ResponsiveContainer width="100%" height={380}>
                    <ScatterChart margin={{ left: 10, right: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" dataKey="x" name={et(corrX)} fontSize={11}
                        label={{ value: et(corrX), position: 'insideBottom', offset: -10, fontSize: 11 }} />
                      <YAxis type="number" dataKey="y" name={et(corrY)} fontSize={11} width={70} />
                      <ZAxis range={[30, 30]} />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }}
                        formatter={(v) => Number(v).toLocaleString('es-MX')}
                        content={({ active, payload }) => {
                          if (!active || !payload || !payload.length) return null;
                          const p = payload[0].payload;
                          return (
                            <div className="rounded-lg bg-neutral-ink px-3 py-2 text-xs text-white">
                              <p className="font-semibold">{p.nombre}</p>
                              <p>{et(corrX)}: {Number(p.x).toLocaleString('es-MX')}</p>
                              <p>{et(corrY)}: {Number(p.y).toLocaleString('es-MX')}</p>
                            </div>
                          );
                        }} />
                      <Scatter data={correlacion.puntos} fill="#C8102E" fillOpacity={0.5} />
                    </ScatterChart>
                  </ResponsiveContainer>
                ) : (
                  <ResponsiveContainer width="100%" height={380}>
                    <ScatterChart margin={{ left: 10, right: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" dataKey="x" fontSize={11} />
                      <YAxis type="number" dataKey="y" fontSize={11} width={70} />
                      <Scatter data={[]} fill="#C8102E" />
                    </ScatterChart>
                  </ResponsiveContainer>
                )}
                {(!corrX || !corrY) && (
                  <p className="text-xs text-neutral-text mt-2">Elige las variables X e Y para ver los puntos.</p>
                )}
              </Collapsible>

              {/* TABLA COMPARATIVA */}
              <Collapsible titulo="Tabla comparativa de variables" icon={BarChart2} defaultOpen={false}
                info="Cruza varias variables por municipio en una sola tabla. Sirve para analisis detallado y para exportar los datos exactos (Excel o PDF) que respaldan un reporte.">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="w-52">
                      <SearchSelect opciones={estadoOpts.map((o) => o.value === '' ? { value: '', label: 'Todos los estados' } : o)}
                        value={tablaEstado} onChange={setTablaEstado} />
                    </div>
                    <MultiCheck label="Variables"
                      opciones={analisis.numericas.map((c) => ({ value: c, label: c }))}
                      seleccion={compSel} onChange={setCompSel} et={(l) => et(l)} />
                  </div>
                  {compSel.length > 0 && tablaFilas.length > 0 && (
                    <div className="flex gap-2">
                      <button onClick={exportExcel} className="flex items-center gap-1.5 rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-ink hover:border-primary">
                        <FileSpreadsheet size={14} className="text-[#1A9641]" /> Excel
                      </button>
                      <button onClick={exportPDF} className="flex items-center gap-1.5 rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-ink hover:border-primary">
                        <FileText size={14} className="text-primary" /> PDF
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-xs text-neutral-text mb-4">
                  Marca las variables a cruzar. La tabla lista cada municipio con su estado y el valor de cada
                  variable, ordenada por la primera. Exporta el resultado a Excel o PDF con membrete.
                </p>
                <p className="text-xs text-neutral-text mb-2">
                  {compSel.length === 0
                    ? 'Marca al menos una variable para llenar la tabla.'
                    : `${tablaFilas.length} municipios en la tabla.`}
                </p>
                <div className="overflow-auto max-h-[28rem] rounded-xl border border-neutral-200">
                  <table className="w-full text-xs min-w-max">
                    <thead className="bg-neutral-bg sticky top-0 z-10">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold text-neutral-ink">Municipio</th>
                        <th className="px-3 py-2 text-left font-semibold text-neutral-ink">Estado</th>
                        {compSel.map((c) => (
                          <th key={c} className="px-3 py-2 text-right font-semibold text-neutral-ink whitespace-nowrap">{et(c)}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tablaFilas.length === 0 ? (
                        <tr>
                          <td colSpan={2 + compSel.length} className="px-3 py-8 text-center text-neutral-text">
                            {compSel.length === 0 ? 'Sin variables seleccionadas.' : 'Sin datos para el filtro actual.'}
                          </td>
                        </tr>
                      ) : tablaFilas.map((r, i) => (
                        <tr key={i} className="border-t border-neutral-200 hover:bg-neutral-bg/60">
                          <td className="px-3 py-2 font-medium text-neutral-ink whitespace-nowrap">{r.Municipio}</td>
                          <td className="px-3 py-2 text-neutral-text whitespace-nowrap">{r.Estado || '—'}</td>
                          {compSel.map((c) => (
                            <td key={c} className="px-3 py-2 text-right tabular-nums text-neutral-text">
                              {r[et(c)] === '' || r[et(c)] === undefined ? '—' : Number(r[et(c)]).toLocaleString('es-MX', { maximumFractionDigits: 2 })}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Collapsible>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
