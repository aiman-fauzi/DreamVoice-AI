import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StoryStage } from "@/components/stories/story-stage";

describe("StoryStage", () => {
  it("frames a story as a private reading stage", () => {
    render(
      <StoryStage
        title="Moon Garden"
        themeLabel="Calm Bedtime"
        language="English"
        savedDate="Jun 20, 2026"
        storyText={"Once upon a moon.\nA lantern glowed softly."}
      />,
    );

    expect(screen.getByRole("region", { name: "Private reading stage" })).toBeInTheDocument();
    expect(screen.getByText("Calm Bedtime")).toBeInTheDocument();
    expect(screen.getByText("Jun 20, 2026")).toBeInTheDocument();
    expect(screen.getByText(/A lantern glowed softly/i)).toBeInTheDocument();
  });
});
