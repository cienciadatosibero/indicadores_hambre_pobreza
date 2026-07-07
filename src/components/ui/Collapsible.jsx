// frontend/src/components/ui/Collapsible.jsx
// Seccion colapsable tipo acordeon. Empieza abierta o cerrada segun defaultOpen.
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import InfoTip from './InfoTip.jsx';

export default function Collapsible({ titulo, icon: Icon, info, defaultOpen = true, children }) {
  const [abierto, setAbierto] = useState(defaultOpen);
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm mb-6 overflow-hidden">
      <button
        onClick={() => setAbierto((a) => !a)}
        className="flex w-full items-center justify-between px-6 py-4 hover:bg-neutral-bg/40"
      >
        <span className="flex items-center gap-2 font-bold text-neutral-ink">
          {Icon && <Icon size={18} className="text-primary" />}
          {titulo}
          {info && <InfoTip texto={info} />}
        </span>
        <ChevronDown size={18} className={`text-neutral-400 transition-transform ${abierto ? 'rotate-180' : ''}`} />
      </button>
      {abierto && <div className="px-6 pb-6 pt-1">{children}</div>}
    </div>
  );
}
