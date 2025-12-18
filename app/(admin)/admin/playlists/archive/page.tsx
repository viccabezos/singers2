import { requireAuth } from "../../middleware";
import { getPlaylists } from "@/shared/lib/playlists";
import { ArchiveListClient } from "./archive-list-client";

export default async function PlaylistsArchivePage() {
  await requireAuth();

  const archivedPlaylists = await getPlaylists({ is_archived: true });

  return <ArchiveListClient playlists={archivedPlaylists} />;
}

