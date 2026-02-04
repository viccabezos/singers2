import Link from "next/link";
import { CalendarIcon, ClockIcon, MapPinIcon, ChevronRightIcon, MusicIcon } from "lucide-react";
import { cn, formatEventDate, formatEventTime } from "@/lib/utils";
import type { Event } from "@/shared/types/event";

interface CurrentEventBannerProps {
  event: Event;
  className?: string;
}

export function CurrentEventBanner({ event, className }: CurrentEventBannerProps) {
  return (
    <Link
      href={`/event/${event.id}`}
      className={cn(
        "group block relative overflow-hidden rounded-xl",
        "bg-gradient-to-br from-indigo-500 to-purple-600",
        "dark:from-indigo-600 dark:to-purple-700",
        "p-6 sm:p-8",
        "shadow-lg hover:shadow-xl",
        "transition-all duration-300",
        className
      )}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/20" />
        <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-white/10" />
      </div>

      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white mb-3">
            <MusicIcon className="h-3.5 w-3.5" />
            Current Event
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            {event.name}
          </h2>

          <div className="flex flex-wrap items-center gap-4 text-white/90">
            <span className="inline-flex items-center gap-1.5">
              <CalendarIcon className="h-4 w-4" />
              {formatEventDate(event.event_date, "long")}
            </span>

            {event.event_time && (
              <span className="inline-flex items-center gap-1.5">
                <ClockIcon className="h-4 w-4" />
                {formatEventTime(event.event_time)}
              </span>
            )}

            {event.place && (
              <span className="inline-flex items-center gap-1.5">
                <MapPinIcon className="h-4 w-4" />
                <span className="truncate max-w-[200px] sm:max-w-[300px]">{event.place}</span>
              </span>
            )}
          </div>

          {event.description && (
            <p className="mt-3 text-white/80 line-clamp-2 max-w-2xl">
              {event.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 text-white font-medium shrink-0">
          <span className="hidden sm:inline">View Event</span>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
            <ChevronRightIcon className="h-5 w-5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
