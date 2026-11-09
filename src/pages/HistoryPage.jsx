import DataTable from '../components/DataTable.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { useBank } from '../context/BankContext.jsx'

export default function HistoryPage() {
  const { log } = useBank()
  return (
    <>
      <PageHeader crumb="Banking / Audit" title="History" />
      <p className="text-xs text-neutral-600">
        Every reconciliation, undo, import and rule action, newest first. Actions you take in this session appear at the top.
      </p>
      <DataTable
        heads={['When', 'User', 'Account', 'Action']}
        rows={log.map((l) => [
          l.t.toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
          l.user,
          l.acct,
          l.action,
        ])}
      />
    </>
  )
}
