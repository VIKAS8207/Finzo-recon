import { useEffect, useRef, useState } from 'react'
import Button from '../components/Button.jsx'
import EmptyState from '../components/EmptyState.jsx'
import LinkButton from '../components/LinkButton.jsx'
import PageHeader from '../components/PageHeader.jsx'
import Pager from '../components/Pager.jsx'
import SearchInput from '../components/SearchInput.jsx'
import Segmented from '../components/Segmented.jsx'
import StatRow from '../components/StatRow.jsx'
import StatTile from '../components/StatTile.jsx'
import { Select } from '../components/Field.jsx'
import AccountCard from '../components/accounts/AccountCard.jsx'
import AccountsTable from '../components/accounts/AccountsTable.jsx'
import { useBank } from '../context/BankContext.jsx'
import { BANKS, ENTITIES, PAGE_SIZE, STATUS, STATUS_KEYS } from '../data/constants.js'
import { cr } from '../utils/format.js'

const BANK_NAMES = BANKS.map((b) => b[0]).sort()
const ENTITY_NAMES = [...ENTITIES].sort()
const RANK = { discrepancy: 0, notstarted: 1, progress: 2, reconciled: 3 }

function loadView() {
  try {
    const v = localStorage.getItem('bank-view')
    if (v === 'table' || v === 'cards') return v
  } catch {
    /* storage blocked: fall back to cards */
  }
  return 'cards'
}

function filterAccounts(accounts, f) {
  const q = f.q.trim().toLowerCase()
  const out = accounts.filter((a) => {
    if (f.bank && a.bank !== f.bank) return false
    if (f.entity && a.entity !== f.entity) return false
    if (f.status && a.status !== f.status) return false
    return !q || `${a.bank} ${a.name} ${a.entity} ${a.last4} ${a.type}`.toLowerCase().includes(q)
  })
  out.sort((x, y) => {
    switch (f.sort) {
      case 'bal-asc':
        return x.balance - y.balance
      case 'name':
        return x.name.localeCompare(y.name)
      case 'bank':
        return x.bank.localeCompare(y.bank) || x.name.localeCompare(y.name)
      case 'attn':
        return RANK[x.status] - RANK[y.status] || y.balance - x.balance
      default:
        return y.balance - x.balance
    }
  })
  return out
}

export default function AccountsPage({ go, openAccount, initialStatus = '', initialQuery = '' }) {
  const { accounts } = useBank()
  const [f, setF] = useState({ q: initialQuery, bank: '', entity: '', status: initialStatus, sort: 'bal-desc' })
  const [view, setView] = useState(loadView)
  const [page, setPage] = useState(1)
  const searchRef = useRef(null)

  const set = (patch) => {
    setF((cur) => ({ ...cur, ...patch }))
    setPage(1)
  }
  const changeView = (v) => {
    setView(v)
    try {
      localStorage.setItem('bank-view', v)
    } catch {
      /* ignore */
    }
  }

  // "/" focuses the search box
  useEffect(() => {
    const onKey = (e) => {
      const tag = document.activeElement && document.activeElement.tagName
      if (e.key === '/' && tag !== 'INPUT' && tag !== 'SELECT' && tag !== 'TEXTAREA') {
        e.preventDefault()
        if (searchRef.current) searchRef.current.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const counts = { reconciled: 0, progress: 0, notstarted: 0, discrepancy: 0 }
  let total = 0
  accounts.forEach((a) => {
    counts[a.status]++
    total += a.balance
  })
  const pct = Math.round((counts.reconciled / accounts.length) * 100)

  const list = filterAccounts(accounts, f)
  const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE))
  const cur = Math.min(page, pages)
  const start = (cur - 1) * PAGE_SIZE
  const slice = list.slice(start, start + PAGE_SIZE)
  const listTotal = list.reduce((s, a) => s + a.balance, 0)
  const filtered = f.q || f.bank || f.entity || f.status

  return (
    <>
      <PageHeader
        crumb="Banking / Accounts"
        title="Bank accounts"
        subtitle="Balances synced from bank feeds"
        actions={
          <Button variant="primary" onClick={() => go('add')}>
            Add account
          </Button>
        }
      />

      <StatRow>
        <StatTile label={`Total balance, ${accounts.length} accounts`} value={cr(total)} sub={`${BANK_NAMES.length} banks, ${ENTITY_NAMES.length} entities`} />
        {STATUS_KEYS.map((k) => (
          <StatTile
            key={k}
            label={STATUS[k]}
            value={counts[k]}
            sub={k === 'reconciled' ? `${pct}% of accounts` : 'accounts'}
            progress={k === 'reconciled' ? pct : undefined}
            selected={f.status === k}
            onClick={() => set({ status: f.status === k ? '' : k })}
          />
        ))}
      </StatRow>

      <section className="flex flex-wrap gap-2.5 items-center" aria-label="Search and filters">
        <SearchInput
          inputRef={searchRef}
          hint="/"
          className="flex-1 min-w-[260px]"
          value={f.q}
          onChange={(e) => set({ q: e.target.value })}
          placeholder="Search by bank, account name, last 4 digits or entity"
          aria-label="Search accounts"
        />
        <Select fluid={false} value={f.bank} onChange={(e) => set({ bank: e.target.value })} aria-label="Filter by bank">
          <option value="">All banks</option>
          {BANK_NAMES.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </Select>
        <Select fluid={false} value={f.entity} onChange={(e) => set({ entity: e.target.value })} aria-label="Filter by entity">
          <option value="">All entities</option>
          {ENTITY_NAMES.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </Select>
        <Select fluid={false} value={f.sort} onChange={(e) => set({ sort: e.target.value })} aria-label="Sort accounts">
          <option value="bal-desc">Balance: high to low</option>
          <option value="bal-asc">Balance: low to high</option>
          <option value="name">Account name</option>
          <option value="bank">Bank</option>
          <option value="attn">Needs attention first</option>
        </Select>
        <Segmented
          label="View"
          value={view}
          onChange={changeView}
          options={[
            { value: 'cards', label: 'Cards' },
            { value: 'table', label: 'Table' },
          ]}
        />
      </section>

      <div className="flex items-center justify-between gap-2 flex-wrap text-sm text-neutral-500 min-h-5">
        <span>
          {list.length > 0 && (
            <>
              Showing <b>{start + 1}-{start + slice.length}</b> of <b>{list.length}</b> accounts, combined{' '}
              <span className="tabular-nums">{cr(listTotal)}</span>
            </>
          )}
        </span>
        {filtered && (
          <LinkButton onClick={() => { setF({ q: '', bank: '', entity: '', status: '', sort: f.sort }); setPage(1) }}>
            Clear filters
          </LinkButton>
        )}
      </div>

      {!list.length ? (
        <EmptyState>
          <b className="text-neutral-800">No accounts match these filters.</b>
          Try a different bank name or the last 4 digits of the account.
        </EmptyState>
      ) : view === 'cards' ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3">
          {slice.map((a) => (
            <AccountCard key={a.id} account={a} onOpen={openAccount} />
          ))}
        </div>
      ) : (
        <AccountsTable accounts={slice} onOpen={openAccount} />
      )}

      <Pager
        page={cur}
        pages={pages}
        onChange={(p) => {
          setPage(p)
          window.scrollTo(0, 0)
        }}
      />
    </>
  )
}
