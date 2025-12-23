"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Song } from "@/shared/types/song";
import { validateSong } from "@/shared/lib/song-validation";
import {
  FormLayout,
  FormSection,
  FormActions,
  useFormFeedback,
  TextField,
  TextAreaField,
  CheckboxField,
} from "@/shared/ui";
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

  const feedback = useFormFeedback({
    successMessage: song ? "Song updated successfully" : "Song created successfully",
    successRedirect: "/admin/songs",
    errorMessage: "Failed to save song",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    feedback.clearError();

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
            feedback.onError(result.error);
            setErrors({ submit: result.error });
            return;
          }
        } else {
          const result = await createSongAction(songData);
          if (result.error) {
            feedback.onError(result.error);
            setErrors({ submit: result.error });
            return;
          }
        }
        feedback.onSuccess();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to save song";
        feedback.onError(errorMessage);
        setErrors({ submit: errorMessage });
      }
    });
  };

  const handleDuplicate = async () => {
    if (!song) return;
    if (!confirm("Are you sure you want to duplicate this song?")) return;

    try {
      const result = await duplicateSongAction(song.id);
      if (result.error) {
        toast.error("Failed to duplicate song", {
          description: result.error,
        });
        return;
      }
      if (result.song) {
        toast.success("Song duplicated successfully");
        router.push(`/admin/songs/${result.song.id}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to duplicate song";
      toast.error("Failed to duplicate song", {
        description: errorMessage,
      });
    }
  };

  return (
    <FormLayout onSubmit={handleSubmit} error={feedback.inlineError}>
      <FormSection>
        {/* Title */}
        <TextField
          label="Title"
          id="title"
          value={formData.title}
          onChange={(v) => setFormData({ ...formData, title: v })}
          required
          error={errors.title}
        />

        {/* Lyrics */}
        <TextAreaField
          label="Lyrics"
          id="lyrics"
          value={formData.lyrics}
          onChange={(v) => setFormData({ ...formData, lyrics: v })}
          required
          rows={20}
          placeholder="Paste lyrics here. Line breaks will be preserved."
          error={errors.lyrics}
        />

        {/* Optional Fields Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Artist/Composer"
            id="artist_composer"
            value={formData.artist_composer}
            onChange={(v) => setFormData({ ...formData, artist_composer: v })}
          />

          <TextField
            label="Language"
            id="language"
            value={formData.language}
            onChange={(v) => setFormData({ ...formData, language: v })}
            placeholder="e.g., English, French"
          />

          <TextField
            label="Genre"
            id="genre"
            value={formData.genre}
            onChange={(v) => setFormData({ ...formData, genre: v })}
          />

          <TextField
            label="Year"
            id="year"
            type="number"
            value={formData.year}
            onChange={(v) => setFormData({ ...formData, year: v })}
            placeholder="e.g., 2020"
            error={errors.year}
          />
        </div>

        {/* Visibility */}
        <CheckboxField
          label="Visible on public website"
          id="is_visible"
          checked={formData.is_visible}
          onChange={(v) => setFormData({ ...formData, is_visible: v })}
        />
      </FormSection>

      <FormActions
        primaryLabel={song ? "Update Song" : "Create Song"}
        onCancel={() => router.back()}
        extraActions={song ? [
          { label: "Duplicate", onClick: handleDuplicate, variant: "secondary" }
        ] : undefined}
        isPending={isPending}
      />
    </FormLayout>
  );
}
