"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  PlusIcon,
  StarIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  ListMusicIcon,
} from "lucide-react";
import { toast } from "sonner";
import type { EventWithPlaylistCount } from "@/shared/types/event";
import {
  PageHeader,
  DataCardList,
  StatusBadge,
  VisibilityBadge,
  InlineFilters,
  SearchInput,
  FilterSelect,
  EditButton,
  ArchiveButton,
  ActionButtonGroup,
  ArchiveLink,
} from "@/shared/ui";
import { Button } from "@/components/ui/button";

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

  const handleSearchSubmit = () => {
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
        toast.error("Failed to set current event", { description: result.error });
        return;
      }

      setEvents((prev) =>
        prev.map((event) => ({
          ...event,
          is_current: event.id === id,
        }))
      );
      toast.success(`"${name}" is now the current event`);
      router.refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to set current event";
      toast.error("Failed to set current event", { description: errorMessage });
    }
  };

  const handleArchive = async (id: string, name: string) => {
    try {
      const { archiveEventAction } = await import("./[id]/actions");
      const result = await archiveEventAction(id);

      if (result.error) {
        toast.error("Failed to archive event", { description: result.error });
        return;
      }

      setEvents((prev) => prev.filter((event) => event.id !== id));
      toast.success(`"${name}" archived successfully`);
      router.refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to archive event";
      toast.error("Failed to archive event", { description: errorMessage });
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
    return timeStr.substring(0, 5);
  };

  const isPastEvent = (dateStr: string) => {
    const eventDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate < today;
  };

  const renderEventCard = (event: EventWithPlaylistCount) => (
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
              <StatusBadge variant="current" showIcon />
            )}
            <VisibilityBadge isVisible={event.is_visible} showIcon />
            {isPastEvent(event.event_date) && (
              <StatusBadge variant="past" />
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
        <ActionButtonGroup>
          {!event.is_current && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleSetCurrent(event.id, event.name)}
              className="bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900 dark:text-amber-200 dark:hover:bg-amber-800"
            >
              <StarIcon className="h-3 w-3" />
              Set Current
            </Button>
          )}
          <EditButton href={`/admin/events/${event.id}`} />
          <ArchiveButton
            onArchive={() => handleArchive(event.id, event.name)}
            itemName={event.name}
          />
        </ActionButtonGroup>
      </div>
    </div>
  );

  return (
    <>
      <PageHeader
        title="Events"
        description="Manage your choir events"
        action={{
          label: "New Event",
          href: "/admin/events/new",
          icon: PlusIcon,
        }}
      />

      <InlineFilters>
        <SearchInput
          value={search}
          onChange={setSearch}
          onSubmit={handleSearchSubmit}
          placeholder="Search events..."
        />
        <FilterSelect
          value={visibility}
          onChange={handleVisibilityChange}
          options={[
            { value: "all", label: "All visibility" },
            { value: "visible", label: "Visible" },
            { value: "hidden", label: "Hidden" },
          ]}
        />
        <FilterSelect
          value={time}
          onChange={handleTimeChange}
          options={[
            { value: "all", label: "All dates" },
            { value: "upcoming", label: "Upcoming" },
            { value: "past", label: "Past" },
          ]}
        />
      </InlineFilters>

      <DataCardList
        data={events}
        renderCard={renderEventCard}
        emptyState={{
          icon: CalendarIcon,
          title: "No events found",
          description: "Create your first event to get started.",
          action: {
            label: "New Event",
            href: "/admin/events/new",
          },
        }}
      />

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
