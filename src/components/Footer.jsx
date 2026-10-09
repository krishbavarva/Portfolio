import { socials } from './SocialLinks.jsx'

export default function Footer() {
  return (
    <footer className="mx-auto max-w-page px-6 md:px-10 pt-6 pb-24 md:pb-12">
      <div className="flex flex-col gap-4 border-t-2 border-dashed border-pencil/50 pt-8 font-hand text-lg md:flex-row md:items-center md:justify-between">
        <span>© 2026 Krish Bavarva</span>
        <ul className="flex gap-6">
          {socials.map(({ label, href, Icon }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center gap-2 decoration-marker decoration-2 hover:line-through"
              >
                <Icon className="size-4" />
                {label}
              </a>
            </li>
          ))}
        </ul>
        <span className="text-pencil/70">Sketched by hand · Built with React</span>
      </div>
    </footer>
  )
}
