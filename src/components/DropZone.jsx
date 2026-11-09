import { useState } from 'react'

/** Click or drop a file. Calls onFile(File). */
export default function DropZone({ title, hint = 'or drop it here', accept, onFile }) {
  const [over, setOver] = useState(false)

  return (
    <label
      onDragOver={(e) => {
        e.preventDefault()
        setOver(true)
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setOver(false)
        if (e.dataTransfer.files[0]) onFile(e.dataTransfer.files[0])
      }}
      className={`flex flex-col items-center gap-1 border-[1.5px] border-dashed rounded-[5px] bg-white px-4 py-7 text-center text-sm cursor-pointer transition-colors ${
        over ? 'border-violet-500 text-neutral-900' : 'border-neutral-300 text-neutral-500 hover:border-violet-400'
      }`}
    >
      <b className="text-neutral-800">{title}</b>
      <span>{hint}</span>
      <input
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => {
          if (e.target.files[0]) onFile(e.target.files[0])
          e.target.value = ''
        }}
      />
    </label>
  )
}
