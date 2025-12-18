import { requireAuth } from "../../middleware";
import { PlaylistForm } from "../playlist-form";
import { Breadcrumbs } from "@/shared/ui/breadcrumbs";

export default async function NewPlaylistPage() {
  await requireAuth();

  return (
    <div className="min-h-screen bg-zinc-50 p-4 dark:bg-black sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        <Breadcrumbs
          items={[
            { label: "Dashboard", href: "/admin/dashboard" },
            { label: "Playlists", href: "/admin/playlists" },
            { label: "New Playlist" },
          ]}
        />
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50 sm:text-3xl">
            Create New Playlist
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Add a new playlist to organize your songs
          </p>
        </div>
        <PlaylistForm />
      </div>
    </div>
  );
}

