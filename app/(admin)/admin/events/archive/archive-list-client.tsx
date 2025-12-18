"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArchiveRestoreIcon,
  Trash2Icon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
} from "lucide-react";
import { toast } from "sonner";
import type { EventWithPlaylistCount } from "@/shared/types/event";
import { restoreEventAction, deleteEventAction } from "../[id]/actions";

interface ArchiveListClientProps {
  events: EventWithPlaylistCount[];
}

export function ArchiveListClient({ events: initialEvents }: ArchiveListClientProps) {
  const router = useRouter();
  const [events, setEvents] = useState(initialEvents);
  const [isPending, startTransition] = useTransition();

  const handleRestore = async (id: string, name: string) => {
    startTransition(async () => {
      const result = await restoreEventAction(id);
      if (result.error) {
        toast.error("Failed to restore event", {
          description: result.error,
        });
      } else {
        setEvents(events.filter((e) => e.id !== id));
        toast.success(`"${name}" restored successfully`);
        router.refresh();
      }
    });
  };

  const handleDelete = async (id: string, name: string) => {
    if (
      !confirm(
        `Are you sure you want to permanently delete "${name}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    startTransition(async () => {
      const result = await deleteEventAction(id);
      if (result.error) {
        toast.error("Failed to delete event", {
          description: result.error,
        });
      } else {
        setEvents(events.filter((e) => e.id !== id));
        toast.success(`"${name}" deleted permanently`);
        router.refresh();
      }
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (timeStr: string | null) => {
    if (!timeStr) return null;
    return timeStr.substring(0, 5);
  };

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50 sm:text-3xl">
          Archived Events
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          View and manage archived events
        </p>
      </div>

      {/* Events List */}
      <div className="rounded-lg bg-white shadow-sm dark:bg-zinc-900">
        {events.length === 0 ? (
          <div className="p-8 text-center">
            <CalendarIcon className="mx-auto h-12 w-12 text-zinc-400" />
            <h3 className="mt-4 text-lg font-medium text-zinc-900 dark:text-zinc-50">
              No archived events
            </h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Archived events will appear here.
            </p>
            <Link
              href="/admin/events"
              className="mt-4 inline-block text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              ← Back to events
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {events.map((event) => (
              <div key={event.id} className="p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  {/* Event Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
                      {event.name}
                    </h3>

                    <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                      <span className="inline-flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        {formatDate(event.event_date)}
                      </span>
                      {event.event_time && (
                        <span className="inline-flex items-center gap-1">
                          <ClockIcon className="h-4 w-4" />
                          {formatTime(event.event_time)}
                        </span>
                      )}
                      {event.place && (
                        <span className="inline-flex items-center gap-1">
                          <MapPinIcon className="h-4 w-4" />
                          {event.place}
                        </span>
                      )}
                    </div>

                    {event.description && (
                      <p className="mt-2 text-sm text-zinc-600 line-clamp-2 dark:text-zinc-400">
                        {event.description}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRestore(event.id, event.name)}
                      disabled={isPending}
                      className="inline-flex items-center gap-1 rounded-md bg-green-100 px-3 py-1 text-sm font-medium text-green-800 transition-colors hover:bg-green-200 disabled:opacity-50 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800"
                    >
                      <ArchiveRestoreIcon className="h-3 w-3" />
                      Restore
                    </button>
                    <button
                      onClick={() => handleDelete(event.id, event.name)}
                      disabled={isPending}
                      className="inline-flex items-center gap-1 rounded-md bg-red-100 px-3 py-1 text-sm font-medium text-red-800 transition-colors hover:bg-red-200 disabled:opacity-50 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800"
                    >
                      <Trash2Icon className="h-3 w-3" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Back Link */}
      <div className="mt-6 text-center">
        <Link
          href="/admin/events"
          className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          ← Back to events
        </Link>
      </div>
    </>
  );
}

