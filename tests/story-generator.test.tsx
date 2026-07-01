import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { StoryGenerator } from "@/components/stories/story-generator";

const push = vi.fn();
const refresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, refresh }),
}));

const childrenProfiles = [
  { id: "child-1", name: "Aina", language: "English" },
  { id: "child-2", name: "Iman", language: "Bahasa Malaysia" },
];

describe("StoryGenerator", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it("shows a guided no-child setup state", () => {
    render(<StoryGenerator childrenProfiles={[]} />);

    expect(screen.getByText("Set up a child profile first")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /finish setup/i })).toHaveAttribute("href", "/onboarding");
  });

  it("makes the selected child and theme path obvious before generation", () => {
    render(<StoryGenerator childrenProfiles={childrenProfiles} />);

    expect(screen.getByRole("heading", { name: "Tonight's story setup" })).toBeInTheDocument();
    expect(screen.getByText("Selected profile")).toBeInTheDocument();
    expect(screen.getByText("Aina")) .toBeInTheDocument();
    expect(screen.getByText("Six bedtime directions")) .toBeInTheDocument();
    expect(screen.getByRole("button", { name: /generate bedtime story/i })).toBeInTheDocument();
  });

  it("announces generation progress while the request is pending", async () => {
    let resolveFetch: (value: Response) => void = () => undefined;
    vi.spyOn(globalThis, "fetch").mockImplementation(() => new Promise((resolve) => {
      resolveFetch = resolve;
    }));

    render(<StoryGenerator childrenProfiles={childrenProfiles} />);

    fireEvent.submit(screen.getByRole("button", { name: /generate bedtime story/i }).closest("form")!);

    expect(screen.getByRole("status")).toHaveTextContent("Preparing a private bedtime story for Aina.");
    expect(screen.getByRole("button", { name: /generating story/i })).toBeDisabled();

    resolveFetch(new Response(JSON.stringify({ storyId: "story-1" }), { status: 200 }));

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith("/stories/story-1");
    });
  });
});
