import { stats } from '../data.js'
import SocialLinks from './SocialLinks.jsx'
import Button from './ui/Button.jsx'
import { HandArrow, Scribble, ScribbleCircle, Sparkle } from './ui/Decorations.jsx'

const title = 'I design products and build them too.'

// Words that get a pen mark in the headline.
const marks = {
  design: <Scribble className="absolute -bottom-1 left-0 h-3 w-full text-pen" />,
  build: <ScribbleCircle className="absolute -inset-x-3 -inset-y-1 h-[calc(100%+0.5rem)] w-[calc(100%+1.5rem)] text-marker" />,
}

// Each stat note gets its own paper, tilt and corner shape.
const statStyles = [
  'bg-postit -rotate-2 rounded-wobbly',
  'bg-white rotate-1 rounded-wobbly-md',
  'bg-erased -rotate-1 rounded-wobbly',
]

export default function Hero() {
  return (
    <section id="top" className="relative mx-auto max-w-page px-6 md:px-10 pt-12 pb-20 md:pt-20">
      <Sparkle className="absolute top-10 right-8 hidden size-12 animate-bounce-slow text-pen md:block" />

      <p className="inline-flex animate-fade-up -rotate-1 items-center gap-2.5 rounded-wobbly border-2 border-pencil bg-white px-4 py-1.5 font-hand text-lg shadow-hard-sm">
        <span className="relative flex size-2.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-marker opacity-60" />
          <span className="relative inline-flex size-2.5 rounded-full bg-marker" />
        </span>
        Available for alternance · Paris
      </p>

      <h1 className="mt-8 max-w-5xl text-5xl leading-[1.1] md:text-7xl" aria-label={title}>
        {title.split(' ').map((word, i) => (
          <span key={i} aria-hidden>
            <span className="relative inline-block animate-word-up" style={{ animationDelay: `${150 + i * 70}ms` }}>
              {word === 'too.' ? (
                <>
                  too<span className="inline-block origin-bottom animate-wiggle text-marker">!</span>
                </>
              ) : (
                <>
                  <span className="relative z-10">{word}</span>
                  {marks[word]}
                </>
              )}
            </span>{' '}
          </span>
        ))}
      </h1>

      <p className="mt-8 max-w-2xl animate-fade-up text-lg leading-relaxed text-pencil/80 [animation-delay:700ms] md:text-xl">
        Full-stack developer &amp; UX/UI designer, doing my Master's at Epitech Paris. I take ideas
        from a Figma frame to a working product.
      </p>

      <div className="relative mt-10 flex animate-fade-up flex-col gap-4 [animation-delay:850ms] sm:flex-row sm:items-center">
        <Button href="#work" variant="ink" className="-rotate-1">
          See my work →
        </Button>
        <Button href="#contact" className="rotate-1">
          Get in touch
        </Button>
        {/* Doodled note pointing back at the buttons (desktop only) */}
        <div className="pointer-events-none absolute -top-12 left-[25rem] hidden items-start gap-1 md:flex" aria-hidden>
          <HandArrow className="h-16 w-24 text-pencil/70" />
          <span className="mt-1 rotate-6 font-hand text-xl text-pen">start here!</span>
        </div>
      </div>

      <SocialLinks className="mt-8 animate-fade-up [animation-delay:950ms]" />

      <dl className="mt-14 grid animate-fade-up gap-6 [animation-delay:1050ms] sm:grid-cols-3">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`border-2 border-pencil px-5 py-4 shadow-hard transition-transform duration-100 hover:rotate-0 hover:scale-[1.02] ${statStyles[i % statStyles.length]}`}
          >
            <dt className="font-display text-3xl font-bold">{s.value}</dt>
            <dd className="mt-1 font-hand text-lg text-pencil/80">{s.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
