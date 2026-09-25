export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative">
      <svg
        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2.2"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <path strokeLinecap="round" d="m20 20-3.5-3.5" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search for a movie..."
        aria-label="Search for a movie by title"
        autoFocus
        className="w-full rounded border border-white/60 bg-black/80 py-3.5 pl-12 pr-14 text-base text-white placeholder-gray-400 outline-none transition focus:border-white focus:ring-1 focus:ring-white"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute inset-y-0 right-1 my-auto flex h-11 w-11 items-center justify-center text-gray-300 hover:text-white"
        >
          ✕
        </button>
      )}
    </div>
  )
}
