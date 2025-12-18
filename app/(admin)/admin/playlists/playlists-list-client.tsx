"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import type { PlaylistWithSongCount, PlaylistStatus } from "@/shared/types/playlist";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/shared/ui/breadcrumbs";

interface PlaylistsListClientProps {
  playlists: PlaylistWithSongCount[];
}

const STATUS_BADGES: Record<PlaylistStatus, { label: string; className: string }> = {
  visible: {
    label: "Visible",
    className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
  hidden: {
    label: "Hidden",
    className: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  archived: {
    label: "Archived",
    className: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200",
  },
};

export function PlaylistsListClient({ playlists: initialPlaylists }: PlaylistsListClientProps) {
  const router = useRouter();
  const [playlists, setPlaylists] = useState(initialPlaylists);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    setPlaylists(initialPlaylists);
  }, [initialPlaylists]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (statusFilter !== "all") params.set("status", statusFilter);
    router.push(`/admin/playlists?${params.toString()}`);
  };

  const handleArchive = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to archive "${name}"?`)) {
      return;
    }

    try {
      const { archivePlaylistAction } = await import("./[id]/actions");
      const result = await archivePlaylistAction(id);

      if (result.error) {
        toast.error("Failed to archive playlist", {
          description: result.error,
        });
        return;
      }

      setPlaylists((prev) => prev.filter((p) => p.id !== id));
      toast.success("Playlist archived successfully");
      router.refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to archive playlist";
      toast.error("Failed to archive playlist", {
        description: errorMessage,
      });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-4 dark:bg-black sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <Breadcrumbs
          items={[
            { label: "Dashboard", href: "/admin/dashboard" },
            { label: "Playlists" },
          ]}
        />
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50 sm:text-3xl">
              Playlists
            </h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Manage your playlists
            </p>
          </div>
          <Link
            href="/admin/playlists/new"
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
          >
            Add New Playlist
          </Link>
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4 rounded-lg bg-white p-4 shadow-sm dark:bg-zinc-900 sm:grid sm:grid-cols-3 sm:gap-4">
          <div className="sm:col-span-1">
            <label htmlFor="search" className="block text-sm font-medium text-zinc-900 dark:text-zinc-50">
              Search by name
            </label>
            <input
              id="search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search playlists..."
              className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500"
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-zinc-900 dark:text-zinc-50">
              Status
            </label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            >
              <option value="all">All</option>
              <option value="visible">Visible</option>
              <option value="hidden">Hidden</option>
              <option value="in_progress">In Progress</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleSearch}
              className="w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Playlists List */}
        <div className="rounded-lg bg-white shadow-sm dark:bg-zinc-900">
          {playlists.length === 0 ? (
            <div className="p-8 text-center text-zinc-600 dark:text-zinc-400">
              No playlists found
            </div>
          ) : (
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {/* Header */}
              <div className="hidden grid-cols-12 gap-4 p-4 text-sm font-medium text-zinc-700 dark:text-zinc-300 sm:grid">
                <div className="col-span-5">Name</div>
                <div className="col-span-2">Songs</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-3">Actions</div>
              </div>

              {/* Playlists */}
              {playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-12 sm:items-center"
                >
                  <div className="col-span-5">
                    <div className="font-medium text-zinc-900 dark:text-zinc-50">
                      {playlist.name}
                    </div>
                    {playlist.description && (
                      <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-1">
                        {playlist.description}
                      </div>
                    )}
                  </div>
                  <div className="col-span-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {playlist.song_count} {playlist.song_count === 1 ? "song" : "songs"}
                  </div>
                  <div className="col-span-2">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        STATUS_BADGES[playlist.status].className
                      }`}
                    >
                      {STATUS_BADGES[playlist.status].label}
                    </span>
                  </div>
                  <div className="col-span-3 flex gap-2">
                    <Link
                      href={`/admin/playlists/${playlist.id}`}
                      className="rounded-md bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleArchive(playlist.id, playlist.name)}
                      className="rounded-md bg-red-100 px-3 py-1 text-sm font-medium text-red-900 transition-colors hover:bg-red-200 dark:bg-red-900/20 dark:text-red-200 dark:hover:bg-red-900/30"
                    >
                      Archive
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4">
          <Link
            href="/admin/playlists/archive"
            className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            View Archive →
          </Link>
        </div>
      </div>
    </div>
  );
}

