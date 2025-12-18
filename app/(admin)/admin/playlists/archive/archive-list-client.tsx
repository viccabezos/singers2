"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import type { PlaylistWithSongCount } from "@/shared/types/playlist";
import { restorePlaylistAction, deletePlaylistAction } from "./actions";
import { Breadcrumbs } from "@/shared/ui/breadcrumbs";

interface ArchiveListClientProps {
  playlists: PlaylistWithSongCount[];
}

export function ArchiveListClient({ playlists: initialPlaylists }: ArchiveListClientProps) {
  const router = useRouter();
  const [playlists, setPlaylists] = useState(initialPlaylists);

  const handleRestore = async (id: string) => {
    if (!confirm("Are you sure you want to restore this playlist?")) return;

    const result = await restorePlaylistAction(id);
    if (result.error) {
      toast.error("Failed to restore playlist", {
        description: result.error,
      });
      return;
    }

    toast.success("Playlist restored successfully");
    setPlaylists(playlists.filter((p) => p.id !== id));
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this playlist? This cannot be undone.")) {
      return;
    }

    const result = await deletePlaylistAction(id);
    if (result.error) {
      toast.error("Failed to delete playlist", {
        description: result.error,
      });
      return;
    }

    toast.success("Playlist deleted permanently");
    setPlaylists(playlists.filter((p) => p.id !== id));
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-4 dark:bg-black sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <Breadcrumbs
          items={[
            { label: "Dashboard", href: "/admin/dashboard" },
            { label: "Playlists", href: "/admin/playlists" },
            { label: "Archive" },
          ]}
        />
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50 sm:text-3xl">
              Archived Playlists
            </h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Restore or permanently delete archived playlists
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-white shadow-sm dark:bg-zinc-900">
          {playlists.length === 0 ? (
            <div className="p-8 text-center text-zinc-600 dark:text-zinc-400">
              No archived playlists
            </div>
          ) : (
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-12 sm:items-center"
                >
                  <div className="col-span-6">
                    <div className="font-medium text-zinc-900 dark:text-zinc-50">{playlist.name}</div>
                    {playlist.description && (
                      <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-1">
                        {playlist.description}
                      </div>
                    )}
                  </div>
                  <div className="col-span-3 text-sm text-zinc-600 dark:text-zinc-400">
                    {playlist.song_count} {playlist.song_count === 1 ? "song" : "songs"}
                  </div>
                  <div className="col-span-3 flex gap-2">
                    <button
                      onClick={() => handleRestore(playlist.id)}
                      className="rounded-md bg-green-600 px-3 py-1 text-sm font-medium text-white transition-colors hover:bg-green-700"
                    >
                      Restore
                    </button>
                    <button
                      onClick={() => handleDelete(playlist.id)}
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
            href="/admin/playlists"
            className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            ← Back to Playlists
          </Link>
        </div>
      </div>
    </div>
  );
}

