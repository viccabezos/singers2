"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Music } from "lucide-react";
import type { Playlist, PlaylistStatus, PlaylistSong } from "@/shared/types/playlist";
import type { Song } from "@/shared/types/song";
import { validatePlaylist } from "@/shared/lib/playlist-validation";
import {
  FormLayout,
  FormSection,
  FormActions,
  useFormFeedback,
  TextField,
  TextAreaField,
  SelectField,
  SortableContentTable,
  type ContentColumn,
} from "@/shared/ui";
import { toast } from "sonner";
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

  const feedback = useFormFeedback({
    successMessage: playlist ? "Playlist updated successfully" : "Playlist created successfully",
    successRedirect: playlist ? "/admin/playlists" : undefined, // New playlists redirect to edit page
    errorMessage: "Failed to save playlist",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    feedback.clearError();

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
            feedback.onError(result.error);
            setErrors({ submit: result.error });
            return;
          }
          feedback.onSuccess();
        } else {
          const result = await createPlaylistAction(playlistData);
          if (result.error) {
            feedback.onError(result.error);
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
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to save playlist";
        feedback.onError(errorMessage);
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
    <FormLayout onSubmit={handleSubmit} error={feedback.inlineError}>
      <FormSection title="Playlist Details">
        <TextField
          label="Name"
          id="name"
          value={formData.name}
          onChange={(v) => setFormData({ ...formData, name: v })}
          required
          error={errors.name}
        />

        <TextAreaField
          label="Description"
          id="description"
          value={formData.description}
          onChange={(v) => setFormData({ ...formData, description: v })}
          placeholder="Optional description for this playlist"
          error={errors.description}
        />

        <SelectField
          label="Status"
          id="status"
          value={formData.status}
          onChange={(v) => setFormData({ ...formData, status: v as PlaylistStatus })}
          options={STATUS_OPTIONS}
        />
      </FormSection>

      {/* Song Management (only for existing playlists) */}
      {playlist && (
        <FormSection title={`Songs (${songs.length})`}>
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
        </FormSection>
      )}

      <FormActions
        primaryLabel={playlist ? "Update Playlist" : "Create Playlist"}
        onCancel={() => router.back()}
        isPending={isPending}
      />
    </FormLayout>
  );
}
