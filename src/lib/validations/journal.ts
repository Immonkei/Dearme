import { z } from "zod";

export const BlockSchema = z.discriminatedUnion("type", [
  z.object({
    id: z.string(),
    type: z.enum(["paragraph", "heading-2", "heading-3", "blockquote"]),
    text: z.string(),
  }),
  z.object({
    id: z.string(),
    type: z.literal("image"),
    imageId: z.string().uuid(),
    caption: z.string().max(250).optional(),
    altText: z.string().max(250).optional(),
    storagePath: z.string().optional(),
    publicPath: z.string().optional(),
    previewUrl: z.string().optional(),
  }),
]);

export const JournalContentSchema = z.object({
  version: z.number().default(1),
  blocks: z.array(BlockSchema),
});

export const EntryFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
  entry_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (must be YYYY-MM-DD)"),
  category: z.string().max(50).optional().nullable(),
  tags: z.array(z.string().trim().min(1).max(30)).default([]),
  mood: z.string().max(30).optional().nullable(),
  status: z.enum(["private", "published", "archived"]).default("private"),
  excerpt: z.string().max(500).optional().nullable(),
  cover_image_id: z.string().uuid().optional().nullable(),
  content: JournalContentSchema,
});

export type EntryFormValues = z.infer<typeof EntryFormSchema>;

export const ImageMetadataSchema = z.object({
  alt_text: z.string().max(250).default(""),
  caption: z.string().max(250).default(""),
  position: z.number().int().min(0).default(0),
});

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const MAX_IMAGE_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
export const MAX_BATCH_IMAGES = 10;
