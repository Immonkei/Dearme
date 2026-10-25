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
  Brain,
  Wind,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Quote,
  Flame,
} from "lucide-react";

interface SinglePageHomeProps {
  entries: JournalEntry[];
}

export function SinglePageHome({ entries }: SinglePageHomeProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [expandedEntryIds, setExpandedEntryIds] = useState<Set<string>>(
    new Set(entries.map((e) => e.id)) // Default: all letters open so readers can read Nithh's mind directly!
  );
  const [activeModalEntry, setActiveModalEntry] = useState<JournalEntry | null>(null);

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

  const toggleExpand = (id: string) => {
    setExpandedEntryIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedEntryIds(new Set(entries.map((e) => e.id)));
  };

  const collapseAll = () => {
    setExpandedEntryIds(new Set());
  };

  // Close modal on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setActiveModalEntry(null);
      }
    }
    if (activeModalEntry) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeModalEntry]);

  return (
    <div className="flex-1 w-full" id="top">
      {/* =========================================================================
          HERO SECTION — A WINDOW INTO MY MIND
          ========================================================================= */}
      <section className="relative overflow-hidden pt-20 sm:pt-28 pb-16 px-4 sm:px-6 text-center max-w-4xl mx-auto">
        {/* Ambient subtle warm gradient wash */}
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
        <p className="text-sm sm:text-base text-journal-muted max-w-xl mx-auto leading-relaxed mb-10 font-journal-sans">
          If you are here, you are stepping directly into my mind. I didn’t build this space to perform or curate an image. When days get crowded and heavy, this is where I slow down to breathe, write honestly, and figure out who I am.
        </p>

        {/* In-page Anchor Nav Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="#headspace"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-white text-journal-text border border-journal-border hover:bg-journal-tag transition-all shadow-xs hover:-translate-y-0.5"
          >
            <Brain className="w-3.5 h-3.5 text-journal-accent" />
            <span>Headspace</span>
          </a>
          <a
            href="#about"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-white text-journal-text border border-journal-border hover:bg-journal-tag transition-all shadow-xs hover:-translate-y-0.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-journal-accent" />
            <span>Why I Write</span>
          </a>
          <a
            href="#letters"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-journal-accent text-white hover:bg-journal-accent-hover transition-all shadow-xs hover:-translate-y-0.5"
          >
            <Feather className="w-3.5 h-3.5" />
            <span>My Letters ({entries.length})</span>
          </a>
          <a
            href="#thoughts"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-white text-journal-text border border-journal-border hover:bg-journal-tag transition-all shadow-xs hover:-translate-y-0.5"
          >
            <Quote className="w-3.5 h-3.5 text-journal-accent" />
            <span>Unfiltered Mind</span>
          </a>
          <a
            href="#rules"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-white text-journal-text border border-journal-border hover:bg-journal-tag transition-all shadow-xs hover:-translate-y-0.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-journal-accent" />
            <span>My Rules</span>
          </a>
        </div>
      </section>

      {/* =========================================================================
          SECTION 1: INSIDE MY HEAD RIGHT NOW (CURRENT HEADSPACE)
          ========================================================================= */}
      <section
        id="headspace"
        className="scroll-mt-20 max-w-4xl mx-auto px-4 sm:px-6 py-14 border-t border-journal-border/80"
      >
        <div className="text-center mb-10">
          <span className="text-xs font-semibold tracking-wider uppercase text-journal-accent mb-2 block">
            Current State
          </span>
          <h2 className="font-journal-serif text-3xl sm:text-4xl font-bold tracking-tight text-journal-text mb-2">
            Inside My Head Right Now
          </h2>
          <p className="text-sm text-journal-muted font-journal-serif italic max-w-md mx-auto">
            A quiet pulse check on what I’m feeling, working through, and holding onto today.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Card 1 */}
          <div className="bg-white border border-journal-border rounded-2xl p-6 shadow-xs relative overflow-hidden group hover:border-journal-accent/40 transition-colors">
            <div className="flex items-center gap-2.5 text-xs font-semibold text-journal-accent uppercase tracking-wider mb-3">
              <Brain className="w-4 h-4 shrink-0" />
              <span>Current State of Mind</span>
            </div>
            <p className="font-journal-serif text-base sm:text-lg text-journal-text leading-relaxed italic">
              &ldquo;Learning to quiet the 2:00 AM overthinking and trust that doing my best today was enough. No panic, no racing.&rdquo;
            </p>
            <div className="mt-4 pt-3 border-t border-journal-border/60 flex items-center justify-between text-[11px] text-journal-muted">
              <span>Mental Climate: Pensive</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-journal-border rounded-2xl p-6 shadow-xs relative overflow-hidden group hover:border-journal-accent/40 transition-colors">
            <div className="flex items-center gap-2.5 text-xs font-semibold text-journal-accent uppercase tracking-wider mb-3">
              <Coffee className="w-4 h-4 shrink-0" />
              <span>Current Daily Ritual</span>
            </div>
            <p className="font-journal-serif text-base sm:text-lg text-journal-text leading-relaxed italic">
              &ldquo;Early morning silence before anyone speaks. Hot coffee, cold air, and zero screens for the first 30 minutes of the day.&rdquo;
            </p>
            <div className="mt-4 pt-3 border-t border-journal-border/60 flex items-center justify-between text-[11px] text-journal-muted">
              <span>Grounding Habit</span>
              <span>Morning Peace</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-journal-border rounded-2xl p-6 shadow-xs relative overflow-hidden group hover:border-journal-accent/40 transition-colors">
            <div className="flex items-center gap-2.5 text-xs font-semibold text-journal-accent uppercase tracking-wider mb-3">
              <Wind className="w-4 h-4 shrink-0" />
              <span>What I’m Letting Go Of</span>
            </div>
            <p className="font-journal-serif text-base sm:text-lg text-journal-text leading-relaxed italic">
              &ldquo;The pressure to have my entire twenties figured out. Closed doors that I tried too hard to keep open.&rdquo;
            </p>
            <div className="mt-4 pt-3 border-t border-journal-border/60 flex items-center justify-between text-[11px] text-journal-muted">
              <span>Release</span>
              <span>Lightening the load</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white border border-journal-border rounded-2xl p-6 shadow-xs relative overflow-hidden group hover:border-journal-accent/40 transition-colors">
            <div className="flex items-center gap-2.5 text-xs font-semibold text-journal-accent uppercase tracking-wider mb-3">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>What I’m Holding Onto</span>
            </div>
            <p className="font-journal-serif text-base sm:text-lg text-journal-text leading-relaxed italic">
              &ldquo;Gentleness with my own mistakes. Friends who love me in my quiet seasons. The person I am becoming.&rdquo;
            </p>
            <div className="mt-4 pt-3 border-t border-journal-border/60 flex items-center justify-between text-[11px] text-journal-muted">
              <span>Anchor</span>
              <span>Dear Me • for me, by me</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: WHY I WRITE — THE REAL ESSAY (ABOUT SECTION)
          ========================================================================= */}
      <section
        id="about"
        className="scroll-mt-20 max-w-3xl mx-auto px-4 sm:px-6 py-14"
      >
        <div className="bg-white border border-journal-border rounded-3xl p-8 sm:p-14 shadow-xs relative overflow-hidden">
          {/* Top bookmark ribbon accent */}
          <div className="absolute top-0 left-10 w-20 h-1.5 bg-journal-accent rounded-b-md" />

          <header className="mb-8">
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-8 mt-8 border-t border-journal-border font-journal-sans text-sm">
            <div className="bg-journal-bg/60 p-4.5 rounded-2xl border border-journal-border/80 space-y-2">
              <div className="w-8 h-8 rounded-full bg-journal-accent-light text-journal-accent flex items-center justify-center mb-1">
                <Heart className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-journal-text text-sm">Honesty Over Polish</h3>
              <p className="text-xs text-journal-muted leading-relaxed">
                No curated personas or fake confidence. Just real words on how life actually feels.
              </p>
            </div>

            <div className="bg-journal-bg/60 p-4.5 rounded-2xl border border-journal-border/80 space-y-2">
              <div className="w-8 h-8 rounded-full bg-journal-accent-light text-journal-accent flex items-center justify-center mb-1">
                <Compass className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-journal-text text-sm">At My Own Pace</h3>
              <p className="text-xs text-journal-muted leading-relaxed">
                No posting schedules or deadlines. Writing only when a moment asks to be remembered.
              </p>
            </div>

            <div className="bg-journal-bg/60 p-4.5 rounded-2xl border border-journal-border/80 space-y-2">
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
          SECTION 3: MY LETTERS — READ DIRECTLY IN THE OPEN (NO MODAL NEEDED)
          ========================================================================= */}
      <section
        id="letters"
        className="scroll-mt-20 max-w-4xl mx-auto px-4 sm:px-6 py-14 border-t border-journal-border/80"
      >
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-journal-border mb-8">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-journal-accent mb-1.5 block">
              Read My Mind
            </span>
            <h2 className="font-journal-serif text-3xl sm:text-4xl font-bold tracking-tight text-journal-text">
              Letters from My Days
            </h2>
            <p className="text-sm text-journal-muted font-journal-serif italic mt-1">
              Read all my letters right here in the open, unedited and honest.
            </p>
          </div>

          {/* Quick controls: Category filter & Expand/Collapse */}
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
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
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

            <div className="hidden sm:flex items-center gap-1 border-l border-journal-border pl-2 ml-1">
              <button
                onClick={expandAll}
                className="text-[11px] font-semibold text-journal-muted hover:text-journal-text px-2 py-1 rounded transition-colors"
                title="Expand all letters"
              >
                Expand all
              </button>
              <span className="text-journal-muted/40">•</span>
              <button
                onClick={collapseAll}
                className="text-[11px] font-semibold text-journal-muted hover:text-journal-text px-2 py-1 rounded transition-colors"
                title="Collapse all letters"
              >
                Collapse all
              </button>
            </div>
          </div>
        </div>

        {/* Letters list — fully readable right in the flow! */}
        <div className="space-y-8">
          {filteredEntries.map((entry) => {
            const isExpanded = expandedEntryIds.has(entry.id);
            const formattedDate = new Date(
              entry.entry_date + "T00:00:00"
            ).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            });

            const wordCount = entry.content.blocks.reduce((acc, b) => {
              return acc + ("text" in b ? b.text.split(/\s+/).length : 0);
            }, 0);
            const readTime = Math.max(1, Math.ceil(wordCount / 180));

            return (
              <article
                key={entry.id}
                className="bg-white border border-journal-border rounded-3xl p-6 sm:p-10 shadow-xs hover:border-journal-accent/40 transition-all duration-200"
              >
                {/* Letter Header */}
                <header className="mb-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-journal-muted mb-3 pb-3 border-b border-journal-border/60">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-journal-accent" />
                      <time dateTime={entry.entry_date} className="tabular-nums font-medium">
                        {formattedDate}
                      </time>
                      <span aria-hidden="true">•</span>
                      <span>Written by Nithh</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      {entry.category && (
                        <span className="font-semibold text-journal-text bg-journal-tag px-2.5 py-0.5 rounded-full text-[11px]">
                          {entry.category}
                        </span>
                      )}
                      <span className="flex items-center gap-1 tabular-nums text-journal-muted text-[11px]">
                        <Clock className="w-3 h-3" />
                        {readTime} min read
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-journal-serif text-2xl sm:text-3xl font-bold text-journal-text leading-snug">
                      {entry.title}
                    </h3>

                    {/* Toggle expand/collapse */}
                    <button
                      onClick={() => toggleExpand(entry.id)}
                      className="p-1.5 rounded-full border border-journal-border text-journal-muted hover:text-journal-text hover:bg-journal-tag transition-colors shrink-0 cursor-pointer"
                      title={isExpanded ? "Collapse letter" : "Read full letter"}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {entry.excerpt && (
                    <p className="text-base sm:text-lg text-journal-muted font-journal-serif italic leading-relaxed pt-3 mt-2 border-t border-journal-border/60">
                      {entry.excerpt}
                    </p>
                  )}
                </header>

                {/* Prose content — open when expanded */}
                {isExpanded ? (
                  <div className="journal-prose pt-4 border-t border-journal-border/80">
                    {entry.content?.blocks?.map((block) => {
                      if (block.type === "heading-2") {
                        return <h4 key={block.id}>{block.text}</h4>;
                      }
                      if (block.type === "heading-3") {
                        return <h5 key={block.id}>{block.text}</h5>;
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
                                  className="w-full object-cover max-h-[500px]"
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

                    {/* Tags */}
                    {entry.tags?.length > 0 && (
                      <div className="mt-8 pt-5 border-t border-journal-border/60 flex flex-wrap items-center gap-2">
                        <Tag className="w-3.5 h-3.5 text-journal-muted shrink-0" />
                        {entry.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs text-journal-muted bg-journal-tag px-2.5 py-0.8 rounded-md"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Sign off */}
                    <div className="mt-8 pt-5 border-t border-journal-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-journal-muted font-journal-serif">
                      <span className="font-semibold text-journal-text">
                        Dear Me • for me, by me
                      </span>
                      <span className="italic">— Written by Nithh</span>
                    </div>
                  </div>
                ) : (
                  <div className="pt-2 flex items-center justify-between">
                    <button
                      onClick={() => toggleExpand(entry.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-journal-accent hover:text-journal-accent-hover transition-colors cursor-pointer"
                    >
                      <span>Read full letter inline</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setActiveModalEntry(entry)}
                      className="text-xs text-journal-muted hover:text-journal-text font-medium"
                    >
                      Focus view
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: UNFILTERED MIND — WHAT I WANT TO SAY TO THE WORLD
          ========================================================================= */}
      <section
        id="thoughts"
        className="scroll-mt-20 max-w-4xl mx-auto px-4 sm:px-6 py-14 border-t border-journal-border/80"
      >
        <div className="text-center mb-12">
          <span className="text-xs font-semibold tracking-wider uppercase text-journal-accent mb-2 block">
            Raw Thoughts
          </span>
          <h2 className="font-journal-serif text-3xl sm:text-4xl font-bold tracking-tight text-journal-text mb-3">
            What I Want to Say to the World
          </h2>
          <p className="text-sm text-journal-muted font-journal-serif italic max-w-lg mx-auto">
            Honest truths about growing up, overthinking, loneliness, and finding peace.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Truth 1 */}
          <div className="bg-white border border-journal-border rounded-2xl p-7 shadow-xs relative space-y-3">
            <span className="text-xs font-semibold tracking-wider uppercase text-journal-accent">
              01 • On Growing Up & Solitude
            </span>
            <p className="font-journal-serif text-base sm:text-lg text-journal-text leading-relaxed">
              &ldquo;Nobody warns you about the quiet grief of outgrowing people, habits, and places you once loved. Growth isn’t always loud victories; sometimes it’s sitting alone on a Friday night realizing you finally prefer peace over company that drains you.&rdquo;
            </p>
            <p className="text-xs text-journal-muted italic font-journal-serif pt-2 border-t border-journal-border/60">
              — Nithh on choosing calm over chaos
            </p>
          </div>

          {/* Truth 2 */}
          <div className="bg-white border border-journal-border rounded-2xl p-7 shadow-xs relative space-y-3">
            <span className="text-xs font-semibold tracking-wider uppercase text-journal-accent">
              02 • On Pacing in Your Twenties
            </span>
            <p className="font-journal-serif text-base sm:text-lg text-journal-text leading-relaxed">
              &ldquo;We treat life like a race where if you haven’t &apos;made it&apos; early, you’ve somehow failed. That’s a lie. Life isn’t a sprint. Some of the most beautiful people I know didn’t find their footing until much later. Stop punishing yourself for taking the scenic route.&rdquo;
            </p>
            <p className="text-xs text-journal-muted italic font-journal-serif pt-2 border-t border-journal-border/60">
              — Nithh on self-compassion
            </p>
          </div>

          {/* Truth 3 */}
          <div className="bg-white border border-journal-border rounded-2xl p-7 shadow-xs relative space-y-3">
            <span className="text-xs font-semibold tracking-wider uppercase text-journal-accent">
              03 • On Burnout & Rest
            </span>
            <p className="font-journal-serif text-base sm:text-lg text-journal-text leading-relaxed">
              &ldquo;Some days, getting out of bed, drinking water, and surviving until evening is a championship victory. Don’t let anyone — especially your own inner critic — convince you that resting is the same as falling behind.&rdquo;
            </p>
            <p className="text-xs text-journal-muted italic font-journal-serif pt-2 border-t border-journal-border/60">
              — Nithh on permitting rest
            </p>
          </div>

          {/* Truth 4 */}
          <div className="bg-white border border-journal-border rounded-2xl p-7 shadow-xs relative space-y-3">
            <span className="text-xs font-semibold tracking-wider uppercase text-journal-accent">
              04 • On Being Misunderstood
            </span>
            <p className="font-journal-serif text-base sm:text-lg text-journal-text leading-relaxed">
              &ldquo;I used to waste so much energy trying to convince people to understand my intentions. Now, I protect my peace. The right people don’t require you to constantly defend your soul.&rdquo;
            </p>
            <p className="text-xs text-journal-muted italic font-journal-serif pt-2 border-t border-journal-border/60">
              — Nithh on boundaries
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: THE RULES I LIVE BY (MY PERSONAL COMPASS)
          ========================================================================= */}
      <section
        id="rules"
        className="scroll-mt-20 max-w-3xl mx-auto px-4 sm:px-6 py-14 border-t border-journal-border/80"
      >
        <div className="bg-white border border-journal-border rounded-3xl p-8 sm:p-12 shadow-xs">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold tracking-wider uppercase text-journal-accent mb-2 block">
              Personal Code
            </span>
            <h2 className="font-journal-serif text-3xl sm:text-4xl font-bold tracking-tight text-journal-text mb-2">
              The Rules I Live By
            </h2>
            <p className="text-sm text-journal-muted font-journal-serif italic">
              Non-negotiable reminders pinned to the mirror of my mind.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4 pb-5 border-b border-journal-border/60">
              <span className="font-journal-serif text-2xl font-bold text-journal-accent shrink-0">
                01
              </span>
              <div>
                <h3 className="font-semibold text-journal-text text-base mb-1 font-journal-sans">
                  Peace Over Proof
                </h3>
                <p className="text-sm text-journal-muted leading-relaxed font-journal-serif">
                  Never trade your internal calm to win an argument or prove a point to someone who has already committed to misunderstanding you.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 pb-5 border-b border-journal-border/60">
              <span className="font-journal-serif text-2xl font-bold text-journal-accent shrink-0">
                02
              </span>
              <div>
                <h3 className="font-semibold text-journal-text text-base mb-1 font-journal-sans">
                  Speak Gently to Yourself
                </h3>
                <p className="text-sm text-journal-muted leading-relaxed font-journal-serif">
                  You are the only person you are stuck with for the rest of your life. Treat yourself with the same gentleness you offer people you love.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 pb-5 border-b border-journal-border/60">
              <span className="font-journal-serif text-2xl font-bold text-journal-accent shrink-0">
                03
              </span>
              <div>
                <h3 className="font-semibold text-journal-text text-base mb-1 font-journal-sans">
                  Quiet Before Chaos
                </h3>
                <p className="text-sm text-journal-muted leading-relaxed font-journal-serif">
                  Protect the first hour of your morning like sacred ground. Don’t let the outside world flood your mind before you have greeted yourself.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="font-journal-serif text-2xl font-bold text-journal-accent shrink-0">
                04
              </span>
              <div>
                <h3 className="font-semibold text-journal-text text-base mb-1 font-journal-sans">
                  Write It Down
                </h3>
                <p className="text-sm text-journal-muted leading-relaxed font-journal-serif">
                  Your memory will blur the edges, but honest ink never forgets how a season truly felt. Write to remember who you were and celebrate how far you’ve come.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-journal-border text-center">
            <p className="text-sm font-journal-serif italic text-journal-text font-semibold">
              Dear Me • for me, by me.
            </p>
            <p className="text-xs text-journal-muted mt-0.5">
              Written with honesty by Nithh.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FOCUSED READING MODAL (OPTIONAL POPUP)
          ========================================================================= */}
      {activeModalEntry && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-journal-text/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setActiveModalEntry(null)}
        >
          <div
            className="bg-journal-bg border border-journal-border rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-12 shadow-2xl relative text-journal-text"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-journal-border">
              <span className="text-xs font-semibold tracking-wider uppercase text-journal-accent">
                {activeModalEntry.category || "Reflection"}
              </span>
              <button
                onClick={() => setActiveModalEntry(null)}
                className="w-9 h-9 rounded-full bg-white border border-journal-border text-journal-muted hover:text-journal-text hover:bg-journal-tag flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                title="Close focus view (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mb-6">
              <h2 className="font-journal-serif text-3xl font-bold text-journal-text mb-3">
                {activeModalEntry.title}
              </h2>
              {activeModalEntry.excerpt && (
                <p className="text-base text-journal-muted font-journal-serif italic">
                  {activeModalEntry.excerpt}
                </p>
              )}
            </div>

            <div className="journal-prose pt-4 border-t border-journal-border">
              {activeModalEntry.content?.blocks?.map((block) => {
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
                    <figure key={block.id} className="my-6">
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

            <div className="mt-8 pt-4 border-t border-journal-border flex items-center justify-between text-xs text-journal-muted font-journal-serif">
              <span>Dear Me • for me, by me</span>
              <span>— Nithh</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
