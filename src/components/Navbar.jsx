import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import SocialLinks from './SocialLinks.jsx'
import CvMenu from './CvMenu.jsx'

// `hash` items are sections of the homepage; `path` items are separate pages.
const navItems = [
  { label: 'Work', hash: '#work' },
  { label: 'Experience', hash: '#experience' },
  { label: 'About', hash: '#about' },
  { label: 'Art', path: '/art' },
  { label: 'Contact', hash: '#contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const progressRef = useRef(null)
  const { pathname } = useLocation()
  const close = () => setOpen(false)

  // Re-clicking the current section (same URL) wouldn't trigger a scroll, so do it here.
  const onNavClick = (item) => {
    close()
    if (pathname !== '/') return
    if (item.hash) document.getElementById(item.hash.slice(1))?.scrollIntoView()
  }

  useEffect(() => {
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight
        const progress = max > 0 ? window.scrollY / max : 0
        progressRef.current?.style.setProperty('--progress', progress)
        setScrolled(window.scrollY > 10)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const linkClass = (active, size = 'text-xl') =>
    `font-hand ${size} decoration-marker decoration-wavy decoration-2 underline-offset-[6px] hover:underline ${
      active ? 'text-marker underline' : ''
    }`

  return (
    <>
      {/* Reading progress, drawn like a marker line across the top */}
      <div
        ref={progressRef}
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-40 h-1 origin-left bg-marker [transform:scaleX(var(--progress,0))]"
      />
      <header
        className={`sticky top-0 z-30 bg-paper/90 backdrop-blur-sm transition-[border-color] duration-200 ${
          scrolled || open ? 'border-b-2 border-dashed border-pencil/40' : 'border-b-2 border-transparent'
        }`}
      >
        <div className="mx-auto flex h-20 max-w-page items-center justify-between px-6 md:px-10">
          <Link
            to="/"
            className="group flex items-center gap-3"
            onClick={() => {
              close()
              if (pathname === '/') window.scrollTo({ top: 0 })
            }}
          >
            <span className="grid size-10 -rotate-3 place-items-center rounded-wobbly border-2 border-pencil bg-postit font-display text-lg shadow-hard-sm transition-transform duration-100 group-hover:rotate-3">
              KB
            </span>
            <span className="font-display text-xl font-bold">Krish Bavarva</span>
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
            <ul className="flex gap-6">
              {navItems.map((item) => {
                const active = item.path === pathname
                return (
                  <li key={item.label}>
                    <Link
                      to={item.path ?? { pathname: '/', hash: item.hash }}
                      className={linkClass(active)}
                      aria-current={active ? 'page' : undefined}
                      onClick={() => onNavClick(item)}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
            <CvMenu />
          </nav>

          <button
            type="button"
            className="grid size-12 place-items-center rounded-wobbly border-2 border-pencil bg-white shadow-hard-sm transition-transform duration-100 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none md:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X strokeWidth={2.5} className="size-6" /> : <Menu strokeWidth={2.5} className="size-6" />}
          </button>
        </div>

        {open && (
          <nav id="mobile-menu" aria-label="Main" className="animate-pop-in px-6 pt-2 pb-8 md:hidden">
            <ul className="flex flex-col gap-4">
              {navItems.map((item) => {
                const active = item.path === pathname
                return (
                  <li key={item.label}>
                    <Link
                      to={item.path ?? { pathname: '/', hash: item.hash }}
                      className={`${linkClass(active, 'text-3xl')} inline-block py-1`}
                      aria-current={active ? 'page' : undefined}
                      onClick={() => onNavClick(item)}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
            <div className="mt-6">
              <CvMenu inline onPick={close} />
            </div>
            <SocialLinks className="mt-6" />
          </nav>
        )}
      </header>
    </>
  )
}
