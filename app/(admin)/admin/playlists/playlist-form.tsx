"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Music } from "lucide-react";
import { toast } from "sonner";
import type { Playlist, PlaylistStatus, PlaylistSong } from "@/shared/types/playlist";
import type { Song } from "@/shared/types/song";
import { validatePlaylist } from "@/shared/lib/playlist-validation";
import { SortableContentTable, type ContentColumn } from "@/shared/ui";
import { createPlaylistAction } from "./actions";
import { 
  updatePlaylistAction, 
  addSongToPlaylistAction, 
  removeSongFromPlaylistAction,
  reorderSongsAction,
} from "./[id]/actions";

interface PlaylistFormProps {
  playlist?: Playlist;
  playlistSongs?: (PlaylistSong & { song: Song })[];
  availableSongs?: Song[];
}

const STATUS_OPTIONS: { value: PlaylistStatus; label: string }[] = [
  { value: "hidden", label: "Hidden" },
  { value: "visible", label: "Visible" },
  { value: "in_progress", label: "In Progress" },
];

type PlaylistSongItem = PlaylistSong & { song: Song };

export function PlaylistForm({ playlist, playlistSongs = [], availableSongs = [] }: PlaylistFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: playlist?.name || "",
    description: playlist?.description || "",
    status: playlist?.status || "hidden" as PlaylistStatus,
  });

  const [songs, setSongs] = useState<PlaylistSongItem[]>(playlistSongs);

  // Get songs not already in playlist
  const songsInPlaylist = new Set(songs.map((s) => s.song_id));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = validatePlaylist({
      name: formData.name,
      description: formData.description || null,
      status: formData.status,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    startTransition(async () => {
      try {
        const playlistData = {
          name: formData.name,
          description: formData.description || null,
          status: formData.status,
        };

        if (playlist) {
          const result = await updatePlaylistAction(playlist.id, playlistData);
          if (result.error) {
            toast.error("Failed to update playlist", {
              description: result.error,
            });
            setErrors({ submit: result.error });
            return;
          }
          toast.success("Playlist updated successfully");
        } else {
          const result = await createPlaylistAction(playlistData);
          if (result.error) {
            toast.error("Failed to create playlist", {
              description: result.error,
            });
            setErrors({ submit: result.error });
            return;
          }
          toast.success("Playlist created successfully");
          // Redirect to edit page to add songs
          if (result.playlist) {
            router.push(`/admin/playlists/${result.playlist.id}`);
            return;
          }
        }

        router.push("/admin/playlists");
        router.refresh();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to save playlist";
        toast.error("Failed to save playlist", {
          description: errorMessage,
        });
        setErrors({ submit: errorMessage });
      }
    });
  };

  const handleAddSong = useCallback(async (song: Song) => {
    if (!playlist) return;

    const result = await addSongToPlaylistAction(playlist.id, song.id);
    if (result.error) {
      toast.error("Failed to add song", {
        description: result.error,
      });
      return;
    }

    setSongs((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        playlist_id: playlist.id,
        song_id: song.id,
        position: prev.length + 1,
        created_at: new Date().toISOString(),
        song,
      },
    ]);

    toast.success("Song added to playlist");
  }, [playlist]);

  const handleRemoveSong = useCallback(async (songId: string) => {
    if (!playlist) return;

    // Find the song_id from the item id
    const item = songs.find((s) => s.song_id === songId);
    if (!item) return;

    const result = await removeSongFromPlaylistAction(playlist.id, item.song_id);
    if (result.error) {
      toast.error("Failed to remove song", {
        description: result.error,
      });
      return;
    }

    setSongs((prev) => prev.filter((s) => s.song_id !== item.song_id));
    toast.success("Song removed from playlist");
  }, [playlist, songs]);

  const handleReorder = useCallback(async (newSongs: PlaylistSongItem[]) => {
    if (!playlist) return;

    const previousSongs = songs;
    setSongs(newSongs);

    const songIds = newSongs.map((s) => s.song_id);
    const result = await reorderSongsAction(playlist.id, songIds);
    if (result.error) {
      toast.error("Failed to reorder songs");
      setSongs(previousSongs); // Revert
    }
  }, [playlist, songs]);

  const handleSearchSongs = useCallback((query: string): Song[] => {
    return availableSongs.filter(
      (song) => !songsInPlaylist.has(song.id) && 
      (query === "" || song.title.toLowerCase().includes(query.toLowerCase()))
    ).slice(0, 10);
  }, [availableSongs, songsInPlaylist]);

  // Column configuration for songs table
  const songColumns: ContentColumn<PlaylistSongItem>[] = [
    {
      key: "title",
      header: "Song",
      render: (item) => (
        <div>
          <div className="font-medium text-zinc-900 dark:text-zinc-50">
            {item.song.title}
          </div>
          {item.song.artist_composer && (
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              {item.song.artist_composer}
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6 rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-900">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-zinc-900 dark:text-zinc-50">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-zinc-900 dark:text-zinc-50">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Optional description for this playlist"
            className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500"
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-zinc-900 dark:text-zinc-50">
            Status
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as PlaylistStatus })}
            className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
            {errors.submit}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
          >
            {isPending ? "Saving..." : playlist ? "Update Playlist" : "Create Playlist"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Song Management (only for existing playlists) */}
      {playlist && (
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-900">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Songs ({songs.length})
          </h2>

          <SortableContentTable
            items={songs}
            onReorder={handleReorder}
            onRemove={handleRemoveSong}
            getItemId={(item) => item.song_id}
            columns={songColumns}
            emptyState={{
              icon: Music,
              title: "No songs in this playlist",
              description: "Click \"Add Song\" to get started.",
            }}
            picker={{
              searchPlaceholder: "Search songs...",
              onSearch: handleSearchSongs,
              onAdd: handleAddSong,
              renderResult: (song) => (
                <div>
                  <div className="font-medium text-zinc-900 dark:text-zinc-50">
                    {song.title}
                  </div>
                  {song.artist_composer && (
                    <div className="text-sm text-zinc-500 dark:text-zinc-400">
                      {song.artist_composer}
                    </div>
                  )}
                </div>
              ),
              getItemId: (song) => song.id,
              buttonLabel: "Add Song",
            }}
            disabled={isPending}
          />
        </div>
      )}
    </div>
  );
}
