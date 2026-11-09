import { STATUS, STATUS_BG, STATUS_KEYS } from '../data/constants.js'

export default function Legend() {
  return (
    <div className="flex flex-wrap gap-4 text-xs text-neutral-500 mt-3">
      {STATUS_KEYS.map((k) => (
        <span key={k} className="flex items-center gap-1.5">
          <i className={`w-2 h-2 rounded-[5px] ${STATUS_BG[k]}`} />
          {STATUS[k]}
        </span>
      ))}
    </div>
  )
}
