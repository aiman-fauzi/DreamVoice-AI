"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, CheckCircle2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Field, fieldControlClass } from "@/components/ui/field";
import { StatusMessage } from "@/components/ui/status-message";
import { ThemePicker } from "@/components/stories/theme-picker";
import { STORY_THEMES, type StoryThemeKey } from "@/lib/story-themes";

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
  const [selectedChildId, setSelectedChildId] = useState(childrenProfiles[0]?.id ?? "");
  const [selectedTheme, setSelectedTheme] = useState<StoryThemeKey>("calm_bedtime");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const selectedChild = childrenProfiles.find((child) => child.id === selectedChildId) ?? childrenProfiles[0];
  const selectedThemeDetails = STORY_THEMES[selectedTheme];

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const response = await fetch("/api/stories/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        childId: selectedChildId,
        themeKey: selectedTheme,
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
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="rounded-lg border border-slate-200 bg-skywash p-5 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-moss">Story composer</p>
        <h2 className="mt-2 text-xl font-semibold text-ink">Tonight&apos;s story setup</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">Choose the child and story direction before DreamVoice writes the private bedtime story.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-md bg-white p-3 ring-1 ring-slate-200">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Selected profile</p>
            <p className="mt-1 font-semibold text-ink">{selectedChild?.name}</p>
            <p className="text-sm text-slate-600">{selectedChild?.language}</p>
          </div>
          <div className="rounded-md bg-white p-3 ring-1 ring-slate-200">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Six bedtime directions</p>
            <p className="mt-1 font-semibold text-ink">{selectedThemeDetails.label}</p>
            <p className="text-sm text-slate-600">{selectedThemeDetails.promptFocus}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex items-start gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-ink text-sm font-bold text-white">1</span>
          <div>
            <h2 className="font-semibold text-ink">Choose child</h2>
            <p className="text-sm text-slate-600">The selected profile sets language, tone, and prompt details.</p>
          </div>
        </div>
        <Field label="Child profile">
          <select
            className={fieldControlClass}
            name="child_id"
            value={selectedChildId}
            onChange={(event) => setSelectedChildId(event.target.value)}
            disabled={isSubmitting}
            required
          >
            {childrenProfiles.map((child) => (
              <option key={child.id} value={child.id}>{child.name} ({child.language})</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex items-start gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-ink text-sm font-bold text-white">2</span>
          <div>
            <h2 className="font-semibold text-ink">Pick theme</h2>
            <p className="text-sm text-slate-600">Choose the story direction for tonight.</p>
          </div>
        </div>
        <ThemePicker selectedTheme={selectedTheme} onThemeChange={setSelectedTheme} disabled={isSubmitting} />
      </div>

      {error ? <StatusMessage tone="error">{error}</StatusMessage> : null}
      {isSubmitting && selectedChild ? <StatusMessage>Preparing a private bedtime story for {selectedChild.name}.</StatusMessage> : null}

      <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 text-moss" aria-hidden="true" />
          <div>
            <h2 className="font-semibold text-ink">3. Generate story</h2>
            <p className="text-sm text-slate-600">The story saves automatically to Story History.</p>
          </div>
        </div>
        <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          {isSubmitting ? "Generating story" : "Generate bedtime story"}
        </Button>
      </div>
    </form>
  );
}
