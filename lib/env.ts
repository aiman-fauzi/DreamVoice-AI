export type SupportedLanguage = "English" | "Bahasa Malaysia";

export function requireServerEnv(name: string): string {
  const value = process.env[name];

  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getOptionalServerEnv(name: string, fallback: string): string {
  const value = process.env[name];

  return value && value.trim().length > 0 ? value : fallback;
}

export function getGoogleTtsVoice(language: SupportedLanguage): string {
  if (language === "Bahasa Malaysia") {
    return getOptionalServerEnv("GOOGLE_TTS_DEFAULT_VOICE_MS", "ms-MY-Wavenet-A");
  }

  return getOptionalServerEnv("GOOGLE_TTS_DEFAULT_VOICE_EN", "en-US-Wavenet-F");
}

export function getPublicSupabaseEnv() {
  return {
    url: requireServerEnv("NEXT_PUBLIC_SUPABASE_URL"),
    anonKey: requireServerEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  };
}