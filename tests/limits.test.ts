import { describe, expect, it } from "vitest";

import {
  MAX_CHILDREN_PER_PARENT,
  MAX_GOOGLE_TTS_NARRATIONS_PER_MONTH,
  MAX_MANUAL_RECORDING_BYTES,
  MAX_STORIES_PER_PARENT_PER_MONTH,
  STORY_WORD_COUNT_RANGE,
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

  it("keeps story length within the MVP range", () => {
    expect(STORY_WORD_COUNT_RANGE).toEqual({ min: 600, max: 900 });
  });
});