export type SupportedLanguage = "English" | "Bahasa Malaysia";

function requireEnvValue(name: string, value: string | undefined): string {
  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function requireServerEnv(name: string): string {
  return requireEnvValue(name, process.env[name]);
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
    url: requireEnvValue("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL),
    anonKey: requireEnvValue("NEXT_PUBLIC_SUPABASE_ANON_KEY", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  };
}
