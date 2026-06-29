"use client";

import { type MouseEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { StatusMessage } from "@/components/ui/status-message";
import { MAX_MANUAL_RECORDING_BYTES } from "@/lib/limits";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type ManualRecorderProps = {
  storyId: string;
};

export function ManualRecorder({ storyId }: ManualRecorderProps) {
  const router = useRouter();
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const startedAtRef = useRef<number | null>(null);
  const stoppedAtRef = useRef<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [tone, setTone] = useState<"success" | "error" | "info">("info");

  async function startRecording(event: MouseEvent<HTMLButtonElement>) {
    setMessage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      startedAtRef.current = event.timeStamp;
      stoppedAtRef.current = null;
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      recorderRef.current = recorder;
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        await saveRecording();
      };
      recorder.start();
      setIsRecording(true);
    } catch {
      setTone("error");
      setMessage("Microphone permission is needed to record parent narration.");
    }
  }

  function stopRecording(event: MouseEvent<HTMLButtonElement>) {
    stoppedAtRef.current = event.timeStamp;
    recorderRef.current?.stop();
    setIsRecording(false);
  }

  async function saveRecording() {
    const blob = new Blob(chunksRef.current, { type: "audio/webm" });

    if (blob.size > MAX_MANUAL_RECORDING_BYTES) {
      setTone("error");
      setMessage("Recording is larger than the Phase 1 manual upload limit.");
      return;
    }

    const supabase = createSupabaseBrowserClient();
    const { data: authData } = await supabase.auth.getUser();

    if (!authData.user) {
      setTone("error");
      setMessage("Please log in again before saving a recording.");
      return;
    }

    const storagePath = `${authData.user.id}/${storyId}/${crypto.randomUUID()}.webm`;
    const upload = await supabase.storage.from("story-audio").upload(storagePath, blob, {
      contentType: "audio/webm",
      upsert: false,
    });

    if (upload.error) {
      setTone("error");
      setMessage(upload.error.message);
      return;
    }

    const durationSeconds = startedAtRef.current !== null && stoppedAtRef.current !== null
      ? Math.max(1, Math.round((stoppedAtRef.current - startedAtRef.current) / 1000))
      : null;
    const response = await fetch("/api/narrations/manual", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ storyId, storagePath, durationSeconds, sizeBytes: blob.size }),
    });
    const payload = (await response.json()) as { error?: string };

    if (response.ok) {
      setTone("success");
      setMessage("Manual recording saved with this story.");
      router.refresh();
    } else {
      setTone("error");
      setMessage(payload.error ?? "Recording metadata could not be saved.");
    }
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <h2 className="text-lg font-semibold">Parent recording</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">Record your own narration as the free alternative to generated voice cloning.</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button type="button" onClick={startRecording} disabled={isRecording}>Record</Button>
        <Button type="button" variant="secondary" onClick={stopRecording} disabled={!isRecording}>Stop</Button>
      </div>
      {message ? <StatusMessage className="mt-3" tone={tone}>{message}</StatusMessage> : null}
    </div>
  );
}
