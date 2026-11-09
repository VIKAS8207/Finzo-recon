export default function EmptyState({ children, className = '' }) {
  return (
    <div
      className={`bg-white border border-dashed border-neutral-300 rounded-[5px] px-4 py-9 text-center text-sm text-neutral-500 flex flex-col items-center gap-2 ${className}`}
    >
      {children}
    </div>
  )
}
