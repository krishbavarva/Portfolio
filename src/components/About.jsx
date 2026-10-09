import { softSkills } from '../data.js'
import SectionHeading from './SectionHeading.jsx'
import Reveal from './Reveal.jsx'
import Card from './ui/Card.jsx'
import { Tack } from './ui/Decorations.jsx'

const facts = [
  {
    label: 'Education',
    lines: ["Master's IT, Epitech Paris (2025–2027)", 'B.E. Computer Engineering, Marwadi University (2021–2025)'],
  },
  { label: 'Languages', lines: ['English C1 · French B1', 'Hindi & Gujarati (native)'] },
  { label: 'Based in', lines: ['Drancy, Paris area', 'Available immediately for an alternance'] },
  { label: 'Soft skills', lines: [softSkills.join(' · ')] },
]

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-page px-6 md:px-10 py-20">
      <div className="grid gap-14 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-12">
        <div>
          <SectionHeading index="05" label="About" title="A bit about me" />
          {/* Polaroid pinned to the page */}
          <Reveal delay={120}>
            <figure className="relative mx-auto mt-12 w-64 rotate-2 border-2 border-pencil bg-white p-3 pb-4 shadow-hard transition-transform duration-100 hover:-rotate-1 md:mx-0">
              <Tack />
              <img
                src="/krish-bavarva.jpg"
                alt="Portrait of Krish Bavarva"
                width="333"
                height="373"
                loading="lazy"
                className="block h-auto w-full border-2 border-pencil"
              />
              <figcaption className="mt-3 text-center font-hand text-xl">Krish · Paris area</figcaption>
            </figure>
          </Reveal>
        </div>

        <Reveal delay={150} className="md:pt-24">
          <p className="text-xl leading-relaxed md:text-2xl md:leading-relaxed">
            I'm Krish, a developer and designer from India, now based in Paris. I studied Computer
            Engineering at Marwadi University and I'm doing my Master's in Information Technology at
            Epitech Paris. What I enjoy most is the moment a design becomes a real, working product, so
            I like doing both.
          </p>
          <p className="mt-5 leading-relaxed text-pencil/80 md:text-lg">
            I have delivered interfaces in a company, at Levaral Solutions, and as a freelancer for
            clients like RoohPhotoFilms. Before that, I mentored students in HTML, CSS, JavaScript and
            C++ for IoT at Master Koder. Now I want to keep growing on real products within a team.
          </p>
          <p className="mt-5 leading-relaxed text-pencil/80 md:text-lg">
            Outside of code, I draw, take photos, swim, play cricket, volleyball and badminton, and love
            exploring historic places. Drawing and photography shape my eye for detail.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {facts.map((f, i) => (
              <Card
                key={f.label}
                tone={i === 0 ? 'postit' : 'white'}
                className={`p-5 transition-transform duration-100 ${i % 2 ? 'rotate-1 hover:-rotate-1' : '-rotate-1 hover:rotate-1'}`}
              >
                <h3 className="font-hand text-lg font-normal text-pen">{f.label}</h3>
                {f.lines.map((line) => (
                  <p key={line} className="mt-1 leading-snug font-medium">
                    {line}
                  </p>
                ))}
              </Card>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
