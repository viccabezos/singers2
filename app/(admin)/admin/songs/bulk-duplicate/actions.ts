"use server";

import { bulkDuplicateSongs } from "@/shared/lib/songs";
import { revalidatePath } from "next/cache";

export async function bulkDuplicateSongsAction(ids: string[]) {
  try {
    const songs = await bulkDuplicateSongs(ids);
    revalidatePath("/admin/songs");
    return { success: true, count: songs.length };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to duplicate songs" };
  }
}

