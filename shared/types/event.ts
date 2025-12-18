export interface Event {
  id: string;
  name: string;
  description: string | null;
  event_date: string; // DATE stored as ISO string (YYYY-MM-DD)
  event_time: string | null; // TIME stored as HH:MM:SS
  place: string | null;
  is_visible: boolean;
  is_current: boolean;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface EventPlaylist {
  id: string;
  event_id: string;
  playlist_id: string;
  position: number;
  created_at: string;
}

export interface EventWithPlaylistCount extends Event {
  playlist_count: number;
}

export interface EventWithPlaylists extends Event {
  playlists: {
    id: string;
    name: string;
    description: string | null;
    status: string;
    position: number;
  }[];
}

export type CreateEventInput = {
  name: string;
  description?: string | null;
  event_date: string;
  event_time?: string | null;
  place?: string | null;
  is_visible?: boolean;
  is_current?: boolean;
};

export type UpdateEventInput = Partial<CreateEventInput> & {
  is_archived?: boolean;
};

