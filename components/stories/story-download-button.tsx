"use client";

import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";

type StoryDownloadButtonProps = {
  title: string | null;
  storyText: string;
};

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug.length > 0 ? slug : "bedtime-story";
}

export function StoryDownloadButton({ title, storyText }: StoryDownloadButtonProps) {
  function handleDownload() {
    const fileTitle = title ?? "Bedtime Story";
    const blob = new Blob([storyText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${slugify(fileTitle)}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Button type="button" variant="secondary" onClick={handleDownload}>
      <Download className="h-4 w-4" aria-hidden="true" />
      Download story
    </Button>
  );
}
