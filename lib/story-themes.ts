export const STORY_THEMES = {
  magical_adventure: {
    label: "Magical Adventure",
    promptFocus: "a gentle magical adventure with wonder, safety, and a peaceful ending",
  },
  calm_bedtime: {
    label: "Calm Bedtime",
    promptFocus: "a soothing bedtime story with soft pacing and a restful ending",
  },
  brave_little_hero: {
    label: "Brave Little Hero",
    promptFocus: "a small brave choice that helps the child feel capable and safe",
  },
  kindness_and_sharing: {
    label: "Kindness and Sharing",
    promptFocus: "kindness, sharing, and warm family-friendly friendship",
  },
  animal_friends: {
    label: "Animal Friends",
    promptFocus: "friendly animals, gentle humor, and a cozy bedtime resolution",
  },
  learning_quest: {
    label: "Learning Quest",
    promptFocus: "a simple learning discovery woven into a comforting adventure",
  },
} as const;

export type StoryThemeKey = keyof typeof STORY_THEMES;

export function isStoryThemeKey(value: string): value is StoryThemeKey {
  return value in STORY_THEMES;
}