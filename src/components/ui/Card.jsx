// frontend/src/components/ui/Card.jsx
export default function Card({ children, className = '' }) {
  return (
    <div className={`rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg ${className}`}>
      {children}
    </div>
  );
}
