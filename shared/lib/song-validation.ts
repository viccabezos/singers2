import type { SongCreateInput } from "../types/song";

export function validateSong(input: SongCreateInput): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!input.title || input.title.trim().length === 0) {
    errors.title = "Title is required";
  }

  if (!input.lyrics || input.lyrics.trim().length === 0) {
    errors.lyrics = "Lyrics are required";
  }

  if (input.year !== undefined && input.year !== null) {
    const currentYear = new Date().getFullYear();
    if (input.year < 1000 || input.year > currentYear + 10) {
      errors.year = `Year must be between 1000 and ${currentYear + 10}`;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

