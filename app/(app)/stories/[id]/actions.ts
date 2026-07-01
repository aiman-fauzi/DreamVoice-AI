"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getOwnedStoryAudioPaths, parseStoryEditForm } from "@/lib/story-management";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function requireStoryId(formData: FormData) {
  const storyId = String(formData.get("story_id") ?? "").trim();

  if (!storyId) {
    throw new Error("A valid story id is required.");
  }

  return storyId;
}

async function getAuthenticatedSupabase() {
  const supabase = await createSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    redirect("/login");
  }

  return { supabase, userId: authData.user.id };
}

function revalidateStorySurfaces(storyId: string) {
  revalidatePath(`/stories/${storyId}`);
  revalidatePath("/library");
  revalidatePath("/dashboard");
}

export async function updateStoryAction(formData: FormData) {
  const { supabase, userId } = await getAuthenticatedSupabase();
  const storyId = requireStoryId(formData);
  const story = parseStoryEditForm(formData);

  const { error } = await supabase
    .from("stories")
    .update({
      title: story.title,
      story_text: story.storyText,
    })
    .eq("id", storyId)
    .eq("parent_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  revalidateStorySurfaces(storyId);
}

export async function deleteStoryAction(formData: FormData) {
  const { supabase, userId } = await getAuthenticatedSupabase();
  const storyId = requireStoryId(formData);

  const { data: story, error: storyError } = await supabase
    .from("stories")
    .select("id")
    .eq("id", storyId)
    .eq("parent_id", userId)
    .single();

  if (storyError || !story) {
    throw new Error("Story not found.");
  }

  const { data: narrations, error: narrationError } = await supabase
    .from("narrations")
    .select("storage_path")
    .eq("story_id", story.id)
    .eq("parent_id", userId);

  if (narrationError) {
    throw new Error(narrationError.message);
  }

  const storagePaths = getOwnedStoryAudioPaths({ parentId: userId, storyId: story.id, narrations: narrations ?? [] });

  if (storagePaths.length > 0) {
    const { error: removeError } = await supabase.storage.from("story-audio").remove(storagePaths);

    if (removeError) {
      throw new Error(removeError.message);
    }
  }

  const { error } = await supabase
    .from("stories")
    .delete()
    .eq("id", story.id)
    .eq("parent_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  revalidateStorySurfaces(story.id);
  redirect("/library");
}
