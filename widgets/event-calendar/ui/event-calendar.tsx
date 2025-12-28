"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { fr } from "date-fns/locale";
import { format, isBefore, isSameDay, startOfDay, startOfMonth, endOfMonth, parseISO } from "date-fns";
import { ChevronRightIcon, ClockIcon, PlusIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { EventWithPlaylistCount } from "@/shared/types/event";
import type { DayButton } from "react-day-picker";

interface EventCalendarProps {
  events: EventWithPlaylistCount[];
}

export function EventCalendar({ events }: EventCalendarProps) {
  const router = useRouter();
  const [month, setMonth] = useState<Date>(new Date());
  const today = startOfDay(new Date());

  // Create a map of date strings to events for quick lookup
  const eventsByDate = useMemo(() => {
    const map = new Map<string, EventWithPlaylistCount[]>();
    events.forEach((event) => {
      const dateKey = event.event_date;
      const existing = map.get(dateKey) || [];
      existing.push(event);
      map.set(dateKey, existing);
    });
    return map;
  }, [events]);

  // Get events for a specific date
  const getEventsForDate = (date: Date): EventWithPlaylistCount[] => {
    const dateKey = format(date, "yyyy-MM-dd");
    return eventsByDate.get(dateKey) || [];
  };

  // Get events for the selected month, sorted: today first, then upcoming, then past
  const monthEvents = useMemo(() => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    
    const filtered = events.filter((event) => {
      const eventDate = parseISO(event.event_date);
      return eventDate >= monthStart && eventDate <= monthEnd;
    });

    // Sort: today first, then upcoming (by date asc), then past (by date desc)
    return filtered.sort((a, b) => {
      const dateA = startOfDay(new Date(a.event_date));
      const dateB = startOfDay(new Date(b.event_date));
      
      const isAToday = isSameDay(dateA, today);
      const isBToday = isSameDay(dateB, today);
      const isAPast = isBefore(dateA, today);
      const isBPast = isBefore(dateB, today);

      // Today events first
      if (isAToday && !isBToday) return -1;
      if (!isAToday && isBToday) return 1;
      
      // Then upcoming events (sorted by date ascending)
      if (!isAPast && isBPast) return -1;
      if (isAPast && !isBPast) return 1;
      
      // Within same category, sort by date
      return a.event_date.localeCompare(b.event_date);
    });
  }, [events, month, today]);

  // Get event type for styling (simplified: just past vs upcoming based on date)
  const getEventType = (event: EventWithPlaylistCount): "today" | "upcoming" | "past" => {
    const eventDate = startOfDay(new Date(event.event_date));
    if (isSameDay(eventDate, today)) return "today";
    if (isBefore(eventDate, today)) return "past";
    return "upcoming";
  };

  // Navigate to event page
  const handleEventClick = (eventId: string) => {
    router.push(`/admin/events/${eventId}`);
  };

  // Handle day click - navigate to event or create new
  const handleDayClick = (date: Date) => {
    const dayEvents = getEventsForDate(date);
    if (dayEvents.length > 0) {
      // Navigate to first event on this day
      router.push(`/admin/events/${dayEvents[0].id}`);
    } else {
      // Navigate to new event form with pre-filled date
      const dateStr = format(date, "yyyy-MM-dd");
      router.push(`/admin/events/new?date=${dateStr}`);
    }
  };

  // Custom day button with colored background for events
  const CustomDayButton = ({
    day,
    modifiers,
    className,
    ...props
  }: React.ComponentProps<typeof DayButton>) => {
    const dayEvents = getEventsForDate(day.date);
    const hasEvents = dayEvents.length > 0;
    const isToday = isSameDay(day.date, today);
    
    // Determine the highlight style
    let dayStyle = "";
    
    if (isToday) {
      // Today always gets primary color
      dayStyle = "bg-primary text-primary-foreground hover:bg-primary/90";
    } else if (hasEvents) {
      const eventDate = startOfDay(day.date);
      const isPast = isBefore(eventDate, today);
      
      if (isPast) {
        dayStyle = "bg-muted text-muted-foreground hover:bg-muted/80";
      } else {
        dayStyle = "bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-100 dark:hover:bg-blue-900/40";
      }
    }

    // Don't spread props to avoid overriding onClick
    const { onClick: _, ...restProps } = props;

    return (
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "flex aspect-square size-auto w-full min-w-8 font-normal rounded-md cursor-pointer",
          modifiers.outside && "text-muted-foreground opacity-50",
          dayStyle,
          className
        )}
        onClick={() => handleDayClick(day.date)}
        {...restProps}
      >
        <span>{day.date.getDate()}</span>
      </Button>
    );
  };

  return (
    <Card>
      <CardHeader className="">
        <CardTitle className="text-lg">Événements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row lg:gap-6">
          {/* Calendar */}
          <div className="flex-shrink-0">
            <Calendar
              mode="single"
              month={month}
              onMonthChange={setMonth}
              locale={fr}
              weekStartsOn={1}
              showOutsideDays
              components={{
                DayButton: CustomDayButton,
              }}
            />
            
            {/* Legend */}
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground border-t pt-3 justify-center">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded bg-primary" />
                <span>Aujourd&apos;hui</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded bg-blue-100 dark:bg-blue-900/30" />
                <span>À venir</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded bg-muted" />
                <span>Passé</span>
              </div>
            </div>
          </div>

          {/* Event list for selected month */}
          <div className="flex-1 mt-4 lg:mt-0 lg:border-l lg:pl-6 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm capitalize">
                {format(month, "MMMM yyyy", { locale: fr })}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => router.push("/admin/events/new")}
                title="Nouvel événement"
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>

            {monthEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">
                Aucun événement ce mois
              </p>
            ) : (
              <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1 mt-2">
                {monthEvents.map((event) => {
                  const eventType = getEventType(event);
                  const eventDate = parseISO(event.event_date);
                  return (
                    <button
                      key={event.id}
                      onClick={() => handleEventClick(event.id)}
                      className={cn(
                        "group w-full text-left p-3 rounded-lg border-l-4 transition-colors cursor-pointer",
                        "hover:bg-accent/50",
                        eventType === "today" && "border-l-primary bg-primary/5",
                        eventType === "upcoming" && "border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10",
                        eventType === "past" && "border-l-muted-foreground/50 bg-muted/30"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">
                            {event.name}
                          </div>
                          {event.description && (
                            <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                              {event.description}
                            </div>
                          )}
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span className="whitespace-nowrap">
                              {format(eventDate, "d MMM", { locale: fr })}
                            </span>
                            {event.event_time && (
                              <div className="flex items-center gap-1">
                                <ClockIcon className="h-3 w-3" />
                                <span>{event.event_time.slice(0, 5)}</span>
                              </div>
                            )}
                            {event.place && (
                              <span className="truncate">{event.place}</span>
                            )}
                          </div>
                        </div>
                        <ChevronRightIcon className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
