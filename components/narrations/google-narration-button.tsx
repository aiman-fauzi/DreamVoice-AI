"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

type GoogleNarrationButtonProps = {
  storyId: string;
};

export function GoogleNarrationButton({ storyId }: GoogleNarrationButtonProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    setMessage(null);
    setIsLoading(true);
    const response = await fetch("/api/narrations/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ storyId }),
    });
    const payload = (await response.json()) as { narrationId?: string; error?: string };
    setIsLoading(false);

    if (!response.ok) {
      setMessage(payload.error ?? "Narration could not be generated.");
      return;
    }

    setMessage("Generated narration is saved with this story.");
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <h2 className="text-lg font-semibold">Generated narration</h2>
      <p className="mt-2 text-sm text-slate-600">Uses Google Cloud TTS only when the monthly app quota allows.</p>
      <Button className="mt-4" type="button" onClick={handleClick} disabled={isLoading}>
        {isLoading ? "Generating..." : "Generate narration"}
      </Button>
      {message ? <p className="mt-3 text-sm text-slate-700">{message}</p> : null}
    </div>
  );
}