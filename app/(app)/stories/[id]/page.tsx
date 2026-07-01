import Link from "next/link";
import { notFound } from "next/navigation";
import { Headphones, Lock } from "lucide-react";

import { AudioPlayer } from "@/components/narrations/audio-player";
import { GoogleNarrationButton } from "@/components/narrations/google-narration-button";
import { ManualRecorder } from "@/components/narrations/manual-recorder";
import { StoryDownloadButton } from "@/components/stories/story-download-button";
import { StoryEditor } from "@/components/stories/story-editor";
import { StoryStage } from "@/components/stories/story-stage";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { STORY_THEMES } from "@/lib/story-themes";

import { deleteStoryAction, updateStoryAction } from "./actions";

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
  const storyTitle = story.title ?? "Bedtime Story";
  const themeLabel = theme?.label ?? "Story";

  return (
    <article className="mx-auto grid max-w-5xl gap-6">
      <PageHeader
        eyebrow={`${themeLabel} | ${story.language}`}
        title={storyTitle}
        description={hasAudio ? "Read, listen, or download this private story." : "Read the story now, then add generated or parent narration when you are ready."}
        primaryAction={{ href: "/stories/new", label: "Create another" }}
        secondaryAction={{ href: "/library", label: "Story History" }}
      />

      <SectionCard>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-moss/10 text-moss">
              <Lock className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-ink">Private story toolkit</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">Download stays private to your browser. Sharing links are KIV for a later phase.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <StoryDownloadButton title={storyTitle} storyText={story.story_text} />
            <Button asChild variant="ghost"><Link href="/library">Back to history</Link></Button>
          </div>
        </div>
      </SectionCard>

      <section className="grid gap-3" aria-labelledby="listening-options-title">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-ink text-white">
            <Headphones className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 id="listening-options-title" className="text-xl font-semibold text-ink">Listening options</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">Choose generated narration when quota allows, or save a parent recording.</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <GoogleNarrationButton storyId={story.id} />
          <ManualRecorder storyId={story.id} />
        </div>
      </section>

      {hasAudio ? (
        <section className="grid gap-3" aria-labelledby="saved-audio-title">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-moss">Saved audio</p>
            <h2 id="saved-audio-title" className="mt-1 text-xl font-semibold text-ink">Private playback</h2>
          </div>
          <div className="grid gap-3">
            {narrations?.map((narration) => (
              <AudioPlayer
                key={narration.id}
                narrationId={narration.id}
                label={narration.kind === "google_tts" ? "Generated narration" : "Parent recording"}
              />
            ))}
          </div>
        </section>
      ) : (
        <EmptyState
          title="No saved audio yet"
          description="Generate narration or record your own. Once saved, audio appears here automatically."
        />
      )}

      <StoryStage
        title={storyTitle}
        themeLabel={themeLabel}
        language={story.language}
        savedDate={new Date(story.created_at).toLocaleDateString()}
        storyText={story.story_text}
      />

      <StoryEditor
        story={{ id: story.id, title: storyTitle, storyText: story.story_text }}
        updateAction={updateStoryAction}
        deleteAction={deleteStoryAction}
      />
    </article>
  );
}
