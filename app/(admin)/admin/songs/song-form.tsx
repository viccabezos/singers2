"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Song } from "@/shared/types/song";
import { validateSong } from "@/shared/lib/song-validation";
import { createSongAction } from "./actions";
import { updateSongAction, duplicateSongAction } from "./[id]/actions";

interface SongFormProps {
  song?: Song;
}

export function SongForm({ song }: SongFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    title: song?.title || "",
    lyrics: song?.lyrics || "",
    artist_composer: song?.artist_composer || "",
    language: song?.language || "",
    genre: song?.genre || "",
    year: song?.year?.toString() || "",
    is_visible: song?.is_visible ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = validateSong({
      title: formData.title,
      lyrics: formData.lyrics,
      artist_composer: formData.artist_composer || null,
      language: formData.language || null,
      genre: formData.genre || null,
      year: formData.year ? parseInt(formData.year) : null,
      is_visible: formData.is_visible,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    startTransition(async () => {
      try {
        const songData = {
          title: formData.title,
          lyrics: formData.lyrics,
          artist_composer: formData.artist_composer || null,
          language: formData.language || null,
          genre: formData.genre || null,
          year: formData.year ? parseInt(formData.year) : null,
          is_visible: formData.is_visible,
        };

        if (song) {
          const result = await updateSongAction(song.id, songData);
          if (result.error) {
            setErrors({ submit: result.error });
            return;
          }
        } else {
          const result = await createSongAction(songData);
          if (result.error) {
            setErrors({ submit: result.error });
            return;
          }
        }

        router.push("/admin/songs");
        router.refresh();
      } catch (error) {
        setErrors({ submit: "Failed to save song" });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-900">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-zinc-900 dark:text-zinc-50">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500"
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
      </div>

      {/* Lyrics */}
      <div>
        <label htmlFor="lyrics" className="block text-sm font-medium text-zinc-900 dark:text-zinc-50">
          Lyrics <span className="text-red-500">*</span>
        </label>
        <textarea
          id="lyrics"
          required
          rows={20}
          value={formData.lyrics}
          onChange={(e) => setFormData({ ...formData, lyrics: e.target.value })}
          placeholder="Paste lyrics here. Line breaks will be preserved."
          className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-1 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500"
        />
        {errors.lyrics && <p className="mt-1 text-sm text-red-600">{errors.lyrics}</p>}
      </div>

      {/* Optional Fields Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Artist/Composer */}
        <div>
          <label htmlFor="artist_composer" className="block text-sm font-medium text-zinc-900 dark:text-zinc-50">
            Artist/Composer
          </label>
          <input
            id="artist_composer"
            type="text"
            value={formData.artist_composer}
            onChange={(e) => setFormData({ ...formData, artist_composer: e.target.value })}
            className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500"
          />
        </div>

        {/* Language */}
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-zinc-900 dark:text-zinc-50">
            Language
          </label>
          <input
            id="language"
            type="text"
            value={formData.language}
            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
            placeholder="e.g., English, French"
            className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500"
          />
        </div>

        {/* Genre */}
        <div>
          <label htmlFor="genre" className="block text-sm font-medium text-zinc-900 dark:text-zinc-50">
            Genre
          </label>
          <input
            id="genre"
            type="text"
            value={formData.genre}
            onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
            className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500"
          />
        </div>

        {/* Year */}
        <div>
          <label htmlFor="year" className="block text-sm font-medium text-zinc-900 dark:text-zinc-50">
            Year
          </label>
          <input
            id="year"
            type="number"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            placeholder="e.g., 2020"
            className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500"
          />
          {errors.year && <p className="mt-1 text-sm text-red-600">{errors.year}</p>}
        </div>
      </div>

      {/* Visibility */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_visible"
          checked={formData.is_visible}
          onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
          className="h-4 w-4 rounded border-zinc-300"
        />
        <label htmlFor="is_visible" className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
          Visible on public website
        </label>
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
          {isPending ? "Saving..." : song ? "Update Song" : "Create Song"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700"
        >
          Cancel
        </button>
        {song && (
          <button
            type="button"
            onClick={async () => {
              if (confirm("Are you sure you want to duplicate this song?")) {
                try {
                  const result = await duplicateSongAction(song.id);
                  if (result.error) {
                    alert(result.error);
                    return;
                  }
                  if (result.song) {
                    router.push(`/admin/songs/${result.song.id}`);
                  }
                } catch (error) {
                  alert("Failed to duplicate song");
                }
              }
            }}
            className="rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700"
          >
            Duplicate
          </button>
        )}
      </div>
    </form>
  );
}

