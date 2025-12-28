import { describe, it, expect, beforeAll, afterAll, afterEach, beforeEach } from "bun:test";
import { getSupabaseEnv } from "./test-utils/supabase-env";
import { testSupabaseConnection } from "./test-utils/supabase-connection";
import {
  getEvents,
  getEventById,
  getEventWithPlaylists,
  getVisibleEventById,
  createEvent,
  updateEvent,
  archiveEvent,
  restoreEvent,
  deleteEvent,
  setCurrentEvent,
  getCurrentEvent,
  getEventPlaylists,
  addPlaylistToEvent,
  removePlaylistFromEvent,
  reorderEventPlaylists,
  getEventPlaylistCount,
} from "./events";
import type { Event, EventPlaylist, CreateEventInput, UpdateEventInput } from "../types/event";

async function getSupabaseClient() {
  try {
    const env = getSupabaseEnv();
    if (!env) return null;
    
    const supabaseModule = await import("./supabase");
    return supabaseModule.supabase;
  } catch (error) {
    return null;
  }
}

describe("Events CRUD Operations", () => {
  let testEventId: string | null = null;
  let testPlaylistId: string | null = null;

  beforeAll(async () => {
    const env = getSupabaseEnv();
    if (!env) {
      console.warn("Skipping events tests - environment variables not set");
      return;
    }

    const connectionResult = await testSupabaseConnection();
    if (!connectionResult.success) {
      console.warn("Skipping events tests - database connection failed:", connectionResult.error);
      return;
    }

    const supabase = await getSupabaseClient();
    if (supabase) {
      const { data: playlist, error: playlistError } = await supabase
        .from("playlists")
        .insert({
          name: "Test Playlist for Events",
          description: "Test playlist for event relationships",
          status: "hidden",
        })
        .select()
        .single();

      if (!playlistError && playlist) {
        testPlaylistId = playlist.id;
      }
    }
  });

  afterAll(async () => {
    if (testPlaylistId) {
      const supabase = await getSupabaseClient();
      if (supabase) {
        await supabase.from("playlists").delete().eq("id", testPlaylistId);
      }
    }
  });

  afterEach(async () => {
    if (testEventId) {
      const supabase = await getSupabaseClient();
      if (supabase) {
        await supabase.from("events").delete().eq("id", testEventId);
        testEventId = null;
      }
    }
  });

  describe("createEvent", () => {
    it("should create a new event with minimum required fields", async () => {
      const env = getSupabaseEnv();
      if (!env) return;

      const eventData: CreateEventInput = {
        name: "Test Event",
        event_date: "2024-12-25",
      };

      const event = await createEvent(eventData);

      expect(event).toBeDefined();
      expect(event.id).toBeDefined();
      expect(event.name).toBe(eventData.name);
      expect(event.event_date).toBe(eventData.event_date);
      expect(event.is_visible).toBe(false);
      expect(event.is_current).toBe(false);
      expect(event.is_archived).toBe(false);

      testEventId = event.id;
    });

    it("should create a new event with all optional fields", async () => {
      const env = getSupabaseEnv();
      if (!env) return;

      const eventData: CreateEventInput = {
        name: "Complete Test Event",
        description: "A complete test event with all fields",
        event_date: "2024-12-30",
        event_time: "18:00",
        place: "Test Venue",
        latitude: 40.7128,
        longitude: -74.0060,
        is_visible: true,
        is_current: true,
      };

      const event = await createEvent(eventData);

      expect(event).toBeDefined();
      expect(event.name).toBe(eventData.name);
      expect(event.description).toBe(eventData.description);
      expect(event.event_time).toBe(eventData.event_time);
      expect(event.place).toBe(eventData.place);
      expect(event.latitude).toBe(eventData.latitude);
      expect(event.longitude).toBe(eventData.longitude);
      expect(event.is_visible).toBe(true);
      expect(event.is_current).toBe(true);

      testEventId = event.id;
    });

    it("should unset other current events when setting is_current to true", async () => {
      const env = getSupabaseEnv();
      if (!env) return;

      const firstEvent = await createEvent({
        name: "First Current Event",
        event_date: "2024-12-25",
        is_current: true,
      });

      const secondEvent = await createEvent({
        name: "Second Current Event",
        event_date: "2024-12-26",
        is_current: true,
      });

      const updatedFirstEvent = await getEventById(firstEvent.id);
      expect(updatedFirstEvent?.is_current).toBe(false);
      expect(secondEvent.is_current).toBe(true);

      testEventId = secondEvent.id;

      const supabase = await getSupabaseClient();
      if (supabase) {
        await supabase.from("events").delete().eq("id", firstEvent.id);
      }
    });
  });

  describe("getEvents", () => {
    it("should return all events when no filters provided", async () => {
      const env = getSupabaseEnv();
      if (!env) return;

      const events = await getEvents();
      expect(Array.isArray(events)).toBe(true);
    });

    it("should filter events by name", async () => {
      const env = getSupabaseEnv();
      if (!env) return;

      const event = await createEvent({
        name: "Unique Test Event Name",
        event_date: "2024-12-25",
      });
      testEventId = event.id;

      const filteredEvents = await getEvents({ name: "Unique Test Event Name" });
      expect(filteredEvents.length).toBeGreaterThanOrEqual(1);
      expect(filteredEvents.some(e => e.id === event.id)).toBe(true);
    });

    it("should filter events by visibility", async () => {
      const env = getSupabaseEnv();
      if (!env) return;

      const visibleEvent = await createEvent({
        name: "Visible Event",
        event_date: "2024-12-25",
        is_visible: true,
      });

      const hiddenEvent = await createEvent({
        name: "Hidden Event",
        event_date: "2024-12-26",
        is_visible: false,
      });

      const visibleEvents = await getEvents({ is_visible: true });
      const hiddenEvents = await getEvents({ is_visible: false });

      expect(visibleEvents.some(e => e.id === visibleEvent.id)).toBe(true);
      expect(hiddenEvents.some(e => e.id === hiddenEvent.id)).toBe(true);

      const supabase = await getSupabaseClient();
      if (supabase) {
        await supabase.from("events").delete().in("id", [visibleEvent.id, hiddenEvent.id]);
      }
    });

    it("should filter events by archived status", async () => {
      const env = getSupabaseEnv();
      if (!env) return;

      const activeEvent = await createEvent({
        name: "Active Event",
        event_date: "2024-12-25",
      });

      const archivedEvent = await createEvent({
        name: "Archived Event",
        event_date: "2024-12-26",
      });
      await updateEvent(archivedEvent.id, { is_archived: true });

      const activeEvents = await getEvents({ is_archived: false });
      const archivedEvents = await getEvents({ is_archived: true });

      expect(activeEvents.some(e => e.id === activeEvent.id)).toBe(true);
      expect(archivedEvents.some(e => e.id === archivedEvent.id)).toBe(true);

      const supabase = await getSupabaseClient();
      if (supabase) {
        await supabase.from("events").delete().in("id", [activeEvent.id, archivedEvent.id]);
      }
    });

    it("should filter upcoming events", async () => {
      const env = getSupabaseEnv();
      if (!env) return;

      const futureEvent = await createEvent({
        name: "Future Event",
        event_date: "2099-12-25",
      });
      testEventId = futureEvent.id;

      const upcomingEvents = await getEvents({ upcoming: true });
      expect(upcomingEvents.some(e => e.id === futureEvent.id)).toBe(true);
    });

    it("should filter past events", async () => {
      const env = getSupabaseEnv();
      if (!env) return;

      const pastEvent = await createEvent({
        name: "Past Event",
        event_date: "2000-12-25",
      });
      testEventId = pastEvent.id;

      const pastEvents = await getEvents({ past: true });
      expect(pastEvents.some(e => e.id === pastEvent.id)).toBe(true);
    });
  });

  describe("getEventById", () => {
    it("should return an event by ID", async () => {
      const env = getSupabaseEnv();
      if (!env) return;

      const createdEvent = await createEvent({
        name: "Event for Get By ID",
        event_date: "2024-12-25",
      });
      testEventId = createdEvent.id;

      const retrievedEvent = await getEventById(createdEvent.id);
      expect(retrievedEvent).toBeDefined();
      expect(retrievedEvent?.id).toBe(createdEvent.id);
      expect(retrievedEvent?.name).toBe(createdEvent.name);
    });

    it("should return null for non-existent event", async () => {
      const env = getSupabaseEnv();
      if (!env) return;

      const nonExistentEvent = await getEventById("00000000-0000-0000-0000-000000000000");
      expect(nonExistentEvent).toBeNull();
    });
  });

  describe("updateEvent", () => {
    it("should update an event", async () => {
      const env = getSupabaseEnv();
      if (!env) return;

      const createdEvent = await createEvent({
        name: "Original Event Name",
        event_date: "2024-12-25",
      });
      testEventId = createdEvent.id;

      const updateData: UpdateEventInput = {
        name: "Updated Event Name",
        description: "Updated description",
        is_visible: true,
      };

      const updatedEvent = await updateEvent(createdEvent.id, updateData);

      expect(updatedEvent).toBeDefined();
      expect(updatedEvent.id).toBe(createdEvent.id);
      expect(updatedEvent.name).toBe(updateData.name);
      expect(updatedEvent.description).toBe(updateData.description);
      expect(updatedEvent.is_visible).toBe(updateData.is_visible);
      expect(updatedEvent.updated_at).toBeDefined();
    });

    it("should handle setting current event", async () => {
      const env = getSupabaseEnv();
      if (!env) return;

      const event1 = await createEvent({
        name: "Event 1",
        event_date: "2024-12-25",
      });

      const event2 = await createEvent({
        name: "Event 2",
        event_date: "2024-12-26",
      });

      await updateEvent(event2.id, { is_current: true });

      const currentEvent1 = await getEventById(event1.id);
      const currentEvent2 = await getEventById(event2.id);

      expect(currentEvent1?.is_current).toBe(false);
      expect(currentEvent2?.is_current).toBe(true);

      const supabase = await getSupabaseClient();
      if (supabase) {
        await supabase.from("events").delete().in("id", [event1.id, event2.id]);
      }
    });
  });

  describe("archiveEvent and restoreEvent", () => {
    it("should archive and restore an event", async () => {
      const env = getSupabaseEnv();
      if (!env) return;

      const createdEvent = await createEvent({
        name: "Event for Archive Test",
        event_date: "2024-12-25",
        is_visible: true,
        is_current: true,
      });
      testEventId = createdEvent.id;

      await archiveEvent(createdEvent.id);

      const archivedEvent = await getEventById(createdEvent.id);
      expect(archivedEvent?.is_archived).toBe(true);
      expect(archivedEvent?.is_current).toBe(false);

      await restoreEvent(createdEvent.id);

      const restoredEvent = await getEventById(createdEvent.id);
      expect(restoredEvent?.is_archived).toBe(false);
    });
  });

  describe("deleteEvent", () => {
    it("should delete an event", async () => {
      const env = getSupabaseEnv();
      if (!env) return;

      const createdEvent = await createEvent({
        name: "Event for Delete Test",
        event_date: "2024-12-25",
      });

      await deleteEvent(createdEvent.id);

      const deletedEvent = await getEventById(createdEvent.id);
      expect(deletedEvent).toBeNull();

      testEventId = null;
    });
  });

  describe("Current Event Logic", () => {
    it("should set and get current event", async () => {
      const env = getSupabaseEnv();
      if (!env) return;

      const event = await createEvent({
        name: "Current Event Test",
        event_date: "2024-12-25",
        is_visible: true,
      });
      testEventId = event.id;

      await setCurrentEvent(event.id);

      const currentEvent = await getCurrentEvent();
      expect(currentEvent).toBeDefined();
      expect(currentEvent?.id).toBe(event.id);
    });

    it("should auto-select closest upcoming event", async () => {
      const env = getSupabaseEnv();
      if (!env) return;

      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);

      const event1 = await createEvent({
        name: "Tomorrow Event",
        event_date: tomorrow.toISOString().split("T")[0],
        is_visible: true,
      });

      const event2 = await createEvent({
        name: "Next Week Event",
        event_date: nextWeek.toISOString().split("T")[0],
        is_visible: true,
      });

      const currentEvent = await getCurrentEvent();
      expect(currentEvent?.id).toBe(event1.id);

      const supabase = await getSupabaseClient();
      if (supabase) {
        await supabase.from("events").delete().in("id", [event1.id, event2.id]);
      }
    });

    it("should return null when no current event exists", async () => {
      const env = getSupabaseEnv();
      if (!env) return;

      const supabase = await getSupabaseClient();
      if (supabase) {
        await supabase.from("events").update({ is_current: false }).eq("is_current", true);
      }

      const currentEvent = await getCurrentEvent();
      expect(currentEvent).toBeNull();
    });
  });

  describe("Event-Playlist Relationships", () => {
    beforeEach(async () => {
      const env = getSupabaseEnv();
      if (!env || !testPlaylistId) return;

      const event = await createEvent({
        name: "Event for Playlist Tests",
        event_date: "2024-12-25",
      });
      testEventId = event.id;
    });

    it("should add playlist to event", async () => {
      const env = getSupabaseEnv();
      if (!env || !testEventId || !testPlaylistId) return;

      const eventPlaylist = await addPlaylistToEvent(testEventId, testPlaylistId);

      expect(eventPlaylist).toBeDefined();
      expect(eventPlaylist.event_id).toBe(testEventId);
      expect(eventPlaylist.playlist_id).toBe(testPlaylistId);
      expect(eventPlaylist.position).toBe(1);
    });

    it("should get event playlists", async () => {
      const env = getSupabaseEnv();
      if (!env || !testEventId || !testPlaylistId) return;

      await addPlaylistToEvent(testEventId, testPlaylistId);

      const eventPlaylists = await getEventPlaylists(testEventId);

      expect(eventPlaylists.length).toBe(1);
      expect(eventPlaylists[0].playlist_id).toBe(testPlaylistId);
      expect(eventPlaylists[0].playlist.id).toBe(testPlaylistId);
    });

    it("should get playlist count for event", async () => {
      const env = getSupabaseEnv();
      if (!env || !testEventId || !testPlaylistId) return;

      await addPlaylistToEvent(testEventId, testPlaylistId);

      const count = await getEventPlaylistCount(testEventId);
      expect(count).toBe(1);
    });

    it("should remove playlist from event", async () => {
      const env = getSupabaseEnv();
      if (!env || !testEventId || !testPlaylistId) return;

      await addPlaylistToEvent(testEventId, testPlaylistId);
      await removePlaylistFromEvent(testEventId, testPlaylistId);

      const eventPlaylists = await getEventPlaylists(testEventId);
      expect(eventPlaylists.length).toBe(0);
    });

    it("should reorder event playlists", async () => {
      const env = getSupabaseEnv();
      if (!env || !testEventId) return;

      const supabase = await getSupabaseClient();
      if (!supabase) return;

      const { data: playlist2, error: playlist2Error } = await supabase
        .from("playlists")
        .insert({
          name: "Test Playlist 2",
          description: "Second test playlist",
          status: "hidden",
        })
        .select()
        .single();

      if (playlist2Error || !playlist2) return;

      try {
        await addPlaylistToEvent(testEventId, testPlaylistId!);
        await addPlaylistToEvent(testEventId, playlist2.id);

        await reorderEventPlaylists(testEventId, [playlist2.id, testPlaylistId!]);

        const eventPlaylists = await getEventPlaylists(testEventId);
        expect(eventPlaylists.length).toBe(2);
        expect(eventPlaylists[0].playlist_id).toBe(playlist2.id);
        expect(eventPlaylists[0].position).toBe(1);
        expect(eventPlaylists[1].playlist_id).toBe(testPlaylistId);
        expect(eventPlaylists[1].position).toBe(2);
      } finally {
        await supabase.from("playlists").delete().eq("id", playlist2.id);
      }
    });
  });

  describe("getEventWithPlaylists", () => {
    it("should return event with playlists", async () => {
      const env = getSupabaseEnv();
      if (!env || !testPlaylistId) return;

      const event = await createEvent({
        name: "Event with Playlists Test",
        event_date: "2024-12-25",
      });
      testEventId = event.id;

      await addPlaylistToEvent(event.id, testPlaylistId);

      const eventWithPlaylists = await getEventWithPlaylists(event.id);

      expect(eventWithPlaylists).toBeDefined();
      expect(eventWithPlaylists?.id).toBe(event.id);
      expect(eventWithPlaylists?.playlists?.length).toBe(1);
      expect(eventWithPlaylists?.playlists[0].id).toBe(testPlaylistId);
    });
  });

  describe("getVisibleEventById", () => {
    it("should return visible event", async () => {
      const env = getSupabaseEnv();
      if (!env) return;

      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);

      const event = await createEvent({
        name: "Visible Event Test",
        event_date: futureDate.toISOString().split("T")[0],
        is_visible: true,
      });
      testEventId = event.id;

      const visibleEvent = await getVisibleEventById(event.id);
      expect(visibleEvent).toBeDefined();
      expect(visibleEvent?.id).toBe(event.id);
    });

    it("should not return hidden event", async () => {
      const env = getSupabaseEnv();
      if (!env) return;

      const event = await createEvent({
        name: "Hidden Event Test",
        event_date: "2024-12-25",
        is_visible: false,
      });
      testEventId = event.id;

      const visibleEvent = await getVisibleEventById(event.id);
      expect(visibleEvent).toBeNull();
    });

    it("should not return archived event", async () => {
      const env = getSupabaseEnv();
      if (!env) return;

      const event = await createEvent({
        name: "Archived Event Test",
        event_date: "2024-12-25",
        is_visible: true,
      });
      await updateEvent(event.id, { is_archived: true });
      testEventId = event.id;

      const visibleEvent = await getVisibleEventById(event.id);
      expect(visibleEvent).toBeNull();
    });
  });
});