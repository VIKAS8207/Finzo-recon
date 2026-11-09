import DataTable from '../components/DataTable.jsx'
import PageHeader from '../components/PageHeader.jsx'

const ROLES = ['Viewer', 'Preparer', 'Approver', 'Admin']

const PERMISSIONS = [
  ['View accounts and balances', [1, 1, 1, 1]],
  ['Reconcile transactions', [0, 1, 1, 1]],
  ['Record payments and transfers', [0, 1, 1, 1]],
  ['Import bank statements', [0, 1, 1, 1]],
  ['Undo a reconciliation', [0, 0, 1, 1]],
  ['Manage rules', [0, 0, 1, 1]],
  ['Add or edit accounts', [0, 0, 0, 1]],
  ['Manage permissions', [0, 0, 0, 1]],
]

export default function PermissionsPage() {
  return (
    <>
      <PageHeader crumb="Settings" title="Permissions" />
      <p className="text-xs text-neutral-600">
        Who can do what in the banking module. Access to each bank account also needs the Bank Account permission on the user.
      </p>
      <DataTable
        heads={['Action', ...ROLES]}
        right={[1, 2, 3, 4]}
        rows={PERMISSIONS.map(([label, flags]) => [
          label,
          ...flags.map((v, i) =>
            v ? (
              <span key={i} className="text-emerald-700 font-semibold" aria-label="Allowed">
                ✓
              </span>
            ) : (
              <span key={i} className="text-neutral-400" aria-label="Not allowed">
                –
              </span>
            ),
          ),
        ])}
      />
    </>
  )
}
