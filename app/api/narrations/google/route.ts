import { NextResponse } from "next/server";

import { getGoogleTtsVoice, getOptionalServerEnv } from "@/lib/env";
import { synthesizeGoogleSpeech } from "@/lib/google-tts";
import { canUseTts, getMonthKey } from "@/lib/tts-quota";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { storyId?: string } | null;

  if (!body?.storyId) {
    return NextResponse.json({ error: "Story id is required." }, { status: 400 });
  }

  const { data: story, error: storyError } = await supabase
    .from("stories")
    .select("id,parent_id,story_text,language")
    .eq("id", body.storyId)
    .eq("parent_id", authData.user.id)
    .single();

  if (storyError || !story) {
    return NextResponse.json({ error: "Story not found." }, { status: 404 });
  }

  const monthKey = getMonthKey();
  const requested = story.story_text.length;
  const limit = Number(getOptionalServerEnv("APP_TTS_MONTHLY_CHARACTER_LIMIT", "50000"));
  const { data: usage } = await supabase
    .from("tts_usage_monthly")
    .select("id,characters_used")
    .eq("parent_id", authData.user.id)
    .eq("month_key", monthKey)
    .eq("provider", "google")
    .maybeSingle();
  const quota = canUseTts({ used: usage?.characters_used ?? 0, requested, limit });

  if (!quota.allowed) {
    return NextResponse.json(
      { error: "Google narration quota is unavailable. Manual recording is still available.", remaining: quota.remaining },
      { status: 429 },
    );
  }

  const voiceName = getGoogleTtsVoice(story.language);
  const narrationId = crypto.randomUUID();
  const storagePath = `${authData.user.id}/${story.id}/${narrationId}.mp3`;

  try {
    const audio = await synthesizeGoogleSpeech({ text: story.story_text, voiceName });
    const { error: uploadError } = await supabase.storage
      .from("story-audio")
      .upload(storagePath, audio, { contentType: "audio/mpeg", upsert: false });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { error: narrationError } = await supabase.from("narrations").insert({
      id: narrationId,
      parent_id: authData.user.id,
      story_id: story.id,
      kind: "google_tts",
      provider: "google",
      voice_name: voiceName,
      text_characters: requested,
      storage_path: storagePath,
      status: "completed",
    });

    if (narrationError) {
      return NextResponse.json({ error: narrationError.message }, { status: 500 });
    }

    await supabase.from("tts_usage_monthly").upsert(
      {
        id: usage?.id,
        parent_id: authData.user.id,
        month_key: monthKey,
        provider: "google",
        characters_used: (usage?.characters_used ?? 0) + requested,
      },
      { onConflict: "parent_id,month_key,provider" },
    );

    return NextResponse.json({ narrationId });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Google narration failed.";

    return NextResponse.json({ error: message }, { status: 502 });
  }
}