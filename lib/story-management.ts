import { isOwnedStoryAudioPath } from "@/lib/audio";

export type ParsedStoryEdit = {
  title: string;
  storyText: string;
};

type NarrationPath = {
  storage_path: string | null;
};

type OwnedStoryAudioInput = {
  parentId: string;
  storyId: string;
  narrations: NarrationPath[];
};

export function parseStoryEditForm(formData: FormData): ParsedStoryEdit {
  const title = String(formData.get("title") ?? "").trim();
  const storyText = String(formData.get("story_text") ?? "").trim();

  if (!title || !storyText) {
    throw new Error("Enter a story title and story text.");
  }

  return { title, storyText };
}

export function getOwnedStoryAudioPaths({ parentId, storyId, narrations }: OwnedStoryAudioInput) {
  return narrations
    .map((narration) => narration.storage_path)
    .filter((storagePath): storagePath is string => Boolean(storagePath))
    .filter((storagePath) => isOwnedStoryAudioPath({ parentId, storyId, storagePath }));
}
