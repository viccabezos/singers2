"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ListMusic } from "lucide-react";
import { toast } from "sonner";
import type { EventWithPlaylists } from "@/shared/types/event";
import {
  FormLayout,
  FormSection,
  FormActions,
  useFormFeedback,
  TextField,
  TextAreaField,
  CheckboxField,
  SortableContentTable,
  StatusBadge,
  PlaceAutocompleteField,
  LocationPickerMap,
  type ContentColumn,
  type PlaceResult,
  type MapLocation,
} from "@/shared/ui";
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
  const [formData, setFormData] = useState({
    name: event?.name || "",
    description: event?.description || "",
    eventDate: event?.event_date || "",
    eventTime: event?.event_time ? event.event_time.substring(0, 5) : "",
    place: event?.place || "",
    latitude: event?.latitude ?? null,
    longitude: event?.longitude ?? null,
    isVisible: event?.is_visible ?? false,
    isCurrent: event?.is_current ?? false,
  });
  const [playlists, setPlaylists] = useState<PlaylistItem[]>(event?.playlists || []);

  const isEditing = !!event;

  const feedback = useFormFeedback({
    successMessage: isEditing ? "Event updated successfully" : "Event created successfully",
    successRedirect: "/admin/events",
    errorMessage: "Failed to save event",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    feedback.clearError();

    const input = {
      name: formData.name.trim(),
      description: formData.description.trim() || null,
      event_date: formData.eventDate,
      event_time: formData.eventTime ? `${formData.eventTime}:00` : null,
      place: formData.place.trim() || null,
      latitude: formData.latitude,
      longitude: formData.longitude,
      is_visible: formData.isVisible,
      is_current: formData.isCurrent,
    };

    startTransition(async () => {
      try {
        if (isEditing) {
          const result = await updateEventAction(event.id, input);
          if (result.error) {
            feedback.onError(result.error);
            return;
          }
        } else {
          const result = await createEventAction(input);
          if (result?.error) {
            feedback.onError(result.error);
            return;
          }
        }
        feedback.onSuccess();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to save event";
        feedback.onError(errorMessage);
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
    <FormLayout onSubmit={handleSubmit} error={feedback.inlineError}>
      <FormSection title="Event Details">
        <TextField
          label="Name"
          id="name"
          value={formData.name}
          onChange={(v) => setFormData({ ...formData, name: v })}
          required
          placeholder="Concert de Noël"
        />

        <TextAreaField
          label="Description"
          id="description"
          value={formData.description}
          onChange={(v) => setFormData({ ...formData, description: v })}
          placeholder="Optional description..."
        />

        {/* Date and Time */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            label="Date"
            id="event_date"
            type="date"
            value={formData.eventDate}
            onChange={(v) => setFormData({ ...formData, eventDate: v })}
            required
          />

          <TextField
            label="Time"
            id="event_time"
            type="time"
            value={formData.eventTime}
            onChange={(v) => setFormData({ ...formData, eventTime: v })}
          />
        </div>

        <PlaceAutocompleteField
          label="Place"
          id="place"
          value={formData.place}
          onChange={(result: PlaceResult) => setFormData({ 
            ...formData, 
            place: result.address,
            latitude: result.latitude,
            longitude: result.longitude,
          })}
          placeholder="Église Saint-Pierre, Paris"
        />

        {/* Interactive map - always visible, click to set location */}
        <LocationPickerMap
          location={
            formData.latitude && formData.longitude
              ? {
                  latitude: formData.latitude,
                  longitude: formData.longitude,
                  address: formData.place,
                }
              : null
          }
          onLocationChange={(loc: MapLocation) => setFormData({
            ...formData,
            place: loc.address || formData.place,
            latitude: loc.latitude,
            longitude: loc.longitude,
          })}
          height="250px"
        />

        {/* Visibility and Current */}
        <div className="flex flex-wrap gap-6">
          <CheckboxField
            label="Visible on public site"
            id="is_visible"
            checked={formData.isVisible}
            onChange={(v) => setFormData({ ...formData, isVisible: v })}
          />

          <CheckboxField
            label="Set as current event"
            id="is_current"
            checked={formData.isCurrent}
            onChange={(v) => setFormData({ ...formData, isCurrent: v })}
          />
        </div>
      </FormSection>

      {/* Playlists */}
      <FormSection title={`Playlists (${playlists.length})`}>
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
      </FormSection>

      <FormActions
        primaryLabel={isEditing ? "Save Changes" : "Create Event"}
        onCancel={() => router.back()}
        isPending={isPending}
      />
    </FormLayout>
  );
}
