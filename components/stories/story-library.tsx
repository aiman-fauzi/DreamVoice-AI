import Link from "next/link";
import { BookOpen, Headphones } from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";
import { STORY_THEMES } from "@/lib/story-themes";

type StoryListItem = {
  id: string;
  title: string | null;
  child_id: string;
  theme_key: string;
  language: string;
  created_at: string;
};

type ChildFilter = {
  id: string;
  name: string;
};

type StoryLibraryProps = {
  stories: StoryListItem[];
  childrenProfiles: ChildFilter[];
  selectedChildId?: string;
};

function filterClass(active: boolean) {
  return `rounded-md px-3 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
    active ? "bg-ink text-white shadow-sm" : "bg-white text-ink ring-1 ring-slate-200 hover:bg-slate-50"
  }`;
}

export function StoryLibrary({ stories, childrenProfiles, selectedChildId }: StoryLibraryProps) {
  const childNames = new Map(childrenProfiles.map((child) => [child.id, child.name]));
  const isFiltered = Boolean(selectedChildId);

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap gap-2" aria-label="Filter story history by child">
        <Link aria-current={!selectedChildId ? "page" : undefined} className={filterClass(!selectedChildId)} href="/library">
          All stories
        </Link>
        {childrenProfiles.map((child) => {
          const active = selectedChildId === child.id;

          return (
            <Link
              key={child.id}
              aria-current={active ? "page" : undefined}
              className={filterClass(active)}
              href={`/library?child=${child.id}`}
            >
              {child.name}
            </Link>
          );
        })}
      </div>

      {stories.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title={isFiltered ? "No stories for this child yet" : "No story history yet"}
          description={isFiltered ? "Generate a story for this child and it will appear here automatically." : "Generate your first bedtime story and DreamVoice will save it here for reading and narration."}
          primaryAction={{ href: "/stories/new", label: "Generate story" }}
          secondaryAction={isFiltered ? { href: "/library", label: "Show all stories" } : undefined}
        />
      ) : (
        <div className="grid gap-3">
          {stories.map((story) => {
            const theme = STORY_THEMES[story.theme_key as keyof typeof STORY_THEMES];
            const childName = childNames.get(story.child_id);

            return (
              <Link key={story.id} className="group rounded-lg border border-slate-200 bg-white p-4 shadow-soft transition hover:border-moss hover:bg-moss/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink" href={`/stories/${story.id}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-moss">{theme?.label ?? "Story"} · {story.language}</p>
                    <h2 className="mt-2 text-lg font-semibold text-ink group-hover:text-moss">{story.title ?? "Bedtime Story"}</h2>
                    <p className="mt-2 text-sm text-slate-600">
                      {childName ? `${childName} · ` : ""}Saved {new Date(story.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-md bg-moss/10 px-2.5 py-1 text-xs font-semibold text-moss">
                    <Headphones className="h-3.5 w-3.5" aria-hidden="true" />
                    Read or listen
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                  <span className="rounded-md bg-skywash px-2.5 py-1 text-ink">Private story</span>
                  <span className="rounded-md bg-slate-100 px-2.5 py-1">Saved bedtime favorite</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
