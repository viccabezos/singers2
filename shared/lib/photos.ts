import { supabase } from "@/shared/lib/supabase";
import type { Photo } from "@/shared/types";
import { supabaseAdmin } from "@/shared/lib/supabase-admin";

const STORAGE_BUCKET = "choir-photos";

/**
 * Get all photos ordered by display_order
 */
export async function getPhotos(): Promise<Photo[]> {
  try {
    const { data, error } = await supabase
      .from("choir_photos")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching photos:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getPhotos:", error);
    return [];
  }
}

/**
 * Upload photo to Supabase Storage and create database record
 */
export async function uploadPhoto(
  file: File,
  caption?: string
): Promise<{ success: boolean; error?: string; photo?: Photo }> {
  try {
    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      return { success: false, error: uploadError.message };
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(fileName);

    // Get next display_order
    const { data: photos } = await supabaseAdmin
      .from("choir_photos")
      .select("display_order")
      .order("display_order", { ascending: false })
      .limit(1);

    const nextOrder = photos && photos.length > 0 ? photos[0].display_order + 1 : 1;

    // Create database record
    const { data: photo, error: dbError } = await supabaseAdmin
      .from("choir_photos")
      .insert({
        image_url: publicUrl,
        caption: caption || null,
        display_order: nextOrder,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Error creating photo record:", dbError);
      // Clean up uploaded file
      await supabaseAdmin.storage.from(STORAGE_BUCKET).remove([fileName]);
      return { success: false, error: dbError.message };
    }

    return { success: true, photo };
  } catch (error) {
    console.error("Error in uploadPhoto:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Delete photo from Storage and database
 */
export async function deletePhoto(
  photoId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get photo to find image URL
    const { data: photo, error: fetchError } = await supabaseAdmin
      .from("choir_photos")
      .select("image_url")
      .eq("id", photoId)
      .single();

    if (fetchError || !photo) {
      return { success: false, error: "Photo not found" };
    }

    // Extract filename from URL
    const fileName = photo.image_url.split("/").pop();
    if (!fileName) {
      return { success: false, error: "Invalid image URL" };
    }

    // Delete from database first
    const { error: dbError } = await supabaseAdmin
      .from("choir_photos")
      .delete()
      .eq("id", photoId);

    if (dbError) {
      console.error("Error deleting photo record:", dbError);
      return { success: false, error: dbError.message };
    }

    // Delete from storage (best effort - don't fail if file already gone)
    const { error: storageError } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .remove([fileName]);

    if (storageError) {
      console.warn("Error deleting file from storage:", storageError);
      // Don't return error - database record is deleted
    }

    return { success: true };
  } catch (error) {
    console.error("Error in deletePhoto:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Update display order for multiple photos
 */
export async function reorderPhotos(
  photoUpdates: Array<{ id: string; display_order: number }>
): Promise<{ success: boolean; error?: string }> {
  try {
    // Update each photo's display_order
    const promises = photoUpdates.map(({ id, display_order }) =>
      supabaseAdmin
        .from("choir_photos")
        .update({ display_order })
        .eq("id", id)
    );

    const results = await Promise.all(promises);

    // Check if any failed
    const failed = results.find((result) => result.error);
    if (failed && failed.error) {
      console.error("Error reordering photos:", failed.error);
      return { success: false, error: failed.error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in reorderPhotos:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Update photo caption
 */
export async function updatePhotoCaption(
  photoId: string,
  caption: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabaseAdmin .from("choir_photos")
      .update({ caption })
      .eq("id", photoId);

    if (error) {
      console.error("Error updating caption:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in updatePhotoCaption:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
