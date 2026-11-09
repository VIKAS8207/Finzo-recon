import { rng } from '../utils/random.js'
import { daysAgo, r2 } from '../utils/format.js'
import { CUSTOMERS, VENDORS } from './constants.js'

/*
 * Reconciliation workspace data + matching logic (pure functions, no React).
 * Invariant: bank balance = books balance - uncleared ledger entries + unreconciled bank transactions
 */

export function genWs(a) {
  if (a.ws) return a.ws
  const rr = rng(a.id * 7919 + 13)
  const ri = (lo, hi) => lo + Math.floor(rr() * (hi - lo + 1))
  const pick = (arr) => arr[Math.floor(rr() * arr.length)]
  const ws = { txns: [], vouchers: [], tid: 1, vid: 1, undo: [] }
  const refN = (p) => p + String(ri(10000000, 99999999))

  function voucher(prefix, party, amt, date, ref, cleared, txn) {
    const v = {
      id: prefix + '-' + (2400 + ws.vid++),
      type: prefix === 'JV' ? 'Journal Entry' : 'Payment Entry',
      party,
      amt,
      date,
      ref,
      cleared,
      txn,
      created: false,
    }
    ws.vouchers.push(v)
    return v
  }

  function pair(done, badClear) {
    const out = rr() < 0.62
    const party = pick(out ? VENDORS : CUSTOMERS)
    const amt = r2((rr() * 180000 + 4000) * (out ? -1 : 1))
    const day = ri(1, 26)
    const ref = refN(out ? 'NEFT' : 'RTGS')
    const tdate = daysAgo(day)
    const vdate = daysAgo(day + ri(0, 4))
    const t = {
      id: ws.tid++,
      date: tdate,
      desc: (out ? 'NEFT DR ' : 'NEFT CR ') + party.toUpperCase(),
      ref,
      amt,
      status: done ? 'reconciled' : 'unreconciled',
      vouchers: [],
    }
    const v = voucher(
      'PE',
      party,
      amt,
      vdate,
      rr() < 0.8 ? ref : '',
      done ? (badClear ? daysAgo(day + 7) : tdate) : null,
      done ? t.id : null,
    )
    if (done) t.vouchers = [v.id]
    ws.txns.push(t)
  }

  const hist = { reconciled: ri(8, 12), progress: ri(3, 7), discrepancy: ri(1, 4), notstarted: 0 }[a.status]
  const bad = rr() < 0.18 ? ri(0, Math.max(0, hist - 1)) : -1
  for (let h = 0; h < hist; h++) pair(true, h === bad)

  const P = a.status === 'reconciled' ? 0 : ri(4, 7)
  for (let q = 0; q < P; q++) pair(false)

  const pairAmts = ws.txns.filter((t) => t.status === 'unreconciled').map((t) => t.amt)
  const m = a.status === 'reconciled' ? ri(0, 2) : ri(2, 4)
  let xu = 0
  for (let k = 0; k < m; k++) {
    let amt
    if (pairAmts.length && rr() < 0.6) {
      amt = r2(pairAmts[ri(0, pairAmts.length - 1)] * (1 + (rr() < 0.5 ? -1 : 1) * (0.002 + rr() * 0.02)))
    } else {
      amt = r2((rr() * 120000 + 2000) * (rr() < 0.6 ? -1 : 1))
    }
    voucher(
      rr() < 0.7 ? 'PE' : 'JV',
      pick(amt < 0 ? VENDORS : CUSTOMERS),
      amt,
      daysAgo(ri(0, 6)),
      rr() < 0.5 ? 'CHQ' + ri(100000, 999999) : '',
      null,
      null,
    )
    xu += amt
  }
  xu = r2(xu)

  if (a.status === 'reconciled') {
    a.ledger = r2(a.balance + xu)
  } else {
    let left = r2(a.balance - a.ledger + xu)
    const nb = Math.abs(left) < 1 ? 0 : ri(2, 3)
    for (let j = 0; j < nb; j++) {
      const last = j === nb - 1
      let amt2, desc
      if (last) {
        amt2 = left
        desc = left > 0 ? 'NEFT CR REMITTER NOT IDENTIFIED' : 'STANDING INSTRUCTION DEBIT'
      } else if (rr() < 0.5) {
        amt2 = -r2(150 + rr() * 2350)
        desc = j === 0 ? 'BANK CHARGES NEFT/RTGS' : 'GST ON BANK CHARGES'
      } else {
        amt2 = r2(200 + rr() * 4800)
        desc = 'INTEREST CREDIT'
      }
      left = r2(left - amt2)
      if (Math.abs(amt2) >= 0.005) {
        ws.txns.push({
          id: ws.tid++,
          date: daysAgo(ri(0, 20)),
          desc,
          ref: refN('UTR'),
          amt: amt2,
          status: 'unreconciled',
          vouchers: [],
        })
      }
    }
  }

  ws.txns.sort((x, y) => y.date - x.date || y.id - x.id)
  a.ws = ws
  return ws
}

