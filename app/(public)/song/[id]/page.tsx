import { getVisibleSongById } from "@/shared/lib/songs";
import { notFound } from "next/navigation";
import { LyricsDisplay } from "./lyrics-display";

export default async function SongPage({ params }: { params: { id: string } }) {
  const song = await getVisibleSongById(params.id);

  if (!song) {
    notFound();
  }

  return <LyricsDisplay song={song} />;
}

