"use server";

import {
  updateEvent,
  archiveEvent,
  restoreEvent,
  deleteEvent,
  setCurrentEvent,
  addPlaylistToEvent,
  removePlaylistFromEvent,
  reorderEventPlaylists,
} from "@/shared/lib/events";
import { validateEventInput } from "@/shared/lib/event-validation";
import type { UpdateEventInput } from "@/shared/types/event";
import { revalidatePath } from "next/cache";

export async function updateEventAction(id: string, input: UpdateEventInput) {
  const errors = validateEventInput(input, false);

  if (errors.length > 0) {
    return { error: errors[0].message, errors };
  }

  try {
    await updateEvent(id, input);
    revalidatePath("/admin/events");
    revalidatePath(`/admin/events/${id}`);
    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to update event",
    };
  }
}

export async function archiveEventAction(id: string) {
  try {
    await archiveEvent(id);
    revalidatePath("/admin/events");
    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to archive event",
    };
  }
}

export async function restoreEventAction(id: string) {
  try {
    await restoreEvent(id);
    revalidatePath("/admin/events");
    revalidatePath("/admin/events/archive");
    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to restore event",
    };
  }
}

export async function deleteEventAction(id: string) {
  try {
    await deleteEvent(id);
    revalidatePath("/admin/events/archive");
    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to delete event",
    };
  }
}

export async function setCurrentEventAction(id: string) {
  try {
    await setCurrentEvent(id);
    revalidatePath("/admin/events");
    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to set current event",
    };
  }
}

export async function addPlaylistToEventAction(eventId: string, playlistId: string) {
  try {
    await addPlaylistToEvent(eventId, playlistId);
    revalidatePath(`/admin/events/${eventId}`);
    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to add playlist",
    };
  }
}

export async function removePlaylistFromEventAction(eventId: string, playlistId: string) {
  try {
    await removePlaylistFromEvent(eventId, playlistId);
    revalidatePath(`/admin/events/${eventId}`);
    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to remove playlist",
    };
  }
}

export async function reorderEventPlaylistsAction(eventId: string, playlistIds: string[]) {
  try {
    await reorderEventPlaylists(eventId, playlistIds);
    revalidatePath(`/admin/events/${eventId}`);
    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to reorder playlists",
    };
  }
}

