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
  sortDesc?: boolean; // Sort descending (newest first)
  recent?: boolean; // Last 30 days
  thisMonth?: boolean; // Current month
  lastMonth?: boolean; // Previous month
  is_current?: boolean; // Featured/current events
}

export async function getEvents(
  filters: EventFilters = {}
): Promise<EventWithPlaylistCount[]> {
  // Default to descending order (newest first) for admin
  const sortAscending = filters.sortDesc === false;
  
  let query = supabase
    .from("events")
    .select("*, event_playlists(count)")
    .order("event_date", { ascending: sortAscending });

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

  // Filter recent events (last 30 days)
  if (filters.recent) {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    query = query
      .gte("event_date", thirtyDaysAgo.toISOString().split("T")[0])
      .lte("event_date", today.toISOString().split("T")[0]);
  }

  // Filter this month
  if (filters.thisMonth) {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    query = query
      .gte("event_date", firstDay.toISOString().split("T")[0])
      .lte("event_date", lastDay.toISOString().split("T")[0]);
  }

  // Filter last month
  if (filters.lastMonth) {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth(), 0);
    query = query
      .gte("event_date", firstDay.toISOString().split("T")[0])
      .lte("event_date", lastDay.toISOString().split("T")[0]);
  }

  // Filter by is_current (featured)
  if (filters.is_current !== undefined) {
    query = query.eq("is_current", filters.is_current);
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
      auto_archive_exempt: input.auto_archive_exempt ?? false,
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

export async function getEventsCount(filters?: { is_archived?: boolean; is_visible?: boolean }): Promise<number> {
  let query = supabase
    .from("events")
    .select("*", { count: "exact", head: true });

  if (filters?.is_archived !== undefined) {
    query = query.eq("is_archived", filters.is_archived);
  } else {
    query = query.eq("is_archived", false);
  }

  if (filters?.is_visible !== undefined) {
    query = query.eq("is_visible", filters.is_visible);
  }

  const { count, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch events count: ${error.message}`);
  }

  return count || 0;
}

export async function getRecentlyUpdatedEvents(limit: number = 5): Promise<Event[]> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("is_archived", false)
    .order("updated_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch recently updated events: ${error.message}`);
  }

  return data || [];
}

export async function getUpcomingEvents(limit: number = 10): Promise<Event[]> {
  const today = new Date().toISOString().split("T")[0];
  
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("is_visible", true)
    .eq("is_archived", false)
    .gte("event_date", today)
    .order("event_date", { ascending: true })
    .order("event_time", { ascending: true, nullsFirst: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch upcoming events: ${error.message}`);
  }

  return data || [];
}

export async function getAllUpcomingEvents(): Promise<Event[]> {
  const today = new Date().toISOString().split("T")[0];
  
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("is_visible", true)
    .eq("is_archived", false)
    .gte("event_date", today)
    .order("event_date", { ascending: true })
    .order("event_time", { ascending: true, nullsFirst: false });

  if (error) {
    throw new Error(`Failed to fetch all upcoming events: ${error.message}`);
  }

  return data || [];
}

// ============================================================================
// Auto-Archive Logic
// ============================================================================

export interface AutoArchiveResult {
  archivedCount: number;
  archivedEvents: { id: string; name: string; event_date: string }[];
}

export async function autoArchiveOldEvents(): Promise<AutoArchiveResult> {
  const today = new Date();
  const cutoffDate = new Date(today);
  cutoffDate.setDate(cutoffDate.getDate() - 14);
  const cutoffDateStr = cutoffDate.toISOString().split("T")[0];

  // Find events older than 14 days that are not archived and not exempt
  const { data: oldEvents, error: findError } = await supabase
    .from("events")
    .select("id, name, event_date")
    .eq("is_archived", false)
    .eq("auto_archive_exempt", false)
    .lt("event_date", cutoffDateStr);

  if (findError) {
    throw new Error(`Failed to find old events: ${findError.message}`);
  }

  if (!oldEvents || oldEvents.length === 0) {
    return { archivedCount: 0, archivedEvents: [] };
  }

  const eventIds = oldEvents.map(e => e.id);

  // Archive all old events and unfeature them
  const { error: updateError } = await supabase
    .from("events")
    .update({ 
      is_archived: true, 
      is_current: false,
      updated_at: new Date().toISOString()
    })
    .in("id", eventIds);

  if (updateError) {
    throw new Error(`Failed to archive old events: ${updateError.message}`);
  }

  return {
    archivedCount: oldEvents.length,
    archivedEvents: oldEvents
  };
}

export function getDaysUntilArchive(eventDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const event = new Date(eventDate);
  event.setHours(0, 0, 0, 0);
  
  const diffTime = today.getTime() - event.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // Days until archive (14 days grace period)
  return Math.max(0, 14 - diffDays);
}

export function isEventPast(eventDate: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const event = new Date(eventDate);
  event.setHours(0, 0, 0, 0);
  
  return event < today;
}

export function isEventToday(eventDate: string): boolean {
  const today = new Date().toISOString().split("T")[0];
  return eventDate === today;
}

export function getEventStatus(eventDate: string): 'today' | 'tomorrow' | 'thisWeek' | 'upcoming' | 'past' {
  if (isEventToday(eventDate)) return 'today';
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const event = new Date(eventDate);
  event.setHours(0, 0, 0, 0);
  
  const diffTime = event.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return 'tomorrow';
  if (diffDays > 1 && diffDays <= 7) return 'thisWeek';
  if (isEventPast(eventDate)) return 'past';
  
  return 'upcoming';
}

export function getDaysAgo(eventDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const event = new Date(eventDate);
  event.setHours(0, 0, 0, 0);
  
  const diffTime = today.getTime() - event.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export function getGracePeriodStatus(eventDate: string): {
  daysRemaining: number;
  isWarning: boolean;
  isCritical: boolean;
} {
  const daysRemaining = getDaysUntilArchive(eventDate);
  return {
    daysRemaining,
    isWarning: daysRemaining > 0 && daysRemaining <= 7,
    isCritical: daysRemaining > 0 && daysRemaining <= 3,
  };
}

