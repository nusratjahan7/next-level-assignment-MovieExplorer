import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import Logo from './Logo.jsx'

const links = [
  { to: '/', label: 'Home' },
  { to: '/movies', label: 'Movies' },
  { to: '/movies?q=drama', label: 'New & Popular' },
]

const linkClass = ({ isActive }) =>
  `text-sm transition-colors ${isActive ? 'font-semibold text-white' : 'text-gray-300 hover:text-gray-400'}`

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()

  // Transparent over the billboard, solid once the page scrolls — like Netflix
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${
        scrolled || menuOpen ? 'bg-surface' : 'bg-linear-to-b from-black/80 to-transparent'
      }`}
    >
      <nav className="flex h-16 items-center gap-4 px-4 sm:gap-6 sm:px-8 lg:h-17 lg:px-14">
        <Logo className="text-[1.7rem] sm:text-4xl" />

        {/* Desktop links */}
        <ul className="hidden items-center gap-5 md:flex">
          {links.map((l) => (
            <li key={l.label}>
              {l.to.includes('?') ? (
                <Link to={l.to} className={linkClass({ isActive: false })}>
                  {l.label}
                </Link>
              ) : (
                <NavLink to={l.to} end className={linkClass}>
                  {l.label}
                </NavLink>
              )}
            </li>
          ))}
        </ul>

        {/* Mobile "Browse" dropdown */}
        <div className="relative md:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            className="flex min-h-11 items-center gap-1 text-sm font-semibold"
          >
            Browse <span className={`text-xs transition-transform ${menuOpen ? 'rotate-180' : ''}`}>▼</span>
          </button>
          {menuOpen && (
            <ul className="absolute left-1/2 top-12 w-56 -translate-x-1/2 border-t-2 border-white bg-black/95 py-2 text-center">
              {links.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    onClick={() => setMenuOpen(false)}
                    className="block py-3 text-sm text-gray-300 hover:bg-white/10 hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="ml-auto flex items-center gap-4">
          {pathname !== '/movies' && (
            <Link to="/movies" aria-label="Search movies" className="hidden h-11 w-11 items-center justify-center sm:flex">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                <circle cx="11" cy="11" r="7" />
                <path strokeLinecap="round" d="m20 20-3.5-3.5" />
              </svg>
            </Link>
          )}
          <Link
            to="/movies"
            className="whitespace-nowrap rounded bg-brand-600 px-3 py-1.5 text-sm font-semibold transition hover:bg-brand-500 sm:px-4"
          >
            Browse All
          </Link>
        </div>
      </nav>
    </header>
  )
}
