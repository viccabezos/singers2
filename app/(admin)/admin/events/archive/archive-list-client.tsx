"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarIcon, ClockIcon, MapPinIcon } from "lucide-react";
import { toast } from "sonner";
import type { EventWithPlaylistCount } from "@/shared/types/event";
import { restoreEventAction, deleteEventAction } from "../[id]/actions";
import {
  PageHeader,
  ArchiveList,
  BackLink,
} from "@/shared/ui";
import { formatEventDate, formatEventTime } from "@/lib/utils";

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
        toast.error("Failed to restore event", { description: result.error });
      } else {
        setEvents((prev) => prev.filter((e) => e.id !== id));
        toast.success(`"${name}" restored successfully`);
        router.refresh();
      }
    });
  };

  const handleDelete = async (id: string, name: string) => {
    startTransition(async () => {
      const result = await deleteEventAction(id);
      if (result.error) {
        toast.error("Failed to delete event", { description: result.error });
      } else {
        setEvents((prev) => prev.filter((e) => e.id !== id));
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

  // Events already have id and name, just use them directly
  const archiveItems = events;

  return (
    <>
      <PageHeader
        title="Archived Events"
        description="View and manage archived events"
      />

      <ArchiveList
        items={archiveItems}
        onRestore={handleRestore}
        onDelete={handleDelete}
        isPending={isPending}
        renderItem={(event) => (
          <div>
            <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
              {event.name}
            </h3>

            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
              <span className="inline-flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                {formatEventDate(event.event_date, "full")}
              </span>
              {event.event_time && (
                <span className="inline-flex items-center gap-1">
                  <ClockIcon className="h-4 w-4" />
                  {formatEventTime(event.event_time)}
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
        )}
        emptyState={{
          icon: CalendarIcon,
          title: "No archived events",
          description: "Archived events will appear here.",
        }}
      />

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
