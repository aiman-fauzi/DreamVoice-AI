import { describe, expect, it } from "vitest";

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
  it("includes safe child details and story constraints", () => {
    const prompt = buildStoryPrompt({ child: baseChild, themeKey: "calm_bedtime" });

    expect(prompt).toContain("Aina");
    expect(prompt).toContain("6 years old");
    expect(prompt).toContain("stars, cats");
    expect(prompt).toContain("calm");
    expect(prompt).toContain("600 to 900 words");
    expect(prompt).toContain("Return story text only");
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