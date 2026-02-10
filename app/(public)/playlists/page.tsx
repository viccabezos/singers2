import Link from "next/link";
import { ListMusic } from "lucide-react";
import { getVisiblePlaylists } from "@/shared/lib/playlists";

export const metadata = {
  title: "Playlists | Les Chanteurs",
  description: "Browse all playlists from our choir events",
};

export default async function PlaylistsPage() {
  const playlists = await getVisiblePlaylists();

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Playlists
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Explore our playlists from various choir events
          </p>
        </div>

        {/* Playlists Grid */}
        {playlists.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
              <ListMusic className="h-10 w-10 text-zinc-400" />
            </div>
            <h2 className="mt-6 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              No playlists available
            </h2>
            <p className="mt-2 max-w-md text-zinc-600 dark:text-zinc-400">
              Check back later for new playlists from our upcoming events.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {playlists.map((playlist) => (
              <Link
                key={playlist.id}
                href={`/playlist/${playlist.id}`}
                className="group rounded-lg border border-zinc-200 bg-white p-6 transition-all hover:border-indigo-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-indigo-700"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
                    <ListMusic className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
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
        )}
      </main>
    </div>
  );
}
