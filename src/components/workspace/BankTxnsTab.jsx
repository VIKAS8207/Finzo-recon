import DataTable from '../DataTable.jsx'
import StatusPill from '../StatusPill.jsx'
import { dShort, money } from '../../utils/format.js'

export default function BankTxnsTab({ ws }) {
  return (
    <DataTable
      heads={['Date', 'Description', 'Reference', 'Withdrawal', 'Deposit', 'Status', 'Matched entries']}
      right={[3, 4]}
      minWidth={820}
      rowKeys={ws.txns.map((t) => t.id)}
      rows={ws.txns.map((t) => [
        dShort(t.date),
        t.desc,
        t.ref,
        t.amt < 0 ? money(-t.amt) : '',
        t.amt > 0 ? money(t.amt) : '',
        t.status === 'reconciled' ? (
          <StatusPill key="s" kind="reconciled" />
        ) : (
          <StatusPill key="s" kind="notstarted" label="Unreconciled" />
        ),
        t.vouchers.join(', ') || '-',
      ])}
    />
  )
}
