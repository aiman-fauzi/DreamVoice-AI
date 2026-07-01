type SupportedLanguage = "English" | "Bahasa Malaysia";

export type ParsedChildProfile = {
  name: string;
  age: number;
  language: SupportedLanguage;
  interests: string[];
  bedtimeTone: string;
};

export function parseChildInterests(value: FormDataEntryValue | string | null) {
  if (typeof value !== "string") {
    return [];
  }

  return value
    .split(",")
    .map((interest) => interest.trim())
    .filter(Boolean)
    .slice(0, 8);
}

export function parseSupportedLanguage(value: FormDataEntryValue | string | null): SupportedLanguage {
  return value === "Bahasa Malaysia" ? "Bahasa Malaysia" : "English";
}

export function parseChildProfileForm(formData: FormData): ParsedChildProfile {
  const name = String(formData.get("name") ?? "").trim();
  const age = Number(formData.get("age") ?? 0);
  const language = parseSupportedLanguage(formData.get("language"));
  const interests = parseChildInterests(formData.get("interests"));
  const bedtimeTone = String(formData.get("bedtime_tone") ?? "calm").trim() || "calm";

  if (!name || !Number.isInteger(age) || age < 1 || age > 12) {
    throw new Error("Enter a child name and an age from 1 to 12.");
  }

  return { name, age, language, interests, bedtimeTone };
}
