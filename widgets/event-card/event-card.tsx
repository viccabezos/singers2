import Link from "next/link";
import { CalendarIcon, ClockIcon, MapPinIcon, ChevronRightIcon } from "lucide-react";
import { cn, formatEventDate, formatEventTime } from "@/lib/utils";
import type { Event } from "@/shared/types/event";

interface EventCardProps {
  event: Event;
  className?: string;
}

export function EventCard({ event, className }: EventCardProps) {
  return (
    <Link
      href={`/event/${event.id}`}
      className={cn(
        "group block rounded-lg bg-white p-4 shadow-sm transition-all",
        "hover:shadow-md hover:bg-zinc-50",
        "dark:bg-zinc-900 dark:hover:bg-zinc-800",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 truncate">
            {event.name}
          </h3>
          
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
            <span className="inline-flex items-center gap-1.5">
              <CalendarIcon className="h-4 w-4 shrink-0" />
              {formatEventDate(event.event_date, "short")}
            </span>
            
            {event.event_time && (
              <span className="inline-flex items-center gap-1.5">
                <ClockIcon className="h-4 w-4 shrink-0" />
                {formatEventTime(event.event_time)}
              </span>
            )}
            
            {event.place && (
              <span className="inline-flex items-center gap-1.5">
                <MapPinIcon className="h-4 w-4 shrink-0" />
                <span className="truncate">{event.place}</span>
              </span>
            )}
          </div>
          
          {event.description && (
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-500 line-clamp-2">
              {event.description}
            </p>
          )}
        </div>
        
        <ChevronRightIcon className="h-5 w-5 shrink-0 text-zinc-400 group-hover:text-zinc-600 dark:text-zinc-600 dark:group-hover:text-zinc-400" />
      </div>
    </Link>
  );
}
