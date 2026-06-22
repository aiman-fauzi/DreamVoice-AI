import Link from "next/link";

import { Button } from "@/components/ui/button";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const { data: children } = await supabase.from("children").select("id,name,language").order("created_at", { ascending: false });
  const { count: storyCount } = await supabase.from("stories").select("id", { count: "exact", head: true });

  return (
    <div className="grid gap-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="mt-2 text-slate-600">Create a child profile, then generate a bedtime story from a preset theme.</p>
        </div>
        <Button asChild><Link href="/stories/new">New story</Link></Button>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <h2 className="text-lg font-semibold">Child profiles</h2>
          <p className="mt-2 text-3xl font-bold">{children?.length ?? 0}</p>
          <Button asChild className="mt-4" variant="secondary"><Link href="/children">Manage children</Link></Button>
        </section>
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <h2 className="text-lg font-semibold">Saved stories</h2>
          <p className="mt-2 text-3xl font-bold">{storyCount ?? 0}</p>
          <Button asChild className="mt-4" variant="secondary"><Link href="/library">Open library</Link></Button>
        </section>
      </div>
    </div>
  );
}