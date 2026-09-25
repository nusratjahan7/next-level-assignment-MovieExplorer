import { FALLBACK_POSTER, getMatch, getRating, getYear } from '../api/tvmaze.js'

export default function MovieCard({ show, onSelect }) {
  const match = getMatch(show)

  return (
    <article className="group flex flex-col overflow-hidden rounded-md bg-card shadow-lg shadow-black/40 transition duration-300 hover:z-10 hover:scale-[1.04] hover:shadow-2xl hover:shadow-black/80">
      <div className="relative aspect-2/3 overflow-hidden">
        <img
          src={show.image?.medium || FALLBACK_POSTER}
          alt={`${show.name} poster`}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        {show.rating?.average >= 8 && (
          <span className="absolute right-0 top-0 flex h-10 w-8 flex-col items-center justify-center rounded-bl bg-brand-600 text-[9px] font-bold leading-tight">
            TOP
            <span className="text-sm">10</span>
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        <h3 className="line-clamp-1 font-bold" title={show.name}>
          {show.name}
        </h3>

        <p className="flex flex-wrap items-center gap-2 text-xs font-medium sm:text-sm">
          {match && <span className="font-bold text-match">{match}</span>}
          <span className="border border-white/40 px-1.5 text-gray-200">⭐ {getRating(show)}</span>
          <span className="text-gray-300">📅 {getYear(show)}</span>
        </p>

        {show.genres?.length > 0 && (
          <p className="line-clamp-1 text-xs text-gray-400">
            {show.genres.slice(0, 3).join(' • ')}
          </p>
        )}

        <button
          type="button"
          onClick={() => onSelect(show)}
          className="mt-auto flex min-h-11 w-full items-center justify-center gap-2 rounded bg-white/10 px-4 text-sm font-semibold transition hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-white"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
            <circle cx="12" cy="12" r="9.5" />
            <path strokeLinecap="round" d="M12 11v6M12 7.5v.01" />
          </svg>
          See Details
        </button>
      </div>
    </article>
  )
}
