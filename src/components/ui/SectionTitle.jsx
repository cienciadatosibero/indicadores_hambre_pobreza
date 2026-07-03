// frontend/src/components/ui/SectionTitle.jsx
export default function SectionTitle({ eyebrow, title, subtitle, center = false }) {
  return (
    <div className={`mb-12 ${center ? 'text-center mx-auto max-w-2xl' : 'max-w-3xl'}`}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-ink leading-tight">{title}</h2>
      {subtitle && <p className="mt-4 text-lg text-neutral-text">{subtitle}</p>}
    </div>
  );
}
