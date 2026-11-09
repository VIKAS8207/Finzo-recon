import StatusPill from '../StatusPill.jsx'
import EmptyState from '../EmptyState.jsx'
import { dShort, money } from '../../utils/format.js'
import { matchTag } from '../../data/workspace.js'

export default function TxnList({ txns, ws, selId, onSelect }) {
  if (!txns.length) {
    return <EmptyState className="border-0">Nothing to show here. Change the filters or switch the status to All.</EmptyState>
  }
  return (
    <div className="max-h-[620px] min-h-[300px] overflow-y-auto">
      {txns.map((t) => {
        const dep = t.amt > 0
        return (
          <button
            key={t.id}
            type="button"
            aria-pressed={selId === t.id}
            onClick={() => onSelect(t.id)}
            className={`w-full grid grid-cols-[minmax(0,1fr)_auto] gap-3 text-left px-3 py-2.5 border-b border-neutral-100 border-l-[3px] transition-colors ${
              selId === t.id ? 'bg-violet-50 border-l-violet-600' : 'border-l-transparent hover:bg-neutral-50'
            }`}
          >
            <span className="min-w-0">
              <span className="block font-medium text-sm truncate">{t.desc}</span>
              <span className="text-xs text-neutral-500">
                {dShort(t.date)} · {t.ref}
              </span>
            </span>
            <span className="flex flex-col items-end gap-1">
              <span className={`text-sm tabular-nums ${dep ? 'text-emerald-700' : ''}`}>
                {dep ? '+' : ''}
                {money(t.amt)}
              </span>
              <StatusPill kind={matchTag(ws, t)} />
            </span>
          </button>
        )
      })}
    </div>
  )
}
