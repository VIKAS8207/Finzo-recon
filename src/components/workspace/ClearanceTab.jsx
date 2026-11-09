import DataTable from '../DataTable.jsx'
import StatusPill from '../StatusPill.jsx'
import { dShort, money } from '../../utils/format.js'

/** Bank Clearance Summary */
export default function ClearanceTab({ ws }) {
  const list = ws.vouchers.slice().sort((x, y) => y.date - x.date)
  return (
    <DataTable
      heads={['Entry', 'Party', 'Posting date', 'Clearance date', 'Amount']}
      right={[4]}
      minWidth={640}
      rowKeys={list.map((v) => v.id)}
      rows={list.map((v) => [
        v.id,
        v.party,
        dShort(v.date),
        v.cleared ? dShort(v.cleared) : <StatusPill key="c" kind="notstarted" label="Not cleared" />,
        money(v.amt),
      ])}
    />
  )
}
