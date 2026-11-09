import Button from './Button.jsx'

export default function Pager({ page, pages, onChange }) {
  if (pages <= 1) return null
  return (
    <div className="flex items-center justify-between gap-2 flex-wrap">
      <Button size="sm" disabled={page === 1} onClick={() => onChange(page - 1)}>
        Previous
      </Button>
      <span className="text-sm text-neutral-500">
        Page {page} of {pages}
      </span>
      <Button size="sm" disabled={page === pages} onClick={() => onChange(page + 1)}>
        Next
      </Button>
    </div>
  )
}
