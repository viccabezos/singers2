import { requireAuth } from "../middleware";
import Link from "next/link";

export default async function DashboardPage() {
  await requireAuth();
  return (
    <div className="min-h-screen bg-zinc-50 p-4 dark:bg-black sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50 sm:text-3xl">
              Dashboard
            </h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Welcome to the back office
            </p>
          </div>
          <Link
            href="/admin/logout"
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
          >
            Logout
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/admin/songs"
            className="rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:bg-zinc-900"
          >
            <h2 className="text-lg font-medium text-black dark:text-zinc-50">
              Songs
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Manage your song library
            </p>
          </Link>
          <Link
            href="/admin/playlists"
            className="rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:bg-zinc-900"
          >
            <h2 className="text-lg font-medium text-black dark:text-zinc-50">
              Playlists
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Organize songs into playlists
            </p>
          </Link>
          <Link
            href="/admin/events"
            className="rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:bg-zinc-900"
          >
            <h2 className="text-lg font-medium text-black dark:text-zinc-50">
              Events
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Manage your choir events
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

