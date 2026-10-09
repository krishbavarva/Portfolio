// Small dashed tag for technologies and skills.
export default function Pill({ children, className = '' }) {
  return (
    <li
      className={`rounded-wobbly border-2 border-dashed border-pencil/50 bg-paper px-2.5 py-0.5 font-hand text-base text-pencil ${className}`}
    >
      {children}
    </li>
  )
}
