import BankChip from '../BankChip.jsx'
import StatusPill from '../StatusPill.jsx'
import ReconcileButton from './ReconcileButton.jsx'
import { ago, money } from '../../utils/format.js'

export default function AccountCard({ account: a, onOpen }) {
  const note =
    a.status === 'reconciled'
      ? `Reconciled ${a.lastRecon === 0 ? 'today' : a.lastRecon + 'd ago'}`
      : `Difference ${money(Math.abs(a.balance - a.ledger))}`

  return (
    <article className="bg-white border border-neutral-200 hover:border-violet-400 rounded-[5px] p-4 flex flex-col gap-2.5 min-w-0 transition-colors">
      <div className="flex items-center justify-between gap-2">
        <BankChip code={a.code} name={a.bank} />
        <StatusPill kind={a.status} />
      </div>
      <div>
        <div className="font-medium text-neutral-900">{a.name}</div>
        <div className="text-xs text-neutral-500">
          {a.type} · <span className="tabular-nums">•••• {a.last4}</span> · {a.entity}
        </div>
      </div>
      <div className={`text-xl font-medium tabular-nums ${a.balance < 0 ? 'text-rose-600' : ''}`}>{money(a.balance)}</div>
      <div className="flex items-center justify-between gap-2 border-t border-neutral-100 pt-2.5 text-xs text-neutral-500">
        <span>
          {note}
          <br />
          Synced {ago(a.synced)}
        </span>
        <ReconcileButton account={a} onOpen={onOpen} />
      </div>
    </article>
  )
}
