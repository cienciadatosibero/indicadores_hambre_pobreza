// frontend/src/components/ui/Modal.jsx
import { CheckCircle2, XCircle, X, Info } from 'lucide-react';

const ICONOS = {
  success: { Icon: CheckCircle2, color: 'text-[#1A9641]', ring: 'bg-[#1A9641]/10' },
  error: { Icon: XCircle, color: 'text-primary', ring: 'bg-primary/10' },
  info: { Icon: Info, color: 'text-[#2F80ED]', ring: 'bg-[#2F80ED]/10' },
};

// Modal de retroalimentacion (exito / error / info). Se cierra con el boton,
// el fondo o la tecla Escape (manejada por el padre si lo desea).
export default function Modal({ tipo = 'info', titulo, mensaje, detalles, onClose, children }) {
  const { Icon, color, ring } = ICONOS[tipo] || ICONOS.info;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Fondo */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Tarjeta */}
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl p-6 animate-[modalIn_.2s_ease]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-ink transition-colors"
          aria-label="Cerrar"
        >
          <X size={20} />
        </button>

        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${ring} mb-4`}>
          <Icon size={26} className={color} />
        </div>

        {titulo && <h3 className="text-lg font-bold text-neutral-ink mb-1">{titulo}</h3>}
        {mensaje && <p className="text-sm text-neutral-text leading-relaxed">{mensaje}</p>}

        {detalles && (
          <div className="mt-3 max-h-48 overflow-auto rounded-lg bg-neutral-bg p-3 text-xs text-neutral-text font-mono whitespace-pre-wrap">
            {detalles}
          </div>
        )}

        {children && <div className="mt-4">{children}</div>}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
