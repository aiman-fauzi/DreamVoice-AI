"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { parseChildProfileForm } from "@/lib/child-profile";
import { MAX_CHILDREN_PER_PARENT } from "@/lib/limits";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function requireFormId(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();

  if (!value) {
    throw new Error("A valid record id is required.");
  }

  return value;
}

async function getAuthenticatedSupabase() {
  const supabase = await createSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    redirect("/login");
  }

  return { supabase, userId: authData.user.id };
}

function revalidateChildSurfaces() {
  revalidatePath("/children");
  revalidatePath("/dashboard");
  revalidatePath("/stories/new");
  revalidatePath("/library");
}

export async function createChildAction(formData: FormData) {
  const { supabase, userId } = await getAuthenticatedSupabase();
  const child = parseChildProfileForm(formData);

  const { count, error: countError } = await supabase
    .from("children")
    .select("id", { count: "exact", head: true })
    .eq("parent_id", userId);

  if (countError) {
    throw new Error(countError.message);
  }

  if ((count ?? 0) >= MAX_CHILDREN_PER_PARENT) {
    throw new Error(`Phase 1 supports up to ${MAX_CHILDREN_PER_PARENT} children per parent.`);
  }

  const { error } = await supabase.from("children").insert({
    parent_id: userId,
    name: child.name,
    age: child.age,
    language: child.language,
    interests: child.interests,
    bedtime_tone: child.bedtimeTone,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidateChildSurfaces();
}

export async function updateChildAction(formData: FormData) {
  const { supabase, userId } = await getAuthenticatedSupabase();
  const childId = requireFormId(formData, "child_id");
  const child = parseChildProfileForm(formData);

  const { error } = await supabase
    .from("children")
    .update({
      name: child.name,
      age: child.age,
      language: child.language,
      interests: child.interests,
      bedtime_tone: child.bedtimeTone,
    })
    .eq("id", childId)
    .eq("parent_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  revalidateChildSurfaces();
}

export async function deleteChildAction(formData: FormData) {
  const { supabase, userId } = await getAuthenticatedSupabase();
  const childId = requireFormId(formData, "child_id");

  const { data: stories, error: storiesError } = await supabase
    .from("stories")
    .select("id")
    .eq("child_id", childId)
    .eq("parent_id", userId);

  if (storiesError) {
    throw new Error(storiesError.message);
  }

  const storyIds = (stories ?? []).map((story) => story.id);

  if (storyIds.length > 0) {
    const { data: narrations, error: narrationsError } = await supabase
      .from("narrations")
      .select("storage_path")
      .eq("parent_id", userId)
      .in("story_id", storyIds);

    if (narrationsError) {
      throw new Error(narrationsError.message);
    }

    const storagePaths = (narrations ?? []).map((narration) => narration.storage_path).filter(Boolean);

    if (storagePaths.length > 0) {
      const { error: removeError } = await supabase.storage.from("story-audio").remove(storagePaths);

      if (removeError) {
        throw new Error(removeError.message);
      }
    }
  }

  const { error } = await supabase
    .from("children")
    .delete()
    .eq("id", childId)
    .eq("parent_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  revalidateChildSurfaces();
}
