import { MAX_MANUAL_RECORDING_BYTES } from "@/lib/limits";

type StoryAudioPathInput = {
  parentId: string;
  storyId: string;
  storagePath: string;
};

export function isOwnedStoryAudioPath({ parentId, storyId, storagePath }: StoryAudioPathInput) {
  return storagePath.startsWith(`${parentId}/${storyId}/`) && !storagePath.includes("..");
}

export function isManualRecordingSizeAllowed(sizeBytes: number) {
  return Number.isFinite(sizeBytes) && sizeBytes > 0 && sizeBytes <= MAX_MANUAL_RECORDING_BYTES;
}