import Link from "next/link";
import { CalendarIcon, ArrowLeftIcon } from "lucide-react";
import { getAllUpcomingEvents } from "@/shared/lib/events";
import { EventCard } from "@/widgets/event-card";
import { PublicBreadcrumbs } from "@/widgets/public-breadcrumbs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upcoming Events | Les Chanteurs",
  description: "Browse all upcoming choir performances and events",
};

export default async function EventsPage() {
  const events = await getAllUpcomingEvents();

  return (
    <>
      <div className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <PublicBreadcrumbs items={[{ label: "Events" }]} />
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
              <CalendarIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              Upcoming Events
            </h1>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 ml-[52px]">
            Join us at our upcoming choir performances
          </p>
        </div>

        {events.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
              <CalendarIcon className="h-10 w-10 text-zinc-400" />
            </div>
            <h2 className="mt-6 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              No Upcoming Events
            </h2>
            <p className="mt-2 max-w-md text-zinc-600 dark:text-zinc-400">
              There are no upcoming events scheduled at the moment. Check back later for new performances!
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Go Back Home
            </Link>
          </div>
        ) : (
          // Events grid
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </main>


    </>
  );
}
