import { useRef } from 'react'
import { FALLBACK_POSTER } from '../api/tvmaze.js'

function Arrow({ direction, onClick }) {
  const left = direction === 'left'
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={left ? 'Scroll left' : 'Scroll right'}
      className={`absolute inset-y-0 z-10 hidden w-10 items-center justify-center bg-black/50 text-3xl opacity-0 transition group-hover/row:opacity-100 hover:bg-black/70 md:flex lg:w-14 ${
        left ? 'left-0' : 'right-0'
      }`}
    >
      {left ? '‹' : '›'}
    </button>
  )
}

/**
 * A horizontally scrolling row of posters. With `ranked`, shows Netflix's
 * "Top 10" style with big outlined numbers beside each poster.
 */
export default function Row({ title, shows, onSelect, ranked = false }) {
  const scroller = useRef(null)

  const scroll = (dir) => {
    const el = scroller.current
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: 'smooth' })
  }

  if (!shows.length) return null

  return (
    <section className="group/row relative mb-8 sm:mb-10">
      <h2 className="mb-2 px-4 text-lg font-bold text-gray-100 sm:px-8 sm:text-xl lg:px-14 lg:text-2xl">{title}</h2>
      <div className="relative">
        <Arrow direction="left" onClick={() => scroll(-1)} />
        <ul
          ref={scroller}
          className="no-scrollbar flex snap-x gap-2 overflow-x-auto scroll-px-4 px-4 py-3 sm:scroll-px-8 sm:px-8 lg:scroll-px-14 lg:px-14"
        >
          {shows.map((show, i) => (
            <li key={show.id} className="flex shrink-0 snap-start items-end">
              {ranked && (
                <span
                  aria-hidden="true"
                  className="-mr-3 select-none text-[6.5rem] font-black leading-[0.75] tracking-tighter text-surface [-webkit-text-stroke:3px_#595959] sm:text-[9rem]"
                >
                  {i + 1}
                </span>
              )}
              <button
                type="button"
                onClick={() => onSelect(show)}
                aria-label={`${ranked ? `Number ${i + 1}: ` : ''}${show.name}, see details`}
                className="relative w-28 overflow-hidden rounded transition duration-300 hover:z-10 hover:scale-110 focus-visible:scale-110 focus-visible:outline-2 focus-visible:outline-white sm:w-36 lg:w-44"
              >
                <img
                  src={show.image?.medium || FALLBACK_POSTER}
                  alt=""
                  loading="lazy"
                  className="aspect-2/3 w-full bg-card object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
        <Arrow direction="right" onClick={() => scroll(1)} />
      </div>
    </section>
  )
}
