import { supabase } from "./supabase";
import type {
  Playlist,
  PlaylistWithSongCount,
  PlaylistSong,
  PlaylistCreateInput,
  PlaylistUpdateInput,
  PlaylistFilters,
  PlaylistStatus,
} from "../types/playlist";
import type { Song } from "../types/song";

// ============================================================================
// Playlist CRUD Operations
// ============================================================================

export async function getPlaylists(
  filters: PlaylistFilters = {}
): Promise<PlaylistWithSongCount[]> {
  let query = supabase
    .from("playlists")
    .select("*, playlist_songs(count)")
    .order("created_at", { ascending: false });

  // Filter by status
  if (filters.status) {
    if (Array.isArray(filters.status)) {
      query = query.in("status", filters.status);
    } else {
      query = query.eq("status", filters.status);
    }
  }

  // Filter archived/non-archived
  if (filters.is_archived === true) {
    query = query.eq("status", "archived");
  } else if (filters.is_archived === false) {
    query = query.neq("status", "archived");
  }

  // Filter by name (case-insensitive search)
  if (filters.name) {
    query = query.ilike("name", `%${filters.name}%`);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch playlists: ${error.message}`);
  }

  // Transform to include song_count
  return (data || []).map((playlist: any) => ({
    ...playlist,
    song_count: playlist.playlist_songs?.[0]?.count || 0,
  }));
}

export async function getPlaylistById(id: string): Promise<Playlist | null> {
  const { data, error } = await supabase
    .from("playlists")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null; // Not found
    }
    throw new Error(`Failed to fetch playlist: ${error.message}`);
  }

  return data;
}

export async function getVisiblePlaylistById(id: string): Promise<Playlist | null> {
  const { data, error } = await supabase
    .from("playlists")
    .select("*")
    .eq("id", id)
    .eq("status", "visible")
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null; // Not found
    }
    throw new Error(`Failed to fetch playlist: ${error.message}`);
  }

  return data;
}

export async function getFeaturedPlaylists(): Promise<PlaylistWithSongCount[]> {
  try {
    const { data, error } = await supabase
      .from("playlists")
      .select("*, playlist_songs(count)")
      .eq("featured", true)
      .eq("status", "visible")
      .order("featured_order", { ascending: true })
      .limit(3);

    if (error) {
      // If column doesn't exist (migration not run), return empty array gracefully
      if (error.message.includes("column") && error.message.includes("featured")) {
        console.warn("Featured playlists column not found. Migration may need to be run.");
        return [];
      }
      throw new Error(`Failed to fetch featured playlists: ${error.message}`);
    }

    // Transform to include song_count
    return (data || []).map((playlist: any) => ({
      ...playlist,
      song_count: playlist.playlist_songs?.[0]?.count || 0,
    }));
  } catch (error) {
    console.error("Error fetching featured playlists:", error);
    // Return empty array on any error to prevent page crash
    return [];
  }
}

export async function getVisiblePlaylists(): Promise<PlaylistWithSongCount[]> {
  const { data, error } = await supabase
    .from("playlists")
    .select("*, playlist_songs(count)")
    .eq("status", "visible")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch playlists: ${error.message}`);
  }

  // Transform to include song_count
  return (data || []).map((playlist: any) => ({
    ...playlist,
    song_count: playlist.playlist_songs?.[0]?.count || 0,
  }));
}

export async function createPlaylist(input: PlaylistCreateInput): Promise<Playlist> {
  const { data, error } = await supabase
    .from("playlists")
    .insert({
      name: input.name,
      description: input.description || null,
      status: input.status || "hidden",
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create playlist: ${error.message}`);
  }

  return data;
}

export async function updatePlaylist(
  id: string,
  input: PlaylistUpdateInput
): Promise<Playlist> {
  const { data, error } = await supabase
    .from("playlists")
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update playlist: ${error.message}`);
  }

  return data;
}

