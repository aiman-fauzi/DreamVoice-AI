import { getStoryWordCountRange, STORY_TTS_CHARACTER_TARGET } from "@/lib/limits";
import { STORY_THEMES, type StoryThemeKey } from "@/lib/story-themes";
import type { SupportedLanguage } from "@/lib/env";

type PromptChild = {
  name: string;
  age: number;
  language: SupportedLanguage;
  interests: string[];
  bedtimeTone: string;
};

type BuildStoryPromptInput = {
  child: PromptChild;
  themeKey: StoryThemeKey;
};

function formatInterests(interests: string[]) {
  return interests.length > 0 ? interests.join(", ") : "gentle bedtime stories";
}

export function buildStoryPrompt({ child, themeKey }: BuildStoryPromptInput) {
  const theme = STORY_THEMES[themeKey];
  const wordCountRange = getStoryWordCountRange();

  return [
    "You are writing a personalized bedtime story for a child.",
    `Write the story in ${child.language}.`,
    `Child first name: ${child.name}.`,
    `Child age: ${child.age} years old.`,
    `Child interests: ${formatInterests(child.interests)}.`,
    `Preferred bedtime tone: ${child.bedtimeTone}.`,
    `Selected theme: ${theme.label}.`,
    `Theme focus: ${theme.promptFocus}.`,
    `Target length: ${wordCountRange.min} to ${wordCountRange.max} words.`,
    `Keep the complete response under ${STORY_TTS_CHARACTER_TARGET} characters so Google Text-to-Speech can narrate it in one request during testing.`,
    "Keep the story child-safe, warm, emotionally reassuring, and suitable for bedtime.",
    "Do not include sensitive personal details beyond the supplied first name, age, interests, language, tone, and theme.",
    "Return story text only, with a short title on the first line.",
  ].join("\n");
}
