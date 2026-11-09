export const TODAY = new Date()

export const r2 = (x) => Math.round(x * 100) / 100

const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
})

export const money = (v) => inr.format(v)

export const cr = (v) => {
  const a = Math.abs(v)
  return (v < 0 ? '-' : '') + '₹' + (a / 1e7).toFixed(2) + ' Cr'
}

export const ago = (m) => (m < 60 ? m + ' min ago' : Math.floor(m / 60) + ' h ago')

export const dateStr = (d) =>
  d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

export const dShort = (d) => d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })

export const daysAgo = (n) => {
  const d = new Date(TODAY)
  d.setDate(d.getDate() - n)
  return d
}

export const minsAgo = (m) => new Date(TODAY.getTime() - m * 60000)

export const acctLabel = (a) => `${a.bank} - ${a.name}`

export function monthRange() {
  const a = new Date(TODAY.getFullYear(), TODAY.getMonth(), 1)
  const b = new Date(TODAY.getFullYear(), TODAY.getMonth() + 1, 0)
  return `${dateStr(a)} to ${dateStr(b)}`
}
