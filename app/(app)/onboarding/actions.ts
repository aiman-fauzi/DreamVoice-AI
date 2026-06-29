"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { MAX_CHILDREN_PER_PARENT } from "@/lib/limits";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type SupportedLanguage = "English" | "Bahasa Malaysia";

function parseInterests(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return [];
  }

  return value
    .split(",")
    .map((interest) => interest.trim())
    .filter(Boolean)
    .slice(0, 8);
}

function parseLanguage(value: FormDataEntryValue | null): SupportedLanguage {
  return value === "Bahasa Malaysia" ? "Bahasa Malaysia" : "English";
}

export async function completeOnboardingAction(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    redirect("/login");
  }

  const displayName = String(formData.get("display_name") ?? "").trim();
  const childName = String(formData.get("name") ?? "").trim();
  const age = Number(formData.get("age") ?? 0);
  const language = parseLanguage(formData.get("language"));
  const bedtimeTone = String(formData.get("bedtime_tone") ?? "calm").trim() || "calm";
  const interests = parseInterests(formData.get("interests"));

  if (!displayName) {
    throw new Error("Enter your name so the dashboard feels personal.");
  }

  if (!childName || !Number.isInteger(age) || age < 1 || age > 12) {
    throw new Error("Enter a child name and an age from 1 to 12.");
  }

  const { error: profileError } = await supabase.from("profiles").upsert({
    id: authData.user.id,
    display_name: displayName,
  });

  if (profileError) {
    throw new Error(profileError.message);
  }

  const { count, error: countError } = await supabase
    .from("children")
    .select("id", { count: "exact", head: true })
    .eq("parent_id", authData.user.id);

  if (countError) {
    throw new Error(countError.message);
  }

  if ((count ?? 0) >= MAX_CHILDREN_PER_PARENT) {
    throw new Error(`Phase 1 supports up to ${MAX_CHILDREN_PER_PARENT} children per parent.`);
  }

  const { error: childError } = await supabase.from("children").insert({
    parent_id: authData.user.id,
    name: childName,
    age,
    language,
    interests,
    bedtime_tone: bedtimeTone,
  });

  if (childError) {
    throw new Error(childError.message);
  }

  revalidatePath("/onboarding");
  revalidatePath("/dashboard");
  revalidatePath("/children");
  redirect("/dashboard");
}
