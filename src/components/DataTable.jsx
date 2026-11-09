/**
 * Simple table. heads: string[], rows: node[][], right: column indexes to right-align (numbers).
 * `bare` removes the outer border (for use inside a Panel).
 */
export default function DataTable({ heads, rows, right = [], minWidth = 640, rowKeys, bare = false }) {
  return (
    <div className={`overflow-x-auto ${bare ? '' : 'bg-white border border-neutral-200 rounded-[5px]'}`}>
      <table className="w-full text-sm text-left border-collapse" style={{ minWidth }}>
        <thead>
          <tr className="bg-violet-50/60 text-neutral-500 text-[11px] uppercase tracking-wide">
            {heads.map((h, i) => (
              <th key={h} className={`font-medium px-3 py-2.5 whitespace-nowrap ${right.includes(i) ? 'text-right' : ''}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={rowKeys ? rowKeys[ri] : ri} className="border-t border-neutral-100 hover:bg-violet-50/40">
              {r.map((c, ci) => (
                <td key={ci} className={`px-3 py-2.5 align-middle ${right.includes(ci) ? 'text-right tabular-nums' : ''}`}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
