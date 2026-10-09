import { useState } from 'react'

// Lazy-loaded drawing that falls back to a titled placeholder if the file is missing.
export default function ArtImage({ src, alt, className = '', eager = false, position }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <span
        role="img"
        aria-label={alt}
        className={`grid place-items-center bg-erased p-6 text-center font-display text-2xl text-pencil/40 ${className}`}
      >
        {alt}
      </span>
    )
  }

  return (
    <img
      className={className}
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
      style={position ? { objectPosition: position } : undefined}
    />
  )
}
