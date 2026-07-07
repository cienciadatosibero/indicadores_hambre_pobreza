// frontend/src/components/ui/InfoTip.jsx
// Boton (i) que muestra una explicacion en un pequeño popover al hacer clic.
import { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';

export default function InfoTip({ texto }) {
  const [abierto, setAbierto] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const cerrar = (e) => { if (ref.current && !ref.current.contains(e.target)) setAbierto(false); };
    document.addEventListener('mousedown', cerrar);
    return () => document.removeEventListener('mousedown', cerrar);
  }, []);
  return (
    <span className="relative inline-flex" ref={ref}>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setAbierto((a) => !a); }}
        className="text-neutral-400 hover:text-primary transition-colors"
        aria-label="Mas informacion"
      >
        <Info size={16} />
      </button>
      {abierto && (
        <span className="absolute left-6 top-0 z-40 w-64 rounded-lg bg-neutral-ink px-3 py-2 text-xs leading-relaxed text-white shadow-xl">
          {texto}
        </span>
      )}
    </span>
  );
}
