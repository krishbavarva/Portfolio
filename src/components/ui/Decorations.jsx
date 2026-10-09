// Paper props and pen doodles shared across the site. All are decorative (aria-hidden).

export function Tape({ className = '' }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute -top-3.5 left-1/2 z-10 h-7 w-24 -translate-x-1/2 -rotate-2 border border-pencil/10 bg-erased/80 ${className}`}
    />
  )
}

export function Tack({ className = '' }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute -top-3 left-1/2 z-10 size-6 -translate-x-1/2 rounded-full border-2 border-pencil bg-marker shadow-hard-sm ${className}`}
    >
      <span className="absolute top-1 left-1 size-1.5 rounded-full bg-white/80" />
    </span>
  )
}

// Wavy marker stroke, drawn under a word.
export function Scribble({ className = '' }) {
  return (
    <svg aria-hidden viewBox="0 0 200 14" preserveAspectRatio="none" className={className} fill="none">
      <path
        d="M3 9 C 28 3, 52 13, 78 7 S 128 2, 152 8 S 186 11, 197 5"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  )
}

// Loose pen circle, drawn around a word.
export function ScribbleCircle({ className = '' }) {
  return (
    <svg aria-hidden viewBox="0 0 220 90" preserveAspectRatio="none" className={className} fill="none">
      <path
        d="M30 20 C 70 2, 170 4, 205 30 C 230 52, 180 86, 105 84 C 40 82, 4 66, 10 42 C 14 26, 40 14, 80 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

// Dashed hand-drawn arrow that curves down and to the left.
export function HandArrow({ className = '' }) {
  return (
    <svg aria-hidden viewBox="0 0 130 90" className={className} fill="none">
      <path
        d="M122 8 C 96 4, 60 14, 44 40 C 34 56, 30 66, 24 80"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="7 7"
      />
      <path d="M12 66 L 23 82 L 38 70" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Dashed squiggle that runs edge to edge of its box, used to link steps.
// non-scaling-stroke keeps the line and dashes the same at any width.
export function Squiggle({ className = '' }) {
  return (
    <svg aria-hidden viewBox="0 0 200 24" preserveAspectRatio="none" className={className} fill="none">
      <path
        d="M1 13 C 25 3, 50 21, 75 12 S 125 3, 150 12 S 185 19, 199 11"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="9 8"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

// Little four-point sparkle.
export function Sparkle({ className = '' }) {
  return (
    <svg aria-hidden viewBox="0 0 40 40" className={className} fill="none">
      <path
        d="M20 3 C 21 14, 25 18, 37 20 C 25 22, 21 26, 20 37 C 19 26, 15 22, 3 20 C 15 18, 19 14, 20 3 Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}
