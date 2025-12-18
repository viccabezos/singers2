"use client";

import Link from "next/link";
import type { Playlist, PlaylistSong } from "@/shared/types/playlist";
import type { Song } from "@/shared/types/song";

interface PlaylistDisplayProps {
  playlist: Playlist;
  songs: (PlaylistSong & { song: Song })[];
}

export function PlaylistDisplay({ playlist, songs }: PlaylistDisplayProps) {
  return (
    <div className="min-h-screen bg-zinc-50 p-4 dark:bg-black sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold tracking-tight text-black dark:text-zinc-50 sm:text-2xl">
            {playlist.name}
          </h1>
          {playlist.description && (
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              {playlist.description}
            </p>
          )}
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-500">
            {songs.length} {songs.length === 1 ? "song" : "songs"}
          </p>
        </div>

        {/* Songs List */}
        <div className="rounded-lg bg-white shadow-sm dark:bg-zinc-900">
          {songs.length === 0 ? (
            <div className="p-8 text-center text-zinc-600 dark:text-zinc-400">
              No songs in this playlist
            </div>
          ) : (
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {songs.map((item, index) => (
                <Link
                  key={item.id}
                  href={`/song/${item.song_id}`}
                  className="flex items-center gap-4 p-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-sm font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-zinc-900 dark:text-zinc-50 truncate">
                      {item.song.title}
                    </div>
                    {item.song.artist_composer && (
                      <div className="text-sm text-zinc-600 dark:text-zinc-400 truncate">
                        {item.song.artist_composer}
                      </div>
                    )}
                  </div>
                  <div className="text-zinc-400 dark:text-zinc-600">
                    →
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

