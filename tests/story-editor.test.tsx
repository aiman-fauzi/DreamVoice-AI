import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { StoryEditor } from "@/components/stories/story-editor";

const updateAction = vi.fn(async () => undefined);
const deleteAction = vi.fn(async () => undefined);

describe("StoryEditor", () => {
  it("renders story edit fields and a delete control", () => {
    render(
      <StoryEditor
        story={{ id: "story-1", title: "Moon Garden", storyText: "Once upon a moon." }}
        updateAction={updateAction}
        deleteAction={deleteAction}
      />,
    );

    expect(screen.getByRole("heading", { name: "Edit story" })).toBeInTheDocument();
    expect(screen.getByDisplayValue("Moon Garden")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Once upon a moon.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save story changes/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delete story/i })).toBeInTheDocument();
  });
});
