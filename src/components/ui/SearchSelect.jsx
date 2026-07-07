// frontend/src/components/ui/SearchSelect.jsx
// Select con buscador (una sola seleccion). opciones: [{ value, label }]
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';

export default function SearchSelect({ opciones, value, onChange, placeholder = 'Selecciona...', disabled = false }) {
  const [abierto, setAbierto] = useState(false);
  const [q, setQ] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const cerrar = (e) => { if (ref.current && !ref.current.contains(e.target)) setAbierto(false); };
    document.addEventListener('mousedown', cerrar);
    return () => document.removeEventListener('mousedown', cerrar);
  }, []);

  const sel = opciones.find((o) => o.value === value);
  const filtradas = q
    ? opciones.filter((o) => o.label.toLowerCase().includes(q.toLowerCase()))
    : opciones;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setAbierto((a) => !a)}
        className={`flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm ${
          disabled ? 'border-neutral-200 bg-neutral-bg text-neutral-400 cursor-not-allowed' : 'border-neutral-300 bg-white text-neutral-ink hover:border-primary'
        }`}
      >
        <span className="truncate">{sel ? sel.label : placeholder}</span>
        <ChevronDown size={15} className={abierto ? 'rotate-180 transition-transform' : 'transition-transform'} />
      </button>
      {abierto && !disabled && (
        <div className="absolute z-30 mt-2 w-full min-w-[20rem] rounded-xl border border-neutral-200 bg-white shadow-xl">
          <div className="flex items-center gap-2 border-b border-neutral-100 px-3 py-2">
            <Search size={14} className="text-neutral-400" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar..."
              className="w-full text-sm focus:outline-none"
            />
          </div>
          <div className="h-60 overflow-y-auto py-1">
            {filtradas.length === 0 && <p className="px-3 py-2 text-xs text-neutral-text">Sin resultados</p>}
            {filtradas.map((o) => (
              <button
                key={o.value}
                onClick={() => { onChange(o.value); setAbierto(false); setQ(''); }}
                className={`block w-full px-3 py-1.5 text-left text-sm hover:bg-neutral-bg ${
                  o.value === value ? 'font-semibold text-primary' : 'text-neutral-ink'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
