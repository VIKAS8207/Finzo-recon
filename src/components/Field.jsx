import { Children, isValidElement, useEffect, useRef, useState } from 'react'

const controlCls =
  'rounded-[5px] border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200'

/** Label + control stacked. */
export function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1 text-xs text-neutral-500 min-w-0">
      {label}
      {children}
    </label>
  )
}

/** Text input. `fluid` (default) makes it full width. */
export function Input({ fluid = true, className = '', ...props }) {
  return <input className={`${controlCls} ${fluid ? 'w-full' : ''} ${className}`} {...props} />
}

const text = (n) => (Array.isArray(n) ? n.join('') : String(n ?? ''))

function Chevron({ open }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`w-4 h-4 shrink-0 text-neutral-500 transition-transform ${open ? 'rotate-180' : ''}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

/**
 * Custom dropdown. Same API as a native select: pass <option value="..."> children,
 * `value`, and `onChange(e)` (read e.target.value). `fluid` (default) makes it full width.
 */
export function Select({ fluid = true, className = '', children, value, onChange, disabled, ...rest }) {
  const options = Children.toArray(children)
    .filter(isValidElement)
    .map((c) => ({ value: c.props.value ?? text(c.props.children), label: text(c.props.children) }))

  const [open, setOpen] = useState(false)
  const [hi, setHi] = useState(0)
  const [pos, setPos] = useState({})
  const wrapRef = useRef(null)
  const btnRef = useRef(null)
  const listRef = useRef(null)

  const selIndex = options.findIndex((o) => String(o.value) === String(value))
  const current = options[selIndex]

  function openList() {
    const r = btnRef.current.getBoundingClientRect()
    const below = window.innerHeight - r.bottom
    const flip = below < 260 && r.top > below
    setPos(
      flip
        ? { left: r.left, minWidth: r.width, bottom: window.innerHeight - r.top + 4 }
        : { left: r.left, minWidth: r.width, top: r.bottom + 4 },
    )
    setHi(Math.max(0, selIndex))
    setOpen(true)
  }

  function choose(o) {
    if (onChange) onChange({ target: { value: o.value } })
    setOpen(false)
    if (btnRef.current) btnRef.current.focus()
  }

  // Close on outside click, scroll or resize (the list is positioned with fixed coordinates)
  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    const onScroll = (e) => {
      // scrolling the option list itself must not close it; scrolling the page should
      if (listRef.current && e.target instanceof Node && listRef.current.contains(e.target)) return
      setOpen(false)
    }
    const onResize = () => setOpen(false)
    document.addEventListener('mousedown', onDown)
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onResize)
    return () => {
      document.removeEventListener('mousedown', onDown)
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onResize)
    }
  }, [open])

  // Keep the highlighted row in view while using the arrow keys
  useEffect(() => {
    if (open && listRef.current && listRef.current.children[hi]) {
      listRef.current.children[hi].scrollIntoView({ block: 'nearest' })
    }
  }, [open, hi])

  function onKeyDown(e) {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        openList()
      }
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHi((h) => Math.min(options.length - 1, h + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHi((h) => Math.max(0, h - 1))
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (options[hi]) choose(options[hi])
    } else if (e.key === 'Escape' || e.key === 'Tab') {
      setOpen(false)
    }
  }

  return (
    <div ref={wrapRef} className={`relative ${fluid ? 'w-full' : 'inline-block'} ${className}`}>
      <button
        ref={btnRef}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        className={`${controlCls} w-full flex items-center justify-between gap-2 text-left disabled:opacity-50`}
        {...rest}
      >
        <span className="truncate">{current ? current.label : ''}</span>
        <Chevron open={open} />
      </button>

      {open && (
        <ul
          ref={listRef}
          role="listbox"
          style={pos}
          className="fixed z-50 w-max max-w-[22rem] max-h-64 overflow-y-auto bg-white border border-neutral-200 rounded-[5px] shadow-lg py-1"
        >
          {options.map((o, i) => {
            const selected = i === selIndex
            return (
              <li
                key={String(o.value)}
                role="option"
                aria-selected={selected}
                onMouseEnter={() => setHi(i)}
                onClick={(e) => {
                  // stop an enclosing <label> from re-clicking the trigger button
                  e.preventDefault()
                  choose(o)
                }}
                className={`flex items-center justify-between gap-4 px-3 py-1.5 text-sm cursor-pointer ${
                  i === hi ? 'bg-violet-50' : ''
                } ${selected ? 'font-medium text-violet-700' : 'text-neutral-800'}`}
              >
                <span className="whitespace-nowrap">{o.label}</span>
                {selected && (
                  <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="m5 12 5 5 9-10" />
                  </svg>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export { controlCls }
