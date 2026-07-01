import { describe, expect, it } from "vitest";

import { getOwnedStoryAudioPaths, parseStoryEditForm } from "@/lib/story-management";

describe("story management helpers", () => {
  it("parses story edit form data", () => {
    const formData = new FormData();
    formData.set("title", " Moon Garden ");
    formData.set("story_text", " Once upon a moon. ");

    expect(parseStoryEditForm(formData)).toEqual({
      title: "Moon Garden",
      storyText: "Once upon a moon.",
    });
  });

  it("rejects missing story title or text", () => {
    const formData = new FormData();
    formData.set("title", "Moon Garden");
    formData.set("story_text", " ");

    expect(() => parseStoryEditForm(formData)).toThrow("Enter a story title and story text.");
  });

  it("keeps only owned audio paths for a story", () => {
    expect(getOwnedStoryAudioPaths({
      parentId: "parent-1",
      storyId: "story-1",
      narrations: [
        { storage_path: "parent-1/story-1/generated.mp3" },
        { storage_path: "parent-1/story-2/other.mp3" },
        { storage_path: "parent-2/story-1/not-owned.mp3" },
        { storage_path: "parent-1/story-1/../bad.mp3" },
      ],
    })).toEqual(["parent-1/story-1/generated.mp3"]);
  });
});
