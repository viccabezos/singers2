"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ListMusicIcon } from "lucide-react";
import type { PlaylistWithSongCount } from "@/shared/types/playlist";
import { restorePlaylistAction, deletePlaylistAction } from "./actions";
import {
  AdminPageLayout,
  ArchiveList,
  BackLink,
} from "@/shared/ui";

interface ArchiveListClientProps {
  playlists: PlaylistWithSongCount[];
}

export function ArchiveListClient({ playlists: initialPlaylists }: ArchiveListClientProps) {
  const router = useRouter();
  const [playlists, setPlaylists] = useState(initialPlaylists);
  const [isPending, setIsPending] = useState(false);

  const handleRestore = async (id: string) => {
    setIsPending(true);
    try {
      const result = await restorePlaylistAction(id);
      if (result.error) {
        toast.error("Failed to restore playlist", { description: result.error });
        return;
      }
      toast.success("Playlist restored successfully");
      setPlaylists((prev) => prev.filter((p) => p.id !== id));
      router.refresh();
    } finally {
      setIsPending(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsPending(true);
    try {
      const result = await deletePlaylistAction(id);
      if (result.error) {
        toast.error("Failed to delete playlist", { description: result.error });
        return;
      }
      toast.success("Playlist deleted permanently");
      setPlaylists((prev) => prev.filter((p) => p.id !== id));
      router.refresh();
    } finally {
      setIsPending(false);
    }
  };

  // Playlists already have id and name, just use them directly
  const archiveItems = playlists;

  return (
    <AdminPageLayout
      breadcrumbs={[
        { label: "Dashboard", href: "/admin/dashboard" },
        { label: "Playlists", href: "/admin/playlists" },
        { label: "Archive" },
      ]}
      title="Archived Playlists"
      description="Restore or permanently delete archived playlists"
    >
      <ArchiveList
        items={archiveItems}
        onRestore={handleRestore}
        onDelete={handleDelete}
        isPending={isPending}
        renderItem={(playlist) => (
          <div>
            <div className="font-medium text-zinc-900 dark:text-zinc-50">{playlist.name}</div>
            {playlist.description && (
              <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-1">
                {playlist.description}
              </div>
            )}
            <div className="text-sm text-zinc-500 dark:text-zinc-500">
              {playlist.song_count} {playlist.song_count === 1 ? "song" : "songs"}
            </div>
          </div>
        )}
        emptyState={{
          icon: ListMusicIcon,
          title: "No archived playlists",
          description: "Archived playlists will appear here.",
        }}
      />

      <BackLink href="/admin/playlists" label="Back to Playlists" />
    </AdminPageLayout>
  );
}
