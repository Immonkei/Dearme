"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { JournalEntry } from "@/types/journal";
import {
  Calendar,
  Clock,
  ArrowRight,
  Heart,
  Compass,
  BookOpen,
  X,
  Tag,
  Feather,
  Sparkles,
  Coffee,
  ExternalLink,
} from "lucide-react";

interface SinglePageHomeProps {
  entries: JournalEntry[];
}

export function SinglePageHome({ entries }: SinglePageHomeProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeEntry, setActiveEntry] = useState<JournalEntry | null>(null);

  // Extract unique categories
  const categories = [
    "All",
    ...Array.from(
      new Set(entries.map((e) => e.category).filter(Boolean))
    ) as string[],
  ];

  const filteredEntries =
    selectedCategory === "All"
      ? entries
      : entries.filter((e) => e.category === selectedCategory);

  // Close modal on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setActiveEntry(null);
      }
    }
    if (activeEntry) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeEntry]);

  return (
    <div className="flex-1 w-full" id="top">
      {/* =========================================================================
          HERO SECTION
          ========================================================================= */}
      <section className="relative overflow-hidden pt-20 sm:pt-28 pb-16 px-4 sm:px-6 text-center max-w-4xl mx-auto">
        {/* Ambient subtle warm gradient glow */}
        <div
          aria-hidden="true"
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-journal-accent/5 rounded-full blur-3xl pointer-events-none"
        />

        {/* Identity Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium text-journal-accent bg-journal-accent-light mb-8 border border-journal-accent/20 shadow-xs">
          <Feather className="w-3.5 h-3.5" />
          <span>Dear Me</span>
          <span className="text-journal-muted/40 font-normal">•</span>
          <span className="italic font-journal-serif">for me, by me</span>
          <span className="text-journal-muted/40 font-normal">•</span>
          <span className="font-semibold text-journal-text">Nithh</span>
        </div>

        {/* Hero Title */}
        <h1 className="font-journal-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-journal-text leading-[1.12] mb-6 text-balance">
          Letters to the person I am becoming.
        </h1>

        {/* Poetic quote */}
        <p className="text-lg sm:text-2xl text-journal-muted max-w-2xl mx-auto leading-relaxed mb-6 font-journal-serif italic">
          &ldquo;Your life, your memories, your words — you decide what the world gets to see.&rdquo;
        </p>

        {/* Raw personal statement */}
        <p className="text-sm sm:text-base text-journal-muted/90 max-w-xl mx-auto leading-relaxed mb-10 font-journal-sans">
          I write not to perform for an audience, but to see myself clearly. When days get loud, fast, and heavy, this is where I slow down to breathe, write honestly, and figure out who I am.
        </p>

        {/* Action jump buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="#letters"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold bg-journal-accent text-white hover:bg-journal-accent-hover transition-all duration-200 shadow-xs hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Read My Letters</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#about"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold bg-white text-journal-text border border-journal-border hover:bg-journal-tag transition-all duration-200 shadow-xs hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Why I Write</span>
          </a>
        </div>
      </section>

      {/* =========================================================================
          WHY I WRITE — THE REAL ESSAY (ABOUT SECTION)
          ========================================================================= */}
      <section
        id="about"
        className="scroll-mt-20 max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20"
      >
        <div className="bg-white border border-journal-border rounded-3xl p-8 sm:p-14 shadow-xs relative overflow-hidden">
          {/* Subtle top bookmark accent line */}
          <div className="absolute top-0 left-12 w-20 h-1.5 bg-journal-accent rounded-b-md" />

          <header className="mb-10 text-center sm:text-left">
            <span className="text-xs font-semibold tracking-wider uppercase text-journal-accent mb-2 block">
              A Personal Note
            </span>
            <h2 className="font-journal-serif text-3xl sm:text-4xl font-bold tracking-tight text-journal-text mb-3">
              Why I Keep This Space
            </h2>
            <p className="font-journal-serif text-lg text-journal-muted italic">
              A quiet room with no applause, no algorithms, and no rush.
            </p>
          </header>

          <div className="space-y-6 font-journal-serif text-base sm:text-lg text-journal-text/90 leading-relaxed">
            <p>
              I’m Nithh. For a long time, I lived with a restless mind — replaying conversations, worrying about where I’ll be in five years, and secretly feeling like I was the only person in the room without a clear script for life.
            </p>

            <blockquote className="border-l-3 border-journal-accent pl-5 my-6 italic text-journal-muted text-lg sm:text-xl font-journal-serif bg-journal-bg/50 py-3 rounded-r-xl">
              &ldquo;I didn’t need likes, advice, or opinions from strangers. I just wanted a blank sheet of paper where I could sit with myself at midnight and say: &apos;Hey. It’s okay. You are doing the best you can.&apos;&rdquo;
            </blockquote>

            <p>
              Social media constantly pushes you to package your life into a highlight reel. But life isn’t lived in highlights. It’s lived in cold mornings with hot coffee, quiet evenings when exhaustion sets in, and confusing seasons where taking things one hour at a time is a triumph.
            </p>

            <p>
              That’s why <strong>Dear Me</strong> exists. It is for me, by me. Nearly everything I write stays locked inside my private journal — raw doubts, prayers, and messy reflections. But whenever a realization brings genuine peace to my chest, I leave it here out in the open, hoping it might help someone else feel a little less alone.
            </p>
          </div>

          {/* 3 Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-10 mt-10 border-t border-journal-border font-journal-sans text-sm">
            <div className="bg-journal-bg/60 p-5 rounded-2xl border border-journal-border/80 space-y-2">
              <div className="w-8 h-8 rounded-full bg-journal-accent-light text-journal-accent flex items-center justify-center mb-1">
                <Heart className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-journal-text text-sm">Honesty Over Polish</h3>
              <p className="text-xs text-journal-muted leading-relaxed">
                No curated personas or fake confidence. Just real words on how life actually feels.
              </p>
            </div>

            <div className="bg-journal-bg/60 p-5 rounded-2xl border border-journal-border/80 space-y-2">
              <div className="w-8 h-8 rounded-full bg-journal-accent-light text-journal-accent flex items-center justify-center mb-1">
                <Compass className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-journal-text text-sm">At My Own Pace</h3>
              <p className="text-xs text-journal-muted leading-relaxed">
                No posting schedules or deadlines. Writing only when a moment asks to be remembered.
              </p>
            </div>

            <div className="bg-journal-bg/60 p-5 rounded-2xl border border-journal-border/80 space-y-2">
              <div className="w-8 h-8 rounded-full bg-journal-accent-light text-journal-accent flex items-center justify-center mb-1">
                <BookOpen className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-journal-text text-sm">Letters to Tomorrow</h3>
              <p className="text-xs text-journal-muted leading-relaxed">
                Remembering where I was, so I never take how far I have come for granted.
              </p>
            </div>
          </div>

          {/* Signature */}
          <div className="pt-8 mt-8 border-t border-journal-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
            <span className="italic font-journal-serif text-journal-muted">
              Dear Me — for me, by me.
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-journal-muted font-journal-sans">Written with love,</span>
              <span className="font-journal-serif font-bold text-journal-text text-lg">
                — Nithh
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          LETTERS SECTION (THE PUBLIC LETTERS)
          ========================================================================= */}
      <section
        id="letters"
        className="scroll-mt-20 max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20"
      >
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-journal-border mb-8">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-journal-accent mb-1.5 block">
              Public Reflections
            </span>
            <h2 className="font-journal-serif text-3xl sm:text-4xl font-bold tracking-tight text-journal-text">
              Letters from My Days
            </h2>
            <p className="text-sm text-journal-muted font-journal-serif italic mt-1">
              Words I felt tender and grounded enough to leave out in the open.
            </p>
          </div>

          {/* Interactive Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              const count =
                cat === "All"
                  ? entries.length
                  : entries.filter((e) => e.category === cat).length;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-journal-text text-white shadow-xs"
                      : "bg-white text-journal-muted border border-journal-border hover:text-journal-text hover:bg-journal-tag"
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-journal-tag text-journal-muted"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Entry List */}
        {filteredEntries.length === 0 ? (
          <div className="bg-white border border-journal-border rounded-2xl p-14 text-center text-sm text-journal-muted italic font-journal-serif">
            I haven&apos;t shared any public letters in this category yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredEntries.map((entry) => {
              const formattedDate = new Date(
                entry.entry_date + "T00:00:00"
              ).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });

              const preview =
                entry.excerpt ||
                entry.content.blocks.find((b) => "text" in b)?.text ||
                "";

              const wordCount = entry.content.blocks.reduce((acc, b) => {
                return acc + ("text" in b ? b.text.split(/\s+/).length : 0);
              }, 0);
              const readTime = Math.max(1, Math.ceil(wordCount / 180));

              return (
                <article
                  key={entry.id}
                  onClick={() => setActiveEntry(entry)}
                  className="bg-white border border-journal-border rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-md hover:border-journal-accent/40 transition-all duration-200 flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    {/* Meta row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-journal-muted mb-4 pb-3 border-b border-journal-border/60">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-journal-accent" />
                        <time dateTime={entry.entry_date} className="tabular-nums">
                          {formattedDate}
                        </time>
                      </div>

                      <div className="flex items-center gap-2">
                        {entry.category && (
                          <span className="font-medium text-journal-text bg-journal-tag px-2.5 py-0.5 rounded-full text-[11px]">
                            {entry.category}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-[11px] tabular-nums text-journal-muted">
                          <Clock className="w-3 h-3" />
                          {readTime}m
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-journal-serif text-xl sm:text-2xl font-bold text-journal-text group-hover:text-journal-accent transition-colors mb-3 leading-snug">
                      {entry.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-xs sm:text-sm text-journal-muted line-clamp-3 leading-relaxed font-journal-sans mb-6">
                      {preview}
                    </p>
                  </div>

                  {/* Read button & permalink */}
                  <div className="pt-4 border-t border-journal-border/60 flex items-center justify-between text-xs font-semibold text-journal-accent">
                    <span className="inline-flex items-center gap-1.5 group-hover:text-journal-accent-hover transition-colors">
                      <span>Read letter</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </span>

                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/entries/${entry.slug}`;
                      }}
                      className="text-journal-muted hover:text-journal-text p-1 transition-colors"
                      title="Open dedicated page"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* =========================================================================
          MOMENTS & NOTES (AESTHETIC POLAROID VIGNETTES)
          ========================================================================= */}
      <section
        id="moments"
        className="scroll-mt-20 max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20 border-t border-journal-border/80"
      >
        <div className="text-center mb-12">
          <span className="text-xs font-semibold tracking-wider uppercase text-journal-accent mb-2 block">
            Daily Reminders
          </span>
          <h2 className="font-journal-serif text-3xl sm:text-4xl font-bold tracking-tight text-journal-text mb-3">
            Quiet Notes to Myself
          </h2>
          <p className="text-sm text-journal-muted font-journal-serif italic max-w-md mx-auto">
            Small truths I pin to the wall when the world starts feeling like too much.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Note 1 */}
          <div className="bg-white border border-journal-border rounded-2xl p-6 shadow-xs relative transform hover:-rotate-1 transition-transform duration-200">
            <div className="w-3 h-3 rounded-full bg-amber-400/80 mb-4 mx-auto" />
            <p className="font-journal-serif italic text-journal-text text-base leading-relaxed text-center mb-6">
              &ldquo;Cold hands, hot coffee, and zero rush. Not every morning has to be productive to be meaningful.&rdquo;
            </p>
            <div className="text-center text-[11px] text-journal-muted font-journal-sans uppercase tracking-wider">
              Note 01 • Morning Peace
            </div>
          </div>

          {/* Note 2 */}
          <div className="bg-white border border-journal-border rounded-2xl p-6 shadow-xs relative transform hover:rotate-1 transition-transform duration-200">
            <div className="w-3 h-3 rounded-full bg-emerald-500/80 mb-4 mx-auto" />
            <p className="font-journal-serif italic text-journal-text text-base leading-relaxed text-center mb-6">
              &ldquo;Breathe. You don’t have to carry tomorrow’s burdens today. Today has enough of its own.&rdquo;
            </p>
            <div className="text-center text-[11px] text-journal-muted font-journal-sans uppercase tracking-wider">
              Note 02 • One Hour at a Time
            </div>
          </div>

          {/* Note 3 */}
          <div className="bg-white border border-journal-border rounded-2xl p-6 shadow-xs relative transform hover:-rotate-1 transition-transform duration-200">
            <div className="w-3 h-3 rounded-full bg-rose-400/80 mb-4 mx-auto" />
            <p className="font-journal-serif italic text-journal-text text-base leading-relaxed text-center mb-6">
              &ldquo;The doors that closed on you were just keeping you from shrinking into rooms you outgrew.&rdquo;
            </p>
            <div className="text-center text-[11px] text-journal-muted font-journal-sans uppercase tracking-wider">
              Note 03 • Moving Forward
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          INLINE READING MODAL (STAY ON ONE PAGE)
          ========================================================================= */}
      {activeEntry && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-journal-text/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setActiveEntry(null)}
        >
          <div
            className="bg-journal-bg border border-journal-border rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-12 shadow-2xl relative text-journal-text"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close button */}
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-journal-border">
              <span className="text-xs font-semibold tracking-wider uppercase text-journal-accent">
                Letter • {activeEntry.category || "Reflection"}
              </span>
              <button
                onClick={() => setActiveEntry(null)}
                className="w-9 h-9 rounded-full bg-white border border-journal-border text-journal-muted hover:text-journal-text hover:bg-journal-tag flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                title="Close letter (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Header */}
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-2.5 text-xs text-journal-muted mb-3">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-journal-accent" />
                  <time dateTime={activeEntry.entry_date} className="tabular-nums">
                    {new Date(activeEntry.entry_date + "T00:00:00").toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
                  </time>
                </div>
                <span>•</span>
                <span>Written by Nithh</span>
              </div>

              <h2 className="font-journal-serif text-3xl sm:text-4xl font-bold text-journal-text leading-tight mb-4">
                {activeEntry.title}
              </h2>

              {activeEntry.excerpt && (
                <p className="text-base sm:text-lg text-journal-muted font-journal-serif italic leading-relaxed pt-3 border-t border-journal-border/80">
                  {activeEntry.excerpt}
                </p>
              )}
            </div>

            {/* Prose Content */}
            <div className="journal-prose pt-6 border-t border-journal-border">
              {activeEntry.content?.blocks?.map((block) => {
                if (block.type === "heading-2") {
                  return <h3 key={block.id}>{block.text}</h3>;
                }
                if (block.type === "heading-3") {
                  return <h4 key={block.id}>{block.text}</h4>;
                }
                if (block.type === "blockquote") {
                  return <blockquote key={block.id}>{block.text}</blockquote>;
                }
                if (block.type === "image") {
                  const imageUrl =
                    block.publicPath || block.previewUrl || block.storagePath;
                  return (
                    <figure key={block.id} className="my-8">
                      {imageUrl && (
                        <div className="overflow-hidden rounded-2xl border border-journal-border bg-white shadow-xs">
                          <img
                            src={imageUrl}
                            alt={block.altText || "Journal photograph"}
                            className="w-full object-cover max-h-[450px]"
                            loading="lazy"
                          />
                        </div>
                      )}
                      {block.caption && (
                        <figcaption className="text-center text-xs text-journal-muted mt-2 font-journal-sans italic">
                          {block.caption}
                        </figcaption>
                      )}
                    </figure>
                  );
                }
                return <p key={block.id}>{block.text}</p>;
              })}
            </div>

            {/* Tags */}
            {activeEntry.tags?.length > 0 && (
              <div className="mt-10 pt-6 border-t border-journal-border flex flex-wrap items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-journal-muted shrink-0" />
                {activeEntry.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-journal-muted bg-journal-tag px-2.5 py-1 rounded-md"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Sign off inside letter */}
            <div className="mt-10 pt-6 border-t border-journal-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-journal-muted font-journal-serif">
              <span className="font-semibold text-journal-text">
                Dear Me • for me, by me
              </span>
              <span className="italic">— Nithh</span>
            </div>

            {/* Bottom Close */}
            <div className="mt-8 text-center">
              <button
                onClick={() => setActiveEntry(null)}
                className="px-6 py-2.5 rounded-full text-xs font-semibold bg-white border border-journal-border text-journal-text hover:bg-journal-tag transition-colors cursor-pointer"
              >
                Close letter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
