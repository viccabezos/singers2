import { getVisiblePlaylistById, getPlaylistSongs } from "@/shared/lib/playlists";
import { notFound } from "next/navigation";
import { PlaylistDisplay } from "./playlist-display";

export default async function PlaylistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const playlist = await getVisiblePlaylistById(id);

  if (!playlist) {
    notFound();
  }

  const playlistSongs = await getPlaylistSongs(id);

  return <PlaylistDisplay playlist={playlist} songs={playlistSongs} />;
}

