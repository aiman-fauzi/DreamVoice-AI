import Link from "next/link";
import { BookOpen, Sparkles, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { STORY_THEMES } from "@/lib/story-themes";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const [{ data: profile }, { data: children }, { count: storyCount }, { data: recentStories }] = await Promise.all([
    supabase.from("profiles").select("display_name").maybeSingle(),
    supabase.from("children").select("id,name,language").order("created_at", { ascending: false }),
    supabase.from("stories").select("id", { count: "exact", head: true }),
    supabase.from("stories").select("id,title,theme_key,language,created_at").order("created_at", { ascending: false }).limit(3),
  ]);

  const childCount = children?.length ?? 0;
  const hasChildren = childCount > 0;
  const hasStories = (storyCount ?? 0) > 0;
  const displayName = profile?.display_name?.trim();

  return (
    <div className="grid gap-6">
      <PageHeader
        eyebrow="Welcome dashboard"
        title={displayName ? `Good evening, ${displayName}` : "Tonight's story flow"}
        description={hasChildren ? "Choose a child, generate a story, then return to story history whenever you need it." : "Finish setup once, then DreamVoice can guide you straight into your first story."}
        primaryAction={hasChildren ? { href: "/stories/new", label: "Generate story" } : { href: "/onboarding", label: "Finish setup" }}
        secondaryAction={hasStories ? { href: "/library", label: "Story History" } : hasChildren ? { href: "/children", label: "Add child" } : undefined}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard icon={Users} label="Child profiles" value={childCount} actionHref="/children" actionLabel="Manage" />
        <MetricCard icon={BookOpen} label="Saved stories" value={storyCount ?? 0} actionHref="/library" actionLabel="History" />
        <MetricCard icon={Sparkles} label="Next step" value={hasChildren ? "Story" : "Setup"} actionHref={hasChildren ? "/stories/new" : "/onboarding"} actionLabel={hasChildren ? "Generate" : "Start"} />
      </div>

      {!hasChildren ? (
        <EmptyState
          icon={Users}
          title="Create your first child profile"
          description="Child details power the prompt, language, tone, and theme selection. Setup takes less than a minute."
          primaryAction={{ href: "/onboarding", label: "Finish setup" }}
        />
      ) : !hasStories ? (
        <EmptyState
          icon={Sparkles}
          title="Your first story is one click away"
          description={`Start with ${children?.[0]?.name ?? "your child"}, choose one of six themes, and DreamVoice will save the story to history.`}
          primaryAction={{ href: "/stories/new", label: "Generate first story" }}
          secondaryAction={{ href: "/children", label: "Review children" }}
        />
      ) : (
        <SectionCard>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-ink">Recent stories</h2>
              <p className="mt-1 text-sm text-slate-600">Pick up where bedtime left off.</p>
            </div>
            <Button asChild variant="secondary">
              <Link href="/library">Open Story History</Link>
            </Button>
          </div>
          <div className="mt-4 grid gap-3">
            {(recentStories ?? []).map((story) => {
              const theme = STORY_THEMES[story.theme_key as keyof typeof STORY_THEMES];
              return (
                <Link key={story.id} href={`/stories/${story.id}`} className="rounded-md border border-slate-200 p-4 transition hover:border-moss hover:bg-moss/5">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-moss">{theme?.label ?? "Story"} · {story.language}</p>
                  <h3 className="mt-1 font-semibold text-ink">{story.title ?? "Bedtime Story"}</h3>
                  <p className="mt-1 text-sm text-slate-600">Saved {new Date(story.created_at).toLocaleDateString()}</p>
                </Link>
              );
            })}
          </div>
        </SectionCard>
      )}
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, actionHref, actionLabel }: { icon: typeof Users; label: string; value: string | number; actionHref: string; actionLabel: string }) {
  return (
    <SectionCard className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-600">{label}</p>
          <p className="mt-2 text-2xl font-bold text-ink">{value}</p>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-moss/10 text-moss">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      <Button asChild className="mt-4 w-full" variant="secondary" size="sm">
        <Link href={actionHref}>{actionLabel}</Link>
      </Button>
    </SectionCard>
  );
}
