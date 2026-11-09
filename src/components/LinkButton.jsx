export default function LinkButton({ children, className = '', ...props }) {
  return (
    <button
      type="button"
      className={`text-violet-700 font-medium text-sm hover:underline ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
