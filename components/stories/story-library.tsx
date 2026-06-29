import Link from "next/link";
import { BookOpen } from "lucide-react";

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

export function StoryLibrary({ stories, childrenProfiles, selectedChildId }: StoryLibraryProps) {
  const childNames = new Map(childrenProfiles.map((child) => [child.id, child.name]));
  const isFiltered = Boolean(selectedChildId);

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap gap-2" aria-label="Filter story history by child">
        <Link className={`rounded-md px-3 py-2 text-sm font-semibold transition ${!selectedChildId ? "bg-ink text-white" : "bg-white text-ink ring-1 ring-slate-200 hover:bg-slate-50"}`} href="/library">All</Link>
        {childrenProfiles.map((child) => (
          <Link
            key={child.id}
            className={`rounded-md px-3 py-2 text-sm font-semibold transition ${selectedChildId === child.id ? "bg-ink text-white" : "bg-white text-ink ring-1 ring-slate-200 hover:bg-slate-50"}`}
            href={`/library?child=${child.id}`}
          >
            {child.name}
          </Link>
        ))}
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
            return (
              <Link key={story.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft transition hover:border-moss hover:bg-moss/5" href={`/stories/${story.id}`}>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-moss">{theme?.label ?? "Story"} · {story.language}</p>
                <h2 className="mt-2 text-lg font-semibold text-ink">{story.title ?? "Bedtime Story"}</h2>
                <p className="mt-2 text-sm text-slate-600">
                  {childNames.get(story.child_id) ? `${childNames.get(story.child_id)} · ` : ""}Saved {new Date(story.created_at).toLocaleDateString()}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}


