// frontend/src/components/ui/Button.jsx
import { ArrowRight } from 'lucide-react';

export default function Button({ children, variant = 'primary', arrow = false, className = '', ...props }) {
  const base = 'inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 group';
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark shadow-sm hover:shadow-lg',
    outline: 'border border-neutral-300 text-neutral-ink hover:border-primary hover:text-primary bg-white',
    ghost: 'text-primary hover:text-primary-dark',
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
      {arrow && <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />}
    </button>
  );
}
