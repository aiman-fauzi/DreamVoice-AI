"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Field, fieldControlClass } from "@/components/ui/field";
import { StatusMessage } from "@/components/ui/status-message";
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
      <EmptyState
        icon={BookOpen}
        title="Set up a child profile first"
        description="DreamVoice needs one child profile before it can generate a personalized bedtime story."
        primaryAction={{ href: "/onboarding", label: "Finish setup" }}
        secondaryAction={{ href: "/children", label: "Manage children" }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <div className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-ink text-sm font-bold text-white">1</span>
          <div>
            <h2 className="font-semibold text-ink">Choose child</h2>
            <p className="text-sm text-slate-600">The selected profile sets language, tone, and prompt details.</p>
          </div>
        </div>
        <Field label="Child profile">
          <select className={fieldControlClass} name="child_id" required>
            {childrenProfiles.map((child) => (
              <option key={child.id} value={child.id}>{child.name} ({child.language})</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-ink text-sm font-bold text-white">2</span>
          <div>
            <h2 className="font-semibold text-ink">Pick theme</h2>
            <p className="text-sm text-slate-600">Choose the story direction for tonight.</p>
          </div>
        </div>
        <ThemePicker selectedTheme="calm_bedtime" />
      </div>

      {error ? <StatusMessage tone="error">{error}</StatusMessage> : null}

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4">
        <div>
          <h2 className="font-semibold text-ink">3. Generate story</h2>
          <p className="text-sm text-slate-600">The story saves automatically to Story History.</p>
        </div>
        <Button type="submit" size="lg" disabled={isSubmitting}>
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          {isSubmitting ? "Generating..." : "Generate story"}
        </Button>
      </div>
    </form>
  );
}
