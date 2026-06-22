import { NextResponse } from "next/server";

import { generateStoryText } from "@/lib/gemini";
import { buildStoryPrompt } from "@/lib/prompt-builder";
import { isStoryThemeKey } from "@/lib/story-themes";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { childId?: string; themeKey?: string } | null;

  if (!body?.childId || !body.themeKey || !isStoryThemeKey(body.themeKey)) {
    return NextResponse.json({ error: "Choose a child and a valid story theme." }, { status: 400 });
  }

  const { data: child, error: childError } = await supabase
    .from("children")
    .select("id,parent_id,name,age,language,interests,bedtime_tone")
    .eq("id", body.childId)
    .eq("parent_id", authData.user.id)
    .single();

  if (childError || !child) {
    return NextResponse.json({ error: "Child profile not found." }, { status: 404 });
  }

  const prompt = buildStoryPrompt({
    child: {
      name: child.name,
      age: child.age,
      language: child.language,
      interests: child.interests,
      bedtimeTone: child.bedtime_tone,
    },
    themeKey: body.themeKey,
  });

  try {
    const generated = await generateStoryText(prompt);
    const { data: story, error } = await supabase
      .from("stories")
      .insert({
        parent_id: authData.user.id,
        child_id: child.id,
        theme_key: body.themeKey,
        title: generated.title,
        prompt,
        story_text: generated.storyText,
        language: child.language,
        status: "completed",
      })
      .select("id")
      .single();

    if (error || !story) {
      return NextResponse.json({ error: error?.message ?? "Story could not be saved." }, { status: 500 });
    }

    return NextResponse.json({ storyId: story.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Story generation failed.";

    return NextResponse.json({ error: message }, { status: 502 });
  }
}