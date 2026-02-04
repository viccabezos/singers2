import Link from "next/link";
import { CalendarIcon, ArrowRightIcon } from "lucide-react";
import { getCurrentEvent, getUpcomingEvents } from "@/shared/lib/events";
import { EventCard } from "@/widgets/event-card";
import { CurrentEventBanner } from "@/widgets/current-event-banner";

export default async function HomePage() {
  // Fetch current event and upcoming events in parallel
  const [currentEvent, upcomingEvents] = await Promise.all([
    getCurrentEvent(),
    getUpcomingEvents(10),
  ]);

  // Filter out current event from upcoming events list to avoid duplication
  const filteredUpcomingEvents = currentEvent
    ? upcomingEvents.filter((event) => event.id !== currentEvent.id)
    : upcomingEvents;

  const hasEvents = currentEvent || filteredUpcomingEvents.length > 0;

  return (
    <>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {!hasEvents ? (
          // Empty state
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
              <CalendarIcon className="h-10 w-10 text-zinc-400" />
            </div>
            <h2 className="mt-6 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              No Upcoming Events
            </h2>
            <p className="mt-2 max-w-md text-zinc-600 dark:text-zinc-400">
              Check back later for upcoming choir performances and events.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Current Event Banner */}
            {currentEvent && (
              <section>
                <CurrentEventBanner event={currentEvent} />
              </section>
            )}

            {/* Upcoming Events */}
            {filteredUpcomingEvents.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                      Upcoming Events
                    </h2>
                    <p className="mt-1 text-zinc-600 dark:text-zinc-400">
                      Join us at our next performances
                    </p>
                  </div>

                  <Link
                    href="/events"
                    className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm ring-1 ring-zinc-200 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-50 dark:ring-zinc-800 dark:hover:bg-zinc-800"
                  >
                    View All
                    <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredUpcomingEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
            © {new Date().getFullYear()} Les Chanteurs. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
