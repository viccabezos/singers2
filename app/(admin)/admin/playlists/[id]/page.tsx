import { requireAuth } from "../../middleware";
import { getPlaylistById, getPlaylistSongs } from "@/shared/lib/playlists";
import { getSongs } from "@/shared/lib/songs";
import { notFound } from "next/navigation";
import { PlaylistForm } from "../playlist-form";
import { Breadcrumbs } from "@/shared/ui/breadcrumbs";

export default async function EditPlaylistPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAuth();

  const { id } = await params;
  const playlist = await getPlaylistById(id);

  if (!playlist) {
    notFound();
  }

  // Get songs in this playlist
  const playlistSongs = await getPlaylistSongs(id);
  
  // Get all available songs (non-archived)
  const allSongs = await getSongs({ is_archived: false });

  return (
    <div className="min-h-screen bg-zinc-50 p-4 dark:bg-black sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        <Breadcrumbs
          items={[
            { label: "Dashboard", href: "/admin/dashboard" },
            { label: "Playlists", href: "/admin/playlists" },
            { label: playlist.name },
          ]}
        />
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50 sm:text-3xl">
            Edit Playlist
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            {playlist.name}
          </p>
        </div>
        <PlaylistForm 
          playlist={playlist} 
          playlistSongs={playlistSongs}
          availableSongs={allSongs}
        />
      </div>
    </div>
  );
}

