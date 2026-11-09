export default function Switch({ on, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onChange}
      className={`relative w-9 h-5 rounded-[5px] border transition-colors ${
        on ? 'bg-violet-600 border-violet-600' : 'bg-neutral-200 border-neutral-300'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-[3px] bg-white transition-transform ${
          on ? 'translate-x-4' : ''
        }`}
      />
    </button>
  )
}
