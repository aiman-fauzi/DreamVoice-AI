import Link from "next/link";
import { Pencil, Sparkles, Trash2, Users } from "lucide-react";

import { ChildForm } from "@/components/children/child-form";
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
  updateAction?: (formData: FormData) => Promise<void>;
  deleteAction?: (formData: FormData) => Promise<void>;
};

export function ChildrenList({ childrenProfiles, updateAction, deleteAction }: ChildrenListProps) {
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
      {childrenProfiles.map((child) => {
        const titleId = `child-${child.id}-title`;

        return (
          <article key={child.id} aria-labelledby={titleId} className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 id={titleId} className="text-lg font-semibold">{child.name}</h2>
                <p className="mt-1 text-sm text-slate-600">Age {child.age} | {child.language} | {child.bedtime_tone}</p>
              </div>
              <span className="rounded-md bg-moss/10 px-2 py-1 text-xs font-semibold text-moss">Ready for stories</span>
            </div>
            {child.interests.length > 0 ? <p className="mt-3 text-sm text-slate-700">Interests: {child.interests.join(", ")}</p> : null}
            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild variant="secondary" size="sm">
                <Link href="/stories/new"><Sparkles className="h-4 w-4" aria-hidden="true" />Generate story</Link>
              </Button>
              {deleteAction ? (
                <form action={deleteAction}>
                  <input type="hidden" name="child_id" value={child.id} />
                  <Button type="submit" variant="ghost" size="sm" className="text-red-700 hover:bg-red-50 hover:text-red-800">
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    Delete profile
                  </Button>
                </form>
              ) : null}
            </div>
            {updateAction ? (
              <details className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-3">
                <summary role="button" className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                  Edit profile
                </summary>
                <div className="mt-3">
                  <ChildForm
                    action={updateAction}
                    child={child}
                    title={`Edit ${child.name}`}
                    description="Update the details DreamVoice uses for future stories. Existing saved stories stay unchanged."
                    submitLabel="Save changes"
                    compact
                  />
                </div>
              </details>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}

