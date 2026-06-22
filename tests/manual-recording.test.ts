import { describe, expect, it } from "vitest";

import { isManualRecordingSizeAllowed, isOwnedStoryAudioPath } from "@/lib/audio";
import { MAX_MANUAL_RECORDING_BYTES } from "@/lib/limits";

describe("manual recording validation", () => {
  it("allows storage paths under the parent and story prefix", () => {
    expect(isOwnedStoryAudioPath({ parentId: "parent-1", storyId: "story-1", storagePath: "parent-1/story-1/recording.webm" })).toBe(true);
  });

  it("rejects storage paths for another parent", () => {
    expect(isOwnedStoryAudioPath({ parentId: "parent-1", storyId: "story-1", storagePath: "parent-2/story-1/recording.webm" })).toBe(false);
  });

  it("rejects storage paths for another story", () => {
    expect(isOwnedStoryAudioPath({ parentId: "parent-1", storyId: "story-1", storagePath: "parent-1/story-2/recording.webm" })).toBe(false);
  });

  it("enforces the manual recording size limit", () => {
    expect(isManualRecordingSizeAllowed(MAX_MANUAL_RECORDING_BYTES)).toBe(true);
    expect(isManualRecordingSizeAllowed(MAX_MANUAL_RECORDING_BYTES + 1)).toBe(false);
  });
});