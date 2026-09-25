import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMatch, getShowImages, getYear, pickBackdrop, stripHtml } from '../api/tvmaze.js'

/** Netflix-style billboard: a featured show filling the top of the home page. */
export default function Hero({ featured, onMoreInfo }) {
  const [backdrop, setBackdrop] = useState({ id: null, url: null })

  useEffect(() => {
    if (!featured) return
    const controller = new AbortController()
    getShowImages(featured.id, controller.signal)
      .then((images) => setBackdrop({ id: featured.id, url: pickBackdrop(images) }))
      .catch(() => {})
    return () => controller.abort()
  }, [featured])

  const wideImage = backdrop.id === featured?.id ? backdrop.url : null
  const image = wideImage || featured?.image?.original
  const summary = stripHtml(featured?.summary)

  return (
    <section className="relative isolate flex h-[85svh] min-h-[520px] items-end overflow-hidden sm:h-[95svh]">
      {/* Backdrop */}
      <div className="absolute inset-0 -z-20 bg-linear-to-br from-red-950 via-surface to-black">
        {image && (
          <img
            key={image}
            src={image}
            alt=""
            aria-hidden="true"
            className={`h-full w-full animate-[fadeIn_1s_ease] object-cover ${wideImage ? 'object-top' : 'object-[center_20%]'}`}
          />
        )}
      </div>
      {/* Left vignette + bottom fade into the page, like Netflix's billboard */}
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-black/85 via-black/40 to-transparent" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-2/5 bg-linear-to-t from-surface via-surface/60 to-transparent" aria-hidden="true" />

      <div className="w-full px-4 pb-[18svh] sm:px-8 sm:pb-[22svh] lg:px-14">
        <div className="max-w-xl">
          <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-gray-200 sm:text-sm">
            <span className="font-display text-2xl leading-none tracking-normal text-brand-600">M</span>
            Discover Movies
          </p>

          <h1 className="text-4xl font-black leading-[0.95] tracking-tight drop-shadow-lg sm:text-6xl lg:text-7xl">
            {featured ? featured.name : 'Unlimited movies, shows and more.'}
          </h1>

          {featured && (
            <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium">
              {getMatch(featured) && <span className="font-bold text-match">{getMatch(featured)}</span>}
              <span>{getYear(featured)}</span>
              {featured.genres?.slice(0, 3).map((g, i) => (
                <span key={g} className="text-gray-300">
                  {i > 0 && <span className="mr-3 text-gray-500">•</span>}
                  {g}
                </span>
              ))}
            </p>
          )}

          <p className="mt-4 line-clamp-3 text-sm text-gray-100 drop-shadow sm:text-lg">
            {summary ||
              'Explore and discover your favorite movies from around the world. Search any title, check ratings and dive into the details.'}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/movies"
              className="flex min-h-11 items-center gap-2 rounded bg-white px-6 py-2 text-base font-bold text-black transition hover:bg-white/75 sm:px-8 sm:text-lg"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M6 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L7.5 3.64A1 1 0 0 0 6 4.5Z" />
              </svg>
              Explore Now
            </Link>
            {featured && (
              <button
                type="button"
                onClick={() => onMoreInfo(featured)}
                className="flex min-h-11 items-center gap-2 rounded bg-gray-500/70 px-6 py-2 text-base font-bold transition hover:bg-gray-500/50 sm:px-8 sm:text-lg"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="12" cy="12" r="9.5" />
                  <path strokeLinecap="round" d="M12 11v6M12 7.5v.01" />
                </svg>
                More Info
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
