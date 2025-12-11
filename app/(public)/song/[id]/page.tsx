import { getVisibleSongById } from "@/shared/lib/songs";
import { notFound } from "next/navigation";
import { LyricsDisplay } from "./lyrics-display";

export default async function SongPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const song = await getVisibleSongById(id);

  if (!song) {
    notFound();
  }

  return <LyricsDisplay song={song} />;
}

