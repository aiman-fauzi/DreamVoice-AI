import { describe, expect, it } from "vitest";

import { filterStoriesByChild, sortStoriesNewestFirst } from "@/lib/library";

const stories = [
  { id: "old", child_id: "child-1", created_at: "2026-06-19T10:00:00.000Z" },
  { id: "new", child_id: "child-2", created_at: "2026-06-21T10:00:00.000Z" },
  { id: "middle", child_id: "child-1", created_at: "2026-06-20T10:00:00.000Z" },
];

describe("library helpers", () => {
  it("sorts stories newest first", () => {
    expect(sortStoriesNewestFirst(stories).map((story) => story.id)).toEqual(["new", "middle", "old"]);
  });

  it("filters stories by child", () => {
    expect(filterStoriesByChild(stories, "child-1").map((story) => story.id)).toEqual(["old", "middle"]);
  });

  it("returns all stories when no child filter is selected", () => {
    expect(filterStoriesByChild(stories).map((story) => story.id)).toEqual(["old", "new", "middle"]);
  });
});