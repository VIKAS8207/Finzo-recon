import { createContext, useCallback, useContext, useState } from 'react'
import { generateAccounts, initialLog, initialRules } from '../data/seed.js'
import { BANKS, ENTITIES } from '../data/constants.js'
import { acctLabel } from '../utils/format.js'
import { parseCSV } from '../utils/csv.js'

/*
 * Holds the dummy bank data. Accounts are mutated in place (like the original prototype)
 * and `refresh()` re-renders everything that reads them.
 */
const BankContext = createContext(null)

export const useBank = () => useContext(BankContext)

export function BankProvider({ children }) {
  const [accounts] = useState(generateAccounts)

  const [log, setLog] = useState(() => initialLog(accounts))
  const [rules, setRules] = useState(initialRules)
  const [, setTick] = useState(0)
  const refresh = useCallback(() => setTick((t) => t + 1), [])

  const logAct = useCallback((acct, action, user = 'You') => {
    setLog((l) => [
      { t: new Date(), user, acct: typeof acct === 'string' ? acct : acctLabel(acct), action },
      ...l,
    ])
  }, [])

  const addAccount = (o) => {
    const b = BANKS.find((x) => x[0] === o.bank)
    const acc = {
      id: accounts.length,
      bank: o.bank,
      code: b ? b[1] : o.bank.slice(0, 2).toUpperCase(),
      type: o.type,
      name: o.name,
      entity: o.entity,
      last4: o.last4,
      balance: o.balance,
      ledger: o.balance,
      status: 'notstarted',
      synced: 1,
      lastRecon: 0,
      ws: null,
    }
    accounts.push(acc)
    refresh()
    return acc
  }

  const bulkAddAccounts = (text) => {
    const rows = parseCSV(text)
    const heads = rows[0].map((h) => h.trim().toLowerCase())
    const ix = (k) => heads.indexOf(k)
    let added = 0
    let skipped = 0
    rows.slice(1).forEach((r) => {
      const bank = (r[ix('bank')] || '').trim()
      const last4 = (r[ix('last4')] || '').trim()
      const balance = parseFloat(r[ix('balance')])
      const name = (r[ix('name')] || '').trim()
      if (!BANKS.some((b) => b[0] === bank) || !/^\d{4}$/.test(last4) || isNaN(balance) || !name) {
        skipped++
        return
      }
      addAccount({
        bank,
        name,
        entity: (r[ix('entity')] || ENTITIES[0]).trim(),
        type: (r[ix('type')] || 'Current').trim(),
        last4,
        balance,
      })
      added++
    })
    return { added, skipped }
  }

  const toggleRule = (i) => setRules((rs) => rs.map((r, k) => (k === i ? { ...r, on: !r.on } : r)))
  const addRule = (rule) => setRules((rs) => [...rs, { ...rule, on: true, hits: 0 }])

  return (
    <BankContext.Provider
      value={{ accounts, log, rules, refresh, logAct, addAccount, bulkAddAccounts, toggleRule, addRule }}
    >
      {children}
    </BankContext.Provider>
  )
}
