import { Link } from 'react-router-dom'

export default function Logo({ className = '' }) {
  return (
    <Link
      to="/"
      aria-label="MovieExplorer home"
      className={`font-display leading-none tracking-wide text-brand-600 drop-shadow ${className}`}
    >
      MOVIEEXPLORER
    </Link>
  )
}
