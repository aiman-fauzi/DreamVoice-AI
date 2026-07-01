import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AudioPlayer } from "@/components/narrations/audio-player";

describe("AudioPlayer", () => {
  it("labels saved audio as private playback", () => {
    render(<AudioPlayer narrationId="narration-1" label="Generated narration" />);

    expect(screen.getByText("Private playback")).toBeInTheDocument();
    expect(screen.getByText("Generated narration")).toBeInTheDocument();
    expect(screen.getByLabelText("Generated narration audio")).toHaveAttribute("src", "/api/audio/narration-1");
  });
});
