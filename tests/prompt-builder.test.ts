import { afterEach, describe, expect, it, vi } from "vitest";

import { getStoryWordCountRange } from "@/lib/limits";
import { buildStoryPrompt } from "@/lib/prompt-builder";
import { STORY_THEMES, type StoryThemeKey } from "@/lib/story-themes";

const baseChild = {
  name: "Aina",
  age: 6,
  language: "English" as const,
  interests: ["stars", "cats"],
  bedtimeTone: "calm",
};

describe("story themes", () => {
  it("defines the six MVP story themes", () => {
    expect(Object.keys(STORY_THEMES)).toEqual([
      "magical_adventure",
      "calm_bedtime",
      "brave_little_hero",
      "kindness_and_sharing",
      "animal_friends",
      "learning_quest",
    ] satisfies StoryThemeKey[]);
  });
});

describe("buildStoryPrompt", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("includes safe child details and story constraints", () => {
    const prompt = buildStoryPrompt({ child: baseChild, themeKey: "calm_bedtime" });

    expect(prompt).toContain("Aina");
    expect(prompt).toContain("6 years old");
    expect(prompt).toContain("stars, cats");
    expect(prompt).toContain("calm");
    expect(prompt).toContain("120 to 180 words");
    expect(prompt).toContain("under 2500 characters");
    expect(prompt).toContain("Return story text only");
  });

  it("uses a short default story length for Google TTS testing", () => {
    expect(getStoryWordCountRange()).toEqual({ min: 120, max: 180 });
  });

  it("allows story length to be configured by environment", () => {
    vi.stubEnv("STORY_WORD_COUNT_MIN", "90");
    vi.stubEnv("STORY_WORD_COUNT_MAX", "130");

    expect(getStoryWordCountRange()).toEqual({ min: 90, max: 130 });

    const prompt = buildStoryPrompt({ child: baseChild, themeKey: "calm_bedtime" });

    expect(prompt).toContain("90 to 130 words");
  });

  it("instructs English output", () => {
    const prompt = buildStoryPrompt({ child: baseChild, themeKey: "magical_adventure" });

    expect(prompt).toContain("Write the story in English.");
  });

  it("instructs Bahasa Malaysia output", () => {
    const prompt = buildStoryPrompt({
      child: { ...baseChild, language: "Bahasa Malaysia" },
      themeKey: "animal_friends",
    });

    expect(prompt).toContain("Write the story in Bahasa Malaysia.");
  });

  it("includes each selected theme label", () => {
    for (const themeKey of Object.keys(STORY_THEMES) as StoryThemeKey[]) {
      const prompt = buildStoryPrompt({ child: baseChild, themeKey });

      expect(prompt).toContain(STORY_THEMES[themeKey].label);
    }
  });
});

