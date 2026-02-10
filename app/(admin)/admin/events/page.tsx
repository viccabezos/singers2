import { requireAuth } from "../middleware";
import { getEvents, autoArchiveOldEvents, AutoArchiveResult } from "@/shared/lib/events";
import { EventsListClient } from "./events-list-client";

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; visibility?: string; time?: string }>;
}) {
  await requireAuth();

  // Run auto-archive check
  let autoArchiveResult: AutoArchiveResult | null = null;
  try {
    autoArchiveResult = await autoArchiveOldEvents();
  } catch (error) {
    console.error("Auto-archive failed:", error);
  }

  const params = await searchParams;
  
  const filters: {
    name?: string;
    is_visible?: boolean;
    is_archived?: boolean;
    upcoming?: boolean;
    past?: boolean;
    recent?: boolean;
    thisMonth?: boolean;
    lastMonth?: boolean;
    sortDesc?: boolean;
  } = {
    is_archived: false,
    sortDesc: true, // Default to newest first
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
  } else if (params.time === "recent") {
    filters.recent = true;
  } else if (params.time === "thisMonth") {
    filters.thisMonth = true;
  } else if (params.time === "lastMonth") {
    filters.lastMonth = true;
  }

  const events = await getEvents(filters);

  return <EventsListClient events={events} autoArchiveResult={autoArchiveResult} />;
}
