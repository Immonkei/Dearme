import { createClient, createAdminClient, getAuthorizedOwner } from "@/lib/supabase/server";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/config/env";
import {
  JournalEntry,
  JournalImage,
  EntryFilterParams,
  JournalContent,
  HeadspaceData,
  DEFAULT_HEADSPACE,
} from "@/types/journal";
import fs from "fs";
import path from "path";

// Local persistent file for offline/dev testing when Supabase is not configured
const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "journal.json");
const HEADSPACE_FILE = path.join(DATA_DIR, "headspace.json");

/**
 * Get the active database client (prefers admin client with service role for full access)
 */
async function getDbClient() {
  const admin = createAdminClient();
  if (admin) return admin;
  return await createClient();
}

interface LocalStore {
  entries: JournalEntry[];
  images: JournalImage[];
}

function initLocalStore(): LocalStore {
  try {
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
  } catch {
    // Read-only filesystem on serverless environments like Vercel
  }

  const initialEntries: JournalEntry[] = [
    {
      id: "7d8f4321-1234-4567-89ab-cdef01234567",
      title: "Learning to be patient with who I am",
      slug: "learning-to-be-patient-with-who-i-am",
      entry_date: new Date().toISOString().split("T")[0],
      category: "Lessons",
      tags: ["Growth", "Mindset", "Evening"],
      mood: "reflective",
      status: "published",
      published_at: new Date().toISOString(),
      excerpt:
        "I have spent so much time rushing toward some future version of myself that I forgot the person living through today deserves some gentleness too.",
      content: {
        version: 1,
        blocks: [
          {
            id: "b1",
            type: "paragraph",
            text: "I caught myself feeling frustrated this evening because things aren't moving as fast as I planned in my head. I have this stubborn habit of treating my days like a checklist where taking a break feels like falling behind.",
          },
          {
            id: "b2",
            type: "blockquote",
            text: "I don't have to have everything figured out by tonight. Staying alive, trying my best, and being kind to myself is enough for one day.",
          },
          {
            id: "b3",
            type: "paragraph",
            text: "I took a long walk as the sun dipped behind the rooftops. The air was cool and crisp against my face. Looking at the evening sky, I realized: growth isn't a straight line. The version of me from two years ago would be proud of where I am standing right now, even if I still feel unsure most days. I need to remember to breathe.",
          },
        ],
      },
      cover_image_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "8e9f5432-2345-5678-90bc-def012345678",
      title: "A quiet Sunday morning and cold hands",
      slug: "a-quiet-sunday-morning-and-cold-hands",
      entry_date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
      category: "Daily Life",
      tags: ["Morning", "Solitude", "Tea"],
      mood: "peaceful",
      status: "published",
      published_at: new Date(Date.now() - 86400000).toISOString(),
      excerpt: "Made tea before anyone else woke up. Ten unbroken minutes of sitting with my thoughts and listening to the breeze.",
      content: {
        version: 1,
        blocks: [
          {
            id: "p1",
            type: "paragraph",
            text: "Woke up earlier than usual today. The house was completely silent, except for the gentle hum of the refrigerator and the wind rustling dry leaves outside my bedroom window.",
          },
          {
            id: "p2",
            type: "paragraph",
            text: "Poured a hot cup of tea and wrapped both hands around the ceramic mug to warm my fingers. Didn't open my phone. Didn't look at emails. Just watched the morning light slowly stretch across the floorboards.",
          },
          {
            id: "p3",
            type: "paragraph",
            text: "These are the moments I usually rush past. When the upcoming week feels heavy, I want to hold on to this exact feeling: that quietness isn't something I have to earn; it's something I just have to give myself permission to feel.",
          },
        ],
      },
      cover_image_id: null,
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "9fa06543-3456-789a-01cd-ef0123456789",
      title: "Things I wish I could tell my younger self",
      slug: "things-i-wish-i-could-tell-my-younger-self",
      entry_date: new Date(Date.now() - 172800000).toISOString().split("T")[0],
      category: "Letters",
      tags: ["SelfCare", "Memories", "Letters"],
      mood: "grateful",
      status: "published",
      published_at: new Date(Date.now() - 172800000).toISOString(),
      excerpt: "You don't need to perform or pretend to be unbreakable to be worthy of love, and the doors closing on you are just saving you from shrinking.",
      content: {
        version: 1,
        blocks: [
          {
            id: "l1",
            type: "paragraph",
            text: "If I could sit across from myself at eighteen, I wouldn't talk about achievements or plans. I'd just sit there and tell myself to stop apologizing for feeling things so deeply.",
          },
          {
            id: "l2",
            type: "blockquote",
            text: "Not every closed door is a tragedy. Some of them are just saving you from rooms you were never meant to shrink into.",
          },
          {
            id: "l3",
            type: "paragraph",
            text: "You're going to lose friendships you thought were permanent, but you will also meet people who see the real you without demanding you change. You are going to stumble through confusing seasons, but you will always find your footing. Don't be afraid of the quiet days.",
          },
        ],
      },
      cover_image_id: null,
      created_at: new Date(Date.now() - 172800000).toISOString(),
      updated_at: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: "a0b17654-4567-89ab-12de-f01234567890",
      title: "Feeling exhausted, taking it one hour at a time",
      slug: "feeling-exhausted-one-hour-at-a-time",
      entry_date: new Date(Date.now() - 259200000).toISOString().split("T")[0],
      category: "Thoughts",
      tags: ["Burnout", "Night", "Honesty"],
      mood: "melancholy",
      status: "published",
      published_at: new Date(Date.now() - 259200000).toISOString(),
      excerpt: "Too many demands today. My brain feels like a crowded room. Reminding myself to step back and close the laptop.",
      content: {
        version: 1,
        blocks: [
          {
            id: "e1",
            type: "paragraph",
            text: "Too many open tabs in my mind today. Everyone wanted an answer right away, and by late afternoon my chest felt tight and hollowed out.",
          },
          {
            id: "e2",
            type: "paragraph",
            text: "Instead of staying up trying to force productivity or scroll through other people's lives to numb out, I closed everything. Took a hot shower. Wrote this down so the thoughts stop bouncing around in my head.",
          },
          {
            id: "e3",
            type: "paragraph",
            text: "Tomorrow is another day. I am allowed to rest without justifying it.",
          },
        ],
      },
      cover_image_id: null,
      created_at: new Date(Date.now() - 259200000).toISOString(),
      updated_at: new Date(Date.now() - 259200000).toISOString(),
    },
  ];

  const store: LocalStore = {
    entries: initialEntries,
    images: [],
  };

  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), "utf-8");
  } catch {
    // Read-only filesystem on serverless environments
  }
  return store;
}

