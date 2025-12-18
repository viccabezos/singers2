"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  PlusIcon,
  SearchIcon,
  EyeIcon,
  EyeOffIcon,
  StarIcon,
  ArchiveIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  ListMusicIcon,
} from "lucide-react";
import { toast } from "sonner";
import type { EventWithPlaylistCount } from "@/shared/types/event";

interface EventsListClientProps {
  events: EventWithPlaylistCount[];
}

export function EventsListClient({ events: initialEvents }: EventsListClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [events, setEvents] = useState(initialEvents);
  const [search, setSearch] = useState(searchParams?.get("search") || "");
  const [visibility, setVisibility] = useState(searchParams?.get("visibility") || "all");
  const [time, setTime] = useState(searchParams?.get("time") || "all");

  // Sync with props when they change
  useEffect(() => {
    setEvents(initialEvents);
  }, [initialEvents]);

  const updateFilters = (newSearch: string, newVisibility: string, newTime: string) => {
    const params = new URLSearchParams();
    if (newSearch) params.set("search", newSearch);
    if (newVisibility !== "all") params.set("visibility", newVisibility);
    if (newTime !== "all") params.set("time", newTime);
    router.push(`/admin/events?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters(search, visibility, time);
  };

  const handleVisibilityChange = (value: string) => {
    setVisibility(value);
    updateFilters(search, value, time);
  };

  const handleTimeChange = (value: string) => {
    setTime(value);
    updateFilters(search, visibility, value);
  };

  const handleSetCurrent = async (id: string, name: string) => {
    try {
      const { setCurrentEventAction } = await import("./[id]/actions");
      const result = await setCurrentEventAction(id);

      if (result.error) {
        toast.error("Failed to set current event", {
          description: result.error,
        });
        return;
      }

      // Update local state
      setEvents((prevEvents) =>
        prevEvents.map((event) => ({
          ...event,
          is_current: event.id === id,
        }))
      );

      toast.success(`"${name}" is now the current event`);
      router.refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to set current event";
      toast.error("Failed to set current event", {
        description: errorMessage,
      });
    }
  };

  const handleArchive = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to archive "${name}"?`)) {
      return;
    }

    try {
      const { archiveEventAction } = await import("./[id]/actions");
      const result = await archiveEventAction(id);

      if (result.error) {
        toast.error("Failed to archive event", {
          description: result.error,
        });
        return;
      }

      // Remove from local state
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));

      toast.success(`"${name}" archived successfully`);
      router.refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to archive event";
      toast.error("Failed to archive event", {
        description: errorMessage,
      });
    }
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
    // Time is stored as HH:MM:SS, display as HH:MM
    return timeStr.substring(0, 5);
  };

  const isPastEvent = (dateStr: string) => {
    const eventDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate < today;
  };

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50 sm:text-3xl">
            Events
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Manage your choir events
          </p>
        </div>
        <Link
          href="/admin/events/new"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
        >
          <PlusIcon className="h-4 w-4" />
          New Event
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <form onSubmit={handleSearchSubmit} className="flex-1">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-zinc-300 bg-white py-2 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-400"
            />
          </div>
        </form>

        <select
          value={visibility}
          onChange={(e) => handleVisibilityChange(e.target.value)}
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        >
          <option value="all">All visibility</option>
          <option value="visible">Visible</option>
          <option value="hidden">Hidden</option>
        </select>

        <select
          value={time}
          onChange={(e) => handleTimeChange(e.target.value)}
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        >
          <option value="all">All dates</option>
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
        </select>
      </div>

      {/* Events List */}
      <div className="rounded-lg bg-white shadow-sm dark:bg-zinc-900">
        {events.length === 0 ? (
          <div className="p-8 text-center">
            <CalendarIcon className="mx-auto h-12 w-12 text-zinc-400" />
            <h3 className="mt-4 text-lg font-medium text-zinc-900 dark:text-zinc-50">
              No events found
            </h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Create your first event to get started.
            </p>
            <Link
              href="/admin/events/new"
              className="mt-4 inline-flex items-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
            >
              <PlusIcon className="h-4 w-4" />
              New Event
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {events.map((event) => (
              <div
                key={event.id}
                className={`p-4 ${isPastEvent(event.event_date) ? "opacity-60" : ""}`}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  {/* Event Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
                        {event.name}
                      </h3>
                      {event.is_current && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                          <StarIcon className="h-3 w-3" />
                          Current
                        </span>
                      )}
                      {event.is_visible ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                          <EyeIcon className="h-3 w-3" />
                          Visible
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                          <EyeOffIcon className="h-3 w-3" />
                          Hidden
                        </span>
                      )}
                      {isPastEvent(event.event_date) && (
                        <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
                          Past
                        </span>
                      )}
                    </div>

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
                      <span className="inline-flex items-center gap-1">
                        <ListMusicIcon className="h-4 w-4" />
                        {event.playlist_count} playlist{event.playlist_count !== 1 ? "s" : ""}
                      </span>
                    </div>

                    {event.description && (
                      <p className="mt-2 text-sm text-zinc-600 line-clamp-2 dark:text-zinc-400">
                        {event.description}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    {!event.is_current && (
                      <button
                        onClick={() => handleSetCurrent(event.id, event.name)}
                        className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800 transition-colors hover:bg-amber-200 dark:bg-amber-900 dark:text-amber-200 dark:hover:bg-amber-800"
                      >
                        <StarIcon className="h-3 w-3" />
                        Set Current
                      </button>
                    )}
                    <Link
                      href={`/admin/events/${event.id}`}
                      className="rounded-md bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleArchive(event.id, event.name)}
                      className="inline-flex items-center gap-1 rounded-md bg-red-100 px-3 py-1 text-sm font-medium text-red-800 transition-colors hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800"
                    >
                      <ArchiveIcon className="h-3 w-3" />
                      Archive
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Archive Link */}
      <div className="mt-6 text-center">
        <Link
          href="/admin/events/archive"
          className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          View archived events →
        </Link>
      </div>
    </>
  );
}

