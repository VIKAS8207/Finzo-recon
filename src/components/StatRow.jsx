/** Row of <StatTile>s separated by thin vertical lines, sitting directly on the page background. */
export default function StatRow({ children, cols = 'lg:grid-cols-5' }) {
  return (
    <section
      className={`grid grid-cols-2 ${cols} gap-x-4 gap-y-4 lg:gap-x-0 lg:[&>*]:px-5 lg:[&>*:first-child]:pl-0 lg:[&>*+*]:border-l lg:[&>*+*]:border-violet-300/60`}
    >
      {children}
    </section>
  )
}
