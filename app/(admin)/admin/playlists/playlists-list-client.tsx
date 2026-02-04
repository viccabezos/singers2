"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon, ListMusicIcon } from "lucide-react";
import type { PlaylistWithSongCount, PlaylistStatus } from "@/shared/types/playlist";
import {
  AdminPageLayout,
  DataTable,
  StatusBadge,
  FilterPanel,
  EditButton,
  ArchiveLink,
  type Column,
} from "@/shared/ui";

interface PlaylistsListClientProps {
  playlists: PlaylistWithSongCount[];
}

export function PlaylistsListClient({ playlists: initialPlaylists }: PlaylistsListClientProps) {
  const router = useRouter();
  const [playlists, setPlaylists] = useState(initialPlaylists);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
  });

  useEffect(() => {
    setPlaylists(initialPlaylists);
  }, [initialPlaylists]);

  const handleFilterChange = (id: string, value: string) => {
    setFilters((prev) => ({ ...prev, [id]: value }));
  };

  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.status !== "all") params.set("status", filters.status);
    router.push(`/admin/playlists?${params.toString()}`);
  };

  const columns: Column<PlaylistWithSongCount>[] = [
    {
      key: "name",
      header: "Name",
      render: (playlist) => (
        <div>
          <div className="font-medium text-zinc-900 dark:text-zinc-50">{playlist.name}</div>
          {playlist.description && (
            <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-1">
              {playlist.description}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "songs",
      header: "Songs",
      hideOnMobile: true,
      render: (playlist) => (
        <span className="text-sm text-zinc-600 dark:text-zinc-400">
          {playlist.song_count} {playlist.song_count === 1 ? "song" : "songs"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (playlist) => <StatusBadge status={playlist.status} />,
    },
    {
      key: "actions",
      header: "",
      render: (playlist) => (
        <EditButton href={`/admin/playlists/${playlist.id}`} />
      ),
    },
  ];

  const filterConfig = [
    {
      type: "search" as const,
      id: "search",
      label: "Search by name",
      placeholder: "Search playlists...",
    },
    {
      type: "select" as const,
      id: "status",
      label: "Status",
      options: [
        { value: "all", label: "All" },
        { value: "visible", label: "Visible" },
        { value: "hidden", label: "Hidden" },
        { value: "in_progress", label: "In Progress" },
      ],
    },
  ];

  return (
    <AdminPageLayout
      breadcrumbs={[
        { label: "Dashboard", href: "/admin/dashboard" },
        { label: "Playlists" },
      ]}
      title="Playlists"
      description="Manage your playlists"
      action={{
        label: "Add New Playlist",
        href: "/admin/playlists/new",
        icon: PlusIcon,
      }}
    >
      <FilterPanel
        filters={filterConfig}
        values={filters}
        onChange={handleFilterChange}
        onApply={handleApplyFilters}
      />

      <DataTable
        data={playlists}
        columns={columns}
        emptyState={{
          icon: ListMusicIcon,
          title: "No playlists found",
          description: "Get started by creating your first playlist.",
          action: {
            label: "Add New Playlist",
            href: "/admin/playlists/new",
          },
        }}
      />

      <ArchiveLink href="/admin/playlists/archive" />
    </AdminPageLayout>
  );
}
