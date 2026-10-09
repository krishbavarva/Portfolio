import { ArrowUpRight } from 'lucide-react'
import Card from './ui/Card.jsx'
import Pill from './ui/Pill.jsx'

// Alternate tilt and paper prop so the grid looks pinned up by hand.
const tilts = ['-rotate-1 hover:rotate-1', 'rotate-1 hover:-rotate-1']
const decorations = ['tape', 'tack']

export default function ProjectCard({ project, index = 0 }) {
  const { title, subtitle, description, highlights, tags, year, image, href, sketch } = project

  const media = image ? (
    <img src={image} alt={title} loading="lazy" className="size-full object-cover" />
  ) : (
    <span className="flex flex-col items-center gap-2" aria-hidden>
      <span className="text-6xl grayscale-[30%] transition-transform duration-100 group-hover:scale-110 group-hover:-rotate-6">
        {sketch ?? '✏️'}
      </span>
      <span className="font-display text-2xl text-pencil/35">{title}</span>
    </span>
  )

  const mediaClass =
    'group grid aspect-[16/10] place-items-center overflow-hidden rounded-wobbly border-2 border-dashed border-pencil/50 bg-erased/50'

  return (
    <Card
      as="article"
      decoration={decorations[index % 2]}
      className={`p-6 transition-[rotate,box-shadow] duration-100 hover:shadow-hard-md md:p-7 ${tilts[index % 2]}`}
    >
      {href ? (
        <a href={href} target="_blank" rel="noreferrer" className={mediaClass} aria-label={`${title} on GitHub`}>
          {media}
        </a>
      ) : (
        <div className={mediaClass}>{media}</div>
      )}

      <div className="mt-5 flex items-start justify-between gap-3">
        <ul className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <Pill key={t}>{t}</Pill>
          ))}
        </ul>
        <span className="shrink-0 font-hand text-lg text-pen">{year}</span>
      </div>

      <h3 className="mt-4 text-3xl">{title}</h3>
      {subtitle && <p className="font-hand text-xl text-pen">{subtitle}</p>}
      <p className="mt-3 leading-relaxed text-pencil/80">{description}</p>

      {highlights && (
        <ul className="mt-4 space-y-1.5">
          {highlights.map((h) => (
            <li key={h} className="flex gap-2 font-hand text-lg">
              <span className="text-marker" aria-hidden>
                ✓
              </span>
              {h}
            </li>
          ))}
        </ul>
      )}

      {href && (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex min-h-11 items-center gap-1 font-hand text-xl text-pen decoration-wavy decoration-2 underline-offset-4 hover:underline"
        >
          View on GitHub
          <ArrowUpRight strokeWidth={2.5} className="size-5" />
        </a>
      )}
    </Card>
  )
}
