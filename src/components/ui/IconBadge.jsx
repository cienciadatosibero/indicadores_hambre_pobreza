// frontend/src/components/ui/IconBadge.jsx
export default function IconBadge({ icon: Icon, size = 'md' }) {
  const sizes = { md: 'h-12 w-12', lg: 'h-14 w-14' };
  return (
    <div className={`flex items-center justify-center rounded-xl bg-primary/10 text-primary ${sizes[size]}`}>
      <Icon size={size === 'lg' ? 28 : 24} />
    </div>
  );
}
