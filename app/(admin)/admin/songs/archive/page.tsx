import { requireAuth } from "../../middleware";
import { getSongs } from "@/shared/lib/songs";
import { ArchiveListClient } from "./archive-list-client";

export default async function ArchivePage() {
  await requireAuth();

  const archivedSongs = await getSongs({ is_archived: true });

  return <ArchiveListClient songs={archivedSongs} />;
}

