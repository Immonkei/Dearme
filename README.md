# Dear Me

> **Letters to the person I am becoming.**  
> *Your life, your memories, your words — you decide what the world gets to see.*

Dear Me is a private, personal daily journal where the owner can record daily experiences, thoughts, memories, lessons, and reflections. The owner can optionally publish selected entries for anyone to read.

---

## ✨ Features

- **Private by Default:** Every new entry begins strictly private. Saving an entry never publishes it automatically.
- **Intentional Publishing:** Publishing requires an explicit owner action. Published entries can be edited or unpublished at any time.
- **Structured Block Editor:** Clean, distraction-free writing experience supporting paragraphs, headings, blockquotes, and inline photographs.
- **Multiple Image Uploads:** Upload up to 10 images per batch (JPEG, PNG, WebP) with client-side EXIF/GPS coordinate stripping, captions, alt text, and reordering.
- **Calendar Archive:** Monthly calendar view navigating by entry journal date with entry indicators and date-specific entry views.
- **Chronological Timeline:** Visual timeline grouping entries by month and year, clearly distinguishing private from published reflections.
- **Search & Filters:** Search by title/content, filter by categories (Daily Life, Memories, Lessons, Thoughts, Letters), tags, and optional mood tracking.
- **Public Journal:** Welcoming public homepage, published entry archive, and read-only entry pages with zero ads, comments, likes, or social counters.
- **Owner Authentication:** Single-owner access control via Supabase Auth with server-side route protection.

---

## 🛠️ Technology Stack

- **Framework:** [Next.js](https://nextjs.org/) App Router (React 19, TypeScript strict mode)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) with custom literary palette (`#FAF7F0`, `#343B33`, `#7C8B72`, `#E4E0D6`, serif typography)
- **Database & Auth:** [Supabase](https://supabase.com/) PostgreSQL + Supabase Auth + Row Level Security (RLS)
- **Storage:** Supabase Storage (`journal-private` & `journal-public` buckets)
- **Validation:** [Zod](https://zod.dev/)
- **Icons:** [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Configure your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OWNER_EMAIL=owner@example.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> **Note:** The application comes with a built-in persistent local store fallback. If Supabase environment variables are left as placeholders, the app runs out-of-the-box in local development mode so you can write, edit, upload, and test immediately without cloud setup.

### 3. Database Setup (Supabase)

Execute the migration in [`supabase/migrations/20261025000000_initial_schema.sql`](supabase/migrations/20261025000000_initial_schema.sql) in your Supabase SQL Editor. This sets up:
- `journal_entries` table with indexes and `updated_at` trigger.
- `journal_images` table with foreign key relations.
- Strict Row Level Security (RLS) policies ensuring unauthenticated users can only query entries where `status = 'published'`.
- Storage buckets (`journal-private` and `journal-public`) with security policies.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the public site, or [http://localhost:3000/login](http://localhost:3000/login) to access the owner workspace.

---

## 🧪 Testing

Run the automated test suite:

```bash
npm test
```

Verifies Zod validation schemas, privacy-by-default rules, image file constraints, and structured content models.

---

## 📦 Production Build

```bash
npm run build
```
