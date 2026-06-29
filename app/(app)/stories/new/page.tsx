import { StoryGenerator } from "@/components/stories/story-generator";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
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
      <PageHeader
        eyebrow="Create"
        title="Generate a bedtime story"
        description="Choose a child, pick one of six themes, and DreamVoice saves the result to Story History."
        secondaryAction={{ href: "/library", label: "Story History" }}
      />
      <SectionCard>
        <StoryGenerator childrenProfiles={children ?? []} />
      </SectionCard>
    </div>
  );
}
