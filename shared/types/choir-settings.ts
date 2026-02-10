export interface ChoirSettings {
  id: number;
  tagline: string | null;
  about_text: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  youtube_url: string | null;
  contact_email: string | null;
  created_at: string;
  updated_at: string;
}

export type ChoirSettingsInput = Omit<ChoirSettings, 'id' | 'created_at' | 'updated_at'>;
