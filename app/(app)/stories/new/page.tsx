import { StoryGenerator } from "@/components/stories/story-generator";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function NewStoryPage() {
  const supabase = await createSupabaseServerClient();
  const { data: children } = await supabase
    .from("children")
    .select("id,name,language")
    .order("created_at", { ascending: false });

  return (
    <div className="grid gap-6">
      <header>
        <h1 className="text-3xl font-semibold">New story</h1>
        <p className="mt-2 text-slate-600">Choose a child profile and one of six bedtime themes.</p>
      </header>
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <StoryGenerator childrenProfiles={children ?? []} />
      </section>
    </div>
  );
}