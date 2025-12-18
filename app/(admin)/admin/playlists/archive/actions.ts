"use server";

import { restorePlaylist, deletePlaylist } from "@/shared/lib/playlists";
import { revalidatePath } from "next/cache";

export async function restorePlaylistAction(id: string) {
  try {
    await restorePlaylist(id);
    revalidatePath("/admin/playlists");
    revalidatePath("/admin/playlists/archive");
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to restore playlist" };
  }
}

export async function deletePlaylistAction(id: string) {
  try {
    await deletePlaylist(id);
    revalidatePath("/admin/playlists");
    revalidatePath("/admin/playlists/archive");
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to delete playlist" };
  }
}

