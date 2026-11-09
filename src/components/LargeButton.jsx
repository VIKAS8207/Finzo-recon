/**
 * Large primary button: full width, black gradient fill, mild 3D gradient border.
 * Use for the main call-to-action of a screen (e.g. "Get Started").
 * Pointer cursor comes from the global rule in index.css.
 */
export default function LargeButton({ children, type = 'button', className = '', style, ...props }) {
  return (
    <button
      type={type}
      style={{
        border: '3px solid transparent',
        borderRadius: '8px',
        background:
          'linear-gradient(to bottom, #3a3a3d 0%, #1c1c1e 50%, #050505 100%) padding-box, linear-gradient(to bottom left, #8a8a8a 0%, #3a3a3a 50%, #000 100%) border-box',
        ...style,
      }}
      className={`w-full py-3 text-sm font-medium text-white hover:opacity-90 active:opacity-100 transition-opacity ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
