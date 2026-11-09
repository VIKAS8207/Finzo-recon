/** Two-letter bank badge + bank name. */
export default function BankChip({ code, name }) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <span className="w-7 h-7 rounded-[5px] bg-violet-100 text-violet-700 grid place-items-center text-[11px] font-semibold shrink-0">
        {code}
      </span>
      {name && <b className="font-semibold truncate">{name}</b>}
    </div>
  )
}
