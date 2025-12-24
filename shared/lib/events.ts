import { supabase } from "./supabase";
import type {
  Event,
  EventWithPlaylistCount,
  EventWithPlaylists,
  EventPlaylist,
  CreateEventInput,
  UpdateEventInput,
} from "../types/event";

// ============================================================================
// Event CRUD Operations
// ============================================================================

export interface EventFilters {
  name?: string;
  is_visible?: boolean;
  is_archived?: boolean;
  upcoming?: boolean; // Only future events
  past?: boolean; // Only past events
}

export async function getEvents(
  filters: EventFilters = {}
): Promise<EventWithPlaylistCount[]> {
  let query = supabase
    .from("events")
    .select("*, event_playlists(count)")
    .order("event_date", { ascending: true });

  // Filter archived/non-archived
  if (filters.is_archived === true) {
    query = query.eq("is_archived", true);
  } else if (filters.is_archived === false) {
    query = query.eq("is_archived", false);
  }

  // Filter by visibility
  if (filters.is_visible !== undefined) {
    query = query.eq("is_visible", filters.is_visible);
  }

  // Filter by name (case-insensitive search)
  if (filters.name) {
    query = query.ilike("name", `%${filters.name}%`);
  }

  // Filter upcoming events (date >= today)
  if (filters.upcoming) {
    const today = new Date().toISOString().split("T")[0];
    query = query.gte("event_date", today);
  }

  // Filter past events (date < today)
  if (filters.past) {
    const today = new Date().toISOString().split("T")[0];
    query = query.lt("event_date", today);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch events: ${error.message}`);
  }

  // Transform to include playlist_count
  return (data || []).map((event: any) => ({
    ...event,
    playlist_count: event.event_playlists?.[0]?.count || 0,
  }));
}

export async function getEventById(id: string): Promise<Event | null> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null; // Not found
    }
    throw new Error(`Failed to fetch event: ${error.message}`);
  }

  return data;
}

export async function getEventWithPlaylists(
  id: string
): Promise<EventWithPlaylists | null> {
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (eventError) {
    if (eventError.code === "PGRST116") {
      return null; // Not found
    }
    throw new Error(`Failed to fetch event: ${eventError.message}`);
  }

  // Get playlists for this event
  const { data: eventPlaylists, error: playlistsError } = await supabase
    .from("event_playlists")
    .select("position, playlist:playlists(id, name, description, status)")
    .eq("event_id", id)
    .order("position", { ascending: true });

  if (playlistsError) {
    throw new Error(`Failed to fetch event playlists: ${playlistsError.message}`);
  }

  return {
    ...event,
    playlists: (eventPlaylists || []).map((ep: any) => ({
      ...ep.playlist,
      position: ep.position,
    })),
  };
}

export async function getVisibleEventById(id: string): Promise<Event | null> {
  // Calculate grace period (14 days ago)
  const gracePeriodDate = new Date();
  gracePeriodDate.setDate(gracePeriodDate.getDate() - 14);
  const gracePeriodStr = gracePeriodDate.toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .eq("is_visible", true)
    .eq("is_archived", false)
    .gte("event_date", gracePeriodStr)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null; // Not found or not visible
    }
    throw new Error(`Failed to fetch event: ${error.message}`);
  }

  return data;
}

export async function createEvent(input: CreateEventInput): Promise<Event> {
  // If setting as current, unset other current events first
  if (input.is_current) {
    await unsetAllCurrentEvents();
  }

  const { data, error } = await supabase
    .from("events")
    .insert({
      name: input.name,
      description: input.description || null,
      event_date: input.event_date,
      event_time: input.event_time || null,
      place: input.place || null,
      latitude: input.latitude ?? null,
      longitude: input.longitude ?? null,
      is_visible: input.is_visible ?? false,
      is_current: input.is_current ?? false,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create event: ${error.message}`);
  }

  return data;
}

export async function updateEvent(
  id: string,
  input: UpdateEventInput
): Promise<Event> {
  // If setting as current, unset other current events first
  if (input.is_current === true) {
    await unsetAllCurrentEvents();
  }

  const { data, error } = await supabase
    .from("events")
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update event: ${error.message}`);
  }

  return data;
}

export async function archiveEvent(id: string): Promise<void> {
  const { error } = await supabase
    .from("events")
    .update({ is_archived: true, is_current: false })
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to archive event: ${error.message}`);
  }
}

