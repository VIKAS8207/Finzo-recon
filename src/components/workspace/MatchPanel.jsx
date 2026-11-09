import Button from '../Button.jsx'
import Segmented from '../Segmented.jsx'
import EmptyState from '../EmptyState.jsx'
import SectionTitle from '../SectionTitle.jsx'
import { Input } from '../Field.jsx'
import TxnSummary from './TxnSummary.jsx'
import CandidateList from './CandidateList.jsx'
import ReconcileBar from './ReconcileBar.jsx'
import RecordPaymentForm from './RecordPaymentForm.jsx'
import TransferForm from './TransferForm.jsx'
import { dateStr, money } from '../../utils/format.js'
import { selTotal } from '../../data/workspace.js'

const MODES = [
  { value: 'match', label: 'Find match' },
  { value: 'record', label: 'Record payment' },
  { value: 'transfer', label: 'Internal transfer' },
]

/** Right-hand pane of the matching screen. */
export default function MatchPanel({
  txn,
  ws,
  account,
  accounts,
  allDone,
  mode,
  onMode,
  query,
  onQuery,
  selected,
  onToggle,
  onReconcile,
  onCreate,
  onUnrec,
  onViewBrs,
}) {
  let body

  if (!txn) {
    body = (
      <EmptyState>
        {allDone ? (
          <>
            <b className="text-neutral-800">Every bank transaction is reconciled.</b>
            The statement shows what is still outstanding in the books.
            <Button variant="primary" onClick={onViewBrs}>
              View reconciliation statement
            </Button>
          </>
        ) : (
          'Select a bank transaction on the left to see suggested matches.'
        )}
      </EmptyState>
    )
  } else if (txn.status === 'reconciled') {
    const vs = ws.vouchers.filter((v) => v.txn === txn.id)
    body = (
      <>
        <TxnSummary txn={txn} />
        <div>
          <SectionTitle>Reconciled with</SectionTitle>
          <ul className="border border-neutral-200 rounded-[5px] divide-y divide-neutral-100">
            {vs.map((v) => (
              <li key={v.id} className="flex justify-between gap-3 px-3 py-2.5">
                <div className="min-w-0">
                  <div className="font-medium text-sm">{v.party}</div>
                  <div className="text-xs text-neutral-500">
                    {v.id} · {v.type} · cleared {dateStr(v.cleared)}
                    {v.created ? ' · created from this transaction' : ''}
                  </div>
                </div>
                <span className="text-sm tabular-nums">{money(v.amt)}</span>
              </li>
            ))}
          </ul>
        </div>
        <Button className="self-start" onClick={() => onUnrec(txn.id)}>
          Undo reconciliation
        </Button>
      </>
    )
  } else {
    body = (
      <>
        <TxnSummary txn={txn} />
        <div className="self-start">
          <Segmented label="Action" options={MODES} value={mode} onChange={onMode} />
        </div>
        {mode === 'match' && (
          <>
            <Input
              type="search"
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              placeholder="Search ledger entries by party, reference or amount"
              aria-label="Search ledger entries"
            />
            <CandidateList ws={ws} txn={txn} query={query} selected={selected} onToggle={onToggle} />
            <ReconcileBar txn={txn} total={selTotal(ws, selected)} count={selected.length} onReconcile={onReconcile} />
          </>
        )}
        {mode === 'record' && <RecordPaymentForm key={txn.id} txn={txn} onSubmit={(t) => onCreate('record', t)} />}
        {mode === 'transfer' && (
          <TransferForm key={txn.id} txn={txn} account={account} accounts={accounts} onSubmit={(t) => onCreate('transfer', t)} />
        )}
      </>
    )
  }

  return (
    <section aria-label="Match panel" className="min-w-0">
      <div className="p-4 flex flex-col gap-4 min-w-0">{body}</div>
    </section>
  )
}
