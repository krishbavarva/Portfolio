import { skills } from '../data.js'
import SectionHeading from './SectionHeading.jsx'
import Reveal from './Reveal.jsx'
import Card from './ui/Card.jsx'

// Sticky notes stuck to the wall at slightly different angles.
const notes = [
  { tone: 'postit', tilt: '-rotate-2 hover:rotate-1' },
  { tone: 'white', tilt: 'rotate-1 hover:-rotate-2' },
  { tone: 'postit', tilt: 'rotate-2 hover:-rotate-1' },
  { tone: 'white', tilt: '-rotate-1 hover:rotate-2' },
]

export default function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-page px-6 md:px-10 py-20">
      <SectionHeading index="02" label="Skills" title="What I work with" />
      <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {skills.map((s, i) => {
          const note = notes[i % notes.length]
          return (
            <Reveal key={s.group} delay={i * 100}>
              <Card
                tone={note.tone}
                decoration="tack"
                className={`h-full p-6 pt-8 shadow-hard transition-transform duration-100 ${note.tilt}`}
              >
                <h3 className="text-2xl">{s.group}</h3>
                <ul className="mt-3 space-y-1.5">
                  {s.items.map((item) => (
                    <li key={item} className="flex items-baseline gap-2 font-hand text-xl">
                      <span className="text-marker" aria-hidden>
                        •
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
