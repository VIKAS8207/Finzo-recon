import Button from '../components/Button.jsx'
import DataTable from '../components/DataTable.jsx'
import LinkButton from '../components/LinkButton.jsx'
import Legend from '../components/Legend.jsx'
import PageHeader from '../components/PageHeader.jsx'
import Panel from '../components/Panel.jsx'
import StackBar from '../components/StackBar.jsx'
import StatRow from '../components/StatRow.jsx'
import StatTile from '../components/StatTile.jsx'
import ReconcileButton from '../components/accounts/ReconcileButton.jsx'
import { useBank } from '../context/BankContext.jsx'
import { STATUS, STATUS_BG, STATUS_KEYS } from '../data/constants.js'
import { ago, cr, money, TODAY } from '../utils/format.js'

function BarRow({ label, bar, value }) {
  return (
    <div className="grid grid-cols-[minmax(90px,160px)_minmax(0,1fr)_auto] gap-3 items-center py-1.5 text-sm">
      <span className="truncate">{label}</span>
      {bar}
      <span className="tabular-nums text-xs text-neutral-500">{value}</span>
    </div>
  )
}

export default function DashboardPage({ go, openAccount }) {
  const { accounts, log } = useBank()

  const counts = { reconciled: 0, progress: 0, notstarted: 0, discrepancy: 0 }
  const byBank = {}
  const byEntity = {}
  let total = 0
  let stale = 0
  accounts.forEach((a) => {
    total += a.balance
    counts[a.status]++
    if (a.synced > 120) stale++
    const b = byBank[a.bank] || (byBank[a.bank] = { n: 0, reconciled: 0, progress: 0, notstarted: 0, discrepancy: 0 })
    b.n++
    b[a.status]++
    byEntity[a.entity] = (byEntity[a.entity] || 0) + a.balance
  })
  const pct = Math.round((counts.reconciled / accounts.length) * 100)
  const bankCount = Object.keys(byBank).length
  const entityMax = Math.max(...Object.values(byEntity).map(Math.abs))
  const topDiscrepancies = accounts
    .filter((a) => a.status === 'discrepancy')
    .sort((x, y) => Math.abs(y.balance - y.ledger) - Math.abs(x.balance - x.ledger))
    .slice(0, 8)

  return (
    <>
      <PageHeader
        crumb="Overview"
        title="Dashboard"
        actions={
          <>
            <Button onClick={() => go('import')}>Import statement</Button>
            <Button variant="primary" onClick={() => go('add')}>
              Add account
            </Button>
          </>
        }
      />

      <StatRow>
        <StatTile label="Total balance" value={cr(total)} sub={`${accounts.length} accounts, ${bankCount} banks`} />
        <StatTile label="Reconciled this period" value={`${pct}%`} progress={pct} />
        <StatTile
          label="Discrepancies"
          value={counts.discrepancy}
          tone="crit"
          sub="Review these accounts"
          onClick={() => go('accounts', { status: 'discrepancy' })}
        />
        <StatTile label="Not started" value={counts.notstarted} sub="accounts" />
        <StatTile label="Stale bank feeds" value={stale} sub="not synced for 2 h or more" />
      </StatRow>

      <div className="grid lg:grid-cols-2 gap-4">
          <Panel title="Reconciliation status by bank, top 8">
            {Object.keys(byBank)
              .sort((x, y) => byBank[y].n - byBank[x].n)
              .slice(0, 8)
              .map((k) => (
                <BarRow
                  key={k}
                  label={k}
                  value={byBank[k].n}
                  bar={
                    <StackBar
                      segments={STATUS_KEYS.map((s) => ({
                        pct: (byBank[k][s] / byBank[k].n) * 100,
                        className: STATUS_BG[s],
                        title: `${STATUS[s]}: ${byBank[k][s]}`,
                      }))}
                    />
                  }
                />
              ))}
            <Legend />
          </Panel>

          <Panel title="Balance by entity">
            {Object.keys(byEntity)
              .sort((x, y) => byEntity[y] - byEntity[x])
              .map((k) => (
                <BarRow
                  key={k}
                  label={k}
                  value={cr(byEntity[k])}
                  bar={<StackBar segments={[{ pct: (Math.abs(byEntity[k]) / entityMax) * 100, className: 'bg-violet-600' }]} />}
                />
              ))}
          </Panel>

          <Panel title="Largest discrepancies">
            <DataTable
              bare
              heads={['Account', 'Bank', 'Difference', 'Action']}
              right={[2, 3]}
              minWidth={460}
              rowKeys={topDiscrepancies.map((a) => a.id)}
              rows={topDiscrepancies.map((a) => [
                <span key="n">
                  {a.name} <span className="text-xs text-neutral-500">{a.last4}</span>
                </span>,
                a.bank,
                money(Math.abs(a.balance - a.ledger)),
                <ReconcileButton key="r" account={a} onOpen={openAccount} />,
              ])}
            />
          </Panel>

          <Panel title="Recent activity">
            <ul className="divide-y divide-neutral-100">
              {log.slice(0, 6).map((l, i) => (
                <li key={i} className="py-2 flex flex-col gap-0.5 text-sm">
                  <span>{l.action}</span>
                  <span className="text-xs text-neutral-500">
                    {l.acct} · {l.user} · {ago(Math.max(1, Math.round((TODAY.getTime() - l.t.getTime()) / 60000)))}
                  </span>
                </li>
              ))}
            </ul>
            <LinkButton className="mt-2" onClick={() => go('history')}>
              See all history
            </LinkButton>
          </Panel>
      </div>
    </>
  )
}
