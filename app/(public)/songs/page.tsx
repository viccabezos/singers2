import Link from "next/link";
import { Music, Search } from "lucide-react";
import { getVisibleSongs } from "@/shared/lib/songs";

export const metadata = {
  title: "Songs | Les Chanteurs",
  description: "Browse all songs in our choir repertoire",
};

interface SongsPageProps {
  searchParams: Promise<{ search?: string }>;
}

export default async function SongsPage({ searchParams }: SongsPageProps) {
  const params = await searchParams;
  const searchQuery = params.search || "";
  
  const songs = await getVisibleSongs(searchQuery);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Songs
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Browse our complete collection of choir songs
          </p>
        </div>
      {/* Search */}
      <div className="mb-8">
        <form action="/songs" method="GET" className="max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              name="search"
              placeholder="Search songs..."
              defaultValue={searchQuery}
              className="w-full rounded-lg border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-zinc-900 placeholder:text-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
            />
          </div>
        </form>
      </div>

      {/* Songs Grid */}
      {songs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
            <Music className="h-10 w-10 text-zinc-400" />
          </div>
          <h2 className="mt-6 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            {searchQuery ? "No songs found" : "No songs available"}
          </h2>
          <p className="mt-2 max-w-md text-zinc-600 dark:text-zinc-400">
            {searchQuery
              ? `No songs match your search for "${searchQuery}". Try a different search term.`
              : "Check back later for new songs in our repertoire."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {songs.map((song) => (
            <Link
              key={song.id}
              href={`/song/${song.id}`}
              className="group rounded-lg border border-zinc-200 bg-white p-6 transition-all hover:border-indigo-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-indigo-700"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
                  <Music className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 truncate">
                    {song.title}
                  </h3>
                  {song.artist_composer && (
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {song.artist_composer}
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-2">
                    {song.language && (
                      <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                        {song.language}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {songs.length > 0 && searchQuery && (
        <div className="mt-8 text-center">
          <Link
            href="/songs"
            className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Clear search
          </Link>
        </div>
      )}
      </main>
    </div>
  );
}
