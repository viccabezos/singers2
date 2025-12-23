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
  AdminPageLayout,
  DataCardList,
  StatusBadge,
  VisibilityBadge,
  FilterPanel,
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
  const [filters, setFilters] = useState({
    search: searchParams?.get("search") || "",
    visibility: searchParams?.get("visibility") || "all",
    time: searchParams?.get("time") || "all",
  });

  useEffect(() => {
    setEvents(initialEvents);
  }, [initialEvents]);

  const handleFilterChange = (id: string, value: string) => {
    setFilters((prev) => ({ ...prev, [id]: value }));
  };

  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.visibility !== "all") params.set("visibility", filters.visibility);
    if (filters.time !== "all") params.set("time", filters.time);
    router.push(`/admin/events?${params.toString()}`);
  };

  const handleSetCurrent = async (id: string, name: string) => {
    // Find the previous current event name for the toast
    const previousCurrent = events.find((e) => e.is_current);
    
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
      
      // Show informative toast with previous event info
      if (previousCurrent) {
        toast.success(`"${name}" is now the current event`, {
          description: `Replaced "${previousCurrent.name}" as the current event.`,
        });
      } else {
        toast.success(`"${name}" is now the current event`);
      }
      
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
    <AdminPageLayout
      breadcrumbs={[
        { label: "Dashboard", href: "/admin/dashboard" },
        { label: "Events" },
      ]}
      title="Events"
      description="Manage your choir events"
      action={{
        label: "New Event",
        href: "/admin/events/new",
        icon: PlusIcon,
      }}
    >
      <FilterPanel
        filters={[
          {
            id: "search",
            type: "search",
            label: "Search",
            placeholder: "Search events...",
            icon: true,
          },
          {
            id: "visibility",
            type: "select",
            label: "Visibility",
            placeholder: "All visibility",
            options: [
              { value: "all", label: "All visibility" },
              { value: "visible", label: "Visible" },
              { value: "hidden", label: "Hidden" },
            ],
          },
          {
            id: "time",
            type: "select",
            label: "Date",
            placeholder: "All dates",
            options: [
              { value: "all", label: "All dates" },
              { value: "upcoming", label: "Upcoming" },
              { value: "past", label: "Past" },
            ],
          },
        ]}
        values={filters}
        onChange={handleFilterChange}
        onApply={handleApplyFilters}
      />

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

      <ArchiveLink href="/admin/events/archive" />
    </AdminPageLayout>
  );
}
