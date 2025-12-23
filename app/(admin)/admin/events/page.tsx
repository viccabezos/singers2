import { requireAuth } from "../middleware";
import { getEvents } from "@/shared/lib/events";
import { EventsListClient } from "./events-list-client";

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; visibility?: string; time?: string }>;
}) {
  await requireAuth();

  const params = await searchParams;

  const filters: {
    name?: string;
    is_visible?: boolean;
    is_archived?: boolean;
    upcoming?: boolean;
    past?: boolean;
  } = {
    is_archived: false,
  };

  if (params.search) {
    filters.name = params.search;
  }

  if (params.visibility === "visible") {
    filters.is_visible = true;
  } else if (params.visibility === "hidden") {
    filters.is_visible = false;
  }

  if (params.time === "upcoming") {
    filters.upcoming = true;
  } else if (params.time === "past") {
    filters.past = true;
  }

  const events = await getEvents(filters);

  return <EventsListClient events={events} />;
}