function readLocalStore(): LocalStore {
  return initLocalStore();
}

function writeLocalStore(store: LocalStore) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), "utf-8");
  } catch {
    // Read-only filesystem on serverless environments
  }
}

function isSupabaseConfigured(): boolean {
  return Boolean(
    SUPABASE_URL &&
    !SUPABASE_URL.includes("placeholder") &&
    SUPABASE_ANON_KEY &&
    !SUPABASE_ANON_KEY.includes("placeholder")
  );
}

/**
 * Ensures a unique, URL-safe slug that never collides with existing entries
 * or violates PostgreSQL UNIQUE constraints.
 */
export async function ensureUniqueSlug(
  baseSlug: string,
  excludeId?: string
): Promise<string> {
  let clean = baseSlug
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!clean || clean === "site-headspace") {
    clean = `letter-${Date.now().toString(36)}`;
  }

  let candidate = clean;
  let counter = 1;

  if (isSupabaseConfigured()) {
    try {
      const supabase = await getDbClient();
      while (true) {
        let query = supabase
          .from("journal_entries")
          .select("id")
          .eq("slug", candidate);

        if (excludeId) {
          query = query.neq("id", excludeId);
        }

        const { data, error } = await query.maybeSingle();
        if (error || !data) {
          return candidate;
        }

        counter++;
        candidate = `${clean}-${counter}`;
      }
    } catch {
      // Fall through to local check
    }
  }

  const store = readLocalStore();
  while (true) {
    const exists = store.entries.some(
      (e) => e.slug === candidate && (!excludeId || e.id !== excludeId)
    );
    if (!exists) {
      return candidate;
    }
    counter++;
    candidate = `${clean}-${counter}`;
  }
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
      const supabase = await getDbClient();
      let query = supabase
        .from("journal_entries")
        .select("*, images:journal_images!journal_images_entry_id_fkey(*)")
        .neq("slug", "site-headspace");

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
  let entries = store.entries.filter((e) => e.slug !== "site-headspace");

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
      const supabase = await getDbClient();
      const { data, error } = await supabase
        .from("journal_entries")
        .select("*, images:journal_images!journal_images_entry_id_fkey(*)")
        .eq("id", id)
        .maybeSingle();

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
  if (slug === "site-headspace") return null;

  if (isSupabaseConfigured()) {
    try {
      const supabase = await getDbClient();
      const { data, error } = await supabase
        .from("journal_entries")
        .select("*, images:journal_images!journal_images_entry_id_fkey(*)")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();

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
      const supabase = await getDbClient();
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

      if (error) {
        console.error("Supabase createEntry error:", error);
        throw new Error(error.message);
      }

      if (inserted) {
        return inserted as JournalEntry;
      }
    } catch (err) {
      console.error("Supabase createEntry failed:", err);
      throw err;
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
      const supabase = await getDbClient();
      const { data, error } = await supabase
        .from("journal_entries")
        .update({
          ...updates,
          updated_at: now,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Supabase updateEntry error:", error);
        throw new Error(error.message);
      }

      if (data) {
        return data as JournalEntry;
      }
    } catch (err) {
      console.error("Supabase updateEntry failed:", err);
      throw err;
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
      const supabase = await getDbClient();
      const { error } = await supabase
        .from("journal_entries")
        .delete()
        .eq("id", id);
      if (error) {
        console.error("Supabase deleteEntry error:", error);
        throw new Error(error.message);
      }
      return true;
    } catch (err) {
      console.error("Supabase deleteEntry failed:", err);
      throw err;
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
      const supabase = await getDbClient();
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

/**
 * Headspace Functions: Dynamic personal headspace for the owner
 */
export async function getHeadspace(): Promise<HeadspaceData> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("journal_entries")
        .select("content, updated_at")
        .eq("slug", "site-headspace")
        .maybeSingle();

      if (
        !error &&
        data?.content &&
        typeof data.content === "object" &&
        "headspace" in data.content
      ) {
        const hs = (data.content as Record<string, unknown>)
          .headspace as HeadspaceData;
        return {
          stateOfMind: hs.stateOfMind || DEFAULT_HEADSPACE.stateOfMind,
          dailyRitual: hs.dailyRitual || DEFAULT_HEADSPACE.dailyRitual,
          lettingGoOf: hs.lettingGoOf || DEFAULT_HEADSPACE.lettingGoOf,
          holdingOnto: hs.holdingOnto || DEFAULT_HEADSPACE.holdingOnto,
          updatedAt: data.updated_at,
        };
      }
    } catch (err) {
      console.warn("Error reading headspace from Supabase:", err);
    }
  }

  // Local fallback
  try {
    if (fs.existsSync(HEADSPACE_FILE)) {
      const raw = fs.readFileSync(HEADSPACE_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      return {
        stateOfMind: parsed.stateOfMind || DEFAULT_HEADSPACE.stateOfMind,
        dailyRitual: parsed.dailyRitual || DEFAULT_HEADSPACE.dailyRitual,
        lettingGoOf: parsed.lettingGoOf || DEFAULT_HEADSPACE.lettingGoOf,
        holdingOnto: parsed.holdingOnto || DEFAULT_HEADSPACE.holdingOnto,
        updatedAt: parsed.updatedAt,
      };
    }
  } catch (err) {
    console.warn("Error reading local headspace fallback:", err);
  }

  return DEFAULT_HEADSPACE;
}

export async function saveHeadspace(
  data: HeadspaceData
): Promise<{ error?: string }> {
  const sanitized: HeadspaceData = {
    stateOfMind: data.stateOfMind?.trim() || DEFAULT_HEADSPACE.stateOfMind,
    dailyRitual: data.dailyRitual?.trim() || DEFAULT_HEADSPACE.dailyRitual,
    lettingGoOf: data.lettingGoOf?.trim() || DEFAULT_HEADSPACE.lettingGoOf,
    holdingOnto: data.holdingOnto?.trim() || DEFAULT_HEADSPACE.holdingOnto,
    updatedAt: new Date().toISOString(),
  };

  // Always write to local file for persistence
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(
      HEADSPACE_FILE,
      JSON.stringify(sanitized, null, 2),
      "utf-8"
    );
  } catch (err) {
    console.warn("Could not write local headspace file:", err);
  }

  // Write to Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      const supabase = await getDbClient();
      const payload = {
        title: "Current Headspace",
        slug: "site-headspace",
        category: "System",
        status: "published",
        content: {
          version: 1,
          headspace: sanitized,
        },
      };

      const { error } = await supabase
        .from("journal_entries")
        .upsert(payload, { onConflict: "slug" });

      if (error) {
        console.error("Supabase error saving headspace:", error);
        return { error: error.message };
      }
    } catch (err: unknown) {
      console.error("Failed to save headspace to Supabase:", err);
      const message =
        err instanceof Error ? err.message : "Failed to save to database";
      return { error: message };
    }
  }

  return {};
}
