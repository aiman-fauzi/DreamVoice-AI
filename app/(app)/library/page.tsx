import { StoryLibrary } from "@/components/stories/story-library";
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
      <header>
        <h1 className="text-3xl font-semibold">Story library</h1>
        <p className="mt-2 text-slate-600">Return later to read stories and play saved narration.</p>
      </header>
      <StoryLibrary stories={visibleStories} childrenProfiles={children ?? []} selectedChildId={child} />
    </div>
  );
}