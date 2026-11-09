import DataTable from '../DataTable.jsx'
import BankChip from '../BankChip.jsx'
import StatusPill from '../StatusPill.jsx'
import ReconcileButton from './ReconcileButton.jsx'
import { ago, money } from '../../utils/format.js'

export default function AccountsTable({ accounts, onOpen }) {
  return (
    <DataTable
      heads={['Account', 'Bank', 'Entity', 'Reconciliation', 'Synced', 'Current balance', 'Action']}
      right={[5, 6]}
      minWidth={820}
      rowKeys={accounts.map((a) => a.id)}
      rows={accounts.map((a) => [
        <div key="n">
          <span className="block font-medium text-neutral-900">{a.name}</span>
          <span className="text-xs text-neutral-500">
            •••• {a.last4} · {a.type}
          </span>
        </div>,
        <BankChip key="b" code={a.code} name={a.bank} />,
        a.entity,
        <StatusPill key="s" kind={a.status} />,
        <span key="y" className="text-xs text-neutral-500">
          {ago(a.synced)}
        </span>,
        <span key="m" className={a.balance < 0 ? 'text-rose-600' : ''}>
          {money(a.balance)}
        </span>,
        <ReconcileButton key="r" account={a} onOpen={onOpen} />,
      ])}
    />
  )
}
