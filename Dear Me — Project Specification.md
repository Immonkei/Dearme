# Dear Me — Project Specification

**Tagline:** Letters to the person I am becoming.

## 1. Project Overview

Dear Me is a private, personal daily journal website where the owner can record daily experiences, thoughts, memories, lessons, and reflections. The owner can optionally publish selected entries for anyone to read.

The product should feel like a personal journal, not a social network or a conventional blogging platform.

### Core principle

> Your life, your memories, your words — you decide what the world gets to see.

### Product goals

- Make writing daily journal entries easy and comfortable.
- Keep every new entry private by default.
- Allow the owner to publish selected entries intentionally.
- Support multiple images within a single entry.
- Provide calendar, timeline, and search experiences.
- Protect private writing, photographs, and personal information.
- Let visitors read published entries without creating accounts.

## 2. Target Users

### Journal owner

The single authorized owner can create, read, edit, delete, organize, and publish journal entries.

### Public visitors

Anyone can read entries that the owner has explicitly published. Visitors cannot create entries, access private content, comment, or interact socially.

Public registration is not required.

## 3. Technology Stack

- **Frontend:** Next.js App Router, React, TypeScript with strict mode
- **Styling:** Tailwind CSS
- **Database:** Supabase PostgreSQL
- **Authentication:** Supabase Auth
- **Image storage:** Supabase Storage
- **Validation:** Zod
- **Content editor:** Structured rich-text editor or sanitized Markdown
- **Deployment:** Vercel
- **Version control:** Git and GitHub

Use compatible, stable versions when implementation begins. Keep secrets in server-side environment variables and never expose Supabase service-role keys to the browser.

## 4. Core Features

### 4.1 Private journal workspace

The journal workspace is the owner's personal space and requires authentication.

Features:

- Create a journal entry.
- Edit and delete an entry.
- Save entries privately.
- Write daily experiences, thoughts, memories, and lessons.
- Set the date associated with an entry.
- Add a title, content, tags, category, and optional mood.
- View recent and older entries.
- See whether an entry is private or published.
- Preview an entry before publishing.

**Privacy rule:** Every new entry must be private by default. Saving an entry must never publish it automatically.

Provide separate actions for **Save privately** and **Publish**. Publishing requires an explicit action. The owner can unpublish an entry later.

### 4.2 Multiple image uploads per entry

Multiple images are a required MVP feature.

The owner can upload zero, one, or many images to a single journal entry.

Requirements:

- Select and upload multiple images in one operation.
- Support an initial batch of up to 10 images, with additional batches allowed.
- Recommended maximum file size: 5 MB per image.
- Accept JPEG, PNG, and WebP initially.
- Reject SVG and unsupported file types.
- Validate file contents, not only filename extensions or browser-supplied MIME types.
- Show upload progress, success states, and individual failure messages.
- Allow the owner to remove, replace, reorder, and caption individual images.
- Support meaningful alternative text for accessibility.
- Allow images to appear between paragraphs, not only as a cover image.
- Preserve the order and placement of images in the entry.
- Optionally select a cover image for archive cards and social previews.
- Preserve image aspect ratios and optimize images for responsive display.

Image placement must be represented in the editor's structured content, so images appear in the intended position when an entry is reopened or published.

**Privacy requirements for images:**

- Store original uploads in a private Supabase Storage bucket.
- Never expose private draft images through permanent public URLs.
- Create public-ready image copies only through an authorized publishing workflow.
- Strip EXIF metadata, especially GPS coordinates, before public sharing.
- Clean up orphaned files when uploads or entry deletion operations fail.
- When an entry is unpublished, ensure its public assets are no longer accessible through the application's public access controls.
- Avoid long-lived signed URLs for private content.

### 4.3 Calendar

Provide a monthly calendar view for browsing the owner's journal history.

Features:

- Navigate between months and years.
- Indicate dates that contain entries.
- Select a date to view its entries.
- Jump to today's date.
- Display the number of entries for a selected date when useful.

The calendar must use the entry's journal date, rather than relying exclusively on its creation timestamp.

### 4.4 Personal timeline

Provide a chronological view of journal entries.

Features:

- Sort entries by journal date.
- Group entries by day, month, or year.
- Display title, short preview, date, optional mood, and cover image.
- Quickly open an entry for viewing or editing.
- Clearly distinguish private entries from published ones.

### 4.5 Search and organization

The owner can search and filter their private journal.

Requirements:

- Search entry titles and content.
- Filter by date range.
- Filter by category or tag.
- Optionally filter by mood.
- Sort entries by journal date or most recently updated.

Suggested categories include Daily Life, Memories, Lessons, Thoughts, and Letters. The owner should be able to add their own tags.

### 4.6 Optional mood tracking

Allow the owner to select an optional mood for an entry.

