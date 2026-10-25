import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  EntryFormSchema,
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_FILE_SIZE,
} from "../src/lib/validations/journal.ts";

describe("Dear Me — Validation & Privacy Tests", () => {
  test("Privacy by default: new entries default to 'private'", () => {
    const validEntry = {
      title: "First Morning of Autumn",
      slug: "first-morning-of-autumn",
      entry_date: "2026-10-25",
      category: "Daily Life",
      tags: ["Autumn", "Morning"],
      mood: "peaceful",
      content: {
        version: 1,
        blocks: [
          {
            id: "b1",
            type: "paragraph",
            text: "The golden leaves began falling quietly onto the stone terrace.",
          },
        ],
      },
    };

    const result = EntryFormSchema.safeParse(validEntry);
    assert.equal(result.success, true);
    if (result.success) {
      assert.equal(result.data.status, "private");
    }
  });

  test("Reject invalid slug formats with special characters or uppercase", () => {
    const invalidSlugEntry = {
      title: "Hello World",
      slug: "Hello_World!@#",
      entry_date: "2026-10-25",
      content: { version: 1, blocks: [] },
    };

    const result = EntryFormSchema.safeParse(invalidSlugEntry);
    assert.equal(result.success, false);
  });

  test("Reject empty titles", () => {
    const emptyTitleEntry = {
      title: "",
      slug: "some-slug",
      entry_date: "2026-10-25",
      content: { version: 1, blocks: [] },
    };

    const result = EntryFormSchema.safeParse(emptyTitleEntry);
    assert.equal(result.success, false);
  });

  test("Enforce valid date format YYYY-MM-DD", () => {
    const invalidDateEntry = {
      title: "Valid Title",
      slug: "valid-title",
      entry_date: "25/10/2026", // Invalid format
      content: { version: 1, blocks: [] },
    };

    const result = EntryFormSchema.safeParse(invalidDateEntry);
    assert.equal(result.success, false);
  });

  test("Image constraints: only JPEG, PNG, WebP are permitted; SVG is rejected", () => {
    assert.ok(ALLOWED_IMAGE_TYPES.includes("image/jpeg"));
    assert.ok(ALLOWED_IMAGE_TYPES.includes("image/png"));
    assert.ok(ALLOWED_IMAGE_TYPES.includes("image/webp"));
    // SVG and executable/binary formats MUST be rejected
    assert.ok(!ALLOWED_IMAGE_TYPES.includes("image/svg+xml" as any));
    assert.ok(!ALLOWED_IMAGE_TYPES.includes("image/gif" as any));
  });

  test("Image constraints: 5 MB file size limit is strictly 5242880 bytes", () => {
    assert.equal(MAX_IMAGE_FILE_SIZE, 5 * 1024 * 1024);
  });

  test("Block schema validates structured image blocks with imageId references", () => {
    const validImageEntry = {
      title: "Entry With Inline Photograph",
      slug: "entry-with-inline-photograph",
      entry_date: "2026-10-25",
      content: {
        version: 1,
        blocks: [
          {
            id: "p1",
            type: "paragraph",
            text: "Before the storm arrived, the lake was glass:",
          },
          {
            id: "img1",
            type: "image",
            imageId: "123e4567-e89b-12d3-a456-426614174000",
            caption: "Reflections at dawn",
            altText: "Mist rising over calm mountain lake",
          },
        ],
      },
    };

    const result = EntryFormSchema.safeParse(validImageEntry);
    assert.equal(result.success, true);
  });
});
