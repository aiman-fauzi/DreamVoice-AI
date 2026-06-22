"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ThemePicker } from "@/components/stories/theme-picker";
import type { StoryThemeKey } from "@/lib/story-themes";

type ChildOption = {
  id: string;
  name: string;
  language: string;
};

type StoryGeneratorProps = {
  childrenProfiles: ChildOption[];
};

export function StoryGenerator({ childrenProfiles }: StoryGeneratorProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/stories/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        childId: formData.get("child_id"),
        themeKey: formData.get("theme_key") as StoryThemeKey,
      }),
    });
    const payload = (await response.json()) as { storyId?: string; error?: string };
    setIsSubmitting(false);

    if (!response.ok || !payload.storyId) {
      setError(payload.error ?? "Story generation failed.");
      return;
    }

    router.push(`/stories/${payload.storyId}`);
    router.refresh();
  }

  if (childrenProfiles.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center shadow-soft">
        <h2 className="text-lg font-semibold">Create a child profile first</h2>
        <p className="mt-2 text-sm text-slate-600">Stories are personalized from child profile details and selected themes.</p>
        <Button asChild className="mt-5"><Link href="/children">Add child</Link></Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <label className="grid gap-2 text-sm font-semibold text-slate-700">
        Child profile
        <select className="h-11 rounded-md border border-slate-300 bg-white px-3 outline-none focus:border-moss focus:ring-2 focus:ring-moss/20" name="child_id" required>
          {childrenProfiles.map((child) => (
            <option key={child.id} value={child.id}>{child.name} ({child.language})</option>
          ))}
        </select>
      </label>
      <ThemePicker selectedTheme="calm_bedtime" />
      {error ? <p className="rounded-md bg-coral/10 p-3 text-sm text-coral">{error}</p> : null}
      <Button type="submit" size="lg" disabled={isSubmitting}>{isSubmitting ? "Generating..." : "Generate story"}</Button>
    </form>
  );
}