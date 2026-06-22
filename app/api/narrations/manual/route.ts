import { NextResponse } from "next/server";

import { isManualRecordingSizeAllowed, isOwnedStoryAudioPath } from "@/lib/audio";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    storyId?: string;
    storagePath?: string;
    durationSeconds?: number;
    sizeBytes?: number;
  } | null;

  if (!body?.storyId || !body.storagePath || !isManualRecordingSizeAllowed(Number(body.sizeBytes))) {
    return NextResponse.json({ error: "Valid recording metadata is required." }, { status: 400 });
  }

  const { data: story } = await supabase
    .from("stories")
    .select("id,parent_id")
    .eq("id", body.storyId)
    .eq("parent_id", authData.user.id)
    .single();

  if (!story) {
    return NextResponse.json({ error: "Story not found." }, { status: 404 });
  }

  if (!isOwnedStoryAudioPath({ parentId: authData.user.id, storyId: story.id, storagePath: body.storagePath })) {
    return NextResponse.json({ error: "Recording path is not allowed." }, { status: 400 });
  }

  const { data: narration, error } = await supabase
    .from("narrations")
    .insert({
      parent_id: authData.user.id,
      story_id: story.id,
      kind: "manual_recording",
      provider: "browser_recording",
      storage_path: body.storagePath,
      duration_seconds: body.durationSeconds ?? null,
      status: "completed",
    })
    .select("id")
    .single();

  if (error || !narration) {
    return NextResponse.json({ error: error?.message ?? "Recording could not be saved." }, { status: 500 });
  }

  return NextResponse.json({ narrationId: narration.id });
}