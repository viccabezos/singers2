"use server";

import { restoreSong, deleteSong } from "@/shared/lib/songs";
import { revalidatePath } from "next/cache";

export async function restoreSongAction(id: string) {
  try {
    await restoreSong(id);
    revalidatePath("/admin/songs");
    revalidatePath("/admin/songs/archive");
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to restore song" };
  }
}

export async function deleteSongAction(id: string) {
  try {
    await deleteSong(id);
    revalidatePath("/admin/songs");
    revalidatePath("/admin/songs/archive");
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to delete song" };
  }
}

