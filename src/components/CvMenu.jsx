import { useEffect, useRef, useState } from 'react'
import { Download } from 'lucide-react'
import { cvs } from '../data.js'
import Button from './ui/Button.jsx'

function CvLinks({ onPick }) {
  return (
    <ul className="space-y-1">
      {cvs.map((cv) => (
        <li key={cv.file}>
          <a
            href={cv.file}
            download
            onClick={onPick}
            className="group flex min-h-12 items-center gap-3 rounded-wobbly px-3 py-2 transition-[background-color,rotate] duration-100 hover:-rotate-1 hover:bg-postit focus-visible:bg-postit"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-blob border-2 border-pencil bg-white transition-colors duration-100 group-hover:bg-marker group-hover:text-white">
              <Download strokeWidth={2.5} className="size-4" />
            </span>
            <span>
              <span className="block font-display text-lg leading-tight font-bold">{cv.label}</span>
              <span className="block font-hand text-base leading-tight text-pencil/70">{cv.note}</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  )
}

// "Download CV" button that opens a small paper card listing every CV version.
// `inline` shows the list directly (used in the mobile menu).
export default function CvMenu({ inline = false, onPick }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e) => !rootRef.current?.contains(e.target) && setOpen(false)
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (inline) {
    return (
      <div className="rounded-wobbly-md border-2 border-dashed border-pencil/50 bg-white p-3">
        <p className="px-3 pb-1 font-hand text-lg text-pen">Download my CV — pick a version:</p>
        <CvLinks onPick={onPick} />
      </div>
    )
  }

  return (
    <div ref={rootRef} className="relative">
      <Button
        size="sm"
        className="rotate-1"
        aria-expanded={open}
        aria-controls="cv-menu"
        onClick={() => setOpen((o) => !o)}
      >
        Download CV {open ? '↑' : '↓'}
      </Button>

      {open && (
        <div
          id="cv-menu"
          className="absolute top-full right-0 z-40 mt-4 w-72 origin-top-right animate-pop-in -rotate-1 rounded-wobbly-md border-2 border-pencil bg-paper p-3 shadow-hard"
        >
          <p className="px-3 pb-1 font-hand text-lg text-pen">Which version would you like?</p>
          <CvLinks onPick={() => setOpen(false)} />
        </div>
      )}
    </div>
  )
}
