import { Tack, Tape } from './Decorations.jsx'

const tones = {
  white: 'bg-white',
  postit: 'bg-postit',
  erased: 'bg-erased',
}

// Paper card with a wobbly outline. `decoration` adds tape or a thumbtack at the top.
export default function Card({
  as: Tag = 'div',
  tone = 'white',
  decoration,
  className = '',
  children,
  ...rest
}) {
  return (
    <Tag
      className={`relative rounded-wobbly-md border-2 border-pencil shadow-faint ${tones[tone]} ${className}`}
      {...rest}
    >
      {decoration === 'tape' && <Tape />}
      {decoration === 'tack' && <Tack />}
      {children}
    </Tag>
  )
}
