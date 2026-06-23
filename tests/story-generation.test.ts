import { afterEach, describe, expect, it, vi } from "vitest";

import { getGeminiModelName, parseGeneratedStory } from "@/lib/gemini";
import { isStoryThemeKey } from "@/lib/story-themes";

describe("story generation helpers", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("parses a title from the first generated line", () => {
    const result = parseGeneratedStory("The Moon Garden\nOnce upon a soft blue evening...");

    expect(result).toEqual({
      title: "The Moon Garden",
      storyText: "The Moon Garden\nOnce upon a soft blue evening...",
    });
  });

  it("uses a fallback title when generated text has no clear title", () => {
    const result = parseGeneratedStory("Once upon a soft blue evening...");

    expect(result.title).toBe("Bedtime Story");
    expect(result.storyText).toBe("Once upon a soft blue evening...");
  });

  it("rejects unknown story themes", () => {
    expect(isStoryThemeKey("calm_bedtime")).toBe(true);
    expect(isStoryThemeKey("voice_cloning")).toBe(false);
  });

  it("uses a current Gemini model by default", () => {
    expect(getGeminiModelName()).toBe("gemini-3.5-flash");
  });

  it("allows the Gemini model to be configured", () => {
    vi.stubEnv("GEMINI_MODEL", "gemini-flash-latest");

    expect(getGeminiModelName()).toBe("gemini-flash-latest");
  });
});
