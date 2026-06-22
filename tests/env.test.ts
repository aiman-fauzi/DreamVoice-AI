import { afterEach, describe, expect, it, vi } from "vitest";

import { getGoogleTtsVoice, getOptionalServerEnv, requireServerEnv } from "@/lib/env";

describe("environment helpers", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns required server env values", () => {
    vi.stubEnv("GEMINI_API_KEY", "gemini-test-key");

    expect(requireServerEnv("GEMINI_API_KEY")).toBe("gemini-test-key");
  });

  it("throws a setup-safe error when required values are missing", () => {
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "");

    expect(() => requireServerEnv("SUPABASE_SERVICE_ROLE_KEY")).toThrow(
      "Missing required environment variable: SUPABASE_SERVICE_ROLE_KEY",
    );
  });

  it("uses fallback values for optional env settings", () => {
    vi.stubEnv("APP_TTS_MONTHLY_CHARACTER_LIMIT", "");

    expect(getOptionalServerEnv("APP_TTS_MONTHLY_CHARACTER_LIMIT", "50000")).toBe("50000");
  });

  it("selects the configured English TTS voice", () => {
    vi.stubEnv("GOOGLE_TTS_DEFAULT_VOICE_EN", "en-US-Wavenet-F");

    expect(getGoogleTtsVoice("English")).toBe("en-US-Wavenet-F");
  });

  it("selects the configured Bahasa Malaysia TTS voice", () => {
    vi.stubEnv("GOOGLE_TTS_DEFAULT_VOICE_MS", "ms-MY-Wavenet-A");

    expect(getGoogleTtsVoice("Bahasa Malaysia")).toBe("ms-MY-Wavenet-A");
  });
});