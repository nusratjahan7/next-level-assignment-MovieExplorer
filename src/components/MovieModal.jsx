import { useEffect, useRef, useState } from 'react'
import {
  FALLBACK_POSTER,
  getMatch,
  getRating,
  getShowDetails,
  getYear,
  pickBackdrop,
  stripHtml,
} from '../api/tvmaze.js'

function Meta({ label, children }) {
  if (!children || (Array.isArray(children) && children.length === 0)) return null
  return (
    <p className="text-sm leading-relaxed">
      <span className="text-muted">{label}: </span>
      <span className="text-gray-100">{children}</span>
    </p>
  )
}

export default function MovieModal({ show, onClose }) {
  const [details, setDetails] = useState(null)
  const closeRef = useRef(null)

  // Fetch cast, crew and backdrop images for the selected show
  useEffect(() => {
    const controller = new AbortController()
    getShowDetails(show.id, controller.signal)
      .then(setDetails)
      .catch(() => {}) // fall back to the data we already have
    return () => controller.abort()
  }, [show.id])

  // Close on Escape, lock page scroll, and move focus into the dialog
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose])

  const data = details?.id === show.id ? details : show
  const embedded = data._embedded ?? {}
  const backdrop = pickBackdrop(embedded.images)
  const image = backdrop || data.image?.original || data.image?.medium || FALLBACK_POSTER
  // One actor can play several characters (e.g. Orphan Black) — merge them into one entry
  const cast = Object.values(
    (embedded.cast ?? []).reduce((acc, { person, character }) => {
      if (acc[person.id]) acc[person.id].roles.push(character.name)
      else acc[person.id] = { person, roles: [character.name] }
      return acc
    }, {}),
  ).slice(0, 8)
  const creators = [
    ...new Set((embedded.crew ?? []).filter((c) => c.type === 'Creator').map((c) => c.person.name)),
  ]
  const summary = stripHtml(data.summary) || 'No overview available.'
  const match = getMatch(data)
  const network = data.network?.name || data.webChannel?.name
  const schedule =
    data.schedule?.days?.length > 0 &&
    `${data.schedule.days.join(', ')}${data.schedule.time ? ` at ${data.schedule.time}` : ''}`

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 sm:px-4 sm:py-8"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
        className="relative mx-auto min-h-full w-full max-w-4xl animate-[modalIn_0.25s_ease-out] overflow-hidden bg-card shadow-2xl shadow-black sm:min-h-0 sm:rounded-lg"
      >
        {/* ✕ close */}
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close details"
          className="absolute right-3 top-3 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-card text-lg transition hover:bg-neutral-700 sm:right-4 sm:top-4"
        >
          ✕
        </button>

        {/* Backdrop with title over it */}
        <div className="relative aspect-video max-h-[60svh] w-full overflow-hidden bg-neutral-900">
          <img
            src={image}
            alt={`${data.name} backdrop`}
            className={`h-full w-full object-cover ${backdrop ? '' : 'object-[center_20%]'}`}
          />
          <div className="absolute inset-0 bg-linear-to-t from-card via-card/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-10">
            <h2 id="modal-title" className="max-w-lg text-3xl font-black leading-none drop-shadow-lg sm:text-5xl">
              {data.name}
            </h2>
            {data.officialSite && (
              <a
                href={data.officialSite}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex min-h-11 items-center gap-2 rounded bg-white px-6 text-base font-bold text-black transition hover:bg-white/75"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M6 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L7.5 3.64A1 1 0 0 0 6 4.5Z" />
                </svg>
                Watch
              </a>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="grid gap-6 px-5 pb-8 pt-2 sm:px-10 md:grid-cols-[2fr_1fr] md:gap-10">
          <div>
            <p className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-medium sm:text-base">
              {match && <span className="font-bold text-match">{match}</span>}
              <span className="text-gray-200">⭐ Rating: {getRating(data)}</span>
              <span className="text-gray-500" aria-hidden="true">|</span>
              <span className="text-gray-200">📅 Release: {data.premiered || getYear(data)}</span>
              {data.runtime && <span className="text-gray-200">{data.runtime}m</span>}
              <span className="rounded-sm border border-white/40 px-1.5 text-[11px] font-semibold text-gray-200">HD</span>
            </p>
            {data.status && (
              <p className="mt-2 text-sm text-gray-300">
                {data.status === 'Running' ? '● Currently airing' : `Status: ${data.status}`}
                {data.ended && ` · Ended ${data.ended}`}
              </p>
            )}

            <h3 className="mt-5 font-bold">Overview:</h3>
            <p className="mt-1 leading-relaxed text-gray-100">{summary}</p>
          </div>

          <div className="space-y-3">
            <Meta label="Cast">{cast.slice(0, 4).map((c) => c.person.name).join(', ')}</Meta>
            <Meta label="Genres">{data.genres?.join(', ')}</Meta>
            <Meta label="Created by">{creators.join(', ')}</Meta>
            <Meta label="Network">{network}</Meta>
            <Meta label="Language">{data.language}</Meta>
          </div>
        </div>

        {/* Cast strip */}
        {cast.length > 0 && (
          <div className="border-t border-neutral-700 px-5 py-6 sm:px-10">
            <h3 className="mb-4 text-xl font-bold">Top Cast</h3>
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {cast.map(({ person, roles }) => (
                <li key={person.id} className="flex items-center gap-3">
                  <img
                    src={person.image?.medium || FALLBACK_POSTER}
                    alt=""
                    loading="lazy"
                    className="h-12 w-12 shrink-0 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{person.name}</p>
                    <p className="truncate text-xs text-muted" title={roles.join(', ')}>
                      {roles.join(', ')}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* About */}
        <div className="border-t border-neutral-700 px-5 py-6 sm:px-10">
          <h3 className="mb-3 text-xl">
            About <span className="font-bold">{data.name}</span>
          </h3>
          <div className="space-y-1.5">
            <Meta label="Type">{data.type}</Meta>
            <Meta label="Schedule">{schedule}</Meta>
            <Meta label="Premiered">{data.premiered}</Meta>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="min-h-11 rounded bg-brand-600 px-6 text-sm font-bold transition hover:bg-brand-500"
            >
              ❌ Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
