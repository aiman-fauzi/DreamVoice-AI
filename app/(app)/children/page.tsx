import { ChildForm } from "@/components/children/child-form";
import { ChildrenList } from "@/components/children/children-list";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { MAX_CHILDREN_PER_PARENT } from "@/lib/limits";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { createChildAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function ChildrenPage() {
  const supabase = await createSupabaseServerClient();
  const { data: children } = await supabase
    .from("children")
    .select("id,name,age,language,interests,bedtime_tone")
    .order("created_at", { ascending: false });

  const childProfiles = children ?? [];
  const canAddChild = childProfiles.length < MAX_CHILDREN_PER_PARENT;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section className="grid gap-4">
        <PageHeader
          eyebrow="Story setup"
          title="Children"
          description="Profiles keep story generation fast: choose a child, pick a theme, and DreamVoice handles the prompt."
          primaryAction={childProfiles.length > 0 ? { href: "/stories/new", label: "Generate story" } : { href: "/onboarding", label: "Finish setup" }}
        />
        <ChildrenList childrenProfiles={childProfiles} />
      </section>
      <aside>
        {canAddChild ? (
          <ChildForm action={createChildAction} />
        ) : (
          <EmptyState
            title="Profile limit reached"
            description={`Phase 1 supports up to ${MAX_CHILDREN_PER_PARENT} children per parent.`}
            primaryAction={{ href: "/stories/new", label: "Generate story" }}
          />
        )}
      </aside>
    </div>
  );
}
