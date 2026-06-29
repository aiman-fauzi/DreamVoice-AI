import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { StoryDownloadButton } from "@/components/stories/story-download-button";

describe("StoryDownloadButton", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("downloads story text as a text file", () => {
    const createObjectURL = vi.fn(() => "blob:story");
    const revokeObjectURL = vi.fn();
    Object.defineProperty(URL, "createObjectURL", { configurable: true, value: createObjectURL });
    Object.defineProperty(URL, "revokeObjectURL", { configurable: true, value: revokeObjectURL });

    render(<StoryDownloadButton title="Moon Garden" storyText="Once upon a moon." />);

    const anchor = document.createElement("a");
    const click = vi.fn();
    vi.spyOn(anchor, "click").mockImplementation(click);
    vi.spyOn(document, "createElement").mockReturnValue(anchor);

    fireEvent.click(screen.getByRole("button", { name: /download story/i }));

    expect(anchor.download).toBe("moon-garden.txt");
    expect(anchor.href).toBe("blob:story");
    expect(click).toHaveBeenCalled();
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:story");
  });
});
