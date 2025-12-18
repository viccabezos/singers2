import { getVisibleEventById, getEventPlaylists } from "@/shared/lib/events";
import { notFound } from "next/navigation";
import { EventDisplay } from "./event-display";

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getVisibleEventById(id);

  if (!event) {
    notFound();
  }

  // Get playlists for this event (only visible ones for public)
  const eventPlaylists = await getEventPlaylists(id);
  const visiblePlaylists = eventPlaylists
    .filter((ep) => ep.playlist.status === "visible")
    .map((ep) => ({
      id: ep.playlist.id,
      name: ep.playlist.name,
      description: ep.playlist.description,
      position: ep.position,
    }));

  return <EventDisplay event={event} playlists={visiblePlaylists} />;
}

