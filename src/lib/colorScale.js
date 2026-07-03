// frontend/src/lib/colorScale.js
export const COLOR_SCALE = ['#D7191C', '#FDAE61', '#FFFFBF', '#A6D96A', '#1A9641'];
export const NO_DATA_COLOR = '#E0E0E0';

// Normaliza un nombre de estado para emparejar GeoJSON con datos.
export function normalizeName(s) {
  if (!s) return '';
  return String(s)
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ');
}
