import { requireAuth } from "../../middleware";
import { getEventWithPlaylists } from "@/shared/lib/events";
import { notFound } from "next/navigation";
import { EventForm } from "../event-form";
import { Breadcrumbs } from "@/shared/ui/breadcrumbs";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAuth();

  const { id } = await params;
  const event = await getEventWithPlaylists(id);

  if (!event) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-4 dark:bg-black sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        <Breadcrumbs
          items={[
            { label: "Dashboard", href: "/admin/dashboard" },
            { label: "Events", href: "/admin/events" },
            { label: event.name, href: `/admin/events/${event.id}` },
          ]}
        />
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50 sm:text-3xl">
            Edit Event
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            {event.name}
          </p>
        </div>
        <EventForm event={event} />
      </div>
    </div>
  );
}

