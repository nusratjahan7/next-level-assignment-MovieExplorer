import { Link } from 'react-router-dom'

const columns = [
  [
    { label: 'Home', to: '/' },
    { label: 'Browse Movies', to: '/movies' },
  ],
  [
    { label: 'Dramas', to: '/movies?q=drama' },
    { label: 'Comedies', to: '/movies?q=comedy' },
  ],
  [
    { label: 'Thrillers', to: '/movies?q=thriller' },
    { label: 'Sci-Fi', to: '/movies?q=science' },
  ],
  [
    { label: 'TVMaze API', href: 'https://www.tvmaze.com/api' },
    { label: 'GitHub', href: 'https://github.com' },
  ],
]

export default function Footer() {
  return (
    <footer className="mx-auto w-full max-w-5xl px-4 pb-10 pt-16 text-sm text-muted sm:px-8">
      <a
        href="https://github.com"
        target="_blank"
        rel="noreferrer"
        aria-label="GitHub"
        className="mb-6 inline-block text-white transition hover:text-gray-300"
      >
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
        </svg>
      </a>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {columns.map((col, i) => (
          <ul key={i} className="space-y-3">
            {col.map((item) => (
              <li key={item.label}>
                {item.href ? (
                  <a href={item.href} target="_blank" rel="noreferrer" className="hover:underline">
                    {item.label}
                  </a>
                ) : (
                  <Link to={item.to} className="hover:underline">
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        ))}
      </div>

      <p className="mt-8 inline-block border border-muted px-2 py-1 text-xs">Data provided by TVMaze</p>
      <p className="mt-5 text-xs">© {new Date().getFullYear()} MovieExplorer. All rights reserved.</p>
    </footer>
  )
}
