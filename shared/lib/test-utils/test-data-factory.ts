import type { CreateEventInput } from "../../types/event";
import type { PlaylistCreateInput } from "../../types/playlist";
import type { Song } from "../../types/song";

export class TestDataFactory {
  static createEvent(overrides: Partial<CreateEventInput> = {}): CreateEventInput {
    const base: CreateEventInput = {
      name: "Test Event",
      event_date: "2024-12-25",
    };

    return { ...base, ...overrides };
  }

  static createPlaylist(overrides: Partial<PlaylistCreateInput> = {}): PlaylistCreateInput {
    const base: PlaylistCreateInput = {
      name: "Test Playlist",
    };

    return { ...base, ...overrides };
  }

  static createSong(overrides: Partial<Song> = {}): Omit<Song, "id" | "created_at" | "updated_at"> {
    const base: Omit<Song, "id" | "created_at" | "updated_at"> = {
      title: "Test Song",
      lyrics: "Test lyrics\nLine 2",
      artist_composer: "Test Artist",
      language: "English",
      genre: "Test Genre",
      year: 2024,
      is_visible: false,
      is_archived: false,
    };

    return { ...base, ...overrides };
  }

  static createMultipleEvents(count: number, baseOverrides: Partial<CreateEventInput> = {}): CreateEventInput[] {
    return Array.from({ length: count }, (_, index) => 
      this.createEvent({
        ...baseOverrides,
        name: `${baseOverrides.name || "Test Event"} ${index + 1}`,
      })
    );
  }

  static createMultiplePlaylists(count: number, baseOverrides: Partial<PlaylistCreateInput> = {}): PlaylistCreateInput[] {
    return Array.from({ length: count }, (_, index) => 
      this.createPlaylist({
        ...baseOverrides,
        name: `${baseOverrides.name || "Test Playlist"} ${index + 1}`,
      })
    );
  }

  static createMultipleSongs(count: number, baseOverrides: Partial<Song> = {}): Omit<Song, "id" | "created_at" | "updated_at">[] {
    return Array.from({ length: count }, (_, index) => 
      this.createSong({
        ...baseOverrides,
        title: `${baseOverrides.title || "Test Song"} ${index + 1}`,
      })
    );
  }

  static createFutureEvent(overrides: Partial<CreateEventInput> = {}): CreateEventInput {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    
    return this.createEvent({
      ...overrides,
      event_date: futureDate.toISOString().split("T")[0],
    });
  }

  static createPastEvent(overrides: Partial<CreateEventInput> = {}): CreateEventInput {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 30);
    
    return this.createEvent({
      ...overrides,
      event_date: pastDate.toISOString().split("T")[0],
    });
  }

  static createVisibleEvent(overrides: Partial<CreateEventInput> = {}): CreateEventInput {
    return this.createEvent({
      ...overrides,
      is_visible: true,
    });
  }

  static createCurrentEvent(overrides: Partial<CreateEventInput> = {}): CreateEventInput {
    return this.createEvent({
      ...overrides,
      is_current: true,
    });
  }

  static createArchivedEvent(overrides: Partial<CreateEventInput> = {}): CreateEventInput {
    const event = this.createEvent(overrides);
    return { ...event, is_archived: true } as CreateEventInput & { is_archived: boolean };
  }

  static createVisiblePlaylist(overrides: Partial<PlaylistCreateInput> = {}): PlaylistCreateInput {
    return this.createPlaylist({
      ...overrides,
      status: "visible",
    });
  }

  static createHiddenPlaylist(overrides: Partial<PlaylistCreateInput> = {}): PlaylistCreateInput {
    return this.createPlaylist({
      ...overrides,
      status: "hidden",
    });
  }

  static createArchivedPlaylist(overrides: Partial<PlaylistCreateInput> = {}): PlaylistCreateInput {
    return this.createPlaylist({
      ...overrides,
      status: "archived",
    });
  }

  static createVisibleSong(overrides: Partial<Song> = {}): Omit<Song, "id" | "created_at" | "updated_at"> {
    return this.createSong({
      ...overrides,
      is_visible: true,
    });
  }

  static createArchivedSong(overrides: Partial<Song> = {}): Omit<Song, "id" | "created_at" | "updated_at"> {
    return this.createSong({
      ...overrides,
      is_archived: true,
    });
  }

  static createEventWithLocation(overrides: Partial<CreateEventInput> = {}): CreateEventInput {
    return this.createEvent({
      ...overrides,
      place: "Test Venue",
      latitude: 40.7128,
      longitude: -74.0060,
      event_time: "18:00",
    });
  }
}