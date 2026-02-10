import Link from "next/link";
import { Music } from "lucide-react";
import { getFeaturedPlaylists } from "@/shared/lib/playlists";

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

export async function FeaturedPlaylists() {
  const playlists = await getFeaturedPlaylists();

  // If no featured playlists, show skeletons as placeholder
  if (playlists.length === 0) {
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
          {playlists.map((playlist) => (
            <Link
              key={playlist.id}
              href={`/playlist/${playlist.id}`}
              className="group relative overflow-hidden rounded-lg border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-indigo-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-indigo-700"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
                  <Music className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 truncate">
                    {playlist.name}
                  </h3>
                  {playlist.description && (
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                      {playlist.description}
                    </p>
                  )}
                  <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-500">
                    {playlist.song_count} {playlist.song_count === 1 ? "song" : "songs"}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
