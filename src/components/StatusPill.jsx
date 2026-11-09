import { STATUS } from '../data/constants.js'

const styles = {
  reconciled: 'bg-emerald-50 text-emerald-700',
  progress: 'bg-violet-100 text-violet-700',
  notstarted: 'bg-neutral-100 text-neutral-600',
  discrepancy: 'bg-rose-50 text-rose-700',
  found: 'bg-teal-50 text-teal-700',
  possible: 'bg-amber-50 text-amber-700',
  none: 'bg-neutral-100 text-neutral-600',
}

const labels = { ...STATUS, found: 'Sure match', possible: 'Possible match', none: 'No match' }

/** kind: reconciled | progress | notstarted | discrepancy | found | possible | none */
export default function StatusPill({ kind, label }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[5px] text-xs font-medium whitespace-nowrap ${styles[kind]}`}
    >
      <span className="w-1.5 h-1.5 rounded-[5px] bg-current" />
      {label ?? labels[kind]}
    </span>
  )
}
