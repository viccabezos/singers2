import { supabase } from "./supabase";
import type { Song, SongCreateInput, SongUpdateInput, SongFilters } from "../types/song";

export async function getSongs(filters?: SongFilters): Promise<Song[]> {
  let query = supabase
    .from("songs")
    .select("*")
    .order("created_at", { ascending: false });

  if (filters) {
    if (filters.is_archived !== undefined) {
      query = query.eq("is_archived", filters.is_archived);
    } else {
      // Default to non-archived songs
      query = query.eq("is_archived", false);
    }

    if (filters.title) {
      query = query.ilike("title", `%${filters.title}%`);
    }

    if (filters.artist_composer) {
      query = query.ilike("artist_composer", `%${filters.artist_composer}%`);
    }

    if (filters.language) {
      query = query.eq("language", filters.language);
    }

    if (filters.is_visible !== undefined) {
      query = query.eq("is_visible", filters.is_visible);
    }
  } else {
    // Default to non-archived songs
    query = query.eq("is_archived", false);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch songs: ${error.message}`);
  }

  return data || [];
}

export async function getSongById(id: string): Promise<Song | null> {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/1428a01a-6442-49ba-805c-35fb10fcf189',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'songs.ts:47',message:'getSongById entry',data:{id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
  // #endregion
  
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("id", id)
    .single();

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/1428a01a-6442-49ba-805c-35fb10fcf189',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'songs.ts:52',message:'getSongById query result',data:{hasError:!!error,errorCode:error?.code,hasData:!!data,dataId:data?.id,dataVisible:data?.is_visible,dataArchived:data?.is_archived},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
  // #endregion

  if (error) {
    if (error.code === "PGRST116") {
      return null; // Not found
    }
    throw new Error(`Failed to fetch song: ${error.message}`);
  }

  return data;
}

export async function getVisibleSongById(id: string): Promise<Song | null> {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/1428a01a-6442-49ba-805c-35fb10fcf189',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'songs.ts:64',message:'getVisibleSongById entry',data:{id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
  // #endregion
  
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("id", id)
    .eq("is_visible", true)
    .eq("is_archived", false)
    .single();

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/1428a01a-6442-49ba-805c-35fb10fcf189',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'songs.ts:72',message:'getVisibleSongById query result',data:{hasError:!!error,errorCode:error?.code,errorMessage:error?.message,hasData:!!data,dataId:data?.id,dataVisible:data?.is_visible,dataArchived:data?.is_archived},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
  // #endregion

  if (error) {
    if (error.code === "PGRST116") {
      return null; // Not found
    }
    throw new Error(`Failed to fetch song: ${error.message}`);
  }

  return data;
}

export async function getVisibleSongs(searchQuery?: string): Promise<Song[]> {
  let query = supabase
    .from("songs")
    .select("*")
    .eq("is_visible", true)
    .eq("is_archived", false)
    .order("title", { ascending: true });

  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch songs: ${error.message}`);
  }

  return data || [];
}

export async function createSong(input: SongCreateInput): Promise<Song> {
  const { data, error } = await supabase
    .from("songs")
    .insert({
      title: input.title,
      lyrics: input.lyrics,
      artist_composer: input.artist_composer || null,
      language: input.language || null,
      genre: input.genre || null,
      year: input.year || null,
      is_visible: input.is_visible ?? true,
      is_archived: false,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create song: ${error.message}`);
  }

  return data;
}

export async function updateSong(id: string, input: SongUpdateInput): Promise<Song> {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/1428a01a-6442-49ba-805c-35fb10fcf189',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'songs.ts:106',message:'updateSong entry',data:{id,input},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion
  
  const { data, error } = await supabase
    .from("songs")
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/1428a01a-6442-49ba-805c-35fb10fcf189',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'songs.ts:115',message:'updateSong query result',data:{hasError:!!error,errorCode:error?.code,errorMessage:error?.message,hasData:!!data,dataId:data?.id,dataVisible:data?.is_visible,dataArchived:data?.is_archived},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion

  if (error) {
    throw new Error(`Failed to update song: ${error.message}`);
  }

  return data;
}

export async function duplicateSong(id: string): Promise<Song> {
  const original = await getSongById(id);
  if (!original) {
    throw new Error("Song not found");
  }

  return createSong({
    title: `${original.title} (Copy)`,
    lyrics: original.lyrics,
    artist_composer: original.artist_composer,
    language: original.language,
    genre: original.genre,
    year: original.year,
    is_visible: false, // Hidden by default
  });
}

export async function archiveSong(id: string): Promise<void> {
  const { error } = await supabase
    .from("songs")
    .update({ is_archived: true })
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to archive song: ${error.message}`);
  }
}

export async function restoreSong(id: string): Promise<void> {
  const { error } = await supabase
    .from("songs")
    .update({ is_archived: false })
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to restore song: ${error.message}`);
  }
}

export async function deleteSong(id: string): Promise<void> {
  const { error } = await supabase
    .from("songs")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to delete song: ${error.message}`);
  }
}

export async function bulkUpdateVisibility(
  ids: string[],
  is_visible: boolean
): Promise<void> {
  const { error } = await supabase
    .from("songs")
    .update({ is_visible })
    .in("id", ids);

  if (error) {
    throw new Error(`Failed to update visibility: ${error.message}`);
  }
}

export async function bulkDuplicateSongs(ids: string[]): Promise<Song[]> {
  const duplicated: Song[] = [];
  
  for (const id of ids) {
    const song = await duplicateSong(id);
    duplicated.push(song);
  }
  
  return duplicated;
}

export async function getDistinctLanguages(): Promise<string[]> {
  const { data, error } = await supabase
    .from("songs")
    .select("language")
    .not("language", "is", null)
    .eq("is_archived", false);

  if (error) {
    throw new Error(`Failed to fetch languages: ${error.message}`);
  }

  const uniqueLanguages = Array.from(
    new Set(data.map((song) => song.language).filter(Boolean))
  ) as string[];
  return uniqueLanguages.sort();
}

export async function getSongsCount(filters?: { is_archived?: boolean; is_visible?: boolean }): Promise<number> {
  let query = supabase
    .from("songs")
    .select("*", { count: "exact", head: true });

  if (filters?.is_archived !== undefined) {
    query = query.eq("is_archived", filters.is_archived);
  } else {
    query = query.eq("is_archived", false);
  }

  if (filters?.is_visible !== undefined) {
    query = query.eq("is_visible", filters.is_visible);
  }

  const { count, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch songs count: ${error.message}`);
  }

  return count || 0;
}

export async function getRecentlyUpdatedSongs(limit: number = 5): Promise<Song[]> {
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("is_archived", false)
    .order("updated_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch recently updated songs: ${error.message}`);
  }

  return data || [];
}

