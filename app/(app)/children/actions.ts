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

export async function createChildAction(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    redirect("/login");
  }

  const name = String(formData.get("name") ?? "").trim();
  const age = Number(formData.get("age") ?? 0);
  const language = parseLanguage(formData.get("language"));
  const bedtimeTone = String(formData.get("bedtime_tone") ?? "calm").trim() || "calm";
  const interests = parseInterests(formData.get("interests"));

  if (!name || !Number.isInteger(age) || age < 1 || age > 12) {
    throw new Error("Enter a child name and an age from 1 to 12.");
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

  const { error } = await supabase.from("children").insert({
    parent_id: authData.user.id,
    name,
    age,
    language,
    interests,
    bedtime_tone: bedtimeTone,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/children");
  revalidatePath("/dashboard");
}