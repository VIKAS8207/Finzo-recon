import { controlCls } from './Field.jsx'

export default function SearchInput({ hint, inputRef, className = '', ...props }) {
  return (
    <label className={`relative block min-w-0 ${className}`}>
      <svg
        viewBox="0 0 24 24"
        className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input ref={inputRef} type="search" autoComplete="off" className={`${controlCls} w-full pl-9 pr-9`} {...props} />
      {hint && (
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-neutral-400 border border-neutral-200 rounded-[5px] px-1.5">
          {hint}
        </kbd>
      )}
    </label>
  )
}
