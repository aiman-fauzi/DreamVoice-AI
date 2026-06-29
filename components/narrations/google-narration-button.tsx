"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { StatusMessage } from "@/components/ui/status-message";

type GoogleNarrationButtonProps = {
  storyId: string;
};

export function GoogleNarrationButton({ storyId }: GoogleNarrationButtonProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [tone, setTone] = useState<"success" | "error" | "info">("info");
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
      setTone("error");
      setMessage(payload.error ?? "Narration could not be generated.");
      return;
    }

    setTone("success");
    setMessage("Generated narration is saved with this story.");
    router.refresh();
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <h2 className="text-lg font-semibold">Generated narration</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">Uses Google Cloud TTS only when the monthly app quota allows.</p>
      <Button className="mt-4" type="button" onClick={handleClick} disabled={isLoading}>
        {isLoading ? "Generating..." : "Generate narration"}
      </Button>
      {message ? <StatusMessage className="mt-3" tone={tone}>{message}</StatusMessage> : null}
    </div>
  );
}
