// frontend/src/lib/api.js
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

function getToken() {
  return localStorage.getItem('token');
}

async function request(path, { method = 'GET', body, auth = false, isForm = false } = {}) {
  const headers = {};
  if (!isForm) headers['Content-Type'] = 'application/json';
  if (auth) {
    const t = getToken();
    if (t) headers['Authorization'] = `Bearer ${t}`;
  }
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: isForm ? body : body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({ success: false, message: 'Respuesta invalida' }));
  if (!res.ok || !json.success) {
    throw new Error(json.message || `Error ${res.status}`);
  }
  return json.data;
}

export const api = {
  login: (usuario, password) => request('/auth/login', { method: 'POST', body: { usuario, password } }),
  indicadores: () => request('/indicadores'),
  datosMapa: (tabla, variable) =>
    request(`/indicadores/${tabla}${variable ? `?variable=${encodeURIComponent(variable)}` : ''}`),
  analytics: (tabla) => request(`/analytics/${tabla}`),
  contacto: (data) => request('/contacto', { method: 'POST', body: data }),

  // descargas publicas (regresan la URL directa, el navegador maneja el archivo)
  urlDescargaIndicador: (tabla) => `${BASE}/indicadores/${tabla}/descarga`,
  urlDescargaCatalogo: () => `${BASE}/catalogo/municipios/descarga`,

  // admin
  adminTablas: () => request('/admin/tablas', { auth: true }),
  adminIndicadores: () => request('/admin/indicadores', { auth: true }),
  adminMensajes: () => request('/admin/mensajes', { auth: true }),
  adminEntidades: () => request('/admin/municipios/entidades', { auth: true }),
  adminMunicipios: ({ entidad, q, limit, offset } = {}) => {
    const p = new URLSearchParams();
    if (entidad) p.set('entidad', entidad);
    if (q) p.set('q', q);
    if (limit) p.set('limit', limit);
    if (offset) p.set('offset', offset);
    const qs = p.toString();
    return request(`/admin/municipios${qs ? `?${qs}` : ''}`, { auth: true });
  },
  adminVariablesGet: (tabla) => request(`/admin/variables/${tabla}`, { auth: true }),
  adminVariablesSave: (tabla, variables) => request(`/admin/variables/${tabla}`, { method: 'PUT', body: { variables }, auth: true }),
  adminRenombrarEstado: (cve, nom) => request(`/admin/estados/${cve}`, { method: 'PUT', body: { nom_ent: nom }, auth: true }),
  catalogoEstados: () => request('/catalogo/estados'),
  catalogoMunicipiosTodos: () => request('/catalogo/municipios/todos'),
  adminEliminarTabla: (nombre) => request(`/admin/tablas/${nombre}`, { method: 'DELETE', auth: true }),
  adminGuardarConfig: (data) => request('/admin/indicadores/config', { method: 'POST', body: data, auth: true }),
  adminPreview: (formData) => request('/admin/upload/preview', { method: 'POST', body: formData, auth: true, isForm: true }),
  adminConfirm: (data) => request('/admin/upload/confirm', { method: 'POST', body: data, auth: true }),
};

export { getToken };
