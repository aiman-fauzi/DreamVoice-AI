import { ChildForm } from "@/components/children/child-form";
import { ChildrenList } from "@/components/children/children-list";
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
        <div>
          <h1 className="text-3xl font-semibold">Children</h1>
          <p className="mt-2 text-slate-600">Profiles personalize prompts while keeping Phase 1 details minimal.</p>
        </div>
        <ChildrenList childrenProfiles={childProfiles} />
      </section>
      <aside>
        {canAddChild ? (
          <ChildForm action={createChildAction} />
        ) : (
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
            <h2 className="text-lg font-semibold">Profile limit reached</h2>
            <p className="mt-2 text-sm text-slate-600">Phase 1 supports up to {MAX_CHILDREN_PER_PARENT} children per parent.</p>
          </div>
        )}
      </aside>
    </div>
  );
}