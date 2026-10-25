import { createClient, getAuthorizedOwner } from "@/lib/supabase/server";
import {
  JournalEntry,
  JournalImage,
  EntryFilterParams,
  JournalContent,
} from "@/types/journal";
import fs from "fs";
import path from "path";

// Local persistent file for offline/dev testing when Supabase is not configured
const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "journal.json");

interface LocalStore {
  entries: JournalEntry[];
  images: JournalImage[];
}

function initLocalStore(): LocalStore {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (fs.existsSync(DATA_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
      return data;
    } catch {
      // Fallback to initial seeds
    }
  }

  const initialEntries: JournalEntry[] = [
    {
      id: "7d8f4321-1234-4567-89ab-cdef01234567",
      title: "First Steps into Dear Me",
      slug: "first-steps-into-dear-me",
      entry_date: new Date().toISOString().split("T")[0],
      category: "Letters",
      tags: ["Beginnings", "Reflections"],
      mood: "reflective",
      status: "published",
      published_at: new Date().toISOString(),
      excerpt:
        "Every story deserves a sanctuary. Here begins the quiet place for memories, lessons, and the slow art of becoming.",
      content: {
        version: 1,
        blocks: [
          {
            id: "b1",
            type: "paragraph",
            text: "Today I began Dear Me. For a long time, I wanted a quiet room on the web — not a stage for applause, not a gallery curated for the gaze of strangers, but a real journal.",
          },
          {
            id: "b2",
            type: "blockquote",
            text: "Your life, your memories, your words — you decide what the world gets to see.",
          },
          {
            id: "b3",
            type: "paragraph",
            text: "Most of what I record here will stay quiet and private. But whenever a lesson feels tender enough to share, or a memory asks for the open sky, I will turn the lock and let it into the light.",
          },
        ],
      },
      cover_image_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "8e9f5432-2345-5678-90bc-def012345678",
      title: "Morning Rain and Warm Coffee",
      slug: "morning-rain-and-warm-coffee",
      entry_date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
      category: "Daily Life",
      tags: ["Morning", "Peace"],
      mood: "peaceful",
      status: "private",
      published_at: null,
      excerpt: "The sound of rain against the window pane and the steam rising from the ceramic mug.",
      content: {
        version: 1,
        blocks: [
          {
            id: "p1",
            type: "paragraph",
            text: "Woke up to the gentle patter of rain against the roof. The air carries that deep, earthy scent of wet soil and cold morning.",
          },
          {
            id: "p2",
            type: "paragraph",
            text: "Poured a dark roast coffee and sat by the windowsill. No rush, no urgent notifications, just ten unbroken minutes of breathing in the dawn.",
          },
        ],
      },
      cover_image_id: null,
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date(Date.now() - 86400000).toISOString(),
    },
  ];

  const store: LocalStore = {
    entries: initialEntries,
    images: [],
  };

  fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), "utf-8");
  return store;
}

function readLocalStore(): LocalStore {
  return initLocalStore();
}

function writeLocalStore(store: LocalStore) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), "utf-8");
}

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return Boolean(url && !url.includes("placeholder"));
}

/**
 * Journal Repository: handles data fetching with full Supabase PostgreSQL support,
 * with resilient local persistence fallback for development.
 */
export async function getEntries(
  params: EntryFilterParams = {},
  isPublicOnly: boolean = false
): Promise<JournalEntry[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      let query = supabase.from("journal_entries").select("*, images:journal_images(*)");

      if (isPublicOnly) {
        query = query.eq("status", "published");
      } else if (params.status && params.status !== "all") {
        query = query.eq("status", params.status);
      }

      if (params.category) {
        query = query.eq("category", params.category);
      }

      if (params.mood) {
        query = query.eq("mood", params.mood);
      }

      if (params.startDate) {
        query = query.gte("entry_date", params.startDate);
      }

      if (params.endDate) {
        query = query.lte("entry_date", params.endDate);
      }

      if (params.tag) {
        query = query.contains("tags", [params.tag]);
      }

      if (params.query) {
        query = query.or(`title.ilike.%${params.query}%,excerpt.ilike.%${params.query}%`);
      }

      if (params.sort === "date_asc") {
        query = query.order("entry_date", { ascending: true });
      } else if (params.sort === "updated_desc") {
        query = query.order("updated_at", { ascending: false });
      } else {
        query = query.order("entry_date", { ascending: false });
      }

      const { data, error } = await query;
      if (!error && data) {
        return data as JournalEntry[];
      }
    } catch (err) {
      console.warn("Supabase query error, using local fallback:", err);
    }
  }

  // Local fallback
  const store = readLocalStore();
  let entries = [...store.entries];

  if (isPublicOnly) {
    entries = entries.filter((e) => e.status === "published");
  } else if (params.status && params.status !== "all") {
    entries = entries.filter((e) => e.status === params.status);
  }

  if (params.category) {
    entries = entries.filter((e) => e.category === params.category);
  }

  if (params.mood) {
    entries = entries.filter((e) => e.mood === params.mood);
  }

  if (params.tag) {
    entries = entries.filter((e) => e.tags.includes(params.tag!));
  }

  if (params.startDate) {
    entries = entries.filter((e) => e.entry_date >= params.startDate!);
  }

  if (params.endDate) {
    entries = entries.filter((e) => e.entry_date <= params.endDate!);
  }

  if (params.query) {
    const q = params.query.toLowerCase();
    entries = entries.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        (e.excerpt && e.excerpt.toLowerCase().includes(q)) ||
        e.content.blocks.some(
          (b) => "text" in b && b.text.toLowerCase().includes(q)
        )
    );
  }

  // Sorting
  if (params.sort === "date_asc") {
    entries.sort((a, b) => a.entry_date.localeCompare(b.entry_date));
  } else if (params.sort === "updated_desc") {
    entries.sort((a, b) => b.updated_at.localeCompare(a.updated_at));
  } else {
    entries.sort((a, b) => b.entry_date.localeCompare(a.entry_date));
  }

  // Attach images
  return entries.map((entry) => {
    const images = store.images.filter((img) => img.entry_id === entry.id);
    return {
      ...entry,
      images,
      cover_image: images.find((img) => img.id === entry.cover_image_id) || null,
    };
  });
}

