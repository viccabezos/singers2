"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PlusIcon, MusicIcon } from "lucide-react";
import type { Song } from "@/shared/types/song";
import {
  AdminPageLayout,
  DataTable,
  BulkActionsBar,
  VisibilityBadge,
  FilterPanel,
  EditButton,
  ArchiveButton,
  ActionButtonGroup,
  ArchiveLink,
  type Column,
} from "@/shared/ui";
import { Button } from "@/components/ui/button";

interface SongsListClientProps {
  songs: Song[];
  languages: string[];
}

export function SongsListClient({ songs: initialSongs, languages }: SongsListClientProps) {
  const router = useRouter();
  const [songs, setSongs] = useState(initialSongs);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState({
    search: "",
    artist: "",
    language: "",
    visibility: "all",
  });

  useEffect(() => {
    setSongs(initialSongs);
  }, [initialSongs]);

  const handleFilterChange = (id: string, value: string) => {
    setFilters((prev) => ({ ...prev, [id]: value }));
  };

  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.artist) params.set("artist", filters.artist);
    if (filters.language) params.set("language", filters.language);
    if (filters.visibility !== "all") params.set("visibility", filters.visibility);
    router.push(`/admin/songs?${params.toString()}`);
  };

  const handleBulkVisibility = async (isVisible: boolean) => {
    if (selectedIds.size === 0) return;

    try {
      const { bulkUpdateVisibilityAction } = await import("./bulk-visibility/actions");
      const result = await bulkUpdateVisibilityAction(Array.from(selectedIds), isVisible);

      if (result.error) {
        toast.error("Failed to update visibility", { description: result.error });
        return;
      }

      setSongs((prev) =>
        prev.map((song) =>
          selectedIds.has(song.id) ? { ...song, is_visible: isVisible } : song
        )
      );
      toast.success(`${selectedIds.size} song(s) visibility updated`);
      setSelectedIds(new Set());
      router.refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update visibility";
      toast.error("Failed to update visibility", { description: errorMessage });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;

    try {
      const { bulkArchiveSongsAction } = await import("./bulk-delete/actions");
      const result = await bulkArchiveSongsAction(Array.from(selectedIds));

      if (result.error) {
        toast.error("Failed to archive songs", { description: result.error });
        return;
      }

      setSongs((prev) => prev.filter((song) => !selectedIds.has(song.id)));
      toast.success(`${selectedIds.size} song(s) archived successfully`);
      setSelectedIds(new Set());
      router.refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to archive songs";
      toast.error("Failed to archive songs", { description: errorMessage });
    }
  };

  const handleArchive = async (id: string, title: string) => {
    try {
      const { archiveSongAction } = await import("./[id]/actions");
      const result = await archiveSongAction(id);

      if (result.error) {
        toast.error("Failed to archive song", { description: result.error });
        return;
      }

      setSongs((prev) => prev.filter((song) => song.id !== id));
      toast.success("Song archived successfully");
      router.refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to archive song";
      toast.error("Failed to archive song", { description: errorMessage });
    }
  };

  const columns: Column<Song>[] = [
    {
      key: "title",
      header: "Title",
      render: (song) => (
        <div>
          <div className="font-medium text-zinc-900 dark:text-zinc-50">{song.title}</div>
          {song.artist_composer && (
            <div className="text-sm text-zinc-600 dark:text-zinc-400 sm:hidden">
              {song.artist_composer}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "artist",
      header: "Artist",
      hideOnMobile: true,
      render: (song) => (
        <span className="text-sm text-zinc-600 dark:text-zinc-400">
          {song.artist_composer || "-"}
        </span>
      ),
    },
    {
      key: "language",
      header: "Language",
      hideOnMobile: true,
      render: (song) => (
        <span className="text-sm text-zinc-600 dark:text-zinc-400">
          {song.language || "-"}
        </span>
      ),
    },
    {
      key: "visibility",
      header: "Visibility",
      render: (song) => <VisibilityBadge isVisible={song.is_visible} />,
    },
    {
      key: "actions",
      header: "Actions",
      render: (song) => (
        <ActionButtonGroup>
          <EditButton href={`/admin/songs/${song.id}`} />
          <ArchiveButton
            onArchive={() => handleArchive(song.id, song.title)}
            itemName={song.title}
          />
        </ActionButtonGroup>
      ),
    },
  ];

  const filterConfig = [
    {
      type: "search" as const,
      id: "search",
      label: "Search by title",
      placeholder: "Search songs...",
      colSpan: 2,
    },
    {
      type: "search" as const,
      id: "artist",
      label: "Artist",
      placeholder: "Filter by artist...",
    },
    {
      type: "select" as const,
      id: "language",
      label: "Language",
      placeholder: "All languages",
      options: [
        { value: "all", label: "All languages" },
        ...languages.map((lang) => ({ value: lang, label: lang })),
      ],
    },
    {
      type: "select" as const,
      id: "visibility",
      label: "Visibility",
      options: [
        { value: "all", label: "All" },
        { value: "visible", label: "Visible" },
        { value: "hidden", label: "Hidden" },
      ],
    },
  ];

  return (
    <AdminPageLayout
      breadcrumbs={[
        { label: "Dashboard", href: "/admin/dashboard" },
        { label: "Songs" },
      ]}
      title="Songs"
      description="Manage your song library"
      action={{
        label: "Add New Song",
        href: "/admin/songs/new",
        icon: PlusIcon,
      }}
    >
      <FilterPanel
        filters={filterConfig}
        values={filters}
        onChange={handleFilterChange}
        onApply={handleApplyFilters}
      />

      <BulkActionsBar
        selectedCount={selectedIds.size}
        onClearSelection={() => setSelectedIds(new Set())}
      >
        <Button
          size="sm"
          onClick={() => handleBulkVisibility(true)}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          Show Selected
        </Button>
        <Button
          size="sm"
          onClick={() => handleBulkVisibility(false)}
          className="bg-orange-600 hover:bg-orange-700 text-white"
        >
          Hide Selected
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={handleBulkDelete}
        >
          Archive Selected
        </Button>
      </BulkActionsBar>

      <DataTable
        data={songs}
        columns={columns}
        selectable
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        emptyState={{
          icon: MusicIcon,
          title: "No songs found",
          description: "Get started by creating your first song.",
          action: {
            label: "Add New Song",
            href: "/admin/songs/new",
          },
        }}
      />

      <ArchiveLink href="/admin/songs/archive" />
    </AdminPageLayout>
  );
}
