import { getMonthKey } from "@/lib/tts-quota";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function DebugPage() {
  const supabase = await createSupabaseServerClient();
  const monthKey = getMonthKey();
  const [{ count: storyCount }, { count: narrationCount }, { data: usage }, { data: failedStories }] = await Promise.all([
    supabase.from("stories").select("id", { count: "exact", head: true }),
    supabase.from("narrations").select("id", { count: "exact", head: true }),
    supabase.from("tts_usage_monthly").select("characters_used").eq("month_key", monthKey).eq("provider", "google").maybeSingle(),
    supabase.from("stories").select("id,title,error_message,created_at").eq("status", "failed").order("created_at", { ascending: false }).limit(5),
  ]);

  return (
    <div className="grid gap-6">
      <header>
        <h1 className="text-3xl font-semibold">Prototype debug</h1>
        <p className="mt-2 text-slate-600">Owner-visible counters for development and free-tier monitoring.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        <Metric label="Stories" value={storyCount ?? 0} />
        <Metric label="Narrations" value={narrationCount ?? 0} />
        <Metric label="TTS characters" value={usage?.characters_used ?? 0} />
      </div>
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <h2 className="text-lg font-semibold">Recent failed generations</h2>
        {failedStories && failedStories.length > 0 ? (
          <ul className="mt-4 grid gap-2 text-sm text-slate-700">
            {failedStories.map((story) => <li key={story.id}>{story.title ?? story.id}: {story.error_message ?? "No message"}</li>)}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-slate-600">No failed generations found.</p>
        )}
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <p className="text-sm font-semibold text-slate-600">{label}</p>
      <p className="mt-2 text-3xl font-bold text-ink">{value}</p>
    </div>
  );
}