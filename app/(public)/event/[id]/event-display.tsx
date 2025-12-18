"use client";

import Link from "next/link";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  ListMusicIcon,
  ChevronRightIcon,
} from "lucide-react";
import type { Event } from "@/shared/types/event";

interface EventDisplayProps {
  event: Event;
  playlists: {
    id: string;
    name: string;
    description: string | null;
    position: number;
  }[];
}

export function EventDisplay({ event, playlists }: EventDisplayProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (timeStr: string | null) => {
    if (!timeStr) return null;
    return timeStr.substring(0, 5);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            ← Back to home
          </Link>
        </div>
      </header>

      {/* Event Content */}
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Event Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-black dark:text-zinc-50 sm:text-4xl">
            {event.name}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-zinc-600 dark:text-zinc-400">
            <span className="inline-flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              {formatDate(event.event_date)}
            </span>
            {event.event_time && (
              <span className="inline-flex items-center gap-2">
                <ClockIcon className="h-5 w-5" />
                {formatTime(event.event_time)}
              </span>
            )}
            {event.place && (
              <span className="inline-flex items-center gap-2">
                <MapPinIcon className="h-5 w-5" />
                {event.place}
              </span>
            )}
          </div>

          {event.description && (
            <p className="mt-4 text-lg text-zinc-700 dark:text-zinc-300">
              {event.description}
            </p>
          )}
        </div>

        {/* Playlists */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-black dark:text-zinc-50">
            <ListMusicIcon className="h-5 w-5" />
            Playlists
          </h2>

          {playlists.length === 0 ? (
            <div className="rounded-lg bg-white p-8 text-center shadow-sm dark:bg-zinc-900">
              <ListMusicIcon className="mx-auto h-12 w-12 text-zinc-400" />
              <p className="mt-4 text-zinc-600 dark:text-zinc-400">
                No playlists available for this event yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {playlists.map((playlist) => (
                <Link
                  key={playlist.id}
                  href={`/playlist/${playlist.id}`}
                  className="block rounded-lg bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:bg-zinc-900"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-zinc-900 dark:text-zinc-50">
                        {playlist.name}
                      </h3>
                      {playlist.description && (
                        <p className="mt-1 text-sm text-zinc-600 line-clamp-1 dark:text-zinc-400">
                          {playlist.description}
                        </p>
                      )}
                    </div>
                    <ChevronRightIcon className="h-5 w-5 text-zinc-400" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

