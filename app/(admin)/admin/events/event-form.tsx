"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  PlusIcon,
  XIcon,
  SearchIcon,
  ListMusicIcon,
} from "lucide-react";
import { toast } from "sonner";
import type { EventWithPlaylists } from "@/shared/types/event";
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
  const [playlists, setPlaylists] = useState(event?.playlists || []);
  const [showPlaylistSearch, setShowPlaylistSearch] = useState(false);
  const [playlistSearch, setPlaylistSearch] = useState("");
  const [availablePlaylists, setAvailablePlaylists] = useState<
    { id: string; name: string; status: string }[]
  >([]);
  const [isSearching, setIsSearching] = useState(false);

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

  const searchPlaylists = async (query: string) => {
    setIsSearching(true);
    try {
      const { getPlaylists } = await import("@/shared/lib/playlists");
      const results = await getPlaylists({
        name: query,
        is_archived: false,
      });
      // Filter out playlists already in the event
      const existingIds = new Set(playlists.map((p) => p.id));
      setAvailablePlaylists(
        results
          .filter((p) => !existingIds.has(p.id))
          .map((p) => ({ id: p.id, name: p.name, status: p.status }))
      );
    } catch (error) {
      toast.error("Failed to search playlists");
    } finally {
      setIsSearching(false);
    }
  };

  const handlePlaylistSearchChange = (value: string) => {
    setPlaylistSearch(value);
    if (value.length >= 1) {
      searchPlaylists(value);
    } else {
      setAvailablePlaylists([]);
    }
  };

  const handleAddPlaylist = async (playlistId: string, playlistName: string, playlistStatus: string) => {
    if (!isEditing) {
      // For new events, just add to local state
      setPlaylists([
        ...playlists,
        {
          id: playlistId,
          name: playlistName,
          description: null,
          status: playlistStatus,
          position: playlists.length + 1,
        },
      ]);
      setAvailablePlaylists(availablePlaylists.filter((p) => p.id !== playlistId));
      setPlaylistSearch("");
      setShowPlaylistSearch(false);
      return;
    }

    startTransition(async () => {
      const result = await addPlaylistToEventAction(event.id, playlistId);
      if (result.error) {
        toast.error("Failed to add playlist", {
          description: result.error,
        });
      } else {
        setPlaylists([
          ...playlists,
          {
            id: playlistId,
            name: playlistName,
            description: null,
            status: playlistStatus,
            position: playlists.length + 1,
          },
        ]);
        setAvailablePlaylists(availablePlaylists.filter((p) => p.id !== playlistId));
        setPlaylistSearch("");
        setShowPlaylistSearch(false);
        toast.success(`Added "${playlistName}" to event`);
        router.refresh();
      }
    });
  };

  const handleRemovePlaylist = async (playlistId: string, playlistName: string) => {
    if (!isEditing) {
      setPlaylists(playlists.filter((p) => p.id !== playlistId));
      return;
    }

    startTransition(async () => {
      const result = await removePlaylistFromEventAction(event.id, playlistId);
      if (result.error) {
        toast.error("Failed to remove playlist", {
          description: result.error,
        });
      } else {
        setPlaylists(playlists.filter((p) => p.id !== playlistId));
        toast.success(`Removed "${playlistName}" from event`);
        router.refresh();
      }
    });
  };

  const handleMovePlaylist = async (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= playlists.length) return;

    const newPlaylists = [...playlists];
    [newPlaylists[index], newPlaylists[newIndex]] = [
      newPlaylists[newIndex],
      newPlaylists[index],
    ];
    // Update positions
    newPlaylists.forEach((p, i) => (p.position = i + 1));
    setPlaylists(newPlaylists);

    if (!isEditing) return;

    startTransition(async () => {
      const result = await reorderEventPlaylistsAction(
        event.id,
        newPlaylists.map((p) => p.id)
      );
      if (result.error) {
        toast.error("Failed to reorder playlists", {
          description: result.error,
        });
        // Revert on error
        setPlaylists(playlists);
      }
    });
  };

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
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium text-black dark:text-zinc-50">
            Playlists
          </h2>
          <button
            type="button"
            onClick={() => {
              setShowPlaylistSearch(!showPlaylistSearch);
              if (!showPlaylistSearch) {
                searchPlaylists("");
              }
            }}
            className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700"
          >
            <PlusIcon className="h-4 w-4" />
            Add Playlist
          </button>
        </div>

        {/* Playlist Search */}
        {showPlaylistSearch && (
          <div className="mb-4 rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search playlists..."
                value={playlistSearch}
                onChange={(e) => handlePlaylistSearchChange(e.target.value)}
                className="w-full rounded-md border border-zinc-300 bg-white py-2 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-400"
                autoFocus
              />
            </div>

            {isSearching && (
              <p className="mt-2 text-sm text-zinc-500">Searching...</p>
            )}

            {availablePlaylists.length > 0 && (
              <ul className="mt-2 max-h-48 overflow-y-auto divide-y divide-zinc-200 dark:divide-zinc-700">
                {availablePlaylists.map((playlist) => (
                  <li
                    key={playlist.id}
                    className="flex items-center justify-between py-2"
                  >
                    <div>
                      <span className="text-sm text-zinc-900 dark:text-zinc-50">
                        {playlist.name}
                      </span>
                      <span
                        className={`ml-2 text-xs ${
                          playlist.status === "visible"
                            ? "text-green-600 dark:text-green-400"
                            : playlist.status === "in_progress"
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-zinc-500"
                        }`}
                      >
                        {playlist.status}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handleAddPlaylist(playlist.id, playlist.name, playlist.status)
                      }
                      disabled={isPending}
                      className="rounded-md bg-black px-2 py-1 text-xs font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
                    >
                      Add
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {playlistSearch && availablePlaylists.length === 0 && !isSearching && (
              <p className="mt-2 text-sm text-zinc-500">No playlists found</p>
            )}
          </div>
        )}

        {/* Current Playlists */}
        {playlists.length === 0 ? (
          <div className="py-8 text-center">
            <ListMusicIcon className="mx-auto h-12 w-12 text-zinc-400" />
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              No playlists added yet
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-zinc-200 dark:divide-zinc-700">
            {playlists.map((playlist, index) => (
              <li
                key={playlist.id}
                className="flex items-center justify-between py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                    {index + 1}
                  </span>
                  <div>
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                      {playlist.name}
                    </span>
                    <span
                      className={`ml-2 text-xs ${
                        playlist.status === "visible"
                          ? "text-green-600 dark:text-green-400"
                          : playlist.status === "in_progress"
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-zinc-500"
                      }`}
                    >
                      {playlist.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleMovePlaylist(index, "up")}
                    disabled={index === 0 || isPending}
                    className="rounded p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 disabled:opacity-30 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                  >
                    <ArrowUpIcon className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMovePlaylist(index, "down")}
                    disabled={index === playlists.length - 1 || isPending}
                    className="rounded p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 disabled:opacity-30 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                  >
                    <ArrowDownIcon className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemovePlaylist(playlist.id, playlist.name)}
                    disabled={isPending}
                    className="rounded p-1 text-red-500 hover:bg-red-100 hover:text-red-700 disabled:opacity-50 dark:hover:bg-red-900 dark:hover:text-red-300"
                  >
                    <XIcon className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
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

