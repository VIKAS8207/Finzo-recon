import { useEffect, useState } from 'react'
import Button from '../Button.jsx'
import { Input, Select } from '../Field.jsx'
import TxnList from './TxnList.jsx'
import MatchPanel from './MatchPanel.jsx'
import { useBank } from '../../context/BankContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { dShort, r2 } from '../../utils/format.js'
import { autoList, selTotal, sure, unreconcileTxn, unrecCount, visibleTxns } from '../../data/workspace.js'

/** "Match and Reconcile" tab: bank transactions on the left, matching on the right. */
export default function MatchTab({ account, ws, onViewBrs }) {
  const { accounts, refresh, logAct } = useBank()
  const toast = useToast()

  const [filters, setFilters] = useState({ q: '', type: 'all', status: 'unrec' })
  const firstTxn = visibleTxns(ws, { q: '', type: 'all', status: 'unrec' })[0]
  const [sel, setSel] = useState(firstTxn ? firstTxn.id : null)
  const [selV, setSelV] = useState(() => {
    const s = firstTxn && sure(ws, firstTxn)
    return s ? [s.id] : []
  })
  const [mode, setMode] = useState('match')
  const [cq, setCq] = useState('')

  const txnById = (id) => ws.txns.find((t) => t.id === id)
  const visible = visibleTxns(ws, filters)
  const selTxn = sel ? txnById(sel) : null
  const nSure = autoList(ws).length

  function selectTxn(id) {
    const t = txnById(id)
    if (!t) return
    setSel(id)
    setMode('match')
    setCq('')
    const s = t.status === 'unreconciled' ? sure(ws, t) : null
    setSelV(s ? [s.id] : [])
  }

  function finish(batch, msg) {
    ws.undo.push(batch)
    logAct(account, msg)
    account.status = unrecCount(ws) === 0 ? 'reconciled' : 'progress'
    if (account.status === 'reconciled') account.lastRecon = 0
    const next = visibleTxns(ws, filters).find((t) => t.status === 'unreconciled')
    if (next) selectTxn(next.id)
    else {
      setSel(null)
      setSelV([])
    }
    refresh()
    toast(msg, { onUndo: doUndo })
  }

  function doReconcile() {
    const t = selTxn
    if (!t) return
    const vs = ws.vouchers.filter((v) => selV.includes(v.id))
    if (!vs.length || r2(t.amt - selTotal(ws, selV)) !== 0) return
    vs.forEach((v) => {
      v.cleared = t.date
      v.txn = t.id
    })
    t.status = 'reconciled'
    t.vouchers = vs.map((v) => v.id)
    finish([t.id], `Reconciled ${vs.length} ${vs.length > 1 ? 'entries' : 'entry'} to ${dShort(t.date)} transaction`)
  }

  function doCreate(kind, party) {
    const t = selTxn
    if (!t) return
    const v = {
      id: (kind === 'record' ? 'PE-' : 'JV-') + (2400 + ws.vid++),
      type: kind === 'record' ? 'Payment Entry' : 'Journal Entry',
      party,
      amt: t.amt,
      date: t.date,
      ref: t.ref,
      cleared: t.date,
      txn: t.id,
      created: true,
    }
    ws.vouchers.push(v)
    account.ledger = r2(account.ledger + t.amt)
    t.status = 'reconciled'
    t.vouchers = [v.id]
    finish([t.id], kind === 'record' ? 'Payment recorded and reconciled' : 'Transfer recorded and reconciled')
  }

  function doAuto() {
    const ids = []
    autoList(ws).forEach((t) => {
      const v = sure(ws, t)
      if (!v) return
      v.cleared = t.date
      v.txn = t.id
      t.status = 'reconciled'
      t.vouchers = [v.id]
      ids.push(t.id)
    })
    if (!ids.length) {
      toast('No sure matches found')
      return
    }
    finish(ids, `Auto-matched ${ids.length} transactions`)
  }

  function doUndo() {
    const batch = ws.undo.pop()
    if (!batch) return
    batch.forEach((id) => unreconcileTxn(ws, account, ws.txns.find((t) => t.id === id)))
    account.status = 'progress'
    logAct(account, 'Undid last reconciliation')
    selectTxn(batch[0])
    refresh()
    toast('Undone')
  }

  function doUnrec(id) {
    unreconcileTxn(ws, account, txnById(id))
    account.status = 'progress'
    logAct(account, 'Undid reconciliation of one transaction')
    selectTxn(id)
    refresh()
    toast('Reconciliation undone')
  }

  const toggleV = (id) => setSelV((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]))

  // Arrow keys move through the list (unless typing in a field)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
      const tag = document.activeElement && document.activeElement.tagName
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return
      if (!visible.length) return
      const idx = visible.findIndex((t) => t.id === sel)
      const next = e.key === 'ArrowDown' ? Math.min(visible.length - 1, idx + 1) : Math.max(0, idx - 1)
      e.preventDefault()
      selectTxn(visible[next].id)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  })

  return (
    <div className="grid lg:grid-cols-[5fr_6fr] bg-white border border-neutral-200 rounded-[5px] max-lg:divide-y lg:divide-x divide-neutral-200 items-start">
      <section aria-label="Bank transactions" className="min-w-0">
        <div className="p-2.5 flex flex-wrap gap-2 border-b border-neutral-100">
          <Input
            type="search"
            fluid={false}
            className="flex-1 min-w-[140px]"
            value={filters.q}
            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
            placeholder="Search description, reference or amount"
            aria-label="Search bank transactions"
          />
          <Select fluid={false} value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })} aria-label="Debit or credit">
            <option value="all">Debit and credit</option>
            <option value="debit">Debit only</option>
            <option value="credit">Credit only</option>
          </Select>
          <Select fluid={false} value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} aria-label="Status">
            <option value="unrec">Unreconciled</option>
            <option value="rec">Reconciled</option>
            <option value="all">All</option>
          </Select>
        </div>
        <div className="px-2.5 py-2 flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100">
          <span className="text-xs text-neutral-500">
            {visible.length} {visible.length === 1 ? 'transaction' : 'transactions'}
          </span>
          <span className="flex gap-2">
            <Button size="sm" disabled={nSure === 0} onClick={doAuto}>
              Auto-match {nSure} sure
            </Button>
            <Button size="sm" disabled={!ws.undo.length} onClick={doUndo}>
              Undo last
            </Button>
          </span>
        </div>
        <TxnList txns={visible} ws={ws} selId={sel} onSelect={selectTxn} />
      </section>

      <MatchPanel
        txn={selTxn}
        ws={ws}
        account={account}
        accounts={accounts}
        allDone={unrecCount(ws) === 0}
        mode={mode}
        onMode={setMode}
        query={cq}
        onQuery={setCq}
        selected={selV}
        onToggle={toggleV}
        onReconcile={doReconcile}
        onCreate={doCreate}
        onUnrec={doUnrec}
        onViewBrs={onViewBrs}
      />
    </div>
  )
}
