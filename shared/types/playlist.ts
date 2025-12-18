export type PlaylistStatus = "visible" | "hidden" | "in_progress" | "archived";

export interface Playlist {
  id: string;
  name: string;
  description: string | null;
  status: PlaylistStatus;
  created_at: string;
  updated_at: string;
}

export interface PlaylistWithSongCount extends Playlist {
  song_count: number;
}

export interface PlaylistSong {
  id: string;
  playlist_id: string;
  song_id: string;
  position: number;
  created_at: string;
}

export interface PlaylistCreateInput {
  name: string;
  description?: string | null;
  status?: PlaylistStatus;
}

export interface PlaylistUpdateInput {
  name?: string;
  description?: string | null;
  status?: PlaylistStatus;
}

export interface PlaylistFilters {
  name?: string;
  status?: PlaylistStatus | PlaylistStatus[];
  is_archived?: boolean;
}

