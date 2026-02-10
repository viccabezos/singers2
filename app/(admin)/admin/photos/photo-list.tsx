"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trash2, GripVertical, Pencil, Check, X } from "lucide-react";
import { toast } from "sonner";
import type { Photo } from "@/shared/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { deletePhoto, reorderPhotos, updatePhotoCaption } from "./actions";

interface PhotoListProps {
  initialPhotos: Photo[];
}

export function PhotoList({ initialPhotos }: PhotoListProps) {
  const router = useRouter();
  const [photos, setPhotos] = useState(initialPhotos);
  const [editingCaption, setEditingCaption] = useState<string | null>(null);
  const [captionValue, setCaptionValue] = useState("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

  // Sync local state when initialPhotos changes (after upload/refresh)
  useEffect(() => {
    setPhotos(initialPhotos);
    // Clear selection when photos change
    setSelectedPhotos(new Set());
  }, [initialPhotos]);

  function togglePhotoSelection(photoId: string) {
    setSelectedPhotos((prev) => {
      const next = new Set(prev);
      if (next.has(photoId)) {
        next.delete(photoId);
      } else {
        next.add(photoId);
      }
      return next;
    });
  }

  function toggleSelectAll() {
    if (selectedPhotos.size === photos.length) {
      setSelectedPhotos(new Set());
    } else {
      setSelectedPhotos(new Set(photos.map((p) => p.id)));
    }
  }

  async function handleBulkDelete() {
    if (selectedPhotos.size === 0) return;

    const count = selectedPhotos.size;
    if (
      !confirm(
        `Are you sure you want to delete ${count} photo${count > 1 ? "s" : ""}? This action cannot be undone.`
      )
    ) {
      return;
    }

    setIsDeleting(true);
    let successCount = 0;
    let failCount = 0;

    try {
      // Delete photos sequentially
      for (const photoId of Array.from(selectedPhotos)) {
        const result = await deletePhoto(photoId);
        if (result.success) {
          successCount++;
        } else {
          failCount++;
        }
      }

      if (successCount > 0) {
        toast.success(
          `Successfully deleted ${successCount} photo${successCount > 1 ? "s" : ""}`
        );
        // Remove deleted photos from local state
        setPhotos(photos.filter((p) => !selectedPhotos.has(p.id)));
        setSelectedPhotos(new Set());
        router.refresh();
      }

      if (failCount > 0) {
        toast.error(`Failed to delete ${failCount} photo${failCount > 1 ? "s" : ""}`);
      }
    } catch (error) {
      console.error("Bulk delete error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleDelete(photoId: string, imageUrl: string) {
    if (
      !confirm(
        "Are you sure you want to delete this photo? This action cannot be undone."
      )
    ) {
      return;
    }

    const result = await deletePhoto(photoId);

    if (result.success) {
      toast.success("Photo deleted successfully");
      setPhotos(photos.filter((p) => p.id !== photoId));
      router.refresh();
    } else {
      toast.error(result.error || "Failed to delete photo");
    }
  }

  function handleDragStart(index: number) {
    setDraggedIndex(index);
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newPhotos = [...photos];
    const draggedPhoto = newPhotos[draggedIndex];
    newPhotos.splice(draggedIndex, 1);
    newPhotos.splice(index, 0, draggedPhoto);

    setPhotos(newPhotos);
    setDraggedIndex(index);
  }

  async function handleDragEnd() {
    if (draggedIndex === null) return;

    // Update display_order for all photos
    const updates = photos.map((photo, index) => ({
      id: photo.id,
      display_order: index + 1,
    }));

    const result = await reorderPhotos(updates);

    if (result.success) {
      toast.success("Photos reordered successfully");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to reorder photos");
      // Revert to original order
      setPhotos(initialPhotos);
    }

    setDraggedIndex(null);
  }

  function startEditCaption(photo: Photo) {
    setEditingCaption(photo.id);
    setCaptionValue(photo.caption || "");
  }

  function cancelEditCaption() {
    setEditingCaption(null);
    setCaptionValue("");
  }

  async function saveCaption(photoId: string) {
    const result = await updatePhotoCaption(photoId, captionValue);

    if (result.success) {
      toast.success("Caption updated successfully");
      setPhotos(
        photos.map((p) =>
          p.id === photoId ? { ...p, caption: captionValue } : p
        )
      );
      setEditingCaption(null);
      router.refresh();
    } else {
      toast.error(result.error || "Failed to update caption");
    }
  }

  if (photos.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-sm">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-zinc-100 p-4 dark:bg-zinc-800">
              <GripVertical className="h-8 w-8 text-zinc-400" />
            </div>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            No photos yet
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Upload your first photo to get started. Photos will appear in the
            gallery on the public website.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Uploaded Photos ({photos.length})
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Drag to reorder
          </p>
        </div>

        {/* Bulk Actions */}
        <div className="flex items-center gap-3">
          {photos.length > 0 && (
            <>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="select-all"
                  checked={selectedPhotos.size === photos.length && photos.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
                <label
                  htmlFor="select-all"
                  className="text-sm text-zinc-700 dark:text-zinc-300 cursor-pointer"
                >
                  Select all
                </label>
              </div>
              {selectedPhotos.size > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                  disabled={isDeleting}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {isDeleting
                    ? "Deleting..."
                    : `Delete ${selectedPhotos.size} photo${selectedPhotos.size > 1 ? "s" : ""}`}
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`group relative cursor-move overflow-hidden rounded-lg border transition-all ${
              selectedPhotos.has(photo.id)
                ? "border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-950/30"
                : "border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950"
            } ${draggedIndex === index ? "opacity-50" : ""}`}
          >
            {/* Selection Checkbox */}
            <div className="absolute left-2 top-2 z-10">
              <Checkbox
                checked={selectedPhotos.has(photo.id)}
                onCheckedChange={() => togglePhotoSelection(photo.id)}
                className="bg-white dark:bg-zinc-900"
              />
            </div>

            {/* Drag Handle */}
            <div className="absolute left-10 top-2 z-10 rounded bg-black/50 p-1 opacity-0 transition-opacity group-hover:opacity-100">
              <GripVertical className="h-4 w-4 text-white" />
            </div>

            {/* Delete Button (single) */}
            <Button
              size="icon"
              variant="destructive"
              className="absolute right-2 top-2 z-10 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={() => handleDelete(photo.id, photo.image_url)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>

            {/* Image */}
            <div className="aspect-video overflow-hidden">
              <img
                src={photo.image_url}
                alt={photo.caption || "Choir photo"}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Caption */}
            <div className="p-3">
              {editingCaption === photo.id ? (
                <div className="flex gap-2">
                  <Input
                    value={captionValue}
                    onChange={(e) => setCaptionValue(e.target.value)}
                    placeholder="Add caption..."
                    className="h-8 text-sm"
                    autoFocus
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => saveCaption(photo.id)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={cancelEditCaption}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-2">
                  <p className="flex-1 truncate text-sm text-zinc-600 dark:text-zinc-400">
                    {photo.caption || "No caption"}
                  </p>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => startEditCaption(photo)}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