export async function getEntryById(id: string): Promise<JournalEntry | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("journal_entries")
        .select("*, images:journal_images(*)")
        .eq("id", id)
        .single();

      if (!error && data) {
        return data as JournalEntry;
      }
    } catch (err) {
      console.warn("Supabase getEntryById failed:", err);
    }
  }

  const store = readLocalStore();
  const entry = store.entries.find((e) => e.id === id);
  if (!entry) return null;

  const images = store.images.filter((img) => img.entry_id === entry.id);
  return {
    ...entry,
    images,
    cover_image: images.find((img) => img.id === entry.cover_image_id) || null,
  };
}

export async function getEntryBySlug(slug: string): Promise<JournalEntry | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("journal_entries")
        .select("*, images:journal_images(*)")
        .eq("slug", slug)
        .eq("status", "published")
        .single();

      if (!error && data) {
        return data as JournalEntry;
      }
    } catch (err) {
      console.warn("Supabase getEntryBySlug failed:", err);
    }
  }

  const store = readLocalStore();
  const entry = store.entries.find(
    (e) => e.slug === slug && e.status === "published"
  );
  if (!entry) return null;

  const images = store.images.filter((img) => img.entry_id === entry.id);
  return {
    ...entry,
    images,
    cover_image: images.find((img) => img.id === entry.cover_image_id) || null,
  };
}

export async function createEntry(
  data: Omit<JournalEntry, "id" | "created_at" | "updated_at">
): Promise<JournalEntry> {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  const newEntry: JournalEntry = {
    ...data,
    id,
    created_at: now,
    updated_at: now,
  };

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data: inserted, error } = await supabase
        .from("journal_entries")
        .insert({
          id: newEntry.id,
          title: newEntry.title,
          slug: newEntry.slug,
          content: newEntry.content,
          excerpt: newEntry.excerpt,
          entry_date: newEntry.entry_date,
          category: newEntry.category,
          tags: newEntry.tags,
          mood: newEntry.mood,
          status: newEntry.status,
          published_at: newEntry.published_at,
          cover_image_id: newEntry.cover_image_id,
        })
        .select()
        .single();

      if (!error && inserted) {
        return inserted as JournalEntry;
      }
    } catch (err) {
      console.warn("Supabase createEntry failed:", err);
    }
  }

  const store = readLocalStore();
  store.entries.unshift(newEntry);
  writeLocalStore(store);
  return newEntry;
}

export async function updateEntry(
  id: string,
  updates: Partial<JournalEntry>
): Promise<JournalEntry | null> {
  const now = new Date().toISOString();

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("journal_entries")
        .update({
          ...updates,
          updated_at: now,
        })
        .eq("id", id)
        .select()
        .single();

      if (!error && data) {
        return data as JournalEntry;
      }
    } catch (err) {
      console.warn("Supabase updateEntry failed:", err);
    }
  }

  const store = readLocalStore();
  const index = store.entries.findIndex((e) => e.id === id);
  if (index === -1) return null;

  store.entries[index] = {
    ...store.entries[index],
    ...updates,
    updated_at: now,
  };

  writeLocalStore(store);
  return store.entries[index];
}

export async function deleteEntry(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { error } = await supabase
        .from("journal_entries")
        .delete()
        .eq("id", id);
      if (!error) return true;
    } catch (err) {
      console.warn("Supabase deleteEntry failed:", err);
    }
  }

  const store = readLocalStore();
  store.entries = store.entries.filter((e) => e.id !== id);
  store.images = store.images.filter((img) => img.entry_id !== id);
  writeLocalStore(store);
  return true;
}

export async function publishEntry(id: string): Promise<JournalEntry | null> {
  const now = new Date().toISOString();
  return await updateEntry(id, {
    status: "published",
    published_at: now,
  });
}

export async function unpublishEntry(id: string): Promise<JournalEntry | null> {
  return await updateEntry(id, {
    status: "private",
    published_at: null,
  });
}

export async function addImageRecord(
  image: Omit<JournalImage, "id" | "created_at">
): Promise<JournalImage> {
  const id = crypto.randomUUID();
  const newImage: JournalImage = {
    ...image,
    id,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("journal_images")
        .insert(newImage)
        .select()
        .single();

      if (!error && data) {
        return data as JournalImage;
      }
    } catch (err) {
      console.warn("Supabase addImageRecord failed:", err);
    }
  }

  const store = readLocalStore();
  store.images.push(newImage);
  writeLocalStore(store);
  return newImage;
}

export async function getCalendarDates(): Promise<Record<string, number>> {
  const entries = await getEntries({}, false);
  const counts: Record<string, number> = {};

  for (const entry of entries) {
    const date = entry.entry_date;
    counts[date] = (counts[date] || 0) + 1;
  }

  return counts;
}