Keep this lightweight and private. Mood tracking is a supporting feature, not a medical or mental-health assessment.

### 4.7 Public journal

The public site displays only entries the owner has explicitly published.

Public features:

- A welcoming homepage.
- A public archive of published entries.
- Individual published entry pages.
- Responsive image galleries and inline images.
- Entry dates, titles, and optional categories.
- Pagination or load-more behavior for larger archives.
- An About page that introduces the journal without revealing unnecessary personal details.

Public visitors do not need accounts.

Do not include comments, likes, follower counts, messaging, public submissions, or social feeds in the MVP.

### 4.8 Publishing workflow

Each entry follows this basic workflow:

1. Create an entry.
2. Save it privately.
3. Add or edit text and images.
4. Preview the entry.
5. Publish only when ready.
6. Edit or unpublish it later if needed.

Public pages, search indexes, metadata, and image access must respect the entry's current publication state. Draft content must never appear in public archives, search results, sitemaps, metadata, or cached public responses.

## 5. Pages and Routes

### Public routes

- `/` — Public journal homepage
- `/entries` — Published entries archive
- `/entries/[slug]` — Individual published entry
- `/about` — About Dear Me
- `/login` — Owner sign-in

### Private routes

- `/journal` — Private dashboard and recent entries
- `/journal/new` — Create an entry
- `/journal/entries/[id]` — View or edit a private entry
- `/journal/calendar` — Calendar view
- `/journal/timeline` — Chronological timeline
- `/journal/search` — Search and filter entries
- `/journal/settings` — Owner preferences

All private routes and mutations must verify authorization on the server. Hiding links or protecting pages only in the browser is insufficient.

## 6. Database Design

Use migrations to manage the schema. Suggested tables follow.

### `journal_entries`

- `id` — UUID primary key
- `title` — Text
- `slug` — Unique text slug for published URLs
- `content` — Structured editor content, preferably JSONB when using a block editor
- `excerpt` — Optional short summary
- `entry_date` — Date the journal entry belongs to
- `category` — Optional category
- `tags` — Text array or a normalized tag relationship
- `mood` — Optional text value
- `status` — `private`, `published`, or `archived`
- `published_at` — Nullable timestamp
- `created_at` — Timestamp
- `updated_at` — Timestamp

New records must default to `private`. Use an explicit publication timestamp and validate publication transitions on the server.

### `journal_images`

- `id` — UUID primary key
- `entry_id` — Foreign key referencing `journal_entries`
- `storage_path` — Private original image path
- `public_path` — Nullable path for a public-ready image
- `alt_text` — Alternative text
- `caption` — Optional caption
- `position` — Ordering value
- `created_at` — Timestamp

The structured editor content should reference image IDs to preserve their exact position among text blocks. The image table's position field can be used for gallery ordering.

If an entry has a cover image, store its image ID on the entry or use a consistent cover-image relationship. Validate that the selected cover belongs to the same entry.

### Database requirements

- Add indexes for entry date, status, publication date, and image foreign keys.
- Enforce unique slugs.
- Use foreign-key constraints and appropriate deletion behavior.
- Use Row Level Security (RLS) policies.
- Public queries must return only published entries and their permitted image metadata.
- Private entries and original image paths must remain inaccessible to anonymous visitors.

## 7. Authentication and Security

This is a single-owner application, not a multi-user journaling platform.

Requirements:

- Use Supabase Auth for owner sign-in.
- Disable public sign-up.
- Restrict access to an explicitly authorized owner account.
- Verify the authenticated owner on every protected server action or route handler.
- Apply RLS to database tables and appropriate policies to Storage.
- Never rely on an obscure URL as an access-control mechanism.
- Validate all input on the server using Zod.
- Sanitize rich text or render Markdown through a safe renderer.
- Do not permit unsafe raw HTML by default.
- Never expose service-role keys or other secrets in client-side code.
- Protect against unauthorized file access, IDOR vulnerabilities, and malicious uploads.
- Avoid leaking private content through logs, error messages, source maps, caches, or metadata.

Test both authenticated and unauthenticated access, including direct requests to private entry IDs and storage paths.

## 8. Privacy and Public Identity

Dear Me should allow the owner to maintain a pseudonymous public identity.

Requirements:

- Do not require the owner's real name on public pages.
- Avoid publishing personal contact information or identifying details by default.
- Strip image location metadata before publication.
- Keep drafts and private images out of public URLs and search indexes.
- Use privacy-conscious analytics, or omit analytics from the MVP.
- Include a clear distinction between private and public content in the owner interface.

Pseudonymity can protect the author's identity from ordinary readers, but it cannot guarantee anonymity from hosting providers, infrastructure operators, or other parties with legitimate access to system records.

## 9. SEO and Performance

