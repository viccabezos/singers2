"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import type { Song } from "@/shared/types/song";
import { useRouter } from "next/navigation";

interface SongsListClientProps {
  songs: Song[];
  languages: string[];
}

export function SongsListClient({ songs: initialSongs, languages }: SongsListClientProps) {
  const router = useRouter();
  const [songs, setSongs] = useState(initialSongs);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [artistFilter, setArtistFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState<string>("all");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (artistFilter) params.set("artist", artistFilter);
    if (languageFilter) params.set("language", languageFilter);
    if (visibilityFilter !== "all") params.set("visibility", visibilityFilter);
    router.push(`/admin/songs?${params.toString()}`);
  };

  const handleBulkVisibility = async (isVisible: boolean) => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Are you sure you want to ${isVisible ? "show" : "hide"} ${selectedIds.size} song(s)?`)) {
      return;
    }

    try {
      const { bulkUpdateVisibilityAction } = await import("./bulk-visibility/actions");
      const result = await bulkUpdateVisibilityAction(Array.from(selectedIds), isVisible);
      
      if (result.error) {
        toast.error("Failed to update visibility", {
          description: result.error,
        });
        return;
      }

      toast.success(`${selectedIds.size} song(s) visibility updated`);
      router.refresh();
      setSelectedIds(new Set());
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update visibility";
      toast.error("Failed to update visibility", {
        description: errorMessage,
      });
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === songs.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(songs.map((s) => s.id)));
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-4 dark:bg-black sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50 sm:text-3xl">
              Songs
            </h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Manage your song library
            </p>
          </div>
          <Link
            href="/admin/songs/new"
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
          >
            Add New Song
          </Link>
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4 rounded-lg bg-white p-4 shadow-sm dark:bg-zinc-900 sm:grid sm:grid-cols-2 sm:gap-4 lg:grid-cols-5">
          <div className="sm:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-zinc-900 dark:text-zinc-50">
              Search by title
            </label>
            <input
              id="search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search songs..."
              className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500"
            />
          </div>
          <div>
            <label htmlFor="artist" className="block text-sm font-medium text-zinc-900 dark:text-zinc-50">
              Artist
            </label>
            <input
              id="artist"
              type="text"
              value={artistFilter}
              onChange={(e) => setArtistFilter(e.target.value)}
              placeholder="Filter by artist..."
              className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500"
            />
          </div>
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-zinc-900 dark:text-zinc-50">
              Language
            </label>
            <select
              id="language"
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
              className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            >
              <option value="">All languages</option>
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="visibility" className="block text-sm font-medium text-zinc-900 dark:text-zinc-50">
              Visibility
            </label>
            <select
              id="visibility"
              value={visibilityFilter}
              onChange={(e) => setVisibilityFilter(e.target.value)}
              className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            >
              <option value="all">All</option>
              <option value="visible">Visible</option>
              <option value="hidden">Hidden</option>
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

        {/* Bulk Actions */}
        {selectedIds.size > 0 && (
          <div className="mb-4 flex flex-wrap gap-2 rounded-lg bg-zinc-100 p-3 dark:bg-zinc-800">
            <span className="text-sm text-zinc-700 dark:text-zinc-300">
              {selectedIds.size} selected
            </span>
            <button
              onClick={() => handleBulkVisibility(true)}
              className="rounded-md bg-green-600 px-3 py-1 text-sm font-medium text-white hover:bg-green-700"
            >
              Show Selected
            </button>
            <button
              onClick={() => handleBulkVisibility(false)}
              className="rounded-md bg-orange-600 px-3 py-1 text-sm font-medium text-white hover:bg-orange-700"
            >
              Hide Selected
            </button>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="rounded-md bg-zinc-600 px-3 py-1 text-sm font-medium text-white hover:bg-zinc-700"
            >
              Clear Selection
            </button>
          </div>
        )}

        {/* Songs List */}
        <div className="rounded-lg bg-white shadow-sm dark:bg-zinc-900">
          {songs.length === 0 ? (
            <div className="p-8 text-center text-zinc-600 dark:text-zinc-400">
              No songs found
            </div>
          ) : (
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {/* Header */}
              <div className="hidden grid-cols-12 gap-4 p-4 text-sm font-medium text-zinc-700 dark:text-zinc-300 sm:grid">
                <div className="col-span-1">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === songs.length && songs.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-zinc-300"
                  />
                </div>
                <div className="col-span-4">Title</div>
                <div className="col-span-2">Artist</div>
                <div className="col-span-2">Language</div>
                <div className="col-span-1">Visibility</div>
                <div className="col-span-2">Actions</div>
              </div>

              {/* Songs */}
              {songs.map((song) => (
                <div
                  key={song.id}
                  className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-12 sm:items-center"
                >
                  <div className="col-span-1">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(song.id)}
                      onChange={() => toggleSelect(song.id)}
                      className="rounded border-zinc-300"
                    />
                  </div>
                  <div className="col-span-4">
                    <div className="font-medium text-zinc-900 dark:text-zinc-50">{song.title}</div>
                    {song.artist_composer && (
                      <div className="text-sm text-zinc-600 dark:text-zinc-400">
                        {song.artist_composer}
                      </div>
                    )}
                  </div>
                  <div className="col-span-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {song.artist_composer || "-"}
                  </div>
                  <div className="col-span-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {song.language || "-"}
                  </div>
                  <div className="col-span-1">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        song.is_visible
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                      }`}
                    >
                      {song.is_visible ? "Visible" : "Hidden"}
                    </span>
                  </div>
                  <div className="col-span-2 flex gap-2">
                    <Link
                      href={`/admin/songs/${song.id}`}
                      className="rounded-md bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4">
          <Link
            href="/admin/songs/archive"
            className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            View Archive →
          </Link>
        </div>
      </div>
    </div>
  );
}

