import { dateStr, money } from '../../utils/format.js'

/** Header card for the selected bank transaction. */
export default function TxnSummary({ txn: t }) {
  const dep = t.amt > 0
  return (
    <div className="bg-violet-50/60 rounded-[5px] px-3.5 py-3 flex flex-wrap justify-between gap-3">
      <div className="min-w-0">
        <div className="text-xs text-neutral-500">
          {dateStr(t.date)} · {dep ? 'Deposit' : 'Withdrawal'}
        </div>
        <div className="font-medium">{t.desc}</div>
        <div className="text-xs text-neutral-500">{t.ref}</div>
      </div>
      <div className={`text-xl font-medium tabular-nums ${dep ? 'text-emerald-700' : ''}`}>
        {dep ? '+' : ''}
        {money(t.amt)}
      </div>
    </div>
  )
}
