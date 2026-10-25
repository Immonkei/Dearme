"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  JournalEntry,
  EditorBlock,
  JournalContent,
  MoodType,
  DEFAULT_CATEGORIES,
} from "@/types/journal";
import {
  saveEntryAction,
  publishEntryAction,
  unpublishEntryAction,
  deleteEntryAction,
  uploadImageAction,
} from "@/actions/journal";
import { processAndStripExif } from "@/lib/utils/image";
import {
  Save,
  Globe,
  Lock,
  Trash2,
  Image as ImageIcon,
  Heading,
  Quote,
  AlignLeft,
  ArrowUp,
  ArrowDown,
  X,
  Eye,
  Edit3,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Leaf,
  Sparkles,
  Sun,
  CloudRain,
  Heart,
  Compass,
  ExternalLink,
} from "lucide-react";

interface EntryEditorProps {
  entry?: JournalEntry | null;
}

const AVAILABLE_MOODS: {
  label: string;
  value: MoodType;
  icon: typeof Leaf;
}[] = [
  { label: "Peaceful", value: "peaceful", icon: Leaf },
  { label: "Reflective", value: "reflective", icon: Sparkles },
  { label: "Joyful", value: "joyful", icon: Sun },
  { label: "Melancholy", value: "melancholy", icon: CloudRain },
  { label: "Grateful", value: "grateful", icon: Heart },
  { label: "Contemplative", value: "contemplative", icon: Compass },
];

