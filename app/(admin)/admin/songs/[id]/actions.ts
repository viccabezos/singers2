"use server";

import { updateSong, duplicateSong, archiveSong } from "@/shared/lib/songs";
import { revalidatePath } from "next/cache";

export async function updateSongAction(id: string, data: any) {
  try {
    await updateSong(id, data);
    revalidatePath("/admin/songs");
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to update song" };
  }
}

export async function duplicateSongAction(id: string) {
  try {
    const song = await duplicateSong(id);
    revalidatePath("/admin/songs");
    return { success: true, song };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to duplicate song" };
  }
}

export async function archiveSongAction(id: string) {
  try {
    await archiveSong(id);
    revalidatePath("/admin/songs");
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to archive song" };
  }
}

