import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="flex min-h-svh flex-col items-center justify-center bg-radial from-neutral-800 to-surface px-4 text-center">
      <h1 className="text-5xl font-black sm:text-7xl">Lost your way?</h1>
      <p className="mt-5 max-w-md text-lg text-gray-300 sm:text-xl">
        Sorry, we can’t find that page. You’ll find lots to explore on the home page.
      </p>
      <Link
        to="/"
        className="mt-8 min-h-11 rounded bg-white px-8 py-3 font-bold text-black transition hover:bg-white/75"
      >
        MovieExplorer Home
      </Link>
      <p className="mt-10 border-l-2 border-brand-600 pl-3 text-lg text-gray-400">
        Error Code <span className="font-bold text-white">404</span>
      </p>
    </section>
  )
}
