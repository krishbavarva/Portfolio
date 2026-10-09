import Reveal from './Reveal.jsx'
import StickyTag from './ui/StickyTag.jsx'
import { Scribble } from './ui/Decorations.jsx'

export default function SectionHeading({ index, label, title, className = '' }) {
  return (
    <Reveal className={`flex flex-col items-start ${className}`}>
      <StickyTag>
        {index} — {label}
      </StickyTag>
      <h2 className="relative mt-4 inline-block text-4xl leading-tight md:text-6xl">
        {title}
        <Scribble className="absolute -bottom-2 left-0 h-3 w-2/3 text-marker" />
      </h2>
    </Reveal>
  )
}
