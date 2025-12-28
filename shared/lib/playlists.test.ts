import { describe, it, expect, beforeAll, afterAll, afterEach, beforeEach } from "bun:test";
import { getSupabaseEnv } from "./test-utils/supabase-env";
import { testSupabaseConnection } from "./test-utils/supabase-connection";
import {
  getPlaylists,
  getPlaylistById,
  getVisiblePlaylistById,
  createPlaylist,
  updatePlaylist,
  archivePlaylist,
  restorePlaylist,
  deletePlaylist,
  getPlaylistSongs,
  addSongToPlaylist,
  removeSongFromPlaylist,
  reorderPlaylistSongs,
  getPlaylistSongCount,
} from "./playlists";
import type { Playlist, PlaylistSong, PlaylistCreateInput, PlaylistUpdateInput } from "../types/playlist";
import type { Song } from "../types/song";

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

describe("Playlists CRUD Operations", () => {
  let testPlaylistId: string | null = null;
  let testSongId: string | null = null;

  beforeAll(async () => {
    const env = getSupabaseEnv();
    if (!env) {
      console.warn("Skipping playlists tests - environment variables not set");
      return;
    }

    const connectionResult = await testSupabaseConnection();
    if (!connectionResult.success) {
      console.warn("Skipping playlists tests - database connection failed:", connectionResult.error);
      return;
    }

    const supabase = await getSupabaseClient();
    if (supabase) {
      const { data: song, error: songError } = await supabase
        .from("songs")
        .insert({
          title: "Test Song for Playlists",
          lyrics: "Test lyrics\nLine 2",
          is_visible: false,
          is_archived: false,
        })
        .select()
        .single();

      if (!songError && song) {
        testSongId = song.id;
      }
    }
  });

  afterAll(async () => {
    if (testSongId) {
      const supabase = await getSupabaseClient();
      if (supabase) {
        await supabase.from("songs").delete().eq("id", testSongId);
      }
    }
  });

  afterEach(async () => {
    if (testPlaylistId) {
      const supabase = await getSupabaseClient();
      if (supabase) {
        await supabase.from("playlists").delete().eq("id", testPlaylistId);
        testPlaylistId = null;
      }
    }
  });

  describe("createPlaylist", () => {
    it("should create a new playlist with minimum required fields", async () => {
      const env = getSupabaseEnv();
      if (!env) return;

      const playlistData: PlaylistCreateInput = {
        name: "Test Playlist",
      };

      const playlist = await createPlaylist(playlistData);

      expect(playlist).toBeDefined();
      expect(playlist.id).toBeDefined();
      expect(playlist.name).toBe(playlistData.name);
      expect(playlist.description).toBeNull();
      expect(playlist.status).toBe("hidden");

      testPlaylistId = playlist.id;
    });

    it("should create a new playlist with all optional fields", async () => {
      const env = getSupabaseEnv();
      if (!env) return;

      const playlistData: PlaylistCreateInput = {
        name: "Complete Test Playlist",
        description: "A complete test playlist with all fields",
        status: "visible",
      };

      const playlist = await createPlaylist(playlistData);

      expect(playlist).toBeDefined();
      expect(playlist.name).toBe(playlistData.name);
      expect(playlist.description).toBe(playlistData.description);
      expect(playlist.status).toBe(playlistData.status);

      testPlaylistId = playlist.id;
    });

    it("should default status to hidden when not provided", async () => {
      const env = getSupabaseEnv();
      if (!env) return;

      const playlistData: PlaylistCreateInput = {
        name: "Default Status Playlist",
      };

      const playlist = await createPlaylist(playlistData);

      expect(playlist.status).toBe("hidden");

      testPlaylistId = playlist.id;
    });
  });

  describe("getPlaylists", () => {
    it("should return all playlists when no filters provided", async () => {
      const env = getSupabaseEnv();
      if (!env) return;

      const playlists = await getPlaylists();
      expect(Array.isArray(playlists)).toBe(true);
    });

    it("should filter playlists by name", async () => {
      const env = getSupabaseEnv();
      if (!env) return;

      const playlist = await createPlaylist({
        name: "Unique Test Playlist Name",
      });
      testPlaylistId = playlist.id;

      const filteredPlaylists = await getPlaylists({ name: "Unique Test Playlist Name" });
      expect(filteredPlaylists.length).toBeGreaterThanOrEqual(1);
      expect(filteredPlaylists.some(p => p.id === playlist.id)).toBe(true);
    });

    it("should filter playlists by status", async () => {
      const env = getSupabaseEnv();
      if (!env) return;

      const visiblePlaylist = await createPlaylist({
        name: "Visible Playlist",
        status: "visible",
      });

      const hiddenPlaylist = await createPlaylist({
        name: "Hidden Playlist",
        status: "hidden",
      });

      const archivedPlaylist = await createPlaylist({
        name: "Archived Playlist",
        status: "archived",
      });

      const visiblePlaylists = await getPlaylists({ status: "visible" });
      const hiddenPlaylists = await getPlaylists({ status: "hidden" });
      const archivedPlaylists = await getPlaylists({ status: "archived" });

      expect(visiblePlaylists.some(p => p.id === visiblePlaylist.id)).toBe(true);
      expect(hiddenPlaylists.some(p => p.id === hiddenPlaylist.id)).toBe(true);
      expect(archivedPlaylists.some(p => p.id === archivedPlaylist.id)).toBe(true);

      const supabase = await getSupabaseClient();
      if (supabase) {
        await supabase.from("playlists").delete().in("id", [
          visiblePlaylist.id,
          hiddenPlaylist.id,
          archivedPlaylist.id,
        ]);
      }
    });

    it("should filter playlists by multiple statuses", async () => {
      const env = getSupabaseEnv();
      if (!env) return;

      const visiblePlaylist = await createPlaylist({
        name: "Visible Multi Playlist",
        status: "visible",
      });

      const hiddenPlaylist = await createPlaylist({
        name: "Hidden Multi Playlist",
        status: "hidden",
      });

      const multiStatusPlaylists = await getPlaylists({ status: ["visible", "hidden"] });
      expect(multiStatusPlaylists.some(p => p.id === visiblePlaylist.id)).toBe(true);
      expect(multiStatusPlaylists.some(p => p.id === hiddenPlaylist.id)).toBe(true);

      const supabase = await getSupabaseClient();
      if (supabase) {
        await supabase.from("playlists").delete().in("id", [
          visiblePlaylist.id,
          hiddenPlaylist.id,
        ]);
      }
    });

    it("should filter playlists by archived status", async () => {
      const env = getSupabaseEnv();
      if (!env) return;

      const activePlaylist = await createPlaylist({
        name: "Active Playlist",
        status: "visible",
      });

      const archivedPlaylist = await createPlaylist({
        name: "Archived Playlist",
        status: "archived",
      });

      const activePlaylists = await getPlaylists({ is_archived: false });
      const archivedPlaylists = await getPlaylists({ is_archived: true });

      expect(activePlaylists.some(p => p.id === activePlaylist.id)).toBe(true);
      expect(archivedPlaylists.some(p => p.id === archivedPlaylist.id)).toBe(true);

      const supabase = await getSupabaseClient();
      if (supabase) {
        await supabase.from("playlists").delete().in("id", [
          activePlaylist.id,
          archivedPlaylist.id,
        ]);
      }
    });
  });

  describe("getPlaylistById", () => {
    it("should return a playlist by ID", async () => {
      const env = getSupabaseEnv();
      if (!env) return;

      const createdPlaylist = await createPlaylist({
        name: "Playlist for Get By ID",
      });
      testPlaylistId = createdPlaylist.id;

      const retrievedPlaylist = await getPlaylistById(createdPlaylist.id);
      expect(retrievedPlaylist).toBeDefined();
      expect(retrievedPlaylist?.id).toBe(createdPlaylist.id);
      expect(retrievedPlaylist?.name).toBe(createdPlaylist.name);
    });

    it("should return null for non-existent playlist", async () => {
      const env = getSupabaseEnv();
      if (!env) return;

      const nonExistentPlaylist = await getPlaylistById("00000000-0000-0000-0000-000000000000");
      expect(nonExistentPlaylist).toBeNull();
    });
  });

  describe("getVisiblePlaylistById", () => {
    it("should return visible playlist", async () => {
      const env = getSupabaseEnv();
      if (!env) return;

      const playlist = await createPlaylist({
        name: "Visible Playlist Test",
        status: "visible",
      });
      testPlaylistId = playlist.id;

      const visiblePlaylist = await getVisiblePlaylistById(playlist.id);
      expect(visiblePlaylist).toBeDefined();
      expect(visiblePlaylist?.id).toBe(playlist.id);
    });

    it("should not return hidden playlist", async () => {
      const env = getSupabaseEnv();
      if (!env) return;

      const playlist = await createPlaylist({
        name: "Hidden Playlist Test",
        status: "hidden",
      });
      testPlaylistId = playlist.id;

      const visiblePlaylist = await getVisiblePlaylistById(playlist.id);
      expect(visiblePlaylist).toBeNull();
    });

    it("should not return archived playlist", async () => {
      const env = getSupabaseEnv();
      if (!env) return;

      const playlist = await createPlaylist({
        name: "Archived Playlist Test",
        status: "archived",
      });
      testPlaylistId = playlist.id;

      const visiblePlaylist = await getVisiblePlaylistById(playlist.id);
      expect(visiblePlaylist).toBeNull();
    });
  });

  describe("updatePlaylist", () => {
    it("should update a playlist", async () => {
      const env = getSupabaseEnv();
      if (!env) return;

      const createdPlaylist = await createPlaylist({
        name: "Original Playlist Name",
      });
      testPlaylistId = createdPlaylist.id;

      const updateData: PlaylistUpdateInput = {
        name: "Updated Playlist Name",
        description: "Updated description",
        status: "visible",
      };

      const updatedPlaylist = await updatePlaylist(createdPlaylist.id, updateData);

      expect(updatedPlaylist).toBeDefined();
      expect(updatedPlaylist.id).toBe(createdPlaylist.id);
      expect(updatedPlaylist.name).toBe(updateData.name);
      expect(updatedPlaylist.description).toBe(updateData.description);
      expect(updatedPlaylist.status).toBe(updateData.status);
      expect(updatedPlaylist.updated_at).toBeDefined();
    });

    it("should update playlist name only", async () => {
      const env = getSupabaseEnv();
      if (!env) return;

      const createdPlaylist = await createPlaylist({
        name: "Original Name",
        description: "Original description",
      });
      testPlaylistId = createdPlaylist.id;

      const updatedPlaylist = await updatePlaylist(createdPlaylist.id, {
        name: "New Name Only",
      });

      expect(updatedPlaylist.name).toBe("New Name Only");
      expect(updatedPlaylist.description).toBe("Original description");
    });
  });

  describe("archivePlaylist and restorePlaylist", () => {
    it("should archive and restore a playlist", async () => {
      const env = getSupabaseEnv();
      if (!env) return;

      const createdPlaylist = await createPlaylist({
        name: "Playlist for Archive Test",
        status: "visible",
      });
      testPlaylistId = createdPlaylist.id;

      await archivePlaylist(createdPlaylist.id);

      const archivedPlaylist = await getPlaylistById(createdPlaylist.id);
      expect(archivedPlaylist?.status).toBe("archived");

      await restorePlaylist(createdPlaylist.id);

      const restoredPlaylist = await getPlaylistById(createdPlaylist.id);
      expect(restoredPlaylist?.status).toBe("hidden");
    });
  });

  describe("deletePlaylist", () => {
    it("should delete a playlist", async () => {
      const env = getSupabaseEnv();
      if (!env) return;

      const createdPlaylist = await createPlaylist({
        name: "Playlist for Delete Test",
      });

      await deletePlaylist(createdPlaylist.id);

      const deletedPlaylist = await getPlaylistById(createdPlaylist.id);
      expect(deletedPlaylist).toBeNull();

      testPlaylistId = null;
    });
  });

  describe("Playlist-Song Relationships", () => {
    beforeEach(async () => {
      const env = getSupabaseEnv();
      if (!env || !testSongId) return;

      const playlist = await createPlaylist({
        name: "Playlist for Song Tests",
      });
      testPlaylistId = playlist.id;
    });

    it("should add song to playlist", async () => {
      const env = getSupabaseEnv();
      if (!env || !testPlaylistId || !testSongId) return;

      const playlistSong = await addSongToPlaylist(testPlaylistId, testSongId);

      expect(playlistSong).toBeDefined();
      expect(playlistSong.playlist_id).toBe(testPlaylistId);
      expect(playlistSong.song_id).toBe(testSongId);
      expect(playlistSong.position).toBe(1);
    });

    it("should get playlist songs", async () => {
      const env = getSupabaseEnv();
      if (!env || !testPlaylistId || !testSongId) return;

      await addSongToPlaylist(testPlaylistId, testSongId);

      const playlistSongs = await getPlaylistSongs(testPlaylistId);

      expect(playlistSongs.length).toBe(1);
      expect(playlistSongs[0].song_id).toBe(testSongId);
      expect(playlistSongs[0].song.id).toBe(testSongId);
      expect(playlistSongs[0].position).toBe(1);
    });

    it("should get song count for playlist", async () => {
      const env = getSupabaseEnv();
      if (!env || !testPlaylistId || !testSongId) return;

      await addSongToPlaylist(testPlaylistId, testSongId);

      const count = await getPlaylistSongCount(testPlaylistId);
      expect(count).toBe(1);
    });

    it("should remove song from playlist", async () => {
      const env = getSupabaseEnv();
      if (!env || !testPlaylistId || !testSongId) return;

      await addSongToPlaylist(testPlaylistId, testSongId);
      await removeSongFromPlaylist(testPlaylistId, testSongId);

      const playlistSongs = await getPlaylistSongs(testPlaylistId);
      expect(playlistSongs.length).toBe(0);
    });

    it("should handle duplicate song addition gracefully", async () => {
      const env = getSupabaseEnv();
      if (!env || !testPlaylistId || !testSongId) return;

      await addSongToPlaylist(testPlaylistId, testSongId);

      let errorThrown = false;
      try {
        await addSongToPlaylist(testPlaylistId, testSongId);
      } catch (error) {
        errorThrown = true;
        expect(error).toBeDefined();
        expect((error as Error).message).toContain("already in this playlist");
      }
      expect(errorThrown).toBe(true);
    });

    it("should reorder playlist songs", async () => {
      const env = getSupabaseEnv();
      if (!env || !testPlaylistId) return;

      const supabase = await getSupabaseClient();
      if (!supabase) return;

      const { data: song2, error: song2Error } = await supabase
        .from("songs")
        .insert({
          title: "Test Song 2",
          lyrics: "Test lyrics 2\nLine 2",
          is_visible: false,
          is_archived: false,
        })
        .select()
        .single();

      if (song2Error || !song2) return;

      try {
        await addSongToPlaylist(testPlaylistId, testSongId!);
        await addSongToPlaylist(testPlaylistId, song2.id);

        await reorderPlaylistSongs(testPlaylistId, [song2.id, testSongId!]);

        const playlistSongs = await getPlaylistSongs(testPlaylistId);
        expect(playlistSongs.length).toBe(2);
        expect(playlistSongs[0].song_id).toBe(song2.id);
        expect(playlistSongs[0].position).toBe(1);
        expect(playlistSongs[1].song_id).toBe(testSongId);
        expect(playlistSongs[1].position).toBe(2);
      } finally {
        await supabase.from("songs").delete().eq("id", song2.id);
      }
    });

    it("should auto-increment positions for multiple songs", async () => {
      const env = getSupabaseEnv();
      if (!env || !testPlaylistId) return;

      const supabase = await getSupabaseClient();
      if (!supabase) return;

      const { data: song2, error: song2Error } = await supabase
        .from("songs")
        .insert({
          title: "Test Song for Position 2",
          lyrics: "Test lyrics for position 2",
          is_visible: false,
          is_archived: false,
        })
        .select()
        .single();

      if (song2Error || !song2) return;

      try {
        await addSongToPlaylist(testPlaylistId, testSongId!);
        await addSongToPlaylist(testPlaylistId, song2.id);

        const playlistSongs = await getPlaylistSongs(testPlaylistId);
        const firstSong = playlistSongs.find((ps: PlaylistSong) => ps.song_id === testSongId);
        const secondSong = playlistSongs.find((ps: PlaylistSong) => ps.song_id === song2.id);

        expect(firstSong?.position).toBe(1);
        expect(secondSong?.position).toBe(2);
      } finally {
        await supabase.from("songs").delete().eq("id", song2.id);
      }
    });

    it("should handle empty playlist reordering", async () => {
      const env = getSupabaseEnv();
      if (!env || !testPlaylistId) return;

      await reorderPlaylistSongs(testPlaylistId, []);

      const playlistSongs = await getPlaylistSongs(testPlaylistId);
      expect(playlistSongs.length).toBe(0);
    });
  });
});