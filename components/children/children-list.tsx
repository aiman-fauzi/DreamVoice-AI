import Link from "next/link";
import { Sparkles, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

type Child = {
  id: string;
  name: string;
  age: number;
  language: string;
  interests: string[];
  bedtime_tone: string;
};

type ChildrenListProps = {
  childrenProfiles: Child[];
};

export function ChildrenList({ childrenProfiles }: ChildrenListProps) {
  if (childrenProfiles.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="Create your first child profile"
        description="A child profile unlocks story generation and keeps each story personal without asking for unnecessary details."
        primaryAction={{ href: "/onboarding", label: "Finish setup" }}
      />
    );
  }

  return (
    <div className="grid gap-3">
      {childrenProfiles.map((child) => (
        <article key={child.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">{child.name}</h2>
              <p className="mt-1 text-sm text-slate-600">Age {child.age} · {child.language} · {child.bedtime_tone}</p>
            </div>
            <span className="rounded-md bg-moss/10 px-2 py-1 text-xs font-semibold text-moss">Ready for stories</span>
          </div>
          {child.interests.length > 0 ? <p className="mt-3 text-sm text-slate-700">Interests: {child.interests.join(", ")}</p> : null}
          <Button asChild className="mt-4" variant="secondary" size="sm">
            <Link href="/stories/new"><Sparkles className="h-4 w-4" aria-hidden="true" /> Generate story</Link>
          </Button>
        </article>
      ))}
    </div>
  );
}
