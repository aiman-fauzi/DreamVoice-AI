import Link from "next/link";
import { notFound } from "next/navigation";

import { AudioPlayer } from "@/components/narrations/audio-player";
import { GoogleNarrationButton } from "@/components/narrations/google-narration-button";
import { ManualRecorder } from "@/components/narrations/manual-recorder";
import { StoryDownloadButton } from "@/components/stories/story-download-button";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
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
  const hasAudio = Boolean(narrations && narrations.length > 0);

  return (
    <article className="mx-auto grid max-w-4xl gap-6">
      <PageHeader
        eyebrow={`${theme?.label ?? "Story"} · ${story.language}`}
        title={story.title ?? "Bedtime Story"}
        description={hasAudio ? "Read, listen, or download this private story." : "Read the story now, then add generated or parent narration when you are ready."}
        primaryAction={{ href: "/stories/new", label: "Create another" }}
        secondaryAction={{ href: "/library", label: "Story History" }}
      />

      <SectionCard>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-ink">Story actions</h2>
            <p className="mt-1 text-sm text-slate-600">Download is private to your browser. Sharing links are KIV for a later phase.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StoryDownloadButton title={story.title} storyText={story.story_text} />
            <Button asChild variant="ghost"><Link href="/library">Back to history</Link></Button>
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-4 md:grid-cols-2">
        <GoogleNarrationButton storyId={story.id} />
        <ManualRecorder storyId={story.id} />
      </div>

      {hasAudio ? (
        <SectionCard className="grid gap-3">
          <h2 className="text-lg font-semibold">Saved audio</h2>
          {narrations?.map((narration) => (
            <AudioPlayer
              key={narration.id}
              narrationId={narration.id}
              label={narration.kind === "google_tts" ? "Generated narration" : "Parent recording"}
            />
          ))}
        </SectionCard>
      ) : (
        <EmptyState
          title="No saved audio yet"
          description="Generate narration or record your own. Once saved, audio appears here automatically."
        />
      )}

      <section className="whitespace-pre-wrap rounded-lg border border-slate-200 bg-white p-6 leading-8 text-slate-800 shadow-soft">
        {story.story_text}
      </section>
    </article>
  );
}
