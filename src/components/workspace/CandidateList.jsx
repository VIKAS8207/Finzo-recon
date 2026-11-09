import EmptyState from '../EmptyState.jsx'
import SignalDots from './SignalDots.jsx'
import { candidates } from '../../data/workspace.js'
import { dShort, money } from '../../utils/format.js'

export default function CandidateList({ ws, txn, query, selected, onToggle }) {
  const list = candidates(ws, txn, query)
  if (!list.length) {
    return <EmptyState>No ledger entries found. Record a payment or transfer for this transaction instead.</EmptyState>
  }
  return (
    <ul className="border border-neutral-200 rounded-[5px] divide-y divide-neutral-100">
      {list.map(({ v, s }) => {
        const on = selected.includes(v.id)
        return (
          <li key={v.id} className={`grid grid-cols-[auto_minmax(0,1fr)_auto] gap-3 px-3 py-2.5 items-start ${on ? 'bg-violet-50' : ''}`}>
            <input
              type="checkbox"
              id={`c-${v.id}`}
              checked={on}
              onChange={() => onToggle(v.id)}
              className="w-4 h-4 mt-1 accent-violet-600"
            />
            <label htmlFor={`c-${v.id}`} className="min-w-0 cursor-pointer">
              <div className="font-medium text-sm">{v.party}</div>
              <div className="text-xs text-neutral-500">
                {v.id} · {v.type} · {dShort(v.date)}
                {v.ref ? ` · ${v.ref}` : ''}
              </div>
              <SignalDots s={s} />
            </label>
            <span className="text-sm tabular-nums">{money(v.amt)}</span>
          </li>
        )
      })}
    </ul>
  )
}
