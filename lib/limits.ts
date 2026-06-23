export const MAX_CHILDREN_PER_PARENT = 3;
export const MAX_STORIES_PER_PARENT_PER_MONTH = 20;
export const MAX_GOOGLE_TTS_NARRATIONS_PER_MONTH = 5;
export const MAX_MANUAL_RECORDING_BYTES = 25 * 1024 * 1024;
export const DEFAULT_STORY_WORD_COUNT_RANGE = { min: 120, max: 180 } as const;
export const STORY_TTS_CHARACTER_TARGET = 2500;

type StoryWordCountRange = {
  min: number;
  max: number;
};

function parsePositiveInteger(value: string | undefined) {
  if (!value) {
    return null;
  }

  const parsed = Number(value);

  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export function getStoryWordCountRange(): StoryWordCountRange {
  const min = parsePositiveInteger(process.env.STORY_WORD_COUNT_MIN);
  const max = parsePositiveInteger(process.env.STORY_WORD_COUNT_MAX);

  if (min && max && min <= max) {
    return { min, max };
  }

  return DEFAULT_STORY_WORD_COUNT_RANGE;
}
