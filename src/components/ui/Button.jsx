import { Link } from 'react-router-dom'

// Wobbly button that "presses flat": the hard shadow shrinks on hover and disappears on click.
const base =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-wobbly border-[3px] border-pencil px-6 py-2 ' +
  'font-hand text-lg shadow-hard transition-[translate,box-shadow,background-color,color,rotate] duration-100 ' +
  'hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-hard-sm ' +
  'active:translate-x-[4px] active:translate-y-[4px] active:shadow-none md:text-xl ' +
  'disabled:pointer-events-none disabled:opacity-40'

const variants = {
  primary: 'bg-white text-pencil hover:bg-marker hover:text-white',
  secondary: 'bg-erased text-pencil hover:bg-pen hover:text-white',
  ink: 'bg-pencil text-paper hover:bg-marker hover:text-white',
}

const sizes = {
  md: '',
  sm: 'min-h-11 px-4 text-base md:text-lg',
}

export function buttonClasses({ variant = 'primary', size = 'md', className = '' } = {}) {
  return `${base} ${variants[variant]} ${sizes[size]} ${className}`
}

// Renders a router <Link> (to), an <a> (href) or a <button>.
export default function Button({ to, href, variant, size, className, children, ...rest }) {
  const classes = buttonClasses({ variant, size, className })
  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    )
  }
  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    )
  }
  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  )
}
