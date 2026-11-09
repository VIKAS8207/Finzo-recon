import { useState } from 'react'
import Button from '../Button.jsx'
import { Field, Input } from '../Field.jsx'
import { money } from '../../utils/format.js'

export default function TransferForm({ txn, account, accounts, onSubmit }) {
  const [dest, setDest] = useState('')
  const options = accounts
    .filter((x) => x.entity === account.entity && x.id !== account.id)
    .slice(0, 25)
    .map((x) => `${x.bank} - ${x.name}`)

  return (
    <div className="flex flex-col gap-3">
      <Field label={txn.amt > 0 ? 'Transferred from' : 'Transferred to'}>
        <Input
          list="transfer-accounts"
          value={dest}
          onChange={(e) => setDest(e.target.value)}
          placeholder={`Search accounts of ${account.entity}`}
        />
      </Field>
      <datalist id="transfer-accounts">
        {options.map((o) => (
          <option key={o} value={o} />
        ))}
      </datalist>
      <Field label="Amount">
        <Input value={money(txn.amt)} readOnly />
      </Field>
      <p className="text-xs text-neutral-500">Creates a Journal Entry between the two bank accounts and reconciles this side.</p>
      <Button variant="primary" className="self-start" onClick={() => onSubmit(dest.trim() || 'Other bank account')}>
        Record transfer
      </Button>
    </div>
  )
}
