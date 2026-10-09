// Little post-it label used above section titles ("01 — Work").
export default function StickyTag({ children, className = '' }) {
  return (
    <span
      className={`inline-block -rotate-2 rounded-wobbly border-2 border-pencil bg-postit px-3 py-0.5 font-hand text-lg text-pencil shadow-hard-sm ${className}`}
    >
      {children}
    </span>
  )
}
