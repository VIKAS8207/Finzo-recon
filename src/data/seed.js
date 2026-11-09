import { rng } from '../utils/random.js'
import { acctLabel, minsAgo } from '../utils/format.js'
import { BANKS, ENTITIES, PURPOSE, TYPES } from './constants.js'

export function generateAccounts() {
  const r = rng(20261109)
  const accounts = []
  for (let i = 0; i < 520; i++) {
    const b = BANKS[Math.floor(r() * BANKS.length)]
    const type = TYPES[Math.floor(r() * TYPES.length)]
    let bal = Math.round((r() * r() * 9e7 + 2500) * 100) / 100
    if (type === 'Overdraft') bal = -Math.round((r() * 4e6 + 1e4) * 100) / 100
    const p = r()
    const status = p < 0.46 ? 'reconciled' : p < 0.66 ? 'progress' : p < 0.86 ? 'notstarted' : 'discrepancy'
    let diff = 0
    if (status !== 'reconciled') diff = (Math.round((r() * 90000 + 120) * 100) / 100) * (r() < 0.5 ? -1 : 1)
    accounts.push({
      id: i,
      bank: b[0],
      code: b[1],
      type,
      name: PURPOSE[Math.floor(r() * PURPOSE.length)] + ' ' + (1 + Math.floor(r() * 9)),
      entity: ENTITIES[Math.floor(r() * ENTITIES.length)],
      last4: String(1000 + Math.floor(r() * 9000)),
      balance: bal,
      ledger: Math.round((bal - diff) * 100) / 100,
      status,
      synced: 1 + Math.floor(r() * 180),
      lastRecon: Math.floor(r() * 40) + 1,
      ws: null,
    })
  }
  return accounts
}

export function initialLog(accounts) {
  return [
    { t: minsAgo(22), user: 'Anita Rao', acct: acctLabel(accounts[3]), action: 'Reconciled 6 transactions' },
    { t: minsAgo(55), user: 'Rule engine', acct: acctLabel(accounts[17]), action: 'Auto-classified 4 bank charges' },
    { t: minsAgo(140), user: 'Rahul Menon', acct: acctLabel(accounts[41]), action: 'Imported statement, 212 rows' },
    { t: minsAgo(260), user: 'Anita Rao', acct: acctLabel(accounts[8]), action: 'Recorded payment for bank charges' },
    { t: minsAgo(1300), user: 'Rahul Menon', acct: acctLabel(accounts[63]), action: 'Marked account as reconciled' },
    { t: minsAgo(1500), user: 'Rule engine', acct: acctLabel(accounts[90]), action: 'Auto-classified 2 interest credits' },
    { t: minsAgo(2900), user: 'Priya Nair', acct: acctLabel(accounts[120]), action: 'Undid reconciliation of one transaction' },
  ]
}

export const initialRules = [
  { name: 'Bank charges', text: 'BANK CHARGES', acct: 'Bank charges', mode: 'Auto-apply', on: true, hits: 412 },
  { name: 'GST on charges', text: 'GST ON', acct: 'GST on bank charges', mode: 'Auto-apply', on: true, hits: 388 },
  { name: 'Interest credit', text: 'INTEREST CREDIT', acct: 'Interest income', mode: 'Auto-apply', on: true, hits: 301 },
  { name: 'Salary run', text: 'SALARY', acct: 'Salary', mode: 'Ask first', on: true, hits: 96 },
  { name: 'Card settlement', text: 'MERCHANT SETTLEMENT', acct: 'Customer receipt', mode: 'Ask first', on: false, hits: 54 },
]
