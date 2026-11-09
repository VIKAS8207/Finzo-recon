import { useMemo, useState } from 'react'
import Tabs from '../components/Tabs.jsx'
import WorkspaceHeader from '../components/workspace/WorkspaceHeader.jsx'
import WorkspaceStats from '../components/workspace/WorkspaceStats.jsx'
import MatchTab from '../components/workspace/MatchTab.jsx'
import BrsTab from '../components/workspace/BrsTab.jsx'
import BankTxnsTab from '../components/workspace/BankTxnsTab.jsx'
import ClearanceTab from '../components/workspace/ClearanceTab.jsx'
import IncorrectTab from '../components/workspace/IncorrectTab.jsx'
import { useBank } from '../context/BankContext.jsx'
import { genWs } from '../data/workspace.js'

const TABS = [
  { key: 'match', label: 'Match and Reconcile' },
  { key: 'brs', label: 'Bank Reconciliation Statement' },
  { key: 'bank', label: 'Bank Transactions' },
  { key: 'clear', label: 'Bank Clearance Summary' },
  { key: 'bad', label: 'Incorrectly Cleared Entries' },
]

/** Full reconciliation screen for one bank account. */
export default function WorkspacePage({ accountId, onBack }) {
  const { accounts } = useBank()
  const account = accounts[accountId]
  const ws = useMemo(() => genWs(account), [account])
  const [tab, setTab] = useState('match')

  return (
    <>
      <WorkspaceHeader account={account} onBack={onBack} />
      <WorkspaceStats account={account} ws={ws} />
      <Tabs tabs={TABS} active={tab} onChange={setTab} />
      {tab === 'match' && <MatchTab account={account} ws={ws} onViewBrs={() => setTab('brs')} />}
      {tab === 'brs' && <BrsTab account={account} ws={ws} />}
      {tab === 'bank' && <BankTxnsTab ws={ws} />}
      {tab === 'clear' && <ClearanceTab ws={ws} />}
      {tab === 'bad' && <IncorrectTab ws={ws} />}
    </>
  )
}
