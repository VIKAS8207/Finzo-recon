import StatRow from '../StatRow.jsx'
import StatTile from '../StatTile.jsx'
import { ago, money, r2 } from '../../utils/format.js'
import { unrecCount } from '../../data/workspace.js'

export default function WorkspaceStats({ account: a, ws }) {
  const un = unrecCount(ws)
  const tot = ws.txns.length
  const pct = tot ? Math.round(((tot - un) / tot) * 100) : 100
  const diff = r2(a.balance - a.ledger)

  return (
    <StatRow>
      <StatTile label="Balance per bank" value={money(a.balance)} sub={`Synced ${ago(a.synced)}`} />
      <StatTile label="Balance per books" value={money(a.ledger)} sub="General ledger" />
      <StatTile label="Difference" value={money(diff)} tone={diff === 0 ? 'good' : 'crit'} sub="Bank minus books" />
      <StatTile label="Left to reconcile" value={un} sub={`of ${tot} bank transactions`} />
      <StatTile label="Progress" value={`${pct}%`} progress={pct} />
    </StatRow>
  )
}
