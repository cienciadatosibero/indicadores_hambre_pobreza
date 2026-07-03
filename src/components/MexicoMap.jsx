// frontend/src/components/MexicoMap.jsx
import { useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import geoData from '../assets/mexico-estados.geojson?url';
import { NO_DATA_COLOR, normalizeName } from '../lib/colorScale.js';

// datos: [{ geo, valor, color }]
export default function MexicoMap({ datos = [] }) {
  const [tooltip, setTooltip] = useState(null);

  // Mapa nombre-normalizado -> { valor, color }
  const lookup = {};
  for (const d of datos) lookup[normalizeName(d.geo)] = d;

  return (
    <div className="relative">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 1300, center: [-102, 23.5] }}
        width={800}
        height={520}
        style={{ width: '100%', height: 'auto' }}
      >
        <Geographies geography={geoData}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const nombre = geo.properties.name;
              const match = lookup[normalizeName(nombre)];
              const fill = match ? match.color : NO_DATA_COLOR;
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fill}
                  stroke="#FFFFFF"
                  strokeWidth={0.6}
                  onMouseEnter={() =>
                    setTooltip({
                      nombre,
                      valor: match ? match.valor : 'Sin dato',
                    })
                  }
                  onMouseLeave={() => setTooltip(null)}
                  style={{
                    default: { outline: 'none' },
                    hover: { outline: 'none', opacity: 0.85, cursor: 'pointer' },
                    pressed: { outline: 'none' },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {tooltip && (
        <div className="pointer-events-none absolute top-3 left-3 rounded-lg bg-neutral-ink/90 text-white px-3 py-2 text-sm shadow-lg">
          <p className="font-semibold">{tooltip.nombre}</p>
          <p className="text-white/80">
            {typeof tooltip.valor === 'number'
              ? tooltip.valor.toLocaleString('es-MX')
              : tooltip.valor}
          </p>
        </div>
      )}
    </div>
  );
}
