import { requireAuth } from "../middleware";
import { getPlaylists } from "@/shared/lib/playlists";
import { PlaylistsListClient } from "./playlists-list-client";
import type { PlaylistFilters, PlaylistStatus } from "@/shared/types/playlist";

export default async function PlaylistsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string }>;
}) {
  await requireAuth();

  const params = await searchParams;
  
  const filters: PlaylistFilters = {
    is_archived: false,
  };

  if (params.search) {
    filters.name = params.search;
  }

  if (params.status && params.status !== "all") {
    filters.status = [params.status as PlaylistStatus];
  }

  const playlists = await getPlaylists(filters);

  return <PlaylistsListClient playlists={playlists} />;
}

