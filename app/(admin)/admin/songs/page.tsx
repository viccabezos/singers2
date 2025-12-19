import { requireAuth } from "../middleware";
import { getSongs, getDistinctLanguages } from "@/shared/lib/songs";
import { SongsListClient } from "./songs-list-client";

export default async function SongsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; artist?: string; language?: string; visibility?: string }>;
}) {
  await requireAuth();

  const params = await searchParams;
  const filters = {
    title: params.search,
    artist_composer: params.artist,
    language: params.language || undefined,
    is_visible:
      params.visibility === "visible"
        ? true
        : params.visibility === "hidden"
          ? false
          : undefined,
  };

  const songs = await getSongs(filters);
  const languages = await getDistinctLanguages();

  return <SongsListClient songs={songs} languages={languages} />;
}

