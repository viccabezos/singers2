"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  PlusIcon,
  StarIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  ListMusicIcon,
  ChevronRightIcon,
  EyeIcon,
  EyeOffIcon,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import type { EventWithPlaylistCount } from "@/shared/types/event";
import {
  AdminPageLayout,
  StatusBadge,
  FilterPanel,
  ArchiveLink,
} from "@/shared/ui";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

  const handleSetCurrent = async (e: React.MouseEvent, id: string, name: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const previousCurrent = events.find((ev) => ev.is_current);
    
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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", {
      weekday: "short",
      day: "numeric",
      month: "short",
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

  // Empty state
  if (events.length === 0) {
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

        <div className="rounded-lg bg-white p-8 shadow-sm dark:bg-zinc-900 text-center">
          <CalendarIcon className="mx-auto h-12 w-12 text-zinc-400" />
          <h3 className="mt-4 text-lg font-medium text-zinc-900 dark:text-zinc-50">
            No events found
          </h3>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Create your first event to get started.
          </p>
          <Button asChild className="mt-4">
            <Link href="/admin/events/new">
              <PlusIcon className="h-4 w-4 mr-2" />
              New Event
            </Link>
          </Button>
        </div>

        <ArchiveLink href="/admin/events/archive" />
      </AdminPageLayout>
    );
  }

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

      {/* Event list - card style based on user sketch */}
      <div className="space-y-2">
        {events.map((event, index) => {
          const past = isPastEvent(event.event_date);
          const isCurrent = event.is_current;
          
          return (
            <Link
              key={event.id}
              href={`/admin/events/${event.id}`}
              className={cn(
                "block rounded-lg border transition-colors",
                // Base styling
                "bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/80",
                // Current event gets special highlight
                isCurrent && "bg-amber-50/50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800",
                // Past events are dimmed
                past && !isCurrent && "opacity-60",
                // Alternating rows (only for non-current, non-highlighted)
                !isCurrent && index % 2 === 1 && "bg-zinc-50/50 dark:bg-zinc-800/30",
                // Default border
                !isCurrent && "border-zinc-200 dark:border-zinc-800"
              )}
            >
              <div className="flex items-center gap-3 p-3 sm:p-4">
                {/* Date badge with optional current star */}
                <div className="relative shrink-0">
                  {/* Star badge for current event - positioned on corner */}
                  {isCurrent && (
                    <div className="absolute -top-1 -left-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-white shadow-sm">
                      <StarIcon className="h-3 w-3 fill-current" />
                    </div>
                  )}
                  {/* Date box */}
                  <div className={cn(
                    "flex flex-col items-center justify-center w-14 h-14 rounded-lg p-2",
                    isCurrent 
                      ? "bg-amber-100 dark:bg-amber-900/30" 
                      : "bg-zinc-100 dark:bg-zinc-800"
                  )}>
                    <span className={cn(
                      "text-[10px] font-medium uppercase tracking-wide",
                      isCurrent 
                        ? "text-amber-700 dark:text-amber-300" 
                        : "text-zinc-500 dark:text-zinc-400"
                    )}>
                      {new Date(event.event_date).toLocaleDateString("fr-FR", { month: "short" })}
                    </span>
                    <span className={cn(
                      "text-xl font-bold leading-none",
                      isCurrent 
                        ? "text-amber-900 dark:text-amber-100" 
                        : "text-zinc-900 dark:text-zinc-50"
                    )}>
                      {new Date(event.event_date).getDate()}
                    </span>
                  </div>
                </div>

                {/* Main content - Title, Description, Meta */}
                <div className="flex-1 min-w-0">
                  {/* Title */}
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 truncate">
                    {event.name}
                  </h3>
                  
                  {/* Description (if available) */}
                  {event.description && (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 truncate mt-0.5">
                      {event.description}
                    </p>
                  )}

                  {/* Meta info row - Time + Place */}
                  <div className="flex items-center gap-2 mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    {event.event_time && (
                      <span className="inline-flex items-center gap-1">
                        <ClockIcon className="h-3 w-3" />
                        {formatTime(event.event_time)}
                      </span>
                    )}
                    {event.place && (
                      <span className="inline-flex items-center gap-1 truncate">
                        <MapPinIcon className="h-3 w-3 shrink-0" />
                        <span className="truncate max-w-[120px] sm:max-w-[200px]">{event.place}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Right side: Playlist count + Visibility + Star/Past + Chevron */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Playlist count */}
                  <span className="inline-flex items-center gap-1 text-sm text-zinc-600 dark:text-zinc-400">
                    <ListMusicIcon className="h-3.5 w-3.5" />
                    <span className="font-medium">{event.playlist_count}</span>
                  </span>

                  {/* Visibility icon */}
                  <span className={cn(
                    "inline-flex items-center justify-center h-6 w-6 rounded-full",
                    event.is_visible 
                      ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" 
                      : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                  )}>
                    {event.is_visible ? (
                      <EyeIcon className="h-3.5 w-3.5" />
                    ) : (
                      <EyeOffIcon className="h-3.5 w-3.5" />
                    )}
                  </span>

                  {/* Star button for non-current, non-past events */}
                  {!isCurrent && !past && (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => handleSetCurrent(e, event.id, event.name)}
                      className="h-7 w-7 text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-900/20"
                      title="Set as current event"
                    >
                      <StarIcon className="h-4 w-4" />
                    </Button>
                  )}

                  {/* Past badge for past events (not current) */}
                  {past && !isCurrent && (
                    <StatusBadge variant="past" className="text-[10px] px-1.5 py-0.5" />
                  )}

                  {/* Chevron */}
                  <ChevronRightIcon className="h-5 w-5 text-zinc-400" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <ArchiveLink href="/admin/events/archive" />
    </AdminPageLayout>
  );
}
