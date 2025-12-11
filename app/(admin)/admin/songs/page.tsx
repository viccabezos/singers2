import { requireAuth } from "../middleware";
import { getSongs, getDistinctLanguages } from "@/shared/lib/songs";
import { SongsListClient } from "./songs-list-client";

export default async function SongsPage({
  searchParams,
}: {
  searchParams: { search?: string; artist?: string; language?: string; visibility?: string };
}) {
  await requireAuth();

  const filters = {
    title: searchParams.search,
    artist_composer: searchParams.artist,
    language: searchParams.language || undefined,
    is_visible:
      searchParams.visibility === "visible"
        ? true
        : searchParams.visibility === "hidden"
          ? false
          : undefined,
  };

  const songs = await getSongs(filters);
  const languages = await getDistinctLanguages();

  return <SongsListClient songs={songs} languages={languages} />;
}

