import DataTable from '../DataTable.jsx'
import EmptyState from '../EmptyState.jsx'
import SectionTitle from '../SectionTitle.jsx'
import { dShort, money, r2 } from '../../utils/format.js'
import { sumB, sumU } from '../../data/workspace.js'

function Row({ label, value, bold, tone }) {
  return (
    <tr className={`border-t border-neutral-100 first:border-0 ${bold ? 'bg-violet-50/60 font-semibold' : ''}`}>
      <td className="px-4 py-2.5">{label}</td>
      <td className={`px-4 py-2.5 text-right tabular-nums ${tone ?? ''}`}>{value}</td>
    </tr>
  )
}

/** Bank Reconciliation Statement */
export default function BrsTab({ account: a, ws }) {
  const sb = sumB(ws)
  const su = sumU(ws)
  const calc = r2(a.ledger - su + sb)
  const diff = r2(a.balance - calc)
  const uncleared = ws.vouchers.filter((v) => !v.cleared)
  const unrecBank = ws.txns.filter((t) => t.status === 'unreconciled')

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white border border-neutral-200 rounded-[5px] overflow-hidden">
        <table className="w-full text-sm">
          <tbody>
            <Row label="Balance as per books" value={money(a.ledger)} />
            <Row label={`Adjustment for ledger entries not yet cleared by the bank (${uncleared.length})`} value={money(-su)} />
            <Row label={`Bank transactions not yet reconciled (${unrecBank.length})`} value={money(sb)} />
            <Row bold label="Calculated balance as per bank" value={money(calc)} />
            <Row label="Balance as per bank statement" value={money(a.balance)} />
            <Row
              label="Difference"
              value={money(diff) + (diff === 0 ? ' (ties out)' : '')}
              tone={diff === 0 ? 'text-emerald-700' : 'text-rose-600'}
            />
          </tbody>
        </table>
      </div>

      <div className="grid lg:grid-cols-2 gap-3">
        <div>
          <SectionTitle>Ledger entries not yet cleared</SectionTitle>
          {uncleared.length ? (
            <DataTable
              heads={['Entry', 'Party', 'Date', 'Amount']}
              right={[3]}
              minWidth={420}
              rows={uncleared.map((v) => [v.id, v.party, dShort(v.date), money(v.amt)])}
            />
          ) : (
            <EmptyState>None. Every ledger entry has cleared the bank.</EmptyState>
          )}
        </div>
        <div>
          <SectionTitle>Bank transactions not yet reconciled</SectionTitle>
          {unrecBank.length ? (
            <DataTable
              heads={['Date', 'Description', 'Amount']}
              right={[2]}
              minWidth={420}
              rows={unrecBank.map((t) => [dShort(t.date), t.desc, money(t.amt)])}
            />
          ) : (
            <EmptyState>None. Every bank transaction is reconciled.</EmptyState>
          )}
        </div>
      </div>
    </div>
  )
}
