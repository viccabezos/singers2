import type { Song } from "@/shared/types/song";
import type { Playlist } from "@/shared/types/playlist";
import type { Event } from "@/shared/types/event";

/**
 * Unified status type for all dashboard entities
 */
export type DashboardStatus =
  | "visible" // Published and visible to public
  | "hidden" // Published but hidden from public
  | "in_progress" // Work in progress (playlists)
  | "draft" // Draft state
  | "archived" // Soft-deleted/archived
  | "current" // Current event
  | "past" // Past event (by date)
  | "upcoming"; // Future event (by date)

/**
 * Converts a song's boolean flags to a DashboardStatus
 * @param song - The song entity
 * @returns The corresponding DashboardStatus
 */
export function getSongStatus(song: Song): DashboardStatus {
  if (song.is_archived) return "archived";
  return song.is_visible ? "visible" : "hidden";
}

/**
 * Converts a playlist's status to a DashboardStatus
 * @param playlist - The playlist entity
 * @returns The corresponding DashboardStatus
 */
export function getPlaylistStatus(playlist: Playlist): DashboardStatus {
  return playlist.status as DashboardStatus;
}

/**
 * Checks if an event date is in the past
 * @param dateStr - ISO date string (YYYY-MM-DD)
 * @returns true if the date is in the past
 */
function isPastEvent(dateStr: string): boolean {
  const eventDate = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return eventDate < today;
}

/**
 * Converts an event's boolean flags and date to a DashboardStatus
 * @param event - The event entity
 * @returns The corresponding DashboardStatus
 */
export function getEventStatus(event: Event): DashboardStatus {
  if (event.is_archived) return "archived";
  if (event.is_current) return "current";
  if (isPastEvent(event.event_date)) return "past";
  return event.is_visible ? "visible" : "hidden";
}
