import { StoryLibrary } from "@/components/stories/story-library";
import { PageHeader } from "@/components/ui/page-header";
import { filterStoriesByChild, sortStoriesNewestFirst } from "@/lib/library";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type LibraryPageProps = {
  searchParams: Promise<{ child?: string }>;
};

export default async function LibraryPage({ searchParams }: LibraryPageProps) {
  const { child } = await searchParams;
  const supabase = await createSupabaseServerClient();
  const [{ data: stories }, { data: children }] = await Promise.all([
    supabase.from("stories").select("id,title,child_id,theme_key,language,created_at").order("created_at", { ascending: false }),
    supabase.from("children").select("id,name").order("created_at", { ascending: false }),
  ]);
  const orderedStories = sortStoriesNewestFirst(stories ?? []);
  const visibleStories = filterStoriesByChild(orderedStories, child);

  return (
    <div className="grid gap-6">
      <PageHeader
        eyebrow="Story History"
        title="Story History"
        description="Return later to read saved stories and play private narration."
        primaryAction={{ href: "/stories/new", label: "Generate story" }}
      />
      <StoryLibrary stories={visibleStories} childrenProfiles={children ?? []} selectedChildId={child} />
    </div>
  );
}
