export interface Photo {
  id: string;
  image_url: string;
  caption: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export type PhotoInput = Omit<Photo, 'id' | 'created_at' | 'updated_at'>;

export interface PhotoUpload {
  file: File;
  caption?: string;
}
