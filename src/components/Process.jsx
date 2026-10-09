import { process } from '../data.js'
import SectionHeading from './SectionHeading.jsx'
import Reveal from './Reveal.jsx'
import { Squiggle } from './ui/Decorations.jsx'

const blobTones = ['bg-postit', 'bg-white', 'bg-erased', 'bg-white']

export default function Process() {
  return (
    <section id="process" className="mx-auto max-w-page px-6 md:px-10 py-20">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading index="03" label="Process" title="How I work" />
        <Reveal as="p" delay={120} className="max-w-sm font-hand text-xl leading-snug text-pencil/80">
          I design in Figma first and then build it myself, so I care about both a good user
          experience and clean code.
        </Reveal>
      </div>

      <div className="mt-16">
        <ol className="grid gap-10 md:grid-cols-4 md:gap-8">
          {process.map((p, i) => (
            <Reveal as="li" key={p.step} delay={i * 120} className="relative text-center md:text-left">
              {/* Squiggle to the next step: starts 14px after this circle (64px) and stops 14px
                  before the next one, across the 32px column gap (desktop only) */}
              {i < process.length - 1 && (
                <Squiggle className="absolute top-5 left-[78px] hidden h-6 w-[calc(100%-60px)] text-pencil/40 md:block" />
              )}
              <span
                className={`relative z-10 mx-auto grid size-16 place-items-center rounded-blob border-[3px] border-pencil font-display text-2xl font-bold shadow-hard-sm md:mx-0 ${blobTones[i % blobTones.length]} ${
                  i % 2 ? 'rotate-6' : '-rotate-6'
                }`}
              >
                {p.step}
              </span>
              <h3 className="mt-5 text-2xl">{p.title}</h3>
              <p className="mt-2 leading-relaxed text-pencil/80">{p.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
