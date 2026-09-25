export default function CardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-md bg-card">
      <div className="aspect-2/3 bg-neutral-800" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 rounded bg-neutral-800" />
        <div className="h-3 w-1/2 rounded bg-neutral-800" />
        <div className="h-11 rounded bg-neutral-800" />
      </div>
    </div>
  )
}
