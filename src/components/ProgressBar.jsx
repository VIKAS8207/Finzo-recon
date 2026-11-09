export default function ProgressBar({ value }) {
  return (
    <div className="h-1 bg-violet-100 rounded-[5px] overflow-hidden mt-1">
      <div className="h-full bg-violet-600" style={{ width: `${value}%` }} />
    </div>
  )
}