/* ---- sums and counts ---- */
export const sumB = (ws) => r2(ws.txns.reduce((s, t) => s + (t.status === 'unreconciled' ? t.amt : 0), 0))
export const sumU = (ws) => r2(ws.vouchers.reduce((s, v) => s + (v.cleared ? 0 : v.amt), 0))
export const unrecCount = (ws) => ws.txns.filter((t) => t.status === 'unreconciled').length
export const selTotal = (ws, selIds) =>
  r2(ws.vouchers.reduce((s, v) => s + (selIds.includes(v.id) ? v.amt : 0), 0))

/* ---- matching ---- */
const dayDiff = (a, b) => Math.abs(Math.round((a - b) / 864e5))

export function sig(t, v) {
  const da = Math.abs(v.amt - t.amt)
  const amt = da < 0.005 ? 2 : da <= Math.abs(t.amt) * 0.03 ? 1 : 0
  const n = dayDiff(t.date, v.date)
  const dt = n <= 4 ? 2 : n <= 10 ? 1 : 0
  const rf = v.ref && v.ref === t.ref ? 2 : !v.ref ? 1 : 0
  return { amt, dt, rf, score: amt * 4 + dt * 2 + rf }
}

export function candidates(ws, t, q) {
  let list = ws.vouchers.filter((v) => !v.cleared && v.amt < 0 === t.amt < 0)
  if (q) {
    const needle = q.toLowerCase()
    list = list.filter((v) => `${v.party} ${v.id} ${v.ref} ${v.amt}`.toLowerCase().includes(needle))
  }
  return list
    .map((v) => ({ v, s: sig(t, v) }))
    .sort((x, y) => y.s.score - x.s.score)
    .slice(0, 8)
}

// A "sure" match: exact amount, date and reference, and no other exact-amount rival.
export function sure(ws, t) {
  const c = candidates(ws, t, '')
  if (!c.length) return null
  const best = c[0]
  if (
    best.s.amt === 2 &&
    best.s.dt === 2 &&
    best.s.rf === 2 &&
    !c.slice(1).some((x) => x.s.amt === 2)
  ) {
    return best.v
  }
  return null
}

export const autoList = (ws) => ws.txns.filter((t) => t.status === 'unreconciled' && sure(ws, t))

export function matchTag(ws, t) {
  if (t.status === 'reconciled') return 'reconciled'
  if (sure(ws, t)) return 'found'
  const c = candidates(ws, t, '')
  if (c.length && c[0].s.amt >= 1) return 'possible'
  return 'none'
}

export function visibleTxns(ws, { q, type, status }) {
  const needle = q.trim().toLowerCase()
  return ws.txns.filter((t) => {
    if (status === 'unrec' && t.status !== 'unreconciled') return false
    if (status === 'rec' && t.status !== 'reconciled') return false
    if (type === 'debit' && t.amt >= 0) return false
    if (type === 'credit' && t.amt < 0) return false
    return !needle || `${t.desc} ${t.ref} ${Math.abs(t.amt)}`.toLowerCase().includes(needle)
  })
}

export function unreconcileTxn(ws, a, t) {
  ws.vouchers.slice().forEach((v) => {
    if (v.txn !== t.id) return
    if (v.created) {
      ws.vouchers.splice(ws.vouchers.indexOf(v), 1)
      a.ledger = r2(a.ledger - v.amt)
    } else {
      v.cleared = null
      v.txn = null
    }
  })
  t.status = 'unreconciled'
  t.vouchers = []
}
