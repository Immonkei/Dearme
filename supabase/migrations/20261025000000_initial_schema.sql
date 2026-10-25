-- Dear Me: Schema Migration
-- Tagline: Letters to the person I am becoming.

-- 1. Create journal_entries table
CREATE TABLE IF NOT EXISTS public.journal_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content JSONB NOT NULL DEFAULT '{"version": 1, "blocks": []}'::jsonb,
    excerpt TEXT,
    entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
    category TEXT,
    tags TEXT[] NOT NULL DEFAULT '{}'::text[],
    mood TEXT,
    status TEXT NOT NULL DEFAULT 'private' CHECK (status IN ('private', 'published', 'archived')),
    published_at TIMESTAMPTZ,
    cover_image_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Create journal_images table
CREATE TABLE IF NOT EXISTS public.journal_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entry_id UUID NOT NULL REFERENCES public.journal_entries(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    public_path TEXT,
    alt_text TEXT NOT NULL DEFAULT '',
    caption TEXT NOT NULL DEFAULT '',
    position INTEGER NOT NULL DEFAULT 0,
    width INTEGER,
    height INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Add foreign key for cover_image_id
ALTER TABLE public.journal_entries
    DROP CONSTRAINT IF EXISTS fk_journal_entries_cover_image;

ALTER TABLE public.journal_entries
    ADD CONSTRAINT fk_journal_entries_cover_image
    FOREIGN KEY (cover_image_id)
    REFERENCES public.journal_images(id)
    ON DELETE SET NULL;

-- 4. Create Indexes
CREATE INDEX IF NOT EXISTS idx_journal_entries_entry_date ON public.journal_entries (entry_date DESC);
CREATE INDEX IF NOT EXISTS idx_journal_entries_status_published ON public.journal_entries (status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_journal_entries_slug ON public.journal_entries (slug);
CREATE INDEX IF NOT EXISTS idx_journal_entries_created_at ON public.journal_entries (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_journal_images_entry_id ON public.journal_images (entry_id, position ASC);

-- 5. Auto-update updated_at timestamp trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_journal_entries_updated_at ON public.journal_entries;
CREATE TRIGGER set_journal_entries_updated_at
    BEFORE UPDATE ON public.journal_entries
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 6. Row Level Security (RLS)
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_images ENABLE ROW LEVEL SECURITY;

-- Entries Policies:
-- Public can read ONLY published entries
CREATE POLICY "Public can view published entries"
    ON public.journal_entries
    FOR SELECT
    USING (status = 'published');

-- Authenticated owner has full access to all entries
CREATE POLICY "Owner has full access to journal entries"
    ON public.journal_entries
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Images Policies:
-- Public can read images belonging to published entries only
CREATE POLICY "Public can view images for published entries"
    ON public.journal_images
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.journal_entries
            WHERE public.journal_entries.id = journal_images.entry_id
            AND public.journal_entries.status = 'published'
        )
    );

-- Authenticated owner has full access to all images
CREATE POLICY "Owner has full access to journal images"
    ON public.journal_images
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 7. Supabase Storage Setup (Instructions & Policies)
-- Buckets:
-- 1. 'journal-private' (private, default for draft & private entry images)
-- 2. 'journal-public' (public, contains copies created explicitly upon publishing)

INSERT INTO storage.buckets (id, name, public)
VALUES ('journal-private', 'journal-private', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('journal-public', 'journal-public', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS:
-- Private bucket: authenticated owner only
CREATE POLICY "Owner can access private journal storage"
    ON storage.objects
    FOR ALL
    TO authenticated
    USING (bucket_id = 'journal-private')
    WITH CHECK (bucket_id = 'journal-private');

-- Public bucket: anyone can read, owner can manage
CREATE POLICY "Anyone can read public journal storage"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'journal-public');

CREATE POLICY "Owner can manage public journal storage"
    ON storage.objects
    FOR ALL
    TO authenticated
    USING (bucket_id = 'journal-public')
    WITH CHECK (bucket_id = 'journal-public');
