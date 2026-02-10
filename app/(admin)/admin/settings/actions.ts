"use server";

import { revalidatePath } from "next/cache";
import { updateChoirSettings } from "@/shared/lib/settings";
import type { ChoirSettingsInput } from "@/shared/types";

export async function updateSettings(
  settings: ChoirSettingsInput
): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await updateChoirSettings(settings);

    if (result.success) {
      // Revalidate paths to refresh data
      revalidatePath("/");
      revalidatePath("/admin/settings");
    }

    return result;
  } catch (error) {
    console.error("Error in updateSettings action:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
