import Hero from '../components/Hero.jsx'
import Work from '../components/Work.jsx'
import Skills from '../components/Skills.jsx'
import Process from '../components/Process.jsx'
import Experience from '../components/Experience.jsx'
import About from '../components/About.jsx'
import ArtTeaser from '../components/ArtTeaser.jsx'
import Contact from '../components/Contact.jsx'

export default function Home() {
  return (
    <main>
      <Hero />
      <Work />
      <Skills />
      <Process />
      <Experience />
      <About />
      <ArtTeaser />
      <Contact />
    </main>
  )
}
