import { projects } from '../data.js'
import SectionHeading from './SectionHeading.jsx'
import ProjectCard from './ProjectCard.jsx'
import Reveal from './Reveal.jsx'

export default function Work() {
  return (
    <section id="work" className="mx-auto max-w-page px-6 md:px-10 py-20">
      <SectionHeading index="01" label="Work" title="Selected work" />

      <div className="mt-14 grid gap-12 md:grid-cols-2 md:gap-10">
        {projects.map((p, i) => (
          <Reveal key={p.title} delay={(i % 2) * 120}>
            <ProjectCard project={p} index={i} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}
