// frontend/src/components/MunicipalMap.jsx
// Mapa de municipios montado sobre un mapa base real (OpenStreetMap via
// MapLibre GL). Los municipios se pintan como capa encima, con zoom/paneo
// nativos, y un popup al pasar el cursor con municipio, estado, variable y valor.
import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import geoUrl from '../assets/mexico-municipios.geojson?url';
import { NO_DATA_COLOR } from '../lib/colorScale.js';

let geoCache = null;
async function loadGeo() {
  if (!geoCache) geoCache = await fetch(geoUrl).then((r) => r.json());
  return geoCache;
}

const STYLE = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors',
    },
  },
  layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
};

export default function MunicipalMap({ datos = [], variableLabel = '', filtroEnt = '', filtroMun = '' }) {
  const box = useRef(null);
  const mapRef = useRef(null);
  const labelRef = useRef('');
  labelRef.current = variableLabel;

  useEffect(() => {
    if (mapRef.current || !box.current) return;
    const map = new maplibregl.Map({
      container: box.current,
      style: STYLE,
      bounds: [[-118.6, 14.3], [-86.5, 32.9]],
      fitBoundsOptions: { padding: 12 },
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    let vivo = true;

    const aplicar = async () => {
      const gj = await loadGeo();
      if (!vivo || !mapRef.current) return;
      const lookup = {};
      for (const d of datos) {
        const g = String(d.geo).replace(/\D/g, '').padStart(5, '0');
        lookup[g] = d;
      }
      const feats = gj.features.map((f) => {
        const g = String(f.properties.cvegeo).padStart(5, '0');
        const m = lookup[g];
        return {
          ...f,
          properties: {
            ...f.properties,
            color: m ? m.color : NO_DATA_COLOR,
            valor: m && m.valor !== null && m.valor !== undefined ? m.valor : null,
            estado: m && m.estado ? m.estado : '',
          },
        };
      });
      // Filtra por estado/municipio si aplica.
      let visibles = feats;
      if (filtroEnt) visibles = visibles.filter((f) => String(f.properties.cve_ent).padStart(2, '0') === filtroEnt);
      if (filtroMun) visibles = visibles.filter((f) => String(f.properties.cvegeo).padStart(5, '0') === filtroMun);
      const data = { type: 'FeatureCollection', features: visibles };

      // Reencuadra segun el filtro.
      const bbox = (fs) => {
        let minX = 180, minY = 90, maxX = -180, maxY = -90;
        const walk = (c) => {
          if (typeof c[0] === 'number') {
            if (c[0] < minX) minX = c[0]; if (c[0] > maxX) maxX = c[0];
            if (c[1] < minY) minY = c[1]; if (c[1] > maxY) maxY = c[1];
          } else c.forEach(walk);
        };
        fs.forEach((f) => walk(f.geometry.coordinates));
        return [[minX, minY], [maxX, maxY]];
      };
      if (visibles.length && (filtroEnt || filtroMun)) {
        try { map.fitBounds(bbox(visibles), { padding: 30, duration: 600 }); } catch { /* ignore */ }
      } else if (!filtroEnt && !filtroMun) {
        map.fitBounds([[-118.6, 14.3], [-86.5, 32.9]], { padding: 12, duration: 600 });
      }

      const src = map.getSource('muns');
      if (src) {
        src.setData(data);
        return;
      }
      map.addSource('muns', { type: 'geojson', data });
      map.addLayer({
        id: 'muns-fill', type: 'fill', source: 'muns',
        paint: { 'fill-color': ['get', 'color'], 'fill-opacity': 0.72 },
      });
      map.addLayer({
        id: 'muns-line', type: 'line', source: 'muns',
        paint: { 'line-color': '#ffffff', 'line-width': 0.4 },
      });
      const popup = new maplibregl.Popup({ closeButton: false, closeOnClick: false, maxWidth: '260px' });
      map.on('mousemove', 'muns-fill', (e) => {
        const f = e.features && e.features[0];
        if (!f) return;
        map.getCanvas().style.cursor = 'pointer';
        const p = f.properties;
        const val = p.valor === null || p.valor === undefined || p.valor === ''
          ? 'Sin dato'
          : Number(p.valor).toLocaleString('es-MX');
        popup.setLngLat(e.lngLat).setHTML(
          `<div style="font-size:12px;line-height:1.4">` +
          `<strong>${p.nombre}${p.estado ? `, ${p.estado}` : ''}</strong><br/>` +
          (labelRef.current ? `<span style="color:#666">${labelRef.current}</span><br/>` : '') +
          `<strong>${val}</strong></div>`
        ).addTo(map);
      });
      map.on('mouseleave', 'muns-fill', () => {
        map.getCanvas().style.cursor = '';
        popup.remove();
      });
    };

    if (map.isStyleLoaded()) aplicar();
    else map.once('load', aplicar);
    return () => { vivo = false; };
  }, [datos, filtroEnt, filtroMun]);

  return <div ref={box} className="h-[500px] w-full rounded-xl overflow-hidden border border-neutral-200" />;
}
