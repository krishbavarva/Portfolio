import { Link } from 'react-router-dom'
import { drawings } from '../data/content.js'
import ArtImage from './ArtImage.jsx'
import Reveal from './Reveal.jsx'
import Button from './ui/Button.jsx'
import Card from './ui/Card.jsx'
import { Scribble, Tape } from './ui/Decorations.jsx'

// Three polaroids, each stuck on at its own angle.
const tilts = ['-rotate-3 hover:rotate-0', 'rotate-2 translate-y-4 hover:rotate-0', '-rotate-1 hover:rotate-2']

export default function ArtTeaser() {
  return (
    <section aria-labelledby="art-teaser-title" className="mx-auto max-w-page px-6 md:px-10 py-12">
      <Card tone="postit" decoration="tape" className="grid items-center gap-12 p-8 shadow-hard md:grid-cols-[1fr_1.3fr] md:p-12">
        <Reveal>
          <h2 id="art-teaser-title" className="relative inline-block text-5xl md:text-6xl">
            I also draw.
            <Scribble className="absolute -bottom-2 left-0 h-3 w-full text-marker" />
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-pencil/80">
            Pencil, charcoal and digital drawings — where I train my eye for light, shapes and detail.
          </p>
          <Button to="/art" variant="ink" className="mt-8 -rotate-1">
            See my drawings →
          </Button>
        </Reveal>

        <ul className="grid grid-cols-3 gap-3 md:gap-5">
          {drawings.slice(0, 3).map((d, i) => (
            <Reveal as="li" key={d.file} delay={i * 100}>
              <Link
                to="/art"
                aria-label={`${d.title} — see all drawings`}
                className={`relative block border-2 border-pencil bg-white p-1.5 pb-5 shadow-hard-sm transition-[rotate,box-shadow] duration-100 hover:shadow-hard md:p-2 md:pb-7 ${tilts[i]}`}
              >
                <Tape className="h-5 w-12" />
                <span className="block aspect-[4/5] overflow-hidden">
                  <ArtImage src={d.file} alt={d.title} position={d.position} className="size-full object-cover" />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Card>
    </section>
  )
}
