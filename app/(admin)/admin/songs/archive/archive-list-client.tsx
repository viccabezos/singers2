"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import type { Song } from "@/shared/types/song";
import { restoreSongAction, deleteSongAction } from "./actions";

interface ArchiveListClientProps {
  songs: Song[];
}

export function ArchiveListClient({ songs: initialSongs }: ArchiveListClientProps) {
  const router = useRouter();
  const [songs, setSongs] = useState(initialSongs);

  const handleRestore = async (id: string) => {
    if (!confirm("Are you sure you want to restore this song?")) return;

    const result = await restoreSongAction(id);
    if (result.error) {
      toast.error("Failed to restore song", {
        description: result.error,
      });
      return;
    }

    toast.success("Song restored successfully");
    setSongs(songs.filter((s) => s.id !== id));
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this song? This cannot be undone.")) {
      return;
    }

    const result = await deleteSongAction(id);
    if (result.error) {
      toast.error("Failed to delete song", {
        description: result.error,
      });
      return;
    }

    toast.success("Song deleted permanently");
    setSongs(songs.filter((s) => s.id !== id));
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-4 dark:bg-black sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50 sm:text-3xl">
              Archived Songs
            </h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Restore or permanently delete archived songs
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-white shadow-sm dark:bg-zinc-900">
          {songs.length === 0 ? (
            <div className="p-8 text-center text-zinc-600 dark:text-zinc-400">
              No archived songs
            </div>
          ) : (
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {songs.map((song) => (
                <div
                  key={song.id}
                  className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-12 sm:items-center"
                >
                  <div className="col-span-6">
                    <div className="font-medium text-zinc-900 dark:text-zinc-50">{song.title}</div>
                    {song.artist_composer && (
                      <div className="text-sm text-zinc-600 dark:text-zinc-400">
                        {song.artist_composer}
                      </div>
                    )}
                  </div>
                  <div className="col-span-3 text-sm text-zinc-600 dark:text-zinc-400">
                    {song.language || "-"}
                  </div>
                  <div className="col-span-3 flex gap-2">
                    <button
                      onClick={() => handleRestore(song.id)}
                      className="rounded-md bg-green-600 px-3 py-1 text-sm font-medium text-white transition-colors hover:bg-green-700"
                    >
                      Restore
                    </button>
                    <button
                      onClick={() => handleDelete(song.id)}
                      className="rounded-md bg-red-600 px-3 py-1 text-sm font-medium text-white transition-colors hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4">
          <Link
            href="/admin/songs"
            className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            ← Back to Songs
          </Link>
        </div>
      </div>
    </div>
  );
}

