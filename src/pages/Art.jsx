import { useEffect, useState } from 'react'
import { drawings } from '../data/content.js'
import ArtImage from '../components/ArtImage.jsx'
import Lightbox from '../components/Lightbox.jsx'
import Reveal from '../components/Reveal.jsx'
import Button from '../components/ui/Button.jsx'
import StickyTag from '../components/ui/StickyTag.jsx'
import { Scribble, Sparkle, Tack, Tape } from '../components/ui/Decorations.jsx'

const title = 'Art — Krish Bavarva'
const description =
  'Pencil, charcoal and digital drawings by Krish Bavarva — a horse study, Spider-Man, Itachi Uchiha, Naruto Uzumaki and more.'

// Each print is stuck to the wall at its own angle; the pattern repeats every 6.
const tilts = [
  '-rotate-2 hover:rotate-1',
  'rotate-1 hover:-rotate-1',
  '-rotate-1 hover:rotate-2',
  'rotate-2 hover:-rotate-1',
  'rotate-[-1.5deg] hover:rotate-1',
  'rotate-[1.5deg] hover:-rotate-2',
]

function usePageMeta() {
  useEffect(() => {
    const meta = document.querySelector('meta[name="description"]')
    const prevTitle = document.title
    const prevDescription = meta?.getAttribute('content')
    document.title = title
    meta?.setAttribute('content', description)
    return () => {
      document.title = prevTitle
      if (prevDescription != null) meta?.setAttribute('content', prevDescription)
    }
  }, [])
}

export default function Art() {
  const [openIndex, setOpenIndex] = useState(null)
  usePageMeta()

  return (
    <main id="top" className="relative mx-auto max-w-page px-6 md:px-10 pt-12 pb-16 md:pt-20">
      <Sparkle className="absolute top-16 right-10 hidden size-14 animate-bounce-slow text-marker md:block" />

      <Reveal className="flex max-w-3xl flex-col items-start">
        <StickyTag>Outside of work</StickyTag>
        <h1 className="relative mt-6 inline-block text-6xl md:text-8xl">
          I also draw.
          <Scribble className="absolute -bottom-2 left-0 h-4 w-full text-marker" />
        </h1>
        <p className="mt-8 text-lg leading-relaxed text-pencil/80 md:text-xl">
          Pencil and charcoal sketches on paper, and digital drawings on my iPad, that I make in my
          free time. Drawing is where I train my eye for light, shapes and detail — the same eye I use
          when I design interfaces.
        </p>
      </Reveal>

      <ul className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
        {drawings.map((d, i) => (
          <Reveal as="li" key={d.file} delay={(i % 3) * 100}>
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              aria-label={`Open ${d.title}`}
              className={`relative block w-full cursor-zoom-in border-2 border-pencil bg-white p-3 pb-4 text-left shadow-hard transition-[rotate,box-shadow,scale] duration-100 hover:scale-[1.02] hover:shadow-hard-lg ${tilts[i % tilts.length]}`}
            >
              {i % 3 === 1 ? <Tack /> : <Tape />}
              <span className="block aspect-[4/5] overflow-hidden border-2 border-pencil bg-erased">
                <ArtImage src={d.file} alt={d.title} position={d.position} className="size-full object-cover" />
              </span>
              <span className="mt-3 block text-center font-hand text-xl">{d.title}</span>
            </button>
          </Reveal>
        ))}
      </ul>

      <div className="mt-20 flex justify-center">
        <Button to="/" variant="secondary" className="rotate-1">
          ← Back to home
        </Button>
      </div>

      {openIndex !== null && (
        <Lightbox items={drawings} index={openIndex} onClose={() => setOpenIndex(null)} onChange={setOpenIndex} />
      )}
    </main>
  )
}
