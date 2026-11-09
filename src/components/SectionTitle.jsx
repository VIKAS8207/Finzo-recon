export default function SectionTitle({ children, className = '' }) {
  return <p className={`text-xs uppercase tracking-wide text-neutral-500 mb-2 ${className}`}>{children}</p>
}
