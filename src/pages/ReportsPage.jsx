import { useState } from 'react'
import Button from '../components/Button.jsx'
import Panel, { PanelGroup, PanelRow } from '../components/Panel.jsx'
import DataTable from '../components/DataTable.jsx'
import PageHeader from '../components/PageHeader.jsx'
import SectionTitle from '../components/SectionTitle.jsx'
import { useBank } from '../context/BankContext.jsx'
import { money } from '../utils/format.js'

function BalanceByBank({ accounts }) {
  const m = {}
  accounts.forEach((a) => {
    const b = m[a.bank] || (m[a.bank] = { n: 0, bal: 0, rec: 0 })
    b.n++
    b.bal += a.balance
    if (a.status === 'reconciled') b.rec++
  })
  return (
    <DataTable bare
      heads={['Bank', 'Accounts', 'Reconciled', 'Total balance']}
      right={[1, 2, 3]}
      rows={Object.keys(m)
        .sort()
        .map((k) => [k, m[k].n, Math.round((m[k].rec / m[k].n) * 100) + '%', money(m[k].bal)])}
    />
  )
}

function StatusByEntity({ accounts }) {
  const e = {}
  accounts.forEach((a) => {
    const b = e[a.entity] || (e[a.entity] = { reconciled: 0, progress: 0, notstarted: 0, discrepancy: 0 })
    b[a.status]++
  })
  return (
    <DataTable bare
      heads={['Entity', 'Reconciled', 'In progress', 'Not started', 'Discrepancy']}
      right={[1, 2, 3, 4]}
      rows={Object.keys(e)
        .sort()
        .map((k) => [k, e[k].reconciled, e[k].progress, e[k].notstarted, e[k].discrepancy])}
    />
  )
}

export default function ReportsPage({ go }) {
  const { accounts } = useBank()
  const [report, setReport] = useState('bank')

  const reports = [
    { key: 'bank', title: 'Balance by bank', text: 'Accounts, reconciled share and total balance for each bank.' },
    { key: 'entity', title: 'Status by entity', text: 'How many accounts of each entity are in each reconciliation state.' },
  ]

  return (
    <>
      <PageHeader crumb="Banking / Reports" title="Reports" />

      <PanelGroup>
      <PanelRow cols="lg:grid-cols-3">
        {reports.map((r) => (
          <Panel bare key={r.key} className="flex flex-col gap-2 items-start">
            <b>{r.title}</b>
            <span className="text-xs text-neutral-500">{r.text}</span>
            <Button size="sm" variant={report === r.key ? 'primary' : 'secondary'} onClick={() => setReport(r.key)}>
              Preview
            </Button>
          </Panel>
        ))}
        <Panel bare className="flex flex-col gap-2 items-start">
          <b>Bank Reconciliation Statement</b>
          <span className="text-xs text-neutral-500">Prepared per account. Open an account to see its statement.</span>
          <Button size="sm" onClick={() => go('accounts')}>
            Go to accounts
          </Button>
        </Panel>
      </PanelRow>

      <Panel bare className="flex flex-col gap-2">
        <SectionTitle className="mb-0">Preview: {report === 'bank' ? 'Balance by bank' : 'Status by entity'}</SectionTitle>
        {report === 'bank' ? <BalanceByBank accounts={accounts} /> : <StatusByEntity accounts={accounts} />}
        <p className="text-xs text-neutral-500">Export to Excel or PDF is not part of this prototype.</p>
      </Panel>
      </PanelGroup>
    </>
  )
}
