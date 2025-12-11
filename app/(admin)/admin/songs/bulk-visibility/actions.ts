"use server";

import { bulkUpdateVisibility } from "@/shared/lib/songs";
import { revalidatePath } from "next/cache";

export async function bulkUpdateVisibilityAction(ids: string[], is_visible: boolean) {
  try {
    await bulkUpdateVisibility(ids, is_visible);
    revalidatePath("/admin/songs");
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to update visibility" };
  }
}

