import { useState } from 'react'
import Button from '../components/Button.jsx'
import Panel, { PanelGroup } from '../components/Panel.jsx'
import DropZone from '../components/DropZone.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { Field, Input, Select } from '../components/Field.jsx'
import { useBank } from '../context/BankContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { BANKS, ENTITIES, TYPES } from '../data/constants.js'
import { readTextFile } from '../utils/csv.js'

export default function AddAccountPage({ go }) {
  const { addAccount, bulkAddAccounts, logAct } = useBank()
  const toast = useToast()
  const [form, setForm] = useState({
    bank: BANKS[0][0],
    name: '',
    entity: ENTITIES[0],
    type: TYPES[0],
    last4: '',
    balance: '',
    feed: 'Bank feed',
  })
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  function save() {
    const name = form.name.trim()
    const balance = parseFloat((form.balance || '0').replace(/,/g, ''))
    if (!name) return toast('Enter an account name')
    if (!/^\d{4}$/.test(form.last4.trim())) return toast('Last 4 digits must be 4 numbers')
    if (isNaN(balance)) return toast('Opening balance must be a number')
    const acc = addAccount({ bank: form.bank, name, entity: form.entity, type: form.type, last4: form.last4.trim(), balance })
    logAct(acc, 'Added account')
    go('accounts', { q: name })
    toast('Account added')
  }

  async function bulk(file) {
    const { added, skipped } = bulkAddAccounts(await readTextFile(file))
    toast(`${added} accounts added${skipped ? `, ${skipped} rows skipped` : ''}`)
  }

  return (
    <>
      <PageHeader
        crumb="Accounts / New"
        title="Add account"
        actions={<Button onClick={() => go('accounts')}>Cancel</Button>}
      />

      <PanelGroup>
      <Panel bare title="Account details">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-3">
          <Field label="Bank">
            <Select value={form.bank} onChange={set('bank')}>
              {BANKS.map((b) => (
                <option key={b[0]}>{b[0]}</option>
              ))}
            </Select>
          </Field>
          <Field label="Account name">
            <Input value={form.name} onChange={set('name')} placeholder="Vendor payments 10" />
          </Field>
          <Field label="Entity">
            <Select value={form.entity} onChange={set('entity')}>
              {ENTITIES.map((e) => (
                <option key={e}>{e}</option>
              ))}
            </Select>
          </Field>
          <Field label="Account type">
            <Select value={form.type} onChange={set('type')}>
              {TYPES.map((e) => (
                <option key={e}>{e}</option>
              ))}
            </Select>
          </Field>
          <Field label="Last 4 digits">
            <Input value={form.last4} onChange={set('last4')} inputMode="numeric" maxLength={4} placeholder="4821" />
          </Field>
          <Field label="Opening balance (INR)">
            <Input value={form.balance} onChange={set('balance')} inputMode="decimal" placeholder="0.00" />
          </Field>
          <Field label="Balance source">
            <Select value={form.feed} onChange={set('feed')}>
              <option>Bank feed</option>
              <option>Manual statement upload</option>
            </Select>
          </Field>
        </div>
        <div className="mt-4">
          <Button variant="primary" onClick={save}>
            Add account
          </Button>
        </div>
      </Panel>

      <Panel bare title="Add many accounts from a CSV">
        <p className="text-xs text-neutral-500 mb-3">
          Columns in the first row: bank, name, entity, type, last4, balance. Bank must match a bank name already in the list.
        </p>
        <DropZone title="Choose a CSV file" accept=".csv,text/csv" onFile={bulk} />
      </Panel>
    </PanelGroup>
    </>
  )
}
