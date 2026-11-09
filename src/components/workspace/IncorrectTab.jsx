import DataTable from '../DataTable.jsx'
import EmptyState from '../EmptyState.jsx'
import StatusPill from '../StatusPill.jsx'
import { dShort, money } from '../../utils/format.js'

/** Entries whose clearance date is earlier than their posting date. */
export default function IncorrectTab({ ws }) {
  const bad = ws.vouchers.filter((v) => v.cleared && v.cleared < v.date)
  if (!bad.length) {
    return (
      <EmptyState>
        <b className="text-neutral-800">No incorrectly cleared entries.</b>
        Entries cleared before they were posted would appear here.
      </EmptyState>
    )
  }
  return (
    <div className="flex flex-col gap-2">
      <DataTable
        heads={['Entry', 'Party', 'Posting date', 'Clearance date', 'Amount']}
        right={[4]}
        minWidth={640}
        rowKeys={bad.map((v) => v.id)}
        rows={bad.map((v) => [
          v.id,
          v.party,
          dShort(v.date),
          <StatusPill key="c" kind="discrepancy" label={dShort(v.cleared)} />,
          money(v.amt),
        ])}
      />
      <p className="text-xs text-neutral-500">
        These entries show a clearance date earlier than their posting date. Correct the date or undo the match.
      </p>
    </div>
  )
}
