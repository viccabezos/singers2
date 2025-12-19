"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ListMusic } from "lucide-react";
import { toast } from "sonner";
import type { EventWithPlaylists } from "@/shared/types/event";
import { SortableContentTable, type ContentColumn, StatusBadge } from "@/shared/ui";
import { createEventAction } from "./actions";
import {
  updateEventAction,
  addPlaylistToEventAction,
  removePlaylistFromEventAction,
  reorderEventPlaylistsAction,
} from "./[id]/actions";

interface EventFormProps {
  event?: EventWithPlaylists;
}

type PlaylistItem = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  position: number;
};

type SearchPlaylistItem = {
  id: string;
  name: string;
  status: string;
};

export function EventForm({ event }: EventFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(event?.name || "");
  const [description, setDescription] = useState(event?.description || "");
  const [eventDate, setEventDate] = useState(event?.event_date || "");
  const [eventTime, setEventTime] = useState(
    event?.event_time ? event.event_time.substring(0, 5) : ""
  );
  const [place, setPlace] = useState(event?.place || "");
  const [isVisible, setIsVisible] = useState(event?.is_visible ?? false);
  const [isCurrent, setIsCurrent] = useState(event?.is_current ?? false);
  const [playlists, setPlaylists] = useState<PlaylistItem[]>(event?.playlists || []);

  const isEditing = !!event;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const input = {
      name: name.trim(),
      description: description.trim() || null,
      event_date: eventDate,
      event_time: eventTime ? `${eventTime}:00` : null,
      place: place.trim() || null,
      is_visible: isVisible,
      is_current: isCurrent,
    };

    startTransition(async () => {
      if (isEditing) {
        const result = await updateEventAction(event.id, input);
        if (result.error) {
          toast.error("Failed to update event", {
            description: result.error,
          });
        } else {
          toast.success("Event updated successfully");
          router.refresh();
        }
      } else {
        const result = await createEventAction(input);
        if (result?.error) {
          toast.error("Failed to create event", {
            description: result.error,
          });
        } else {
          toast.success("Event created successfully");
        }
      }
    });
  };

  const handleSearchPlaylists = useCallback(async (query: string): Promise<SearchPlaylistItem[]> => {
    try {
      const { getPlaylists } = await import("@/shared/lib/playlists");
      const results = await getPlaylists({
        name: query,
        is_archived: false,
      });
      // Filter out playlists already in the event
      const existingIds = new Set(playlists.map((p) => p.id));
      return results
        .filter((p) => !existingIds.has(p.id))
        .map((p) => ({ id: p.id, name: p.name, status: p.status }));
    } catch {
      toast.error("Failed to search playlists");
      return [];
    }
  }, [playlists]);

  const handleAddPlaylist = useCallback(async (playlist: SearchPlaylistItem) => {
    if (!isEditing) {
      // For new events, just add to local state
      setPlaylists((prev) => [
        ...prev,
        {
          id: playlist.id,
          name: playlist.name,
          description: null,
          status: playlist.status,
          position: prev.length + 1,
        },
      ]);
      return;
    }

    startTransition(async () => {
      const result = await addPlaylistToEventAction(event.id, playlist.id);
      if (result.error) {
        toast.error("Failed to add playlist", {
          description: result.error,
        });
      } else {
        setPlaylists((prev) => [
          ...prev,
          {
            id: playlist.id,
            name: playlist.name,
            description: null,
            status: playlist.status,
            position: prev.length + 1,
          },
        ]);
        toast.success(`Added "${playlist.name}" to event`);
        router.refresh();
      }
    });
  }, [isEditing, event?.id, router]);

  const handleRemovePlaylist = useCallback(async (playlistId: string) => {
    const playlist = playlists.find((p) => p.id === playlistId);
    if (!playlist) return;

    if (!isEditing) {
      setPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
      return;
    }

    startTransition(async () => {
      const result = await removePlaylistFromEventAction(event.id, playlistId);
      if (result.error) {
        toast.error("Failed to remove playlist", {
          description: result.error,
        });
      } else {
        setPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
        toast.success(`Removed "${playlist.name}" from event`);
        router.refresh();
      }
    });
  }, [isEditing, event?.id, playlists, router]);

  const handleReorderPlaylists = useCallback(async (newPlaylists: PlaylistItem[]) => {
    const previousPlaylists = playlists;
    // Update positions
    const updatedPlaylists = newPlaylists.map((p, i) => ({ ...p, position: i + 1 }));
    setPlaylists(updatedPlaylists);

    if (!isEditing) return;

    startTransition(async () => {
      const result = await reorderEventPlaylistsAction(
        event.id,
        updatedPlaylists.map((p) => p.id)
      );
      if (result.error) {
        toast.error("Failed to reorder playlists", {
          description: result.error,
        });
        // Revert on error
        setPlaylists(previousPlaylists);
      }
    });
  }, [isEditing, event?.id, playlists]);

  // Column configuration for playlists table
  const playlistColumns: ContentColumn<PlaylistItem>[] = [
    {
      key: "name",
      header: "Playlist",
      render: (item) => (
        <div className="flex items-center gap-2">
          <span className="font-medium text-zinc-900 dark:text-zinc-50">
            {item.name}
          </span>
          <StatusBadge variant={item.status as "visible" | "hidden" | "in_progress"} />
        </div>
      ),
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-900">
        <h2 className="mb-4 text-lg font-medium text-black dark:text-zinc-50">
          Event Details
        </h2>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-400"
              placeholder="Concert de Noël"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-400"
              placeholder="Optional description..."
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="event_date"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="event_date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              />
            </div>

            <div>
              <label
                htmlFor="event_time"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Time
              </label>
              <input
                type="time"
                id="event_time"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              />
            </div>
          </div>

          {/* Place */}
          <div>
            <label
              htmlFor="place"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Place
            </label>
            <input
              type="text"
              id="place"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-400"
              placeholder="Église Saint-Pierre"
            />
          </div>

          {/* Visibility and Current */}
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isVisible}
                onChange={(e) => setIsVisible(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-300 text-black focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800"
              />
              <span className="text-sm text-zinc-700 dark:text-zinc-300">
                Visible on public site
              </span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isCurrent}
                onChange={(e) => setIsCurrent(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-300 text-amber-600 focus:ring-amber-500 dark:border-zinc-700 dark:bg-zinc-800"
              />
              <span className="text-sm text-zinc-700 dark:text-zinc-300">
                Set as current event
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Playlists */}
      <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-900">
        <h2 className="mb-4 text-lg font-medium text-black dark:text-zinc-50">
          Playlists ({playlists.length})
        </h2>

        <SortableContentTable
          items={playlists}
          onReorder={handleReorderPlaylists}
          onRemove={handleRemovePlaylist}
          getItemId={(item) => item.id}
          columns={playlistColumns}
          emptyState={{
            icon: ListMusic,
            title: "No playlists added yet",
            description: "Click \"Add Playlist\" to get started.",
          }}
          picker={{
            searchPlaceholder: "Search playlists...",
            onSearch: handleSearchPlaylists,
            onAdd: handleAddPlaylist,
            renderResult: (playlist) => (
              <div className="flex items-center gap-2">
                <span className="text-sm text-zinc-900 dark:text-zinc-50">
                  {playlist.name}
                </span>
                <StatusBadge variant={playlist.status as "visible" | "hidden" | "in_progress"} />
              </div>
            ),
            getItemId: (playlist) => playlist.id,
            buttonLabel: "Add Playlist",
          }}
          disabled={isPending}
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
        >
          {isPending ? "Saving..." : isEditing ? "Save Changes" : "Create Event"}
        </button>
      </div>
    </form>
  );
}
