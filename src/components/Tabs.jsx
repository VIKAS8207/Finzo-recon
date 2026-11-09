/** Underlined tab bar. tabs: [{ key, label }] */
export default function Tabs({ tabs, active, onChange }) {
  return (
    <div role="tablist" className="flex gap-1 border-b border-neutral-200 overflow-x-auto">
      {tabs.map((t) => (
        <button
          key={t.key}
          role="tab"
          aria-selected={active === t.key}
          onClick={() => onChange(t.key)}
          className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap -mb-px border-b-2 transition-colors ${
            active === t.key
              ? 'border-violet-600 text-violet-700'
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}
