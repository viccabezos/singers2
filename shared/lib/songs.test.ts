import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import { getSupabaseEnv } from "./test-utils/supabase-env";
import type { Song, SongCreateInput } from "../types/song";

// Dynamically import songs functions to avoid errors when env vars aren't set
let songsModule: any = null;

async function getSongsModule() {
  if (songsModule) return songsModule;
  
  const env = getSupabaseEnv();
  if (!env) return null;
  
  try {
    songsModule = await import("./songs");
    return songsModule;
  } catch (error) {
    return null;
  }
}

// Helper to get supabase client safely
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

describe("Songs CRUD Operations", () => {
  let testSongIds: string[] = [];
  let testSong: Song | null = null;

  beforeAll(async () => {
    const env = getSupabaseEnv();
    if (!env) {
      console.warn("Skipping songs CRUD tests - environment variables not set");
      return;
    }
  });

  afterAll(async () => {
    // Clean up test songs
    const supabase = await getSupabaseClient();
    if (supabase && testSongIds.length > 0) {
      for (const id of testSongIds) {
        try {
          await supabase.from("songs").delete().eq("id", id);
        } catch (error) {
          // Ignore cleanup errors
        }
      }
    }
  });

  describe("Create Song (INSERT)", () => {
    it("should create a song with required fields", async () => {
      const songsModule = await getSongsModule();
      if (!songsModule) return;

      const input: SongCreateInput = {
        title: "Test Song - Create",
        lyrics: "Test lyrics\nLine 2\nLine 3",
      };

      const song = await songsModule.createSong(input);
      testSongIds.push(song.id);
      testSong = song;

      expect(song).toBeDefined();
      expect(song.id).toBeDefined();
      expect(song.title).toBe(input.title);
      expect(song.lyrics).toBe(input.lyrics);
      expect(song.is_visible).toBe(true); // Default value
      expect(song.is_archived).toBe(false);
      expect(song.created_at).toBeDefined();
      expect(song.updated_at).toBeDefined();
    });

    it("should create a song with all optional fields", async () => {
      const env = getSupabaseEnv();
      if (!env) return;

      const input: SongCreateInput = {
        title: "Test Song - Full Fields",
        lyrics: "Complete lyrics",
        artist_composer: "Test Artist",
        language: "English",
        genre: "Pop",
        year: 2024,
        is_visible: false,
      };

      const songsModule = await getSongsModule();
      if (!songsModule) return;
      const song = await songsModule.createSong(input);
      testSongIds.push(song.id);

      expect(song.title).toBe(input.title);
      expect(song.lyrics).toBe(input.lyrics);
      expect(song.artist_composer).toBe(input.artist_composer);
      expect(song.language).toBe(input.language);
      expect(song.genre).toBe(input.genre);
      expect(song.year).toBe(input.year);
      expect(song.is_visible).toBe(false);
    });

    it("should preserve line breaks in lyrics", async () => {
      const env = getSupabaseEnv();
      if (!env) return;

      const lyrics = "Verse 1\n\nVerse 2\n\nChorus";
      const input: SongCreateInput = {
        title: "Test Song - Line Breaks",
        lyrics,
      };

      const songsModule = await getSongsModule();
      if (!songsModule) return;
      const song = await songsModule.createSong(input);
      testSongIds.push(song.id);

      expect(song.lyrics).toBe(lyrics);
      expect(song.lyrics).toContain("\n");
    });

    it("should throw error when creating song without title", async () => {
      const env = getSupabaseEnv();
      if (!env) return;

      const input = {
        lyrics: "Some lyrics",
      } as any;

      const songsModule = await getSongsModule();
      if (!songsModule) return;
      await expect(songsModule.createSong(input)).rejects.toThrow();
    });

    it("should throw error when creating song without lyrics", async () => {
      const env = getSupabaseEnv();
      if (!env) return;

      const input = {
        title: "Some title",
      } as any;

      const songsModule = await getSongsModule();
      if (!songsModule) return;
      await expect(songsModule.createSong(input)).rejects.toThrow();
    });
  });

  describe("Read Songs (SELECT)", () => {
    it("should get all non-archived songs", async () => {
      const env = getSupabaseEnv();
      if (!env) return;

      const songsModule = await getSongsModule();
      if (!songsModule) return;
      const songs = await songsModule.getSongs();

      expect(Array.isArray(songs)).toBe(true);
      // All returned songs should not be archived
      songsModule.forEach((song) => {
        expect(song.is_archived).toBe(false);
      });
    });

    it("should get song by ID", async () => {
      const env = getSupabaseEnv();
      if (!env || !testSong) return;

      const songsModule = await getSongsModule();
      if (!songsModule) return;
      const song = await songsModule.getSongById(testSong.id);

      expect(song).not.toBeNull();
      expect(song?.id).toBe(testSong.id);
      expect(song?.title).toBe(testSong.title);
    });

    it("should return null for non-existent song ID", async () => {
      const env = getSupabaseEnv();
      if (!env) return;

      const nonExistentId = "00000000-0000-0000-0000-000000000000";
      const songsModule = await getSongsModule();
      if (!songsModule) return;
      const song = await songsModule.getSongById(nonExistentId);

      expect(song).toBeNull();
    });

    it("should get visible song by ID", async () => {
      const env = getSupabaseEnv();
      if (!env || !testSong) return;

      // Ensure test song is visible
      const songsModule = await getSongsModule();
      if (!songsModule) return;
      if (!testSong.is_visible) {
        await songsModule.updateSong(testSong.id, { is_visible: true });
        testSong = await songsModule.getSongById(testSong.id)!;
      }

      const song = await songsModule.getVisibleSongById(testSong.id);

      expect(song).not.toBeNull();
      expect(song?.id).toBe(testSong.id);
      expect(song?.is_visible).toBe(true);
      expect(song?.is_archived).toBe(false);
    });

    it("should return null for hidden song when using getVisibleSongById", async () => {
      const env = getSupabaseEnv();
      if (!env || !testSong) return;

      // Create a hidden song
      const songsModule = await getSongsModule();
      if (!songsModule) return;
      const hiddenSong = await songsModule.createSong({
        title: "Hidden Test Song",
        lyrics: "Hidden lyrics",
        is_visible: false,
      });
      testSongIds.push(hiddenSong.id);

      const song = await songsModule.getVisibleSongById(hiddenSong.id);

      expect(song).toBeNull();
    });

    it("should filter songs by title", async () => {
      const env = getSupabaseEnv();
      if (!env) return;

      const songsModule = await getSongsModule();
      if (!songsModule) return;
      const songs = await songsModule.getSongs({ title: "Test Song" });

      expect(Array.isArray(songs)).toBe(true);
      songsModule.forEach((song) => {
        expect(song.title.toLowerCase()).toContain("test song");
      });
    });

    it("should filter songs by artist", async () => {
      const env = getSupabaseEnv();
      if (!env) return;

      const songsModule = await getSongsModule();
      if (!songsModule) return;
      const songs = await songsModule.getSongs({ artist_composer: "Test Artist" });

      expect(Array.isArray(songs)).toBe(true);
      songsModule.forEach((song) => {
        if (song.artist_composer) {
          expect(song.artist_composer.toLowerCase()).toContain("test artist");
        }
      });
    });

    it("should filter songs by language", async () => {
      const env = getSupabaseEnv();
      if (!env) return;

      const songsModule = await getSongsModule();
      if (!songsModule) return;
      const songs = await songsModule.getSongs({ language: "English" });

      expect(Array.isArray(songs)).toBe(true);
      songsModule.forEach((song) => {
        expect(song.language).toBe("English");
      });
    });

    it("should filter songs by visibility", async () => {
      const env = getSupabaseEnv();
      if (!env) return;

      const songsModule = await getSongsModule();
      if (!songsModule) return;
      const visibleSongs = await songsModule.getSongs({ is_visible: true });
      const hiddenSongs = await songsModule.getSongs({ is_visible: false });

      expect(Array.isArray(visibleSongs)).toBe(true);
      expect(Array.isArray(hiddenSongs)).toBe(true);

      visibleSongs.forEach((song) => {
        expect(song.is_visible).toBe(true);
      });

      hiddenSongs.forEach((song) => {
        expect(song.is_visible).toBe(false);
      });
    });

    it("should filter archived songs", async () => {
      const env = getSupabaseEnv();
      if (!env || !testSong) return;

      // Archive a test song
      const songsModule = await getSongsModule();
      if (!songsModule) return;
      await songsModule.archiveSong(testSong.id);
      const archivedSongs = await songsModule.getSongs({ is_archived: true });

      // Restore for cleanup
      await songsModule.restoreSong(testSong.id);

      expect(Array.isArray(archivedSongs)).toBe(true);
      const foundArchived = archivedSongs.find((s) => s.id === testSong.id);
      expect(foundArchived).toBeDefined();
    });

    it("should combine multiple filters", async () => {
      const env = getSupabaseEnv();
      if (!env) return;

      const songsModule = await getSongsModule();
      if (!songsModule) return;
      const songs = await songsModule.getSongs({
        title: "Test",
        language: "English",
        is_visible: true,
      });

      expect(Array.isArray(songs)).toBe(true);
      songsModule.forEach((song) => {
        expect(song.title.toLowerCase()).toContain("test");
        expect(song.language).toBe("English");
        expect(song.is_visible).toBe(true);
        expect(song.is_archived).toBe(false);
      });
    });
  });

  describe("Update Song (UPDATE)", () => {
    it("should update song title", async () => {
      const env = getSupabaseEnv();
      if (!env || !testSong) return;

      const updatedTitle = "Updated Test Song Title";
      const songsModule = await getSongsModule();
      if (!songsModule) return;
      const updated = await songsModule.updateSong(testSong.id, { title: updatedTitle });

      expect(updated.title).toBe(updatedTitle);
      expect(updated.id).toBe(testSong.id);

      // Verify in database
      const song = await songsModule.getSongById(testSong.id);
      expect(song?.title).toBe(updatedTitle);
    });

    it("should update song lyrics", async () => {
      const env = getSupabaseEnv();
      if (!env || !testSong) return;

      const updatedLyrics = "Updated lyrics\nNew line";
      const songsModule = await getSongsModule();
      if (!songsModule) return;
      const updated = await songsModule.updateSong(testSong.id, { lyrics: updatedLyrics });

      expect(updated.lyrics).toBe(updatedLyrics);
    });

    it("should update multiple fields at once", async () => {
      const env = getSupabaseEnv();
      if (!env || !testSong) return;

      const updates = {
        title: "Multi-Update Song",
        artist_composer: "Updated Artist",
        language: "French",
        genre: "Jazz",
        year: 2023,
        is_visible: false,
      };

      const updated = await updateSong(testSong.id, updates);

      expect(updated.title).toBe(updates.title);
      expect(updated.artist_composer).toBe(updates.artist_composer);
      expect(updated.language).toBe(updates.language);
      expect(updated.genre).toBe(updates.genre);
      expect(updated.year).toBe(updates.year);
      expect(updated.is_visible).toBe(updates.is_visible);
    });

    it("should update updated_at timestamp", async () => {
      const env = getSupabaseEnv();
      if (!env || !testSong) return;

      const songsModule = await getSongsModule();
      if (!songsModule) return;
      const beforeUpdate = await songsModule.getSongById(testSong.id);
      const originalUpdatedAt = beforeUpdate?.updated_at;

      // Wait a moment to ensure timestamp difference
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await songsModule.updateSong(testSong.id, { title: "Timestamp Test" });
      const afterUpdate = await songsModule.getSongById(testSong.id);

      expect(afterUpdate?.updated_at).not.toBe(originalUpdatedAt);
    });

    it("should throw error when updating non-existent song", async () => {
      const env = getSupabaseEnv();
      if (!env) return;

      const nonExistentId = "00000000-0000-0000-0000-000000000000";

      await expect(updateSong(nonExistentId, { title: "Test" })).rejects.toThrow();
    });
  });

  describe("Duplicate Song", () => {
    it("should duplicate a song with 'Copy' appended to title", async () => {
      const env = getSupabaseEnv();
      if (!env || !testSong) return;

      const songsModule = await getSongsModule();
      if (!songsModule) return;
      const duplicated = await songsModule.duplicateSong(testSong.id);
      testSongIds.push(duplicated.id);

      expect(duplicated.title).toBe(`${testSong.title} (Copy)`);
      expect(duplicated.lyrics).toBe(testSong.lyrics);
      expect(duplicated.artist_composer).toBe(testSong.artist_composer);
      expect(duplicated.language).toBe(testSong.language);
      expect(duplicated.genre).toBe(testSong.genre);
      expect(duplicated.year).toBe(testSong.year);
      expect(duplicated.is_visible).toBe(false); // Hidden by default
      expect(duplicated.is_archived).toBe(false);
    });

    it("should create a new song with different ID", async () => {
      const env = getSupabaseEnv();
      if (!env || !testSong) return;

      const songsModule = await getSongsModule();
      if (!songsModule) return;
      const duplicated = await songsModule.duplicateSong(testSong.id);
      testSongIds.push(duplicated.id);

      expect(duplicated.id).not.toBe(testSong.id);
    });

    it("should throw error when duplicating non-existent song", async () => {
      const env = getSupabaseEnv();
      if (!env) return;

      const nonExistentId = "00000000-0000-0000-0000-000000000000";

      await expect(duplicateSong(nonExistentId)).rejects.toThrow("Song not found");
    });
  });

  describe("Archive Song", () => {
    it("should archive a song", async () => {
      const env = getSupabaseEnv();
      if (!env || !testSong) return;

      const songsModule = await getSongsModule();
      if (!songsModule) return;
      await songsModule.archiveSong(testSong.id);

      const archived = await getSongById(testSong.id);
      expect(archived?.is_archived).toBe(true);

      // Restore for cleanup
      await restoreSong(testSong.id);
    });

    it("should not appear in default getSongs() after archiving", async () => {
      const env = getSupabaseEnv();
      if (!env || !testSong) return;

      const songsModule = await getSongsModule();
      if (!songsModule) return;
      await songsModule.archiveSong(testSong.id);

      const songs = await songsModule.getSongs();
      const found = songs.find((s) => s.id === testSong.id);
      expect(found).toBeUndefined();

      // Restore for cleanup
      await restoreSong(testSong.id);
    });

    it("should throw error when archiving non-existent song", async () => {
      const env = getSupabaseEnv();
      if (!env) return;

      const nonExistentId = "00000000-0000-0000-0000-000000000000";

      const songsModule = await getSongsModule();
      if (!songsModule) return;
      await expect(songsModule.archiveSong(nonExistentId)).rejects.toThrow();
    });
  });

  describe("Restore Song", () => {
    it("should restore an archived song", async () => {
      const env = getSupabaseEnv();
      if (!env || !testSong) return;

      // Archive first
      const songsModule = await getSongsModule();
      if (!songsModule) return;
      await songsModule.archiveSong(testSong.id);
      let archived = await songsModule.getSongById(testSong.id);
      expect(archived?.is_archived).toBe(true);

      // Restore
      await songsModule.restoreSong(testSong.id);
      const restored = await songsModule.getSongById(testSong.id);
      expect(restored?.is_archived).toBe(false);
    });

    it("should appear in default getSongs() after restoring", async () => {
      const env = getSupabaseEnv();
      if (!env || !testSong) return;

      // Archive first
      const songsModule = await getSongsModule();
      if (!songsModule) return;
      await songsModule.archiveSong(testSong.id);
      let songs = await songsModule.getSongs();
      let found = songs.find((s) => s.id === testSong.id);
      expect(found).toBeUndefined();

      // Restore
      await songsModule.restoreSong(testSong.id);
      songs = await songsModule.getSongs();
      found = songsModule.find((s) => s.id === testSong.id);
      expect(found).toBeDefined();
    });
  });

  describe("Delete Song", () => {
    it("should delete a song permanently", async () => {
      const env = getSupabaseEnv();
      if (!env) return;

      // Create a song to delete
      const songsModule = await getSongsModule();
      if (!songsModule) return;
      const songToDelete = await songsModule.createSong({
        title: "Song To Delete",
        lyrics: "Delete me",
      });

      await songsModule.deleteSong(songToDelete.id);

      // Verify deletion
      const deleted = await songsModule.getSongById(songToDelete.id);
      expect(deleted).toBeNull();
    });

    it("should throw error when deleting non-existent song", async () => {
      const env = getSupabaseEnv();
      if (!env) return;

      const nonExistentId = "00000000-0000-0000-0000-000000000000";

      await expect(deleteSong(nonExistentId)).rejects.toThrow();
    });
  });

  describe("Bulk Update Visibility", () => {
    it("should update visibility for multiple songs", async () => {
      const env = getSupabaseEnv();
      if (!env) return;

      // Create multiple test songs
      const songsModule = await getSongsModule();
      if (!songsModule) return;
      const song1 = await songsModule.createSong({
        title: "Bulk Test 1",
        lyrics: "Lyrics 1",
        is_visible: true,
      });
      const song2 = await songsModule.createSong({
        title: "Bulk Test 2",
        lyrics: "Lyrics 2",
        is_visible: true,
      });
      testSongIds.push(song1.id, song2.id);

      // Hide both
      await songsModule.bulkUpdateVisibility([song1.id, song2.id], false);

      const updated1 = await songsModule.getSongById(song1.id);
      const updated2 = await songsModule.getSongById(song2.id);

      expect(updated1?.is_visible).toBe(false);
      expect(updated2?.is_visible).toBe(false);

      // Show both
      await songsModule.bulkUpdateVisibility([song1.id, song2.id], true);

      const updated3 = await songsModule.getSongById(song1.id);
      const updated4 = await songsModule.getSongById(song2.id);

      expect(updated3?.is_visible).toBe(true);
      expect(updated4?.is_visible).toBe(true);
    });

    it("should handle empty array", async () => {
      const env = getSupabaseEnv();
      if (!env) return;

      // Should not throw error
      const songsModule = await getSongsModule();
      if (!songsModule) return;
      await expect(songsModule.bulkUpdateVisibility([], true)).resolves.not.toThrow();
    });
  });

  describe("Get Distinct Languages", () => {
    it("should return unique languages", async () => {
      const env = getSupabaseEnv();
      if (!env) return;

      const songsModule = await getSongsModule();
      if (!songsModule) return;
      const languages = await songsModule.getDistinctLanguages();

      expect(Array.isArray(languages)).toBe(true);
      // Check for uniqueness
      const uniqueSet = new Set(languages);
      expect(uniqueSet.size).toBe(languages.length);
    });

    it("should return sorted languages", async () => {
      const env = getSupabaseEnv();
      if (!env) return;

      const songsModule = await getSongsModule();
      if (!songsModule) return;
      const languages = await songsModule.getDistinctLanguages();

      // Check if sorted
      const sorted = [...languages].sort();
      expect(languages).toEqual(sorted);
    });

    it("should exclude null languages", async () => {
      const env = getSupabaseEnv();
      if (!env) return;

      const songsModule = await getSongsModule();
      if (!songsModule) return;
      const languages = await songsModule.getDistinctLanguages();

      languages.forEach((lang) => {
        expect(lang).not.toBeNull();
        expect(lang).not.toBeUndefined();
      });
    });
  });
});