export function EntryEditor({ entry }: EntryEditorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Core metadata state
  const [title, setTitle] = useState(entry?.title || "");
  const [slug, setSlug] = useState(entry?.slug || "");
  const [entryDate, setEntryDate] = useState(
    entry?.entry_date || new Date().toISOString().split("T")[0]
  );
  const [category, setCategory] = useState(entry?.category || "Daily Life");
  const [tagsInput, setTagsInput] = useState(entry?.tags?.join(", ") || "");
  const [mood, setMood] = useState<string | null>(entry?.mood || null);
  const [excerpt, setExcerpt] = useState(entry?.excerpt || "");
  const [coverImageId, setCoverImageId] = useState<string | null>(
    entry?.cover_image_id || null
  );

  // Content Blocks
  const [blocks, setBlocks] = useState<EditorBlock[]>(() => {
    if (entry?.content?.blocks && entry.content.blocks.length > 0) {
      return entry.content.blocks;
    }
    return [
      {
        id: crypto.randomUUID(),
        type: "paragraph",
        text: "",
      },
    ];
  });

  // UI state
  const [status, setStatus] = useState<"private" | "published" | "archived">(
    entry?.status || "private"
  );
  const [isPreview, setIsPreview] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{
    type: "success" | "error";
    text: string;
    slug?: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper for adding text blocks
  const addBlock = (
    type: "paragraph" | "heading-2" | "heading-3" | "blockquote",
    index?: number
  ) => {
    const newBlock: EditorBlock = {
      id: crypto.randomUUID(),
      type,
      text: "",
    };

    if (index !== undefined) {
      const updated = [...blocks];
      updated.splice(index + 1, 0, newBlock);
      setBlocks(updated);
    } else {
      setBlocks((prev) => [...prev, newBlock]);
    }
  };

  const updateBlockText = (id: string, text: string) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id && "text" in b ? { ...b, text } : b))
    );
  };

  const updateImageBlockMeta = (
    id: string,
    updates: { caption?: string; altText?: string }
  ) => {
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === id && b.type === "image" ? { ...b, ...updates } : b
      )
    );
  };

  const removeBlock = (id: string) => {
    if (blocks.length <= 1) {
      setBlocks([{ id: crypto.randomUUID(), type: "paragraph", text: "" }]);
      return;
    }
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  const moveBlock = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === blocks.length - 1)
    ) {
      return;
    }
    const updated = [...blocks];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setBlocks(updated);
  };

  // Multiple Image Batch Upload Handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (files.length > 10) {
      setUploadError("You can upload up to 10 images per batch.");
      return;
    }

    setUploadError(null);
    setUploadProgress(`Processing ${files.length} image(s)...`);

    const newImageBlocks: EditorBlock[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadProgress(
        `Optimizing and stripping EXIF: ${file.name} (${i + 1}/${files.length})...`
      );

      try {
        const processed = await processAndStripExif(file);

        const formData = new FormData();
        const processedFile = new File([processed.blob], file.name, {
          type: processed.blob.type,
        });
        formData.append("file", processedFile);
        formData.append("entryId", entry?.id || "temp");
        formData.append("position", String(blocks.length + i));

        const res = await uploadImageAction(formData);

        if (res.error) {
          setUploadError(`Failed uploading ${file.name}: ${res.error}`);
          continue;
        }

        if (res.image) {
          newImageBlocks.push({
            id: crypto.randomUUID(),
            type: "image",
            imageId: res.image.id,
            caption: "",
            altText: file.name.replace(/\.[^/.]+$/, ""),
            storagePath: res.image.storage_path,
            publicPath: res.image.public_path || undefined,
            previewUrl: processed.dataUrl,
          });

          if (!coverImageId) {
            setCoverImageId(res.image.id);
          }
        }
      } catch (err: any) {
        setUploadError(`Error processing ${file.name}: ${err.message}`);
      }
    }

    setBlocks((prev) => [...prev, ...newImageBlocks]);
    setUploadProgress(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Save Privately
  const handleSavePrivately = () => {
    if (!title.trim()) {
      setToastMessage({ type: "error", text: "Please enter a title for your entry." });
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      if (entry?.id) formData.append("id", entry.id);
      formData.append("title", title);
      formData.append("entry_date", entryDate);
      formData.append("category", category);
      formData.append("tags", tagsInput);
      if (mood) formData.append("mood", mood);
      if (excerpt) formData.append("excerpt", excerpt);
      if (coverImageId) formData.append("cover_image_id", coverImageId);

      const content: JournalContent = {
        version: 1,
        blocks,
      };
      formData.append("content", JSON.stringify(content));

      const res = await saveEntryAction(null, formData);

      if (res?.error) {
        setToastMessage({ type: "error", text: res.error });
      } else {
        setToastMessage({
          type: "success",
          text: "Saved privately to your journal.",
        });
        if (!entry?.id && res?.entryId) {
          router.push(`/journal/entries/${res.entryId}`);
        }
      }
    });
  };

  // Explicit Publish action (supports publishing new or existing entries)
  const handlePublish = () => {
    if (!title.trim()) {
      setToastMessage({
        type: "error",
        text: "Please enter a title for your entry before publishing.",
      });
      return;
    }

    const confirmPublish = window.confirm(
      "Are you sure you want to publish this entry? It will become publicly readable by anyone visiting your journal."
    );
    if (!confirmPublish) return;

    startTransition(async () => {
      // If it's a new entry (no id yet), create and publish in one step
      if (!entry?.id) {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("entry_date", entryDate);
        formData.append("category", category);
        formData.append("tags", tagsInput);
        formData.append("status", "published");
        if (mood) formData.append("mood", mood);
        if (excerpt) formData.append("excerpt", excerpt);
        if (coverImageId) formData.append("cover_image_id", coverImageId);

        const content: JournalContent = {
          version: 1,
          blocks,
        };
        formData.append("content", JSON.stringify(content));

        const res = await saveEntryAction(null, formData);
        if (res?.error) {
          setToastMessage({ type: "error", text: res.error });
        } else {
          setStatus("published");
          if (res?.slug) setSlug(res.slug);
          setToastMessage({
            type: "success",
            text: "Entry created and published to your public journal!",
            slug: res?.slug,
          });
          if (res?.entryId) {
            router.push(`/journal/entries/${res.entryId}`);
          }
        }
        return;
      }

      // Existing entry: publish directly
      const res = await publishEntryAction(entry.id);
      if (res.error) {
        setToastMessage({ type: "error", text: res.error });
      } else {
        setStatus("published");
        if (res.slug) setSlug(res.slug);
        setToastMessage({
          type: "success",
          text: "Entry has been published to your public journal!",
          slug: res.slug || entry.slug || slug,
        });
        router.refresh();
      }
    });
  };

  // Explicit Unpublish action
  const handleUnpublish = () => {
    if (!entry?.id) return;

    const confirmUnpublish = window.confirm(
      "Unpublishing will make this entry private again. Visitors will no longer see it. Proceed?"
    );
    if (!confirmUnpublish) return;

    startTransition(async () => {
      const res = await unpublishEntryAction(entry.id);
      if (res.error) {
        setToastMessage({ type: "error", text: res.error });
      } else {
        setStatus("private");
        setToastMessage({
          type: "success",
          text: "Entry has been unpublished and is now private.",
        });
        router.refresh();
      }
    });
  };

  // Delete Action
  const handleDelete = () => {
    if (!entry?.id) return;
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete this entry and its images? This cannot be undone."
    );
    if (!confirmDelete) return;

    startTransition(async () => {
      await deleteEntryAction(entry.id);
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className={`mb-6 p-4 rounded-xl border flex items-center justify-between shadow-xs transition-all ${
            toastMessage.type === "success"
              ? "bg-emerald-50/90 border-emerald-300 text-emerald-950"
              : "bg-red-50/90 border-red-300 text-red-950"
          }`}
        >
          <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm font-medium">
            {toastMessage.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
            {toastMessage.slug && (
              <Link
                href={`/entries/${toastMessage.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1 font-semibold text-journal-accent underline ml-1 hover:text-journal-accent-hover"
              >
                <span>View Public Letter</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-gray-500 hover:text-gray-800 p-1"
            aria-label="Dismiss alert"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Editor Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-journal-border mb-8">
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
              status === "published"
                ? "bg-emerald-50 text-emerald-900 border-emerald-300"
                : "bg-amber-50 text-amber-950 border-amber-300"
            }`}
          >
            {status === "published" ? (
              <>
                <Globe className="w-3.5 h-3.5 text-emerald-700" />
                <span>Published Entry</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-amber-800" />
                <span>Private Draft</span>
              </>
            )}
          </span>

          {status === "published" && (entry?.slug || slug) && (
            <Link
              href={`/entries/${entry?.slug || slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-full transition-colors"
              title="Open published letter on public site"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Public Letter</span>
            </Link>
          )}

          <button
            type="button"
            onClick={() => setIsPreview(!isPreview)}
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-journal-muted hover:text-journal-text bg-white border border-journal-border rounded-full hover:bg-journal-tag transition-colors"
          >
            {isPreview ? (
              <>
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Mode</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>Preview Mode</span>
              </>
            )}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {entry?.id && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-800 hover:bg-red-50 border border-red-200 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          )}

          {status === "published" ? (
            <button
              type="button"
              onClick={handleUnpublish}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Make Private (Unpublish)</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePublish}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-700" />
              <span>Publish Publicly</span>
            </button>
          )}

          {/* Primary Action: Save Privately */}
          <button
            type="button"
            onClick={handleSavePrivately}
            disabled={isPending}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-journal-accent hover:bg-journal-accent-hover rounded-lg transition-colors shadow-xs cursor-pointer disabled:opacity-60"
          >
            {isPending ? (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save Privately</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Editor / Preview Column */}
        <div className="lg:col-span-8 space-y-6">
          {isPreview ? (
            /* PREVIEW VIEW */
            <div className="bg-white border border-journal-border rounded-xl sm:rounded-2xl p-4 sm:p-8 md:p-12 shadow-xs">
              <div className="flex items-center gap-2 text-xs text-journal-muted mb-3">
                <Calendar className="w-3.5 h-3.5 text-journal-accent" />
                <time className="tabular-nums">{entryDate}</time>
                {category && <span>• {category}</span>}
                {mood && <span>• {mood}</span>}
              </div>

              <h1 className="font-journal-serif text-3xl sm:text-4xl font-bold text-journal-text mb-6 text-balance">
                {title || "Untitled Entry"}
              </h1>

              {excerpt && (
                <p className="text-base text-journal-muted italic mb-8 pb-6 border-b border-journal-border/70 font-journal-serif">
                  {excerpt}
                </p>
              )}

              <div className="journal-prose">
                {blocks.map((block) => {
                  if (block.type === "heading-2") {
                    return <h2 key={block.id}>{block.text}</h2>;
                  }
                  if (block.type === "heading-3") {
                    return <h3 key={block.id}>{block.text}</h3>;
                  }
                  if (block.type === "blockquote") {
                    return <blockquote key={block.id}>{block.text}</blockquote>;
                  }
                  if (block.type === "image") {
                    return (
                      <figure key={block.id} className="my-8">
                        {block.previewUrl && (
                          <div className="overflow-hidden rounded-xl border border-journal-border">
                            <img
                              src={block.previewUrl}
                              alt={block.altText || "Journal photograph"}
                              className="w-full object-cover max-h-125"
                            />
                          </div>
                        )}
                        {block.caption && (
                          <figcaption className="text-center text-xs text-journal-muted mt-2.5 font-journal-sans italic">
                            {block.caption}
                          </figcaption>
                        )}
                      </figure>
                    );
                  }
                  return <p key={block.id}>{block.text}</p>;
                })}
              </div>
            </div>
          ) : (
            /* EDIT VIEW */
            <div className="space-y-6">
              {/* Title input */}
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What's on your mind today?"
                className="w-full font-journal-serif text-3xl sm:text-4xl font-bold text-journal-text bg-transparent border-0 border-b border-journal-border focus:border-journal-accent focus:outline-none pb-3 transition-colors placeholder:text-journal-muted/50"
              />

              {/* Upload Progress / Error Notice */}
              {uploadProgress && (
                <div className="p-3 bg-journal-accent-light text-journal-accent text-xs rounded-xl flex items-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-journal-accent/40 border-t-journal-accent rounded-full animate-spin" />
                  <span>{uploadProgress}</span>
                </div>
              )}

              {uploadError && (
                <div className="p-3 bg-red-50 text-red-900 text-xs rounded-xl flex items-center gap-2 border border-red-200">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-700" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Structured Blocks List */}
              <div className="space-y-4">
                {blocks.map((block, index) => {
                  return (
                    <div
                      key={block.id}
                      className="group relative bg-white border border-journal-border hover:border-journal-accent/50 rounded-xl p-4 transition-all"
                    >
                      {/* Block Controls Header */}
                      <div className="flex items-center justify-between text-xs text-journal-muted mb-2">
                        <span className="font-semibold uppercase tracking-wider text-[10px]">
                          {block.type.replace("-", " ")}
                        </span>

                        <div className="flex items-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => moveBlock(index, "up")}
                            disabled={index === 0}
                            className="p-1 hover:text-journal-text disabled:opacity-30"
                            title="Move up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveBlock(index, "down")}
                            disabled={index === blocks.length - 1}
                            className="p-1 hover:text-journal-text disabled:opacity-30"
                            title="Move down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeBlock(block.id)}
                            className="p-1 hover:text-red-700"
                            title="Delete block"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Block Content by Type */}
                      {block.type === "paragraph" && (
                        <textarea
                          rows={3}
                          value={block.text}
                          onChange={(e) =>
                            updateBlockText(block.id, e.target.value)
                          }
                          placeholder="Write freely. How was today? What are you feeling right now? Nobody is judging..."
                          className="w-full bg-transparent border-0 focus:outline-none resize-y text-base font-journal-serif text-journal-text leading-relaxed placeholder:text-journal-muted/50"
                        />
                      )}

                      {block.type === "heading-2" && (
                        <input
                          type="text"
                          value={block.text}
                          onChange={(e) =>
                            updateBlockText(block.id, e.target.value)
                          }
                          placeholder="A section or theme from today..."
                          className="w-full bg-transparent border-0 focus:outline-none text-xl font-journal-serif font-semibold text-journal-text"
                        />
                      )}

                      {block.type === "heading-3" && (
                        <input
                          type="text"
                          value={block.text}
                          onChange={(e) =>
                            updateBlockText(block.id, e.target.value)
                          }
                          placeholder="Sub-heading..."
                          className="w-full bg-transparent border-0 focus:outline-none text-lg font-journal-serif font-semibold text-journal-text"
                        />
                      )}

                      {block.type === "blockquote" && (
                        <div className="border-l-2 border-journal-accent pl-3">
                          <textarea
                            rows={2}
                            value={block.text}
                            onChange={(e) =>
                              updateBlockText(block.id, e.target.value)
                            }
                            placeholder="A sentence or realization you want to hold onto..."
                            className="w-full bg-transparent border-0 focus:outline-none italic text-base font-journal-serif text-journal-text leading-relaxed"
                          />
                        </div>
                      )}

                      {block.type === "image" && (
                        <div className="space-y-3">
                          {block.previewUrl && (
                            <div className="overflow-hidden rounded-lg border border-journal-border">
                              <img
                                src={block.previewUrl}
                                alt={block.altText || "Journal photograph"}
                                className="w-full object-cover max-h-96"
                              />
                            </div>
                          )}

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            <input
                              type="text"
                              value={block.caption || ""}
                              onChange={(e) =>
                                updateImageBlockMeta(block.id, {
                                  caption: e.target.value,
                                })
                              }
                              placeholder="Add a photo caption..."
                              className="px-3 py-1.5 bg-journal-bg border border-journal-border rounded-lg focus:outline-none focus:border-journal-accent"
                            />
                            <input
                              type="text"
                              value={block.altText || ""}
                              onChange={(e) =>
                                updateImageBlockMeta(block.id, {
                                  altText: e.target.value,
                                })
                              }
                              placeholder="Alt text (for accessibility)..."
                              className="px-3 py-1.5 bg-journal-bg border border-journal-border rounded-lg focus:outline-none focus:border-journal-accent"
                            />
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-journal-muted pt-1">
                            <button
                              type="button"
                              onClick={() => setCoverImageId(block.imageId)}
                              className={`cursor-pointer hover:underline ${
                                coverImageId === block.imageId
                                  ? "text-journal-accent font-semibold"
                                  : ""
                              }`}
                            >
                              {coverImageId === block.imageId
                                ? "✓ Selected as Cover Image"
                                : "Set as Cover Image"}
                            </button>
                            <span className="text-journal-muted/80">EXIF metadata stripped</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Add Block Toolbar */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 p-2 sm:p-3 bg-white border border-journal-border rounded-xl">
                <span className="text-[11px] sm:text-xs font-semibold text-journal-muted mr-0.5 sm:mr-1">
                  Insert:
                </span>
                <button
                  type="button"
                  onClick={() => addBlock("paragraph")}
                  className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-journal-text bg-journal-bg hover:bg-journal-tag rounded-lg transition-colors border border-journal-border/70 min-h-[32px]"
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                  <span>Paragraph</span>
                </button>
                <button
                  type="button"
                  onClick={() => addBlock("heading-2")}
                  className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-journal-text bg-journal-bg hover:bg-journal-tag rounded-lg transition-colors border border-journal-border/70 min-h-[32px]"
                >
                  <Heading className="w-3.5 h-3.5" />
                  <span>Heading</span>
                </button>
                <button
                  type="button"
                  onClick={() => addBlock("blockquote")}
                  className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-journal-text bg-journal-bg hover:bg-journal-tag rounded-lg transition-colors border border-journal-border/70 min-h-[32px]"
                >
                  <Quote className="w-3.5 h-3.5" />
                  <span>Quote</span>
                </button>

                {/* Multiple Images Upload Button */}
                <label className="inline-flex items-center gap-1 sm:gap-1.5 px-3 sm:px-3.5 py-1.5 text-xs font-semibold text-journal-accent bg-journal-accent-light hover:bg-journal-accent/20 rounded-lg transition-colors cursor-pointer border border-journal-accent/30 min-h-[32px]">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Add Images (Max 10)</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Metadata Column */}
        <aside className="lg:col-span-4 space-y-5 sm:space-y-6">
          <div className="bg-white border border-journal-border rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xs space-y-4 sm:space-y-5">
            <h3 className="font-journal-serif text-lg font-bold text-journal-text pb-2.5 border-b border-journal-border">
              Entry Details
            </h3>

            {/* Entry Date */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-journal-muted mb-1.5">
                Journal Date
              </label>
              <input
                type="date"
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-journal-bg border border-journal-border rounded-lg focus:outline-none focus:ring-1 focus:ring-journal-accent tabular-nums"
              />
            </div>

            {/* Mood selector (using drawn Lucide icons, no emojis!) */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-journal-muted mb-2">
                Mood (Optional)
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {AVAILABLE_MOODS.map((m) => {
                  const Icon = m.icon;
                  const isSelected = mood === m.value;
                  return (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() => setMood(isSelected ? null : m.value)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                        isSelected
                          ? "bg-journal-accent text-white border-journal-accent"
                          : "bg-journal-bg text-journal-text border-journal-border hover:bg-journal-tag"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category dropdown */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-journal-muted mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-journal-bg border border-journal-border rounded-lg focus:outline-none focus:ring-1 focus:ring-journal-accent"
              >
                {DEFAULT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags input */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-journal-muted mb-1.5">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Morning, Reflection, Reading"
                className="w-full px-3 py-2 text-sm bg-journal-bg border border-journal-border rounded-lg focus:outline-none focus:ring-1 focus:ring-journal-accent"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-journal-muted mb-1.5">
                Short Excerpt
              </label>
              <textarea
                rows={3}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A brief note or takeaway to remember this day by..."
                className="w-full px-3 py-2 text-sm bg-journal-bg border border-journal-border rounded-lg focus:outline-none focus:ring-1 focus:ring-journal-accent resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Privacy Note */}
          <div className="p-4 bg-journal-tag border border-journal-border rounded-xl text-xs text-journal-muted space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-journal-text">
              <Lock className="w-3.5 h-3.5 text-journal-accent" />
              <span>Privacy by Default</span>
            </div>
            <p className="leading-relaxed">
              Every save keeps this entry strictly private. It will only be visible to public visitors if you explicitly click <strong>Publish Publicly</strong>.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
