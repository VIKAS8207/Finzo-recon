/** Small toggle group. options: [{ value, label }] */
export default function Segmented({ options, value, onChange, label }) {
  return (
    <div role="group" aria-label={label} className="inline-flex border border-neutral-200 bg-white rounded-[5px] overflow-hidden">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={`px-3 py-2 text-sm font-medium transition-colors ${
            value === o.value ? 'bg-violet-600 text-white' : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
