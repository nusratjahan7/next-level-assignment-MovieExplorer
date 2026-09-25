# 🎬 MovieExplorer

A responsive, Netflix-inspired React app to browse, search, and explore shows using the free [TVMaze API](https://www.tvmaze.com/api).

## Features

- **Home page**: a transparent navbar that turns solid on scroll, a full-screen billboard for a featured top-rated show (with an **Explore Now** CTA and **More Info**), a Top 10 row with ranked numbers, then Trending and genre rows that scroll sideways.
- **Movie listing** (`/movies`): browse all shows (`GET /shows`) or search by title (`GET /search/shows?q=`) with a debounced live search. The query is kept in the URL.
- **Movie cards**: poster, title, rating, release year, and a *See Details* button, laid out in a responsive CSS grid (1 → 6 columns).
- **Details modal**: a Netflix-style preview with a 16:9 backdrop, % Match, rating, release date, runtime, overview, cast, genres, creators, network and schedule. It closes with ✕, the Close button, a click outside, or Esc.
- Loading skeletons, empty and error states, and a Netflix-style "Browse" menu on mobile.

## Tech

React 19 · Vite · Tailwind CSS v4 · React Router

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build
npm run lint
```

## Structure

```
src/
  api/tvmaze.js          API calls + small helpers
  hooks/useDebounce.js
  components/            Navbar, Logo, Footer, Hero (billboard), Row, SearchBar, MovieCard, CardSkeleton, MovieModal
  pages/                 Home, Movies, NotFound
```
