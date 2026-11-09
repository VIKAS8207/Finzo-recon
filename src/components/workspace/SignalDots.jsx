const LABELS = ['No match', 'Close', 'Match']
const DOT = ['bg-rose-500', 'bg-amber-500', 'bg-emerald-500']

function Signal({ name, level }) {
  return (
    <span className="inline-flex items-center gap-1" title={`${name}: ${LABELS[level]}`}>
      <i className={`w-2 h-2 rounded-[5px] ${DOT[level]}`} />
      {name}
    </span>
  )
}

/** Amount / Date / Reference match indicators for a suggested ledger entry. */
export default function SignalDots({ s }) {
  return (
    <div className="flex flex-wrap gap-3 mt-1 text-xs text-neutral-500">
      <Signal name="Amount" level={s.amt} />
      <Signal name="Date" level={s.dt} />
      <Signal name="Reference" level={s.rf} />
    </div>
  )
}