export async function archivePlaylist(id: string): Promise<void> {
  const { error } = await supabase
    .from("playlists")
    .update({ status: "archived" as PlaylistStatus })
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to archive playlist: ${error.message}`);
  }
}

export async function restorePlaylist(id: string): Promise<void> {
  const { error } = await supabase
    .from("playlists")
    .update({ status: "hidden" as PlaylistStatus })
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to restore playlist: ${error.message}`);
  }
}

export async function deletePlaylist(id: string): Promise<void> {
  const { error } = await supabase.from("playlists").delete().eq("id", id);

  if (error) {
    throw new Error(`Failed to delete playlist: ${error.message}`);
  }
}

// ============================================================================
// Playlist-Song Management
// ============================================================================

export async function getPlaylistSongs(playlistId: string): Promise<(PlaylistSong & { song: Song })[]> {
  const { data, error } = await supabase
    .from("playlist_songs")
    .select("*, song:songs(*)")
    .eq("playlist_id", playlistId)
    .order("position", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch playlist songs: ${error.message}`);
  }

  return data || [];
}

export async function addSongToPlaylist(
  playlistId: string,
  songId: string
): Promise<PlaylistSong> {
  // Get the current max position
  const { data: existing } = await supabase
    .from("playlist_songs")
    .select("position")
    .eq("playlist_id", playlistId)
    .order("position", { ascending: false })
    .limit(1);

  const nextPosition = existing && existing.length > 0 ? existing[0].position + 1 : 1;

  const { data, error } = await supabase
    .from("playlist_songs")
    .insert({
      playlist_id: playlistId,
      song_id: songId,
      position: nextPosition,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("Song is already in this playlist");
    }
    throw new Error(`Failed to add song to playlist: ${error.message}`);
  }

  return data;
}

export async function removeSongFromPlaylist(
  playlistId: string,
  songId: string
): Promise<void> {
  const { error } = await supabase
    .from("playlist_songs")
    .delete()
    .eq("playlist_id", playlistId)
    .eq("song_id", songId);

  if (error) {
    throw new Error(`Failed to remove song from playlist: ${error.message}`);
  }
}

export async function reorderPlaylistSongs(
  playlistId: string,
  songIds: string[]
): Promise<void> {
  // Update positions for all songs in the new order
  const updates = songIds.map((songId, index) => ({
    playlist_id: playlistId,
    song_id: songId,
    position: index + 1,
  }));

  // Delete existing entries and re-insert with new positions
  // This is simpler than updating each row individually
  const { error: deleteError } = await supabase
    .from("playlist_songs")
    .delete()
    .eq("playlist_id", playlistId);

  if (deleteError) {
    throw new Error(`Failed to reorder songs: ${deleteError.message}`);
  }

  if (updates.length > 0) {
    const { error: insertError } = await supabase
      .from("playlist_songs")
      .insert(updates);

    if (insertError) {
      throw new Error(`Failed to reorder songs: ${insertError.message}`);
    }
  }
}

export async function getPlaylistSongCount(playlistId: string): Promise<number> {
  const { count, error } = await supabase
    .from("playlist_songs")
    .select("*", { count: "exact", head: true })
    .eq("playlist_id", playlistId);

  if (error) {
    throw new Error(`Failed to get song count: ${error.message}`);
  }

  return count || 0;
}

export async function getPlaylistsCount(filters?: { is_archived?: boolean; status?: PlaylistStatus | PlaylistStatus[] }): Promise<number> {
  let query = supabase
    .from("playlists")
    .select("*", { count: "exact", head: true });

  if (filters?.is_archived === true) {
    query = query.eq("status", "archived");
  } else if (filters?.is_archived === false) {
    query = query.neq("status", "archived");
  }

  if (filters?.status !== undefined) {
    if (Array.isArray(filters.status)) {
      query = query.in("status", filters.status);
    } else {
      query = query.eq("status", filters.status);
    }
  }

  const { count, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch playlists count: ${error.message}`);
  }

  return count || 0;
}

export async function getRecentlyUpdatedPlaylists(limit: number = 5): Promise<Playlist[]> {
  const { data, error } = await supabase
    .from("playlists")
    .select("*")
    .neq("status", "archived")
    .order("updated_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch recently updated playlists: ${error.message}`);
  }

  return data || [];
}

