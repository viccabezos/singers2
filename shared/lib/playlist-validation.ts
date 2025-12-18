import type { PlaylistCreateInput, PlaylistStatus } from "../types/playlist";

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

const VALID_STATUSES: PlaylistStatus[] = ["visible", "hidden", "in_progress", "archived"];

export function validatePlaylist(input: PlaylistCreateInput): ValidationResult {
  const errors: Record<string, string> = {};

  // Name validation
  if (!input.name || input.name.trim().length === 0) {
    errors.name = "Name is required";
  } else if (input.name.trim().length > 200) {
    errors.name = "Name must be 200 characters or less";
  }

  // Description validation (optional but has max length)
  if (input.description && input.description.length > 2000) {
    errors.description = "Description must be 2000 characters or less";
  }

  // Status validation
  if (input.status && !VALID_STATUSES.includes(input.status)) {
    errors.status = "Invalid status";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

