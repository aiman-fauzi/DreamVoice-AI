import { describe, expect, it } from "vitest";

import {
  DEFAULT_STORY_WORD_COUNT_RANGE,
  MAX_CHILDREN_PER_PARENT,
  MAX_GOOGLE_TTS_NARRATIONS_PER_MONTH,
  MAX_MANUAL_RECORDING_BYTES,
  MAX_STORIES_PER_PARENT_PER_MONTH,
  STORY_TTS_CHARACTER_TARGET,
} from "@/lib/limits";

describe("prototype limits", () => {
  it("limits child profiles per parent", () => {
    expect(MAX_CHILDREN_PER_PARENT).toBe(3);
  });

  it("limits generated stories per month", () => {
    expect(MAX_STORIES_PER_PARENT_PER_MONTH).toBe(20);
  });

  it("limits Google TTS narrations per month", () => {
    expect(MAX_GOOGLE_TTS_NARRATIONS_PER_MONTH).toBe(5);
  });

  it("limits manual recordings to 25 MB", () => {
    expect(MAX_MANUAL_RECORDING_BYTES).toBe(25 * 1024 * 1024);
  });

  it("keeps story length short for TTS testing", () => {
    expect(DEFAULT_STORY_WORD_COUNT_RANGE).toEqual({ min: 120, max: 180 });
    expect(STORY_TTS_CHARACTER_TARGET).toBe(2500);
  });
});
