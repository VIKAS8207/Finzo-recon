import ProgressBar from './ProgressBar.jsx'

const toneCls = { crit: 'text-rose-600', good: 'text-emerald-600' }

/**
 * Plain number block (no card, no border) used inside <StatRow>.
 * Pass `onClick` to make it a toggle (with `selected`). `progress` shows a bar (0-100).
 */
export default function StatTile({ label, value, sub, tone, progress, onClick, selected }) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      aria-pressed={onClick ? !!selected : undefined}
      className={`flex flex-col gap-1.5 text-left min-w-0 py-2 transition-colors ${
        onClick ? 'hover:bg-white/50' : ''
      } ${selected ? 'bg-white/70' : ''}`}
    >
      <span className="text-sm text-neutral-700">{label}</span>
      <span className={`text-3xl font-medium tabular-nums truncate ${tone ? toneCls[tone] : 'text-neutral-900'}`}>{value}</span>
      {progress !== undefined && <ProgressBar value={progress} />}
      {sub && <span className="text-xs text-neutral-500">{sub}</span>}
    </Tag>
  )
}
