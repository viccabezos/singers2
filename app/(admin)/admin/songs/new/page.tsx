import { requireAuth } from "../../middleware";
import { SongForm } from "../song-form";

export default async function NewSongPage() {
  await requireAuth();

  return (
    <div className="min-h-screen bg-zinc-50 p-4 dark:bg-black sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50 sm:text-3xl">
            Create New Song
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Add a new song to your library
          </p>
        </div>
        <SongForm />
      </div>
    </div>
  );
}

