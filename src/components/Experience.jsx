import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { experience, links } from '../data.js'
import SectionHeading from './SectionHeading.jsx'
import Reveal from './Reveal.jsx'
import Button from './ui/Button.jsx'
import Pill from './ui/Pill.jsx'

export default function Experience() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section id="experience" className="mx-auto max-w-page px-6 md:px-10 py-20">
      <SectionHeading index="04" label="Experience" title="Where I have worked" />

      <ul className="mt-12 border-t-2 border-dashed border-pencil/40">
        {experience.map((job, i) => {
          const open = openIndex === i
          const id = `job-${i}`
          return (
            <Reveal as="li" key={job.role} delay={i * 80} className="border-b-2 border-dashed border-pencil/40">
              <button
                type="button"
                aria-expanded={open}
                aria-controls={id}
                onClick={() => setOpenIndex(open ? null : i)}
                className="group grid w-full grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 py-6 text-left md:grid-cols-[170px_1fr_auto_auto] md:gap-x-6"
              >
                <span className="font-hand text-lg text-pen">{job.period}</span>
                <span className="col-start-1 font-display text-2xl leading-tight font-bold transition-colors duration-100 group-hover:text-marker md:col-start-2 md:text-3xl">
                  {job.role}
                </span>
                <span className="col-start-1 font-hand text-lg text-pencil/70 md:col-start-3 md:text-right">
                  {job.company}
                </span>
                <span
                  aria-hidden
                  className={`col-start-2 row-span-3 row-start-1 grid size-12 place-items-center rounded-blob border-2 border-pencil shadow-hard-sm transition-[rotate,background-color,color] duration-100 md:col-start-4 md:row-span-1 ${
                    open ? 'rotate-180 bg-marker text-white' : 'bg-white group-hover:rotate-12 group-hover:bg-postit'
                  }`}
                >
                  {open ? <Minus strokeWidth={3} className="size-5" /> : <Plus strokeWidth={3} className="size-5" />}
                </span>
              </button>

              {open && (
                <div id={id} className="animate-pop-in space-y-4 pb-8 md:pr-20 md:pl-[194px]">
                  {job.details && <p className="leading-relaxed text-pencil/85 md:text-lg">{job.details}</p>}
                  {job.points && (
                    <ul className="space-y-2">
                      {job.points.map((pt) => (
                        <li key={pt} className="flex gap-2.5 font-hand text-lg leading-snug md:text-xl">
                          <span className="text-marker" aria-hidden>
                            →
                          </span>
                          {pt}
                        </li>
                      ))}
                    </ul>
                  )}
                  {job.tags && (
                    <ul className="flex flex-wrap gap-2">
                      {job.tags.map((t) => (
                        <Pill key={t}>{t}</Pill>
                      ))}
                    </ul>
                  )}
                  {job.href && (
                    <a
                      href={job.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block font-hand text-xl text-pen decoration-wavy decoration-2 underline-offset-4 hover:underline"
                    >
                      See the project →
                    </a>
                  )}
                </div>
              )}
            </Reveal>
          )
        })}
      </ul>

      <Button href={links.linkedin} target="_blank" rel="noreferrer" variant="secondary" className="mt-10 -rotate-1">
        Full experience on LinkedIn ↗
      </Button>
    </section>
  )
}
