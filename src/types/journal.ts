export type EntryStatus = "private" | "published" | "archived";

export type MoodType =
  | "peaceful"
  | "reflective"
  | "joyful"
  | "melancholy"
  | "grateful"
  | "energetic"
  | "contemplative";

export const DEFAULT_CATEGORIES = [
  "Daily Life",
  "Memories",
  "Lessons",
  "Thoughts",
  "Letters",
] as const;

export type DefaultCategory = (typeof DEFAULT_CATEGORIES)[number];

export type BlockType =
  | "paragraph"
  | "heading-2"
  | "heading-3"
  | "blockquote"
  | "image";

export interface TextBlock {
  id: string;
  type: "paragraph" | "heading-2" | "heading-3" | "blockquote";
  text: string;
}

export interface ImageBlock {
  id: string;
  type: "image";
  imageId: string; // Foreign key to journal_images.id
  caption?: string;
  altText?: string;
  storagePath?: string;
  publicPath?: string;
  previewUrl?: string;
}

export type EditorBlock = TextBlock | ImageBlock;

export interface JournalContent {
  version: number;
  blocks: EditorBlock[];
}

export interface JournalImage {
  id: string;
  entry_id: string;
  storage_path: string;
  public_path: string | null;
  alt_text: string;
  caption: string;
  position: number;
  width?: number | null;
  height?: number | null;
  created_at: string;
  // Computed client-side URLs
  url?: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  slug: string;
  content: JournalContent;
  excerpt: string | null;
  entry_date: string; // YYYY-MM-DD
  category: string | null;
  tags: string[];
  mood: MoodType | string | null;
  status: EntryStatus;
  published_at: string | null;
  cover_image_id: string | null;
  cover_image?: JournalImage | null;
  images?: JournalImage[];
  created_at: string;
  updated_at: string;
}

export interface EntryFilterParams {
  query?: string;
  category?: string;
  tag?: string;
  mood?: string;
  startDate?: string;
  endDate?: string;
  status?: EntryStatus | "all";
  sort?: "date_desc" | "date_asc" | "updated_desc";
}
