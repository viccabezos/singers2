export type Song = {
  id: string;
  title: string;
  lyrics: string;
  artist_composer: string | null;
  language: string | null;
  genre: string | null;
  year: number | null;
  is_visible: boolean;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
};

export type SongCreateInput = {
  title: string;
  lyrics: string;
  artist_composer?: string | null;
  language?: string | null;
  genre?: string | null;
  year?: number | null;
  is_visible?: boolean;
};

export type SongUpdateInput = Partial<SongCreateInput>;

export type SongFilters = {
  title?: string;
  artist_composer?: string;
  language?: string;
  is_visible?: boolean;
  is_archived?: boolean;
};

