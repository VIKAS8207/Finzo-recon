/**
 * Section of a page. Put several inside <PanelGroup> (and <PanelRow> for side-by-side)
 * so they share one white container split by thin lines. Use `bare` inside a group.
 * Standalone (no `bare`) it draws its own border.
 */
export default function Panel({ title, children, className = '', bare = false }) {
  return (
    <section className={`min-w-0 p-5 ${bare ? '' : 'bg-white border border-neutral-200 rounded-[5px]'} ${className}`}>
      {title && <p className="text-xs uppercase tracking-wide text-neutral-500 mb-3">{title}</p>}
      {children}
    </section>
  )
}

/** One big white container; its children are separated by horizontal lines. */
export function PanelGroup({ children }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-[5px] overflow-hidden divide-y divide-neutral-200">{children}</div>
  )
}

/** A row inside <PanelGroup>; children sit side by side (separated by vertical lines) on wide screens. */
export function PanelRow({ children, cols = 'lg:grid-cols-2' }) {
  return (
    <div className={`grid grid-cols-1 ${cols} max-lg:divide-y lg:divide-x divide-neutral-200`}>{children}</div>
  )
}
