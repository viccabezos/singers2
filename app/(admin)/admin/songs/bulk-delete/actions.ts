"use server";

import { archiveSong } from "@/shared/lib/songs";
import { revalidatePath } from "next/cache";

export async function bulkArchiveSongsAction(ids: string[]) {
  try {
    // Archive all songs in parallel
    await Promise.all(ids.map((id) => archiveSong(id)));
    revalidatePath("/admin/songs");
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to archive songs" };
  }
}

