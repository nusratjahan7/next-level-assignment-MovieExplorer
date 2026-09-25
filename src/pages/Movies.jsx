import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getAllShows, searchShows } from '../api/tvmaze.js'
import useDebounce from '../hooks/useDebounce.js'
import SearchBar from '../components/SearchBar.jsx'
import MovieCard from '../components/MovieCard.jsx'
import CardSkeleton from '../components/CardSkeleton.jsx'
import MovieModal from '../components/MovieModal.jsx'

export default function Movies() {
  // Keep the query in the URL so searches are shareable and survive a refresh
  const [searchParams, setSearchParams] = useSearchParams()
  const urlQuery = searchParams.get('q') ?? ''
  const [query, setQuery] = useState(urlQuery)
  const debouncedQuery = useDebounce(query.trim(), 400)

  // Follow outside navigation to a new ?q= (e.g. footer genre links) without
  // clobbering what the user is typing when the URL is just catching up
  const [seenUrlQuery, setSeenUrlQuery] = useState(urlQuery)
  if (urlQuery !== seenUrlQuery) {
    setSeenUrlQuery(urlQuery)
    if (urlQuery !== debouncedQuery) setQuery(urlQuery)
  }

  const [selected, setSelected] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  // Each result remembers which request produced it; we're loading until it matches the current one
  const requestKey = `${debouncedQuery}|${reloadKey}`
  const [result, setResult] = useState({ key: null, shows: [], error: null })
  const loading = result.key !== requestKey
  const { shows, error } = loading ? { shows: [], error: null } : result

  useEffect(() => {
    setSearchParams(debouncedQuery ? { q: debouncedQuery } : {}, { replace: true })
  }, [debouncedQuery, setSearchParams])

  useEffect(() => {
    const controller = new AbortController()
    const request = debouncedQuery ? searchShows(debouncedQuery, controller.signal) : getAllShows()

    request
      .then((data) => {
        if (!controller.signal.aborted) setResult({ key: requestKey, shows: data, error: null })
      })
      .catch((err) => {
        if (controller.signal.aborted) return
        setResult({ key: requestKey, shows: [], error: err.message || 'Something went wrong' })
      })

    return () => controller.abort()
  }, [debouncedQuery, requestKey])

  const closeModal = useCallback(() => setSelected(null), [])

  return (
    <section className="px-4 pb-10 pt-24 sm:px-8 lg:px-14 lg:pt-28">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">Movies</h1>
          <p className="mt-1 text-sm text-muted sm:text-base">Search thousands of titles by name.</p>
        </div>
        <div className="w-full md:max-w-md">
          <SearchBar value={query} onChange={setQuery} />
        </div>
      </div>

      <p className="mb-4 mt-8 text-sm text-gray-400" aria-live="polite">
        {loading
          ? 'Loading…'
          : error
            ? ''
            : debouncedQuery
              ? <>Explore titles related to: <span className="font-semibold text-white">“{debouncedQuery}”</span> · {shows.length} result{shows.length === 1 ? '' : 's'}</>
              : <>Popular on MovieExplorer · {shows.length} titles</>}
      </p>

      {error ? (
        <div className="rounded-md bg-card p-10 text-center">
          <p className="text-lg font-bold">Couldn’t load movies</p>
          <p className="mt-1 text-sm text-muted">{error}</p>
          <button
            type="button"
            onClick={() => setReloadKey((k) => k + 1)}
            className="mt-5 min-h-11 rounded bg-white px-6 text-sm font-bold text-black hover:bg-white/75"
          >
            Try again
          </button>
        </div>
      ) : !loading && shows.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-lg text-gray-200">
            Your search for “{debouncedQuery}” did not have any matches.
          </p>
          <ul className="mx-auto mt-4 inline-block space-y-1 text-left text-sm text-muted">
            <li>Suggestions:</li>
            <li>• Try different keywords</li>
            <li>• Try a movie or show title</li>
            <li>• Try a genre, like comedy, drama or thriller</li>
          </ul>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-x-3 gap-y-6 min-[420px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {loading
            ? Array.from({ length: 12 }, (_, i) => <CardSkeleton key={i} />)
            : shows.map((show) => <MovieCard key={show.id} show={show} onSelect={setSelected} />)}
        </div>
      )}

      {selected && <MovieModal show={selected} onClose={closeModal} />}
    </section>
  )
}
