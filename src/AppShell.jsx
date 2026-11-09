import { useCallback, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import { BankProvider } from './context/BankContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import AccountsPage from './pages/AccountsPage.jsx'
import WorkspacePage from './pages/WorkspacePage.jsx'
import AddAccountPage from './pages/AddAccountPage.jsx'
import ImportPage from './pages/ImportPage.jsx'
import RulesPage from './pages/RulesPage.jsx'
import HistoryPage from './pages/HistoryPage.jsx'
import ReportsPage from './pages/ReportsPage.jsx'
import PermissionsPage from './pages/PermissionsPage.jsx'

const LINKS = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'accounts', label: 'Accounts' },
  { key: 'import', label: 'Statement import' },
  { key: 'rules', label: 'Rules' },
  { key: 'history', label: 'History' },
  { key: 'reports', label: 'Reports' },
  { key: 'settings', label: 'Permissions' },
]

// Pages that belong under the "Accounts" nav item
const UNDER_ACCOUNTS = ['workspace', 'add']

/** Logged-in layout: lavender background, top nav and the current page. */
export default function AppShell({ onLogout }) {
  const [nav, setNav] = useState({ page: 'dashboard', opts: {}, n: 0 })

  // go('accounts', { status: 'discrepancy' }) etc. `n` remounts the page so its filters reset.
  const go = useCallback((page, opts = {}) => {
    setNav((s) => ({ page, opts, n: s.n + 1 }))
    window.scrollTo(0, 0)
  }, [])
  const openAccount = useCallback((id) => go('workspace', { id }), [go])

  const { page, opts, n } = nav
  const pageProps = { go, openAccount }

  let content
  switch (page) {
    case 'accounts':
      content = <AccountsPage key={n} {...pageProps} initialStatus={opts.status} initialQuery={opts.q} />
      break
    case 'workspace':
      content = <WorkspacePage key={n} accountId={opts.id} onBack={() => go('accounts')} />
      break
    case 'add':
      content = <AddAccountPage {...pageProps} />
      break
    case 'import':
      content = <ImportPage />
      break
    case 'rules':
      content = <RulesPage />
      break
    case 'history':
      content = <HistoryPage />
      break
    case 'reports':
      content = <ReportsPage {...pageProps} />
      break
    case 'settings':
      content = <PermissionsPage />
      break
    default:
      content = <DashboardPage {...pageProps} />
  }

  return (
    <BankProvider>
      <ToastProvider>
        <div
          className="min-h-screen paper-bg"
        >
          <Navbar
            links={LINKS}
            active={UNDER_ACCOUNTS.includes(page) ? 'accounts' : page}
            onNavigate={(key) => go(key)}
            onLogout={onLogout}
          />
          <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-24 pb-6 space-y-5">{content}</main>
        </div>
      </ToastProvider>
    </BankProvider>
  )
}
