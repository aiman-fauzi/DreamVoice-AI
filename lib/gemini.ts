import { GoogleGenerativeAI } from "@google/generative-ai";

import { requireServerEnv } from "@/lib/env";

type GeneratedStory = {
  title: string;
  storyText: string;
};

export function parseGeneratedStory(rawText: string): GeneratedStory {
  const storyText = rawText.trim();
  const firstLine = storyText.split(/\r?\n/)[0]?.trim() ?? "";
  const hasTitle = firstLine.length > 0 && firstLine.length <= 80 && !firstLine.endsWith(".");

  return {
    title: hasTitle ? firstLine.replace(/^#+\s*/, "") : "Bedtime Story",
    storyText,
  };
}

export async function generateStoryText(prompt: string): Promise<GeneratedStory> {
  const apiKey = requireServerEnv("GEMINI_API_KEY");
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  const text = result.response.text();

  if (!text || text.trim().length === 0) {
    throw new Error("Gemini returned an empty story.");
  }

  return parseGeneratedStory(text);
}