- Generate metadata and Open Graph tags for published entries only.
- Include published pages in the sitemap.
- Exclude private entries and drafts from public indexing.
- Use canonical URLs for public entries.
- Optimize images and load below-the-fold images lazily.
- Preserve image dimensions to reduce layout shifts.
- Revalidate or invalidate public caches after publishing, editing, or unpublishing.
- Ensure cached responses never reveal a private version of an entry.
- Use pagination for large archives.

## 10. Design System

### Visual direction

The design should feel calm, reflective, intimate, and literary.

Suggested colors:

- Background: `#FAF7F0`
- Surface: `#FFFFFF`
- Primary text: `#343B33`
- Secondary text: `#73766C`
- Accent: `#7C8B72`
- Border: `#E4E0D6`

Use serif typography for titles and long-form writing, paired with a clean sans-serif font for navigation and controls.

### User experience

- Generous whitespace and comfortable reading widths.
- Minimal decoration.
- Clear typography and date presentation.
- A distraction-free writing experience.
- Gentle, unobtrusive transitions.
- Responsive layouts for desktop, tablet, and mobile.
- Accessible forms, buttons, focus states, and keyboard navigation.
- A clear visual distinction between private and published entries.

Aim for WCAG 2.2 AA accessibility.

## 11. MVP Scope

### Must have

- Owner authentication
- Private journal dashboard
- Create, edit, and delete entries
- Private-by-default saving
- Explicit publishing and unpublishing
- Multiple image uploads per entry
- Inline image placement, captions, alt text, and ordering
- Secure private and public image access
- Public archive and published entry pages
- Calendar and chronological timeline
- Basic search and tags
- Responsive design
- Server-side authorization, RLS, and Storage policies

### Can come later

- Advanced mood statistics
- Rich writing analytics
- Export to Markdown, JSON, or PDF
- Full-text search enhancements
- Scheduled publishing
- Custom themes
- Encrypted export or backup workflows
- Additional organization and writing tools

Do not add social features or multiple-author support unless the product direction changes deliberately.

## 12. Development Phases

**Phase 1 — Foundation**
- Create the Next.js project.
- Configure TypeScript, Tailwind CSS, and environment variables.
- Set up Supabase.
- Create database migrations and security policies.
- Implement owner authentication.

**Phase 2 — Private journal**
- Build the dashboard and entry editor.
- Implement private saving, editing, and deletion.
- Add entry dates, categories, and tags.

**Phase 3 — Image system**
- Implement multi-image uploads.
- Add inline placement, captions, ordering, and alt text.
- Add file validation, progress indicators, and failure handling.
- Configure private storage and the controlled publishing workflow for public images.

**Phase 4 — Journal navigation**
- Build the calendar.
- Build the timeline.
- Add search and filters.

**Phase 5 — Public publishing**
- Build the public homepage and archive.
- Implement public entry pages.
- Add preview, publish, and unpublish flows.
- Verify public cache invalidation and metadata handling.

**Phase 6 — Quality and deployment**
- Test authorization and RLS.
- Test upload limits, invalid files, and partial upload failures.
- Test private-content isolation and unpublishing.
- Check accessibility, mobile layouts, SEO, and performance.
- Deploy to Vercel and verify production environment settings.

## 13. Acceptance Criteria

The MVP is ready when:

1. An unauthenticated visitor cannot access private entries or private images.
2. New entries are always private by default.
3. Publishing requires an explicit owner action.
4. The owner can add multiple images to one entry and place them among text blocks.
5. Images retain their order, captions, and alternative text.
6. Invalid uploads are rejected safely, and failed uploads can be retried.
7. Public visitors can read published entries without signing in.
8. Unpublished entries disappear from public listings and cannot be accessed through the application's public content and image routes.
9. The calendar and timeline reflect the entry's journal date.
10. Search and filtering return only entries available to the owner.
11. Database and Storage policies prevent unauthorized access independently of the UI.
12. The site works on mobile and desktop and meets the agreed accessibility and performance targets.

## 14. Instructions for the AI Coding Agent

Build Dear Me incrementally, using this specification as the source of truth.

Before implementing each phase:

1. Inspect the existing repository and report the current architecture.
2. Identify what already works and what needs to be changed.
3. Propose a small, testable implementation plan.
4. Preserve working features unless a change is necessary.
5. Implement one phase at a time.
6. Add migrations, validation, authorization, and tests alongside features.
7. Run linting, type checking, and relevant tests.
8. Report changed files, commands executed, results, and remaining work.

Do not fabricate test results or claim deployment success without verification. Do not expose secrets or bypass security policies to make a feature work.

**Final product direction:** Dear Me is a private daily journal with an intentional, optional public publishing experience. Privacy is the default; sharing is always the owner's choice.