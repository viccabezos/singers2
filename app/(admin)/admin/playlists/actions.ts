"use server";

import { createPlaylist } from "@/shared/lib/playlists";
import { revalidatePath } from "next/cache";

export async function createPlaylistAction(data: any) {
  try {
    const playlist = await createPlaylist(data);
    revalidatePath("/admin/playlists");
    return { success: true, playlist };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to create playlist" };
  }
}

