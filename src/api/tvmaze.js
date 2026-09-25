const BASE_URL = 'https://api.tvmaze.com'

async function request(path, signal) {
  const res = await fetch(`${BASE_URL}${path}`, { signal })
  if (!res.ok) throw new Error(`Request failed (${res.status})`)
  return res.json()
}

// The home rows and the browse page both need /shows, so fetch it once per session.
let allShowsPromise = null

/** GET /shows — first page (~250 shows) of all shows. */
export function getAllShows() {
  if (!allShowsPromise) {
    allShowsPromise = request('/shows').catch((err) => {
      allShowsPromise = null // allow a retry after a failure
      throw err
    })
  }
  return allShowsPromise
}

/** GET /search/shows?q= — results are wrapped as { score, show }. */
export async function searchShows(query, signal) {
  const results = await request(`/search/shows?q=${encodeURIComponent(query)}`, signal)
  return results.map((r) => r.show)
}

/** GET /shows/:id with cast, crew and images embedded — used by the details modal. */
export function getShowDetails(id, signal) {
  return request(`/shows/${id}?embed[]=cast&embed[]=crew&embed[]=images`, signal)
}

/** GET /shows/:id/images — used to find a wide backdrop for the billboard. */
export function getShowImages(id, signal) {
  return request(`/shows/${id}/images`, signal)
}

/** Picks a 16:9 background image from a list of TVMaze images, if there is one. */
export function pickBackdrop(images = []) {
  const backgrounds = images.filter((img) => img.type === 'background')
  const best = backgrounds.find((img) => img.main) || backgrounds[0]
  return best?.resolutions?.original?.url ?? null
}

export function stripHtml(html) {
  if (!html) return ''
  return new DOMParser().parseFromString(html, 'text/html').body.textContent || ''
}

export const FALLBACK_POSTER = 'https://placehold.co/210x295/181818/808080?text=No+Image'

export const getRating = (show) => show.rating?.average ?? 'N/A'

export const getYear = (show) => (show.premiered ? show.premiered.slice(0, 4) : 'N/A')

/** Netflix-style "% Match", derived from the 0–10 rating. */
export const getMatch = (show) =>
  show.rating?.average ? `${Math.round(show.rating.average * 10)}% Match` : null
