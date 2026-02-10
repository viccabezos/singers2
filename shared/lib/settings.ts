import { supabase } from "@/shared/lib/supabase";
import type { ChoirSettings, ChoirSettingsInput } from "@/shared/types";

/**
 * Get choir settings (singleton row)
 */
export async function getChoirSettings(): Promise<ChoirSettings | null> {
  try {
    const { data, error } = await supabase
      .from("choir_settings")
      .select("*")
      .eq("id", 1)
      .single();

    if (error) {
      console.error("Error fetching choir settings:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in getChoirSettings:", error);
    return null;
  }
}

/**
 * Update choir settings
 */
export async function updateChoirSettings(
  settings: ChoirSettingsInput
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from("choir_settings")
      .update(settings)
      .eq("id", 1);

    if (error) {
      console.error("Error updating choir settings:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in updateChoirSettings:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
}
