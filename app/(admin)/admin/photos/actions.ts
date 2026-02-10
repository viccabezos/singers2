"use server";

import { revalidatePath } from "next/cache";
import {
  uploadPhoto as uploadPhotoLib,
  deletePhoto as deletePhotoLib,
  reorderPhotos as reorderPhotosLib,
  updatePhotoCaption as updatePhotoCaptionLib,
} from "@/shared/lib/photos";

export async function uploadPhoto(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    const caption = formData.get("caption") as string | null;

    if (!file) {
      return { success: false, error: "No file provided" };
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return {
        success: false,
        error: "Invalid file type. Please upload JPG, PNG, or WebP images.",
      };
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return {
        success: false,
        error: "File size exceeds 5MB. Please upload a smaller image.",
      };
    }

    const result = await uploadPhotoLib(file, caption || undefined);

    if (result.success) {
      revalidatePath("/admin/photos");
      revalidatePath("/");
    }

    return result;
  } catch (error) {
    console.error("Error in uploadPhoto action:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function deletePhoto(photoId: string) {
  try {
    const result = await deletePhotoLib(photoId);

    if (result.success) {
      revalidatePath("/admin/photos");
      revalidatePath("/");
    }

    return result;
  } catch (error) {
    console.error("Error in deletePhoto action:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function reorderPhotos(
  photoUpdates: Array<{ id: string; display_order: number }>
) {
  try {
    const result = await reorderPhotosLib(photoUpdates);

    if (result.success) {
      revalidatePath("/admin/photos");
      revalidatePath("/");
    }

    return result;
  } catch (error) {
    console.error("Error in reorderPhotos action:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function updatePhotoCaption(photoId: string, caption: string) {
  try {
    const result = await updatePhotoCaptionLib(photoId, caption);

    if (result.success) {
      revalidatePath("/admin/photos");
      revalidatePath("/");
    }

    return result;
  } catch (error) {
    console.error("Error in updatePhotoCaption action:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
