// frontend/src/lib/stateCentroids.js
// Centroide aproximado [lng, lat] por entidad, calculado desde el GeoJSON.
import { normalizeName } from './colorScale.js';

const RAW = {
  "Zacatecas": [
    -102.8029,
    22.9349
  ],
  "Yucatán": [
    -88.8916,
    20.706
  ],
  "Veracruz": [
    -96.7818,
    19.8639
  ],
  "Tlaxcala": [
    -98.0965,
    19.4726
  ],
  "Tamaulipas": [
    -98.6867,
    25.095
  ],
  "Tabasco": [
    -92.7187,
    17.9445
  ],
  "Sonora": [
    -111.0776,
    29.1948
  ],
  "Sinaloa": [
    -107.6178,
    24.8641
  ],
  "San Luis Potosí": [
    -100.2544,
    22.5638
  ],
  "Quintana Roo": [
    -87.8811,
    19.778
  ],
  "Querétaro": [
    -99.7855,
    20.9316
  ],
  "Puebla": [
    -97.7792,
    19.1925
  ],
  "Oaxaca": [
    -96.1442,
    16.9631
  ],
  "Nuevo León": [
    -99.9699,
    25.5842
  ],
  "Nayarit": [
    -105.1887,
    21.8125
  ],
  "Morelos": [
    -98.994,
    18.7625
  ],
  "Michoacán": [
    -101.8423,
    19.3055
  ],
  "México": [
    -99.5109,
    19.3803
  ],
  "Jalisco": [
    -103.5634,
    20.8743
  ],
  "Hidalgo": [
    -98.8052,
    20.449
  ],
  "Guerrero": [
    -100.1031,
    17.9472
  ],
  "Guanajuato": [
    -100.9569,
    20.883
  ],
  "Durango": [
    -104.9299,
    24.9123
  ],
  "Ciudad de México": [
    -99.0663,
    19.2455
  ],
  "Colima": [
    -103.9893,
    19.1525
  ],
  "Coahuila": [
    -101.8856,
    27.2725
  ],
  "Chihuahua": [
    -106.235,
    28.41
  ],
  "Chiapas": [
    -92.3483,
    16.7156
  ],
  "Campeche": [
    -90.8875,
    19.0025
  ],
  "Baja California Sur": [
    -111.9514,
    25.4377
  ],
  "Baja California": [
    -114.7884,
    29.7949
  ],
  "Aguascalientes": [
    -102.3872,
    21.9636
  ]
};

export const STATE_CENTROIDS = Object.fromEntries(
  Object.entries(RAW).map(([k, v]) => [normalizeName(k), v])
);

export function centroidFor(nombre) {
  return STATE_CENTROIDS[normalizeName(nombre)] || null;
}
