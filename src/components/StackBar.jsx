/** Horizontal stacked bar. segments: [{ pct, className, title }] */
export default function StackBar({ segments }) {
  return (
    <div className="flex h-2.5 rounded-[5px] overflow-hidden bg-neutral-100 min-w-0">
      {segments.map((s, i) => (
        <i key={i} title={s.title} className={`block h-full ${s.className}`} style={{ width: `${s.pct}%` }} />
      ))}
    </div>
  )
}
