import Button from '../Button.jsx'
import { monthRange } from '../../utils/format.js'

function Chip({ label, children }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-[5px] px-3 py-1 text-sm flex flex-col min-w-0">
      <small className="text-[11px] text-neutral-500">{label}</small>
      {children}
    </div>
  )
}

export default function WorkspaceHeader({ account: a, onBack }) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="sm" onClick={onBack}>
        ← All accounts
      </Button>
      <div className="flex-1 min-w-[220px]">
        <p className="text-xs uppercase tracking-wide text-neutral-500">Bank reconciliation</p>
        <h1 className="text-2xl font-semibold text-neutral-900">{a.name}</h1>
        <p className="text-xs text-neutral-500">
          {a.bank} · {a.type} · •••• {a.last4}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Chip label="Company">{a.entity}</Chip>
        <Chip label="Bank account">
          {a.bank} •••• {a.last4}
        </Chip>
        <Chip label="Period">{monthRange()}</Chip>
      </div>
    </div>
  )
}
