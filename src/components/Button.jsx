const variants = {
  primary: 'bg-neutral-900 border-neutral-900 text-white hover:bg-neutral-700',
  secondary: 'bg-white border-neutral-300 text-neutral-800 hover:bg-neutral-100',
}

const sizes = {
  sm: 'px-2.5 py-1 text-xs',
  md: 'px-3.5 py-2 text-sm',
}

/** Standard button. For the big black call-to-action use LargeButton. */
export default function Button({
  variant = 'secondary',
  size = 'md',
  type = 'button',
  className = '',
  children,
  ...props
}) {
  return (
    <button
      type={type}
      className={`border rounded-[5px] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
