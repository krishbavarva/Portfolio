import { useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import ArtImage from './ArtImage.jsx'

const roundButton =
  'grid size-12 place-items-center rounded-blob border-2 border-pencil bg-paper text-pencil shadow-hard-sm ' +
  'transition-[translate,box-shadow,background-color,color] duration-100 hover:bg-marker hover:text-white ' +
  'active:translate-x-[2px] active:translate-y-[2px] active:shadow-none'

export default function Lightbox({ items, index, onClose, onChange }) {
  const closeRef = useRef(null)
  const item = items[index]
  const count = items.length
  const prev = () => onChange((index - 1 + count) % count)
  const next = () => onChange((index + 1) % count)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  // Lock page scroll and move focus into the dialog while it is open.
  useEffect(() => {
    const previousFocus = document.activeElement
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = overflow
      previousFocus?.focus?.()
    }
  }, [])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="fixed inset-0 z-50 grid animate-pop-in grid-cols-1 grid-rows-[1fr_auto] items-center gap-4 bg-pencil/95 p-4 pt-20 md:grid-cols-[3.5rem_1fr_3.5rem] md:grid-rows-1 md:p-8"
    >
      <button ref={closeRef} type="button" aria-label="Close" onClick={onClose} className={`${roundButton} absolute top-5 right-5`}>
        <X strokeWidth={3} className="size-5" />
      </button>

      <button
        type="button"
        aria-label="Previous drawing"
        onClick={prev}
        className={`${roundButton} col-start-1 row-start-2 justify-self-start md:row-start-1`}
      >
        <ChevronLeft strokeWidth={3} className="size-6" />
      </button>

      <figure
        key={item.file}
        className="col-start-1 row-start-1 flex min-w-0 animate-pop-in flex-col items-center gap-3 md:col-start-2"
      >
        <div className="border-2 border-pencil bg-white p-2 shadow-hard-lg md:p-3">
          <ArtImage
            src={item.file}
            alt={item.title}
            eager
            className="block max-h-[calc(100dvh-220px)] max-w-full object-contain md:max-h-[calc(100dvh-170px)]"
          />
        </div>
        <figcaption className="flex gap-4 font-hand text-xl text-paper">
          {item.title}
          <span className="text-paper/50">
            {index + 1} / {count}
          </span>
        </figcaption>
      </figure>

      <button
        type="button"
        aria-label="Next drawing"
        onClick={next}
        className={`${roundButton} col-start-1 row-start-2 justify-self-end md:col-start-3 md:row-start-1`}
      >
        <ChevronRight strokeWidth={3} className="size-6" />
      </button>
    </div>
  )
}
