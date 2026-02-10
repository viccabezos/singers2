function PlaylistSkeleton() {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-zinc-100/60 dark:via-zinc-800/60 to-transparent" />
      
      {/* Skeleton content */}
      <div className="space-y-3">
        <div className="h-6 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-1/2 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-1/3 rounded bg-zinc-200 dark:bg-zinc-800" />
      </div>
    </div>
  );
}

export function FeaturedPlaylists() {
  return (
    <section className="bg-zinc-50 dark:bg-zinc-950/50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Featured Playlists
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Discover our curated collection of songs
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <PlaylistSkeleton />
          <PlaylistSkeleton />
          <PlaylistSkeleton />
        </div>
      </div>
    </section>
  );
}
