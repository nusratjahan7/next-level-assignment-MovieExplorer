import { useCallback, useEffect, useMemo, useState } from 'react'
import { getAllShows } from '../api/tvmaze.js'
import Hero from '../components/Hero.jsx'
import Row from '../components/Row.jsx'
import MovieModal from '../components/MovieModal.jsx'

const GENRE_ROWS = [
  ['Drama', 'Critically Acclaimed Dramas'],
  ['Comedy', 'Comedies'],
  ['Action', 'Action & Adventure'],
  ['Crime', 'Crime TV Shows'],
  ['Thriller', 'Thrillers'],
  ['Science-Fiction', 'Sci-Fi'],
  ['Horror', 'Horror'],
  ['Romance', 'Romantic Favorites'],
  ['Family', 'Family Time'],
]

const byRating = (a, b) => (b.rating?.average ?? 0) - (a.rating?.average ?? 0)

function SkeletonRow() {
  return (
    <div className="mb-10 px-4 sm:px-8 lg:px-14">
      <div className="mb-3 h-5 w-48 animate-pulse rounded bg-neutral-800" />
      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="aspect-2/3 w-28 shrink-0 animate-pulse rounded bg-neutral-800 sm:w-36 lg:w-44" />
        ))}
      </div>
    </div>
  )
}

export default function Home() {
  const [state, setState] = useState({ shows: [], featured: null, error: null })
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    let active = true
    getAllShows()
      .then((shows) => {
        if (!active) return
        // Feature a random pick from the best-rated shows each visit
        const top = shows.filter((s) => s.image).sort(byRating).slice(0, 15)
        setState({ shows, featured: top[Math.floor(Math.random() * top.length)], error: null })
      })
      .catch((err) => active && setState((s) => ({ ...s, error: err.message })))
    return () => {
      active = false
    }
  }, [])

  const rows = useMemo(() => {
    const { shows } = state
    if (!shows.length) return []
    return [
      { title: 'Top 10 Shows Today', shows: [...shows].sort(byRating).slice(0, 10), ranked: true },
      { title: 'Trending Now', shows: [...shows].sort((a, b) => b.weight - a.weight).slice(0, 20) },
      ...GENRE_ROWS.map(([genre, title]) => ({
        title,
        shows: shows.filter((s) => s.genres.includes(genre)).sort(byRating).slice(0, 20),
      })),
    ]
  }, [state])

  const closeModal = useCallback(() => setSelected(null), [])

  return (
    <>
      <Hero featured={state.featured} onMoreInfo={setSelected} />

      {/* Rows slide up over the bottom of the billboard, like Netflix */}
      <div className="relative z-10 mt-[-12svh] sm:mt-[-16svh]">
        {state.error ? (
          <p className="px-4 text-gray-300 sm:px-8 lg:px-14">Couldn’t load titles: {state.error}</p>
        ) : rows.length === 0 ? (
          Array.from({ length: 3 }, (_, i) => <SkeletonRow key={i} />)
        ) : (
          rows.map((row) => <Row key={row.title} {...row} onSelect={setSelected} />)
        )}
      </div>

      {selected && <MovieModal show={selected} onClose={closeModal} />}
    </>
  )
}
