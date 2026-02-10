"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, Image as ImageIcon, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadPhoto } from "./actions";

interface SelectedFile {
  file: File;
  preview: string;
  caption: string;
}

export function PhotoUpload() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  function validateFile(file: File): string | null {
    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return "Please upload a JPG, PNG, or WebP image";
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return "File size must be less than 5MB";
    }

    return null;
  }

  function processFiles(files: FileList | null) {
    if (!files) return;

    const newFiles: SelectedFile[] = [];
    
    Array.from(files).forEach((file) => {
      const error = validateFile(file);
      if (error) {
        toast.error(`${file.name}: ${error}`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        newFiles.push({
          file,
          preview: reader.result as string,
          caption: "",
        });
        
        // Update state when all files are processed
        if (newFiles.length === Array.from(files).filter(f => !validateFile(f)).length) {
          setSelectedFiles((prev) => [...prev, ...newFiles]);
        }
      };
      reader.readAsDataURL(file);
    });
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    processFiles(e.target.files);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  }

  function removeFile(index: number) {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function updateCaption(index: number, caption: string) {
    setSelectedFiles((prev) =>
      prev.map((file, i) => (i === index ? { ...file, caption } : file))
    );
  }

  async function handleUploadAll() {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    let successCount = 0;
    let failCount = 0;

    try {
      // Upload files sequentially to avoid overwhelming the server
      for (const selectedFile of selectedFiles) {
        const formData = new FormData();
        formData.append("file", selectedFile.file);
        if (selectedFile.caption) {
          formData.append("caption", selectedFile.caption);
        }

        const result = await uploadPhoto(formData);

        if (result.success) {
          successCount++;
        } else {
          failCount++;
          toast.error(
            `Failed to upload ${selectedFile.file.name}: ${result.error}`
          );
        }
      }

      if (successCount > 0) {
        toast.success(
          `Successfully uploaded ${successCount} photo${successCount > 1 ? "s" : ""}`
        );
        setSelectedFiles([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        router.refresh();
      }

      if (failCount > 0 && successCount === 0) {
        toast.error("Failed to upload photos");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsUploading(false);
    }
  }

  function handleCancelAll() {
    setSelectedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        Upload Photos
      </h3>

      {selectedFiles.length === 0 ? (
        <div>
          <label
            htmlFor="photo-upload"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors ${
              isDragging
                ? "border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-950"
                : "border-zinc-300 bg-zinc-50 hover:border-indigo-500 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:border-indigo-400 dark:hover:bg-zinc-800"
            }`}
          >
            <Upload className="mb-4 h-12 w-12 text-zinc-400" />
            <p className="mb-2 text-sm font-medium text-zinc-900 dark:text-zinc-50">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              JPG, PNG, or WebP (max. 5MB each)
            </p>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
              Multiple files supported
            </p>
          </label>
          <input
            ref={fileInputRef}
            id="photo-upload"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
            multiple
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {selectedFiles.map((selectedFile, index) => (
              <div
                key={index}
                className="relative rounded-lg border border-zinc-200 p-3 dark:border-zinc-700"
              >
                <button
                  onClick={() => removeFile(index)}
                  disabled={isUploading}
                  className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white transition-colors hover:bg-red-600 disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="mb-3 aspect-video overflow-hidden rounded">
                  <img
                    src={selectedFile.preview}
                    alt={`Preview ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
                <Input
                  value={selectedFile.caption}
                  onChange={(e) => updateCaption(index, e.target.value)}
                  placeholder="Add caption (optional)..."
                  disabled={isUploading}
                  className="text-sm"
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-700">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {selectedFiles.length} photo{selectedFiles.length > 1 ? "s" : ""}{" "}
              ready to upload
            </p>
            <div className="flex gap-3">
              <Button
                onClick={handleCancelAll}
                variant="outline"
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button onClick={handleUploadAll} disabled={isUploading}>
                {isUploading ? "Uploading..." : "Upload All"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
