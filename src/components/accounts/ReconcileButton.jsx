import Button from '../Button.jsx'

export default function ReconcileButton({ account, onOpen }) {
  const label = account.status === 'reconciled' ? 'Review' : account.status === 'progress' ? 'Continue' : 'Reconcile'
  return (
    <Button size="sm" variant={account.status === 'reconciled' ? 'secondary' : 'primary'} onClick={() => onOpen(account.id)}>
      {label}
    </Button>
  )
}
