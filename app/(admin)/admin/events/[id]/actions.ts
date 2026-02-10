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

export async function bulkArchiveEventsAction(ids: string[]) {
  try {
    // Archive all selected events
    const results = await Promise.all(
      ids.map(async (id) => {
        try {
          await archiveEvent(id);
          return { id, success: true };
        } catch (error) {
          return { id, success: false, error: error instanceof Error ? error.message : "Unknown error" };
        }
      })
    );

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    revalidatePath("/admin/events");
    
    if (failCount > 0) {
      return {
        success: successCount > 0,
        error: `${failCount} event(s) failed to archive`,
        archivedCount: successCount,
        failedCount: failCount,
      };
    }

    return {
      success: true,
      archivedCount: successCount,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to archive events",
    };
  }
}

export async function updateEventAutoArchiveExemptAction(id: string, exempt: boolean) {
  try {
    await updateEvent(id, { auto_archive_exempt: exempt });
    revalidatePath("/admin/events");
    revalidatePath(`/admin/events/${id}`);
    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to update auto-archive exempt status",
    };
  }
}

