import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StoryLibrary } from "@/components/stories/story-library";

const stories = [
  {
    id: "story-1",
    title: "Moon Garden",
    child_id: "child-1",
    theme_key: "calm_bedtime",
    language: "English",
    created_at: "2026-06-20T10:00:00.000Z",
  },
];

const childrenProfiles = [{ id: "child-1", name: "Aina" }];

describe("StoryLibrary", () => {
  it("marks the selected child filter as the current page", () => {
    render(<StoryLibrary stories={stories} childrenProfiles={childrenProfiles} selectedChildId="child-1" />);

    expect(screen.getByRole("link", { name: "Aina" })).toHaveAttribute("aria-current", "page");
  });

  it("shows scan-friendly story card details", () => {
    render(<StoryLibrary stories={stories} childrenProfiles={childrenProfiles} />);

    expect(screen.getByRole("link", { name: /Moon Garden/i })).toHaveTextContent("Calm Bedtime");
    expect(screen.getByRole("link", { name: /Moon Garden/i })).toHaveTextContent("Private story");
    expect(screen.getByRole("link", { name: /Moon Garden/i })).toHaveTextContent("Read or listen");
  });
});