export async function restoreEvent(id: string): Promise<void> {
  const { error } = await supabase
    .from("events")
    .update({ is_archived: false })
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to restore event: ${error.message}`);
  }
}

export async function deleteEvent(id: string): Promise<void> {
  const { error } = await supabase.from("events").delete().eq("id", id);

  if (error) {
    throw new Error(`Failed to delete event: ${error.message}`);
  }
}

// ============================================================================
// Current Event Logic
// ============================================================================

async function unsetAllCurrentEvents(): Promise<void> {
  const { error } = await supabase
    .from("events")
    .update({ is_current: false })
    .eq("is_current", true);

  if (error) {
    throw new Error(`Failed to unset current events: ${error.message}`);
  }
}

export async function setCurrentEvent(id: string): Promise<void> {
  await unsetAllCurrentEvents();

  const { error } = await supabase
    .from("events")
    .update({ is_current: true })
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to set current event: ${error.message}`);
  }
}

export async function getCurrentEvent(): Promise<Event | null> {
  // First check for manually set current event
  const { data: manualCurrent, error: manualError } = await supabase
    .from("events")
    .select("*")
    .eq("is_current", true)
    .eq("is_visible", true)
    .eq("is_archived", false)
    .single();

  if (!manualError && manualCurrent) {
    return manualCurrent;
  }

  // Auto-select: closest upcoming event
  const today = new Date().toISOString().split("T")[0];
  const { data: autoSelect, error: autoError } = await supabase
    .from("events")
    .select("*")
    .eq("is_visible", true)
    .eq("is_archived", false)
    .gte("event_date", today)
    .order("event_date", { ascending: true })
    .order("event_time", { ascending: true, nullsFirst: false })
    .limit(1)
    .single();

  if (autoError) {
    if (autoError.code === "PGRST116") {
      return null; // No upcoming events
    }
    throw new Error(`Failed to get current event: ${autoError.message}`);
  }

  return autoSelect;
}

// ============================================================================
// Event-Playlist Management
// ============================================================================

export async function getEventPlaylists(
  eventId: string
): Promise<(EventPlaylist & { playlist: { id: string; name: string; description: string | null; status: string } })[]> {
  const { data, error } = await supabase
    .from("event_playlists")
    .select("*, playlist:playlists(id, name, description, status)")
    .eq("event_id", eventId)
    .order("position", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch event playlists: ${error.message}`);
  }

  return data || [];
}

export async function addPlaylistToEvent(
  eventId: string,
  playlistId: string
): Promise<EventPlaylist> {
  // Get the current max position
  const { data: existing } = await supabase
    .from("event_playlists")
    .select("position")
    .eq("event_id", eventId)
    .order("position", { ascending: false })
    .limit(1);

  const nextPosition = existing && existing.length > 0 ? existing[0].position + 1 : 1;

  const { data, error } = await supabase
    .from("event_playlists")
    .insert({
      event_id: eventId,
      playlist_id: playlistId,
      position: nextPosition,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("Playlist is already in this event");
    }
    throw new Error(`Failed to add playlist to event: ${error.message}`);
  }

  return data;
}

export async function removePlaylistFromEvent(
  eventId: string,
  playlistId: string
): Promise<void> {
  const { error } = await supabase
    .from("event_playlists")
    .delete()
    .eq("event_id", eventId)
    .eq("playlist_id", playlistId);

  if (error) {
    throw new Error(`Failed to remove playlist from event: ${error.message}`);
  }
}

export async function reorderEventPlaylists(
  eventId: string,
  playlistIds: string[]
): Promise<void> {
  // Update positions for all playlists in the new order
  const updates = playlistIds.map((playlistId, index) => ({
    event_id: eventId,
    playlist_id: playlistId,
    position: index + 1,
  }));

  // Delete existing entries and re-insert with new positions
  const { error: deleteError } = await supabase
    .from("event_playlists")
    .delete()
    .eq("event_id", eventId);

  if (deleteError) {
    throw new Error(`Failed to reorder playlists: ${deleteError.message}`);
  }

  if (updates.length > 0) {
    const { error: insertError } = await supabase
      .from("event_playlists")
      .insert(updates);

    if (insertError) {
      throw new Error(`Failed to reorder playlists: ${insertError.message}`);
    }
  }
}

export async function getEventPlaylistCount(eventId: string): Promise<number> {
  const { count, error } = await supabase
    .from("event_playlists")
    .select("*", { count: "exact", head: true })
    .eq("event_id", eventId);

  if (error) {
    throw new Error(`Failed to get playlist count: ${error.message}`);
  }

  return count || 0;
}

