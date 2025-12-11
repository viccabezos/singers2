"use server";

import { createSong } from "@/shared/lib/songs";
import { revalidatePath } from "next/cache";

export async function createSongAction(data: any) {
  try {
    await createSong(data);
    revalidatePath("/admin/songs");
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to create song" };
  }
}

