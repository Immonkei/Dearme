"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAuthorizedOwner, createAdminClient } from "@/lib/supabase/server";
import {
  createEntry,
  updateEntry,
  deleteEntry,
  publishEntry,
  unpublishEntry,
  addImageRecord,
  getEntryById,
  ensureUniqueSlug,
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
  const rawSlug = (formData.get("slug") as string)?.trim() || title;
  const entry_date = formData.get("entry_date") as string;
  const category = (formData.get("category") as string)?.trim() || null;
  const mood = (formData.get("mood") as string)?.trim() || null;
  const excerpt = (formData.get("excerpt") as string)?.trim() || null;
  const cover_image_id = (formData.get("cover_image_id") as string)?.trim() || null;
  const tagsRaw = formData.get("tags") as string;
  const contentJson = formData.get("content") as string;

  const slug = await ensureUniqueSlug(rawSlug, id || undefined);

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
    const admin = createAdminClient();

    if (id) {
      // 1. If updating an existing entry, sync any image blocks first
      if (admin) {
        const imageBlocks = validData.content.blocks.filter(
          (b): b is Extract<typeof b, { type: "image" }> => b.type === "image"
        );
        for (let i = 0; i < imageBlocks.length; i++) {
          const imgBlock = imageBlocks[i];
          if (imgBlock.imageId) {
            try {
              await admin.from("journal_images").upsert({
                id: imgBlock.imageId,
                entry_id: id,
                storage_path: imgBlock.storagePath || imgBlock.publicPath || `images/${imgBlock.imageId}.jpg`,
                public_path: imgBlock.publicPath || null,
                alt_text: imgBlock.altText || "",
                caption: imgBlock.caption || "",
                position: i,
              });
            } catch (imgErr) {
              console.warn("Could not upsert image block:", imgErr);
            }
          }
        }
      }

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
      // 2. If creating a new entry, create without cover_image_id first to prevent circular foreign key constraint error
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
        cover_image_id: null,
        content: validData.content,
      });
      savedId = created.id;

      // 3. Link image blocks to the newly created entry id in journal_images
      if (admin && savedId) {
        const imageBlocks = validData.content.blocks.filter(
          (b): b is Extract<typeof b, { type: "image" }> => b.type === "image"
        );
        for (let i = 0; i < imageBlocks.length; i++) {
          const imgBlock = imageBlocks[i];
          if (imgBlock.imageId) {
            try {
              await admin.from("journal_images").upsert({
                id: imgBlock.imageId,
                entry_id: savedId,
                storage_path: imgBlock.storagePath || imgBlock.publicPath || `images/${imgBlock.imageId}.jpg`,
                public_path: imgBlock.publicPath || null,
                alt_text: imgBlock.altText || "",
                caption: imgBlock.caption || "",
                position: i,
              });
            } catch (imgErr) {
              console.warn("Could not link image block:", imgErr);
            }
          }
        }

        // 4. Attach cover_image_id now that the image row exists in journal_images
        if (validData.cover_image_id) {
          try {
            await admin
              .from("journal_entries")
              .update({ cover_image_id: validData.cover_image_id })
              .eq("id", savedId);
          } catch (coverErr) {
            console.warn("Could not update cover_image_id:", coverErr);
          }
        }
      }
    }

    revalidatePath("/journal");
    revalidatePath("/journal/calendar");
    revalidatePath("/journal/timeline");
    if (savedId) {
      revalidatePath(`/journal/entries/${savedId}`);
    }
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

  try {
    await deleteEntry(id);

    revalidatePath("/journal");
    revalidatePath("/journal/calendar");
    revalidatePath("/journal/timeline");
    revalidatePath("/entries");
    revalidatePath("/");

    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to delete entry." };
  }
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

  try {
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const imageId = crypto.randomUUID();
    const filename = `${imageId}.${ext}`;
    const storagePath = `images/${filename}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let publicUrl: string | null = null;
    const admin = createAdminClient();

    if (admin) {
      // 1. Upload to Supabase Storage 'journal-public' bucket
      const { error: uploadErr } = await admin.storage
        .from("journal-public")
        .upload(storagePath, buffer, {
          contentType: file.type || "image/jpeg",
          upsert: true,
        });

      if (uploadErr) {
        console.error("Supabase storage upload error:", uploadErr);
        return { error: `Failed to upload image to storage: ${uploadErr.message}` };
      }

      const { data: urlData } = admin.storage
        .from("journal-public")
        .getPublicUrl(storagePath);

      publicUrl = urlData?.publicUrl || null;
    }

    // Fallback to data URI if storage URL wasn't produced
    if (!publicUrl) {
      publicUrl = `data:${file.type};base64,${buffer.toString("base64")}`;
    }

    // 2. Check if entryId is an existing UUID in journal_entries
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const isValidEntryUuid = Boolean(entryId && uuidRegex.test(entryId));

    if (isValidEntryUuid && admin) {
      try {
        const { data: existingEntry } = await admin
          .from("journal_entries")
          .select("id")
          .eq("id", entryId)
          .maybeSingle();

        if (existingEntry) {
          await admin.from("journal_images").upsert({
            id: imageId,
            entry_id: existingEntry.id,
            storage_path: storagePath,
            public_path: publicUrl,
            alt_text: altText,
            caption: caption,
            position,
          });
        }
      } catch (dbErr) {
        console.warn("Could not record image in journal_images yet:", dbErr);
      }
    }

    return {
      success: true,
      image: {
        id: imageId,
        entry_id: isValidEntryUuid ? entryId : "draft",
        storage_path: storagePath,
        public_path: publicUrl,
        alt_text: altText,
        caption: caption,
        position,
        url: publicUrl,
      },
    };
  } catch (err: any) {
    console.error("Image upload exception:", err);
    return { error: err.message || "Failed to process and upload image." };
  }
}
