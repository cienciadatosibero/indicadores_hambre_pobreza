// frontend/src/components/Header.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, BarChart3 } from 'lucide-react';

const NAV = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Acerca de', href: '#acerca' },
  { label: 'Indicadores', href: '#indicadores' },
  { label: 'Descargas', href: '#descargas' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur shadow-sm' : 'bg-white/70 backdrop-blur'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
              <BarChart3 size={20} />
            </span>
            <span className="font-bold text-neutral-ink leading-tight text-sm sm:text-base">
              Pobreza y Hambre<span className="text-primary"> · MX</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="text-sm font-medium text-neutral-text hover:text-primary transition-colors">
                {n.label}
              </a>
            ))}
          </nav>

          <button className="md:hidden text-neutral-ink" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-neutral-200 px-4 py-4 space-y-3">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="block text-neutral-text font-medium hover:text-primary">
              {n.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
