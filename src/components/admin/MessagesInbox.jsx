// frontend/src/components/admin/MessagesInbox.jsx
import { useEffect, useState } from 'react';
import { Mail } from 'lucide-react';
import { api } from '../../lib/api.js';

export default function MessagesInbox() {
  const [mensajes, setMensajes] = useState([]);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    api.adminMensajes()
      .then(setMensajes)
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  }, []);

  return (
    <div>
      <h3 className="font-bold text-neutral-ink flex items-center gap-2 mb-4">
        <Mail size={18} className="text-primary" /> Mensajes de contacto
      </h3>
      {error && <p className="text-sm text-primary">{error}</p>}
      {cargando && <p className="text-sm text-neutral-text">Cargando...</p>}
      {!cargando && mensajes.length === 0 && <p className="text-sm text-neutral-text">No hay mensajes.</p>}
      <div className="space-y-3">
        {mensajes.map((m) => (
          <div key={m.id} className="rounded-xl border border-neutral-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-neutral-ink">{m.nombre}</p>
              <p className="text-xs text-neutral-text">{new Date(m.created_at).toLocaleString('es-MX')}</p>
            </div>
            <p className="text-sm text-primary">{m.correo}</p>
            <p className="text-sm font-medium text-neutral-ink mt-1">{m.asunto}</p>
            <p className="text-sm text-neutral-text mt-1">{m.mensaje}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
