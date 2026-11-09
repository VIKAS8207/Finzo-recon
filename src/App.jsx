import { useState } from 'react'
import Login from './Login.jsx'
import AppShell from './AppShell.jsx'

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false)

  return loggedIn ? (
    <AppShell onLogout={() => setLoggedIn(false)} />
  ) : (
    <Login onLogin={() => setLoggedIn(true)} />
  )
}
