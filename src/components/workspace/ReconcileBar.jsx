import Button from '../Button.jsx'
import { money, r2 } from '../../utils/format.js'

export default function ReconcileBar({ txn, total, count, onReconcile }) {
  const rem = r2(txn.amt - total)
  const ok = rem === 0 && count > 0
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border border-neutral-200 rounded-[5px] px-3 py-2.5 text-sm">
      <span>
        Selected <b className="tabular-nums">{money(total)}</b> of <b className="tabular-nums">{money(txn.amt)}</b> · Remaining{' '}
        <b className={`tabular-nums ${rem === 0 ? 'text-emerald-700' : 'text-rose-600'}`}>{money(rem)}</b>
      </span>
      <Button variant="primary" disabled={!ok} onClick={onReconcile}>
        Reconcile
      </Button>
    </div>
  )
}
