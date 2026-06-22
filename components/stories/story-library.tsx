import Link from "next/link";

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
  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap gap-2">
        <Link className={`rounded-md px-3 py-2 text-sm font-semibold ${!selectedChildId ? "bg-ink text-white" : "bg-white text-ink"}`} href="/library">All</Link>
        {childrenProfiles.map((child) => (
          <Link
            key={child.id}
            className={`rounded-md px-3 py-2 text-sm font-semibold ${selectedChildId === child.id ? "bg-ink text-white" : "bg-white text-ink"}`}
            href={`/library?child=${child.id}`}
          >
            {child.name}
          </Link>
        ))}
      </div>

      {stories.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center text-slate-600">No saved stories yet.</div>
      ) : (
        <div className="grid gap-3">
          {stories.map((story) => {
            const theme = STORY_THEMES[story.theme_key as keyof typeof STORY_THEMES];
            return (
              <Link key={story.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft transition hover:border-moss" href={`/stories/${story.id}`}>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-coral">{theme?.label ?? "Story"} · {story.language}</p>
                <h2 className="mt-2 text-lg font-semibold text-ink">{story.title ?? "Bedtime Story"}</h2>
                <p className="mt-2 text-sm text-slate-600">Saved {new Date(story.created_at).toLocaleDateString()}</p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}