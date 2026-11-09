import { useEffect, useState } from 'react'
import Logo from './Logo.jsx'

// Light film grain (SVG noise) laid over the white gradient once the page is scrolled
const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.35'/></svg>\")"

const iconBtn =
  'w-9 h-9 flex items-center justify-center bg-white border border-neutral-200 rounded-full text-neutral-700 hover:bg-neutral-100 transition-colors'

/**
 * Top bar. links: [{ key, label }], active: key of the current page.
 * Links collapse into a menu below the xl breakpoint.
 */
export default function Navbar({ links, active, onNavigate, onLogout }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (key) => {
    onNavigate(key)
    setOpen(false)
  }

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-40 px-4 sm:px-8 py-2 transition-all duration-200 ${scrolled ? 'border-b border-neutral-200 shadow-sm' : 'border-b border-transparent'}`}
      style={
        scrolled
          ? { backgroundImage: `${GRAIN}, linear-gradient(to bottom, rgba(255,255,255,0.98), rgba(244,246,248,0.9))`, backdropFilter: 'blur(8px)' }
          : undefined
      }
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-12 gap-4">
        <div className="flex items-center gap-2 font-semibold text-neutral-900 shrink-0">
          <Logo className="w-6 h-6 text-violet-600" /> Finzo Recon
        </div>

        <ul className="hidden xl:flex items-center gap-6 text-sm">
          {links.map((l) => (
            <li key={l.key}>
              <button
                onClick={() => go(l.key)}
                className={`pb-1 border-b-2 transition-colors whitespace-nowrap ${
                  active === l.key
                    ? 'border-violet-600 text-neutral-900 font-medium'
                    : 'border-transparent text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            onClick={onLogout}
            className="hidden sm:flex items-center gap-2 pl-1 pr-4 h-9 bg-white border border-neutral-200 rounded-full text-sm hover:bg-neutral-100 transition-colors"
          >
            <span className="w-7 h-7 rounded-full bg-violet-600 text-white text-xs flex items-center justify-center">U</span>
            Logout
          </button>
          <button onClick={() => setOpen((o) => !o)} aria-label="Toggle menu" className={`xl:hidden ${iconBtn}`}>
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {open && (
        <ul className="xl:hidden mt-2 bg-white border border-neutral-200 rounded-[5px] p-2 space-y-1 max-w-7xl mx-auto">
          {links.map((l) => (
            <li key={l.key}>
              <button
                onClick={() => go(l.key)}
                className={`w-full text-left px-3 py-2 rounded-[5px] text-sm ${
                  active === l.key ? 'bg-violet-600 text-white' : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                {l.label}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={onLogout}
              className="w-full text-left px-3 py-2 rounded-[5px] text-sm text-neutral-700 hover:bg-neutral-100"
            >
              Logout
            </button>
          </li>
        </ul>
      )}
    </nav>
  )
}
