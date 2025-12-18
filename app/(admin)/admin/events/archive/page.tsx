import { requireAuth } from "../../middleware";
import { getEvents } from "@/shared/lib/events";
import { ArchiveListClient } from "./archive-list-client";
import { Breadcrumbs } from "@/shared/ui/breadcrumbs";

export default async function ArchivePage() {
  await requireAuth();

  const archivedEvents = await getEvents({ is_archived: true });

  return (
    <div className="min-h-screen bg-zinc-50 p-4 dark:bg-black sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <Breadcrumbs
          items={[
            { label: "Dashboard", href: "/admin/dashboard" },
            { label: "Events", href: "/admin/events" },
            { label: "Archive", href: "/admin/events/archive" },
          ]}
        />
        <ArchiveListClient events={archivedEvents} />
      </div>
    </div>
  );
}

