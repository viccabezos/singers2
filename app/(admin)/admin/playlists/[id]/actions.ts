"use server";

import {
  updatePlaylist,
  archivePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
  reorderPlaylistSongs,
  getPlaylists,
} from "@/shared/lib/playlists";
import { revalidatePath } from "next/cache";

export async function updatePlaylistAction(id: string, data: any) {
  try {
    // Validate max 3 featured playlists
    if (data.featured === true) {
      const allPlaylists = await getPlaylists();
      const featuredPlaylists = allPlaylists.filter(
        (p) => p.featured === true && p.id !== id
      );
      
      if (featuredPlaylists.length >= 3) {
        return {
          error: "Maximum 3 playlists can be featured. Please unfeature another playlist first.",
        };
      }
    }
    
    await updatePlaylist(id, data);
    revalidatePath("/admin/playlists");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to update playlist" };
  }
}

export async function archivePlaylistAction(id: string) {
  try {
    await archivePlaylist(id);
    revalidatePath("/admin/playlists");
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to archive playlist" };
  }
}

export async function addSongToPlaylistAction(playlistId: string, songId: string) {
  try {
    await addSongToPlaylist(playlistId, songId);
    revalidatePath(`/admin/playlists/${playlistId}`);
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to add song" };
  }
}

export async function removeSongFromPlaylistAction(playlistId: string, songId: string) {
  try {
    await removeSongFromPlaylist(playlistId, songId);
    revalidatePath(`/admin/playlists/${playlistId}`);
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to remove song" };
  }
}

export async function reorderSongsAction(playlistId: string, songIds: string[]) {
  try {
    await reorderPlaylistSongs(playlistId, songIds);
    revalidatePath(`/admin/playlists/${playlistId}`);
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to reorder songs" };
  }
}

