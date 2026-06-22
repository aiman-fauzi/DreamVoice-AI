import Link from "next/link";
import { notFound } from "next/navigation";

import { AudioPlayer } from "@/components/narrations/audio-player";
import { GoogleNarrationButton } from "@/components/narrations/google-narration-button";
import { ManualRecorder } from "@/components/narrations/manual-recorder";
import { Button } from "@/components/ui/button";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { STORY_THEMES } from "@/lib/story-themes";

export const dynamic = "force-dynamic";

type StoryPageProps = {
  params: Promise<{ id: string }>;
};

export default async function StoryPage({ params }: StoryPageProps) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: story } = await supabase
    .from("stories")
    .select("id,title,story_text,theme_key,language,created_at")
    .eq("id", id)
    .single();

  if (!story) {
    notFound();
  }

  const { data: narrations } = await supabase
    .from("narrations")
    .select("id,kind,provider,created_at")
    .eq("story_id", story.id)
    .order("created_at", { ascending: false });
  const theme = STORY_THEMES[story.theme_key as keyof typeof STORY_THEMES];

  return (
    <article className="mx-auto grid max-w-3xl gap-6">
      <header className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <p className="text-sm font-semibold text-coral">{theme?.label ?? "Story"} · {story.language}</p>
        <h1 className="mt-2 text-3xl font-semibold">{story.title ?? "Bedtime Story"}</h1>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button asChild variant="secondary"><Link href="/stories/new">Create another</Link></Button>
          <Button asChild variant="ghost"><Link href="/library">Back to library</Link></Button>
        </div>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        <GoogleNarrationButton storyId={story.id} />
        <ManualRecorder storyId={story.id} />
      </div>
      {narrations && narrations.length > 0 ? (
        <section className="grid gap-3 rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <h2 className="text-lg font-semibold">Saved audio</h2>
          {narrations.map((narration) => (
            <AudioPlayer
              key={narration.id}
              narrationId={narration.id}
              label={narration.kind === "google_tts" ? "Google narration" : "Parent recording"}
            />
          ))}
        </section>
      ) : null}
      <section className="whitespace-pre-wrap rounded-lg border border-slate-200 bg-white p-6 leading-8 text-slate-800 shadow-soft">
        {story.story_text}
      </section>
    </article>
  );
}