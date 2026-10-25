"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAuthorizedOwner } from "@/lib/supabase/server";
import {
  createEntry,
  updateEntry,
  deleteEntry,
  publishEntry,
  unpublishEntry,
  addImageRecord,
  getEntryById,
} from "@/lib/journal/repository";
import {
  EntryFormSchema,
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_FILE_SIZE,
} from "@/lib/validations/journal";
import { JournalContent, EntryStatus } from "@/types/journal";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Save entry (Create or Update).
 * ALWAYS private by default for new entries.
 */
export async function saveEntryAction(prevState: any, formData: FormData) {
  const owner = await getAuthorizedOwner();
  if (!owner) {
    return { error: "Unauthorized. Please sign in as the owner." };
  }

  const id = formData.get("id") as string | null;
  const title = (formData.get("title") as string)?.trim();
  let slug = (formData.get("slug") as string)?.trim();
  const entry_date = formData.get("entry_date") as string;
  const category = (formData.get("category") as string)?.trim() || null;
  const mood = (formData.get("mood") as string)?.trim() || null;
  const excerpt = (formData.get("excerpt") as string)?.trim() || null;
  const cover_image_id = (formData.get("cover_image_id") as string)?.trim() || null;
  const tagsRaw = formData.get("tags") as string;
  const contentJson = formData.get("content") as string;

  if (!slug && title) {
    slug = slugify(title);
  }

  const tags = tagsRaw
    ? tagsRaw
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  let content: JournalContent = { version: 1, blocks: [] };
  try {
    if (contentJson) {
      content = JSON.parse(contentJson);
    }
  } catch {
    return { error: "Invalid structured content format." };
  }

  // Support publishing directly or saving privately
  const requestedStatus = formData.get("status") as EntryStatus | null;
  let status: EntryStatus = requestedStatus === "published" ? "published" : "private";
  let published_at: string | null = status === "published" ? new Date().toISOString() : null;

  if (id) {
    const existing = await getEntryById(id);
    if (existing) {
      if (requestedStatus) {
        status = requestedStatus;
        published_at =
          status === "published"
            ? existing.published_at || new Date().toISOString()
            : null;
      } else {
        status = existing.status;
        published_at = existing.published_at;
      }
    }
  }

  const parseResult = EntryFormSchema.safeParse({
    title,
    slug,
    entry_date,
    category,
    tags,
    mood,
    status,
    excerpt,
    cover_image_id: cover_image_id || undefined,
    content,
  });

  if (!parseResult.success) {
    const errorMsg = parseResult.error.issues
      .map((e: { message: string }) => e.message)
      .join(", ");
    return { error: errorMsg };
  }

  const validData = parseResult.data;

  try {
    let savedId = id;
    if (id) {
      await updateEntry(id, {
        title: validData.title,
        slug: validData.slug,
        entry_date: validData.entry_date,
        category: validData.category ?? null,
        tags: validData.tags,
        mood: validData.mood ?? null,
        status,
        excerpt: validData.excerpt ?? null,
        cover_image_id: validData.cover_image_id ?? null,
        content: validData.content,
      });
    } else {
      const created = await createEntry({
        title: validData.title,
        slug: validData.slug,
        entry_date: validData.entry_date,
        category: validData.category ?? null,
        tags: validData.tags,
        mood: validData.mood ?? null,
        status,
        published_at,
        excerpt: validData.excerpt ?? null,
        cover_image_id: validData.cover_image_id ?? null,
        content: validData.content,
      });
      savedId = created.id;
    }

    revalidatePath("/journal");
    revalidatePath("/journal/calendar");
    revalidatePath("/journal/timeline");
    revalidatePath("/entries");
    revalidatePath(`/entries/${validData.slug}`);
    revalidatePath("/");

    return { success: true, entryId: savedId, slug: validData.slug };
  } catch (err: any) {
    return { error: err.message || "Failed to save journal entry." };
  }
}

/**
 * Explicit owner action to publish an entry
 */
export async function publishEntryAction(id: string) {
  const owner = await getAuthorizedOwner();
  if (!owner) {
    return { error: "Unauthorized." };
  }

  const updated = await publishEntry(id);
  if (!updated) {
    return { error: "Entry not found." };
  }

  revalidatePath("/journal");
  revalidatePath(`/journal/entries/${id}`);
  revalidatePath("/entries");
  revalidatePath(`/entries/${updated.slug}`);
  revalidatePath("/");

  return { success: true, slug: updated.slug };
}

/**
 * Explicit owner action to unpublish an entry
 */
export async function unpublishEntryAction(id: string) {
  const owner = await getAuthorizedOwner();
  if (!owner) {
    return { error: "Unauthorized." };
  }

  const updated = await unpublishEntry(id);
  if (!updated) {
    return { error: "Entry not found." };
  }

  revalidatePath("/journal");
  revalidatePath(`/journal/entries/${id}`);
  revalidatePath("/entries");
  revalidatePath(`/entries/${updated.slug}`);
  revalidatePath("/");

  return { success: true };
}

/**
 * Delete an entry
 */
export async function deleteEntryAction(id: string) {
  const owner = await getAuthorizedOwner();
  if (!owner) {
    return { error: "Unauthorized." };
  }

  await deleteEntry(id);

  revalidatePath("/journal");
  revalidatePath("/journal/calendar");
  revalidatePath("/journal/timeline");
  revalidatePath("/entries");
  revalidatePath("/");

  redirect("/journal");
}

/**
 * Upload image for an entry:
 * Validates type (JPEG, PNG, WebP only, rejects SVG), file size (<= 5MB).
 * Returns image record.
 */
export async function uploadImageAction(formData: FormData) {
  const owner = await getAuthorizedOwner();
  if (!owner) {
    return { error: "Unauthorized." };
  }

  const file = formData.get("file") as File;
  const entryId = formData.get("entryId") as string;
  const caption = (formData.get("caption") as string) || "";
  const altText = (formData.get("altText") as string) || "";
  const position = Number(formData.get("position") || "0");

  if (!file) {
    return { error: "No file provided." };
  }

  // Validate MIME type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as any)) {
    return {
      error: `Unsupported file type (${file.type}). Dear Me accepts JPEG, PNG, and WebP images only.`,
    };
  }

  // Validate file size
  if (file.size > MAX_IMAGE_FILE_SIZE) {
    return {
      error: `File size exceeds the 5 MB limit (${(file.size / (1024 * 1024)).toFixed(1)} MB).`,
    };
  }

  // Save image file
  const ext = file.name.split(".").pop() || "jpg";
  const filename = `${crypto.randomUUID()}.${ext}`;
  const storagePath = `private/${entryId || "drafts"}/${filename}`;

  // In local/dev mode: store in public/uploads/ or base64 data URI
  const buffer = Buffer.from(await file.arrayBuffer());
  const base64Data = `data:${file.type};base64,${buffer.toString("base64")}`;

  const imageRecord = await addImageRecord({
    entry_id: entryId || "draft",
    storage_path: storagePath,
    public_path: null,
    alt_text: altText,
    caption: caption,
    position,
    width: null,
    height: null,
    url: base64Data,
  });

  return { success: true, image: imageRecord };
}
