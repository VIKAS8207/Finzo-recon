import { useState } from 'react'
import Button from '../Button.jsx'
import { Field, Input, Select } from '../Field.jsx'
import { money } from '../../utils/format.js'

const IN_ACCOUNTS = ['Customer receipt', 'Interest income', 'Other income']
const OUT_ACCOUNTS = ['Vendor payment', 'Bank charges', 'GST on bank charges', 'Salary', 'Other expense']

export default function RecordPaymentForm({ txn, onSubmit }) {
  const dep = txn.amt > 0
  const accts = dep ? IN_ACCOUNTS : OUT_ACCOUNTS
  const [party, setParty] = useState('')
  const [acct, setAcct] = useState(accts[0])

  return (
    <div className="flex flex-col gap-3">
      <Field label="Party or description">
        <Input value={party} onChange={(e) => setParty(e.target.value)} placeholder={dep ? 'Customer or source' : 'Vendor or payee'} />
      </Field>
      <Field label="Account">
        <Select value={acct} onChange={(e) => setAcct(e.target.value)}>
          {accts.map((x) => (
            <option key={x}>{x}</option>
          ))}
        </Select>
      </Field>
      <Field label="Amount">
        <Input value={money(txn.amt)} readOnly />
      </Field>
      <p className="text-xs text-neutral-500">Creates a Payment Entry for this amount and reconciles it to the transaction.</p>
      <Button variant="primary" className="self-start" onClick={() => onSubmit(party.trim() || acct)}>
        Record and reconcile
      </Button>
    </div>
  )
}
