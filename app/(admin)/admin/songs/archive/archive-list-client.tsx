"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MusicIcon } from "lucide-react";
import type { Song } from "@/shared/types/song";
import { restoreSongAction, deleteSongAction } from "./actions";
import {
  AdminPageLayout,
  ArchiveList,
  BackLink,
} from "@/shared/ui";

interface ArchiveListClientProps {
  songs: Song[];
}

export function ArchiveListClient({ songs: initialSongs }: ArchiveListClientProps) {
  const router = useRouter();
  const [songs, setSongs] = useState(initialSongs);
  const [isPending, setIsPending] = useState(false);

  const handleRestore = async (id: string) => {
    setIsPending(true);
    try {
      const result = await restoreSongAction(id);
      if (result.error) {
        toast.error("Failed to restore song", { description: result.error });
        return;
      }
      toast.success("Song restored successfully");
      setSongs((prev) => prev.filter((s) => s.id !== id));
      router.refresh();
    } finally {
      setIsPending(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsPending(true);
    try {
      const result = await deleteSongAction(id);
      if (result.error) {
        toast.error("Failed to delete song", { description: result.error });
        return;
      }
      toast.success("Song deleted permanently");
      setSongs((prev) => prev.filter((s) => s.id !== id));
      router.refresh();
    } finally {
      setIsPending(false);
    }
  };

  // Map songs to the format expected by ArchiveList (Song uses 'title' not 'name')
  const archiveItems = songs.map((song) => ({
    ...song,
    name: song.title,
  }));

  return (
    <AdminPageLayout
      breadcrumbs={[
        { label: "Dashboard", href: "/admin/dashboard" },
        { label: "Songs", href: "/admin/songs" },
        { label: "Archive" },
      ]}
      title="Archived Songs"
      description="Restore or permanently delete archived songs"
    >
      <ArchiveList
        items={archiveItems}
        onRestore={handleRestore}
        onDelete={handleDelete}
        isPending={isPending}
        renderItem={(song) => (
          <div>
            <div className="font-medium text-zinc-900 dark:text-zinc-50">{song.title}</div>
            {song.artist_composer && (
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                {song.artist_composer}
              </div>
            )}
            {song.language && (
              <div className="text-sm text-zinc-500 dark:text-zinc-500">
                {song.language}
              </div>
            )}
          </div>
        )}
        emptyState={{
          icon: MusicIcon,
          title: "No archived songs",
          description: "Archived songs will appear here.",
        }}
      />

      <BackLink href="/admin/songs" label="Back to Songs" />
    </AdminPageLayout>
  );
}
