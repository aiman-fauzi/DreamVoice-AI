import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const synthesizeSpeechMock = vi.fn(async () => [{ audioContent: Buffer.from("audio-bytes") }]);
  const textToSpeechClientMock = vi.fn(function TextToSpeechClient() {
    return {
      synthesizeSpeech: synthesizeSpeechMock,
    };
  });

  return { synthesizeSpeechMock, textToSpeechClientMock };
});

vi.mock("@google-cloud/text-to-speech", () => ({
  default: {
    TextToSpeechClient: mocks.textToSpeechClientMock,
  },
}));

import { synthesizeGoogleSpeech } from "@/lib/google-tts";

describe("Google TTS", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  it("uses Application Default Credentials when credentials JSON is not configured", async () => {
    vi.stubEnv("GOOGLE_APPLICATION_CREDENTIALS_JSON", "");

    const audio = await synthesizeGoogleSpeech({
      text: "Once upon a time",
      voiceName: "en-US-Wavenet-F",
    });

    expect(mocks.textToSpeechClientMock).toHaveBeenCalledWith();
    expect(mocks.synthesizeSpeechMock).toHaveBeenCalledWith({
      input: { text: "Once upon a time" },
      voice: {
        languageCode: "en-US",
        name: "en-US-Wavenet-F",
      },
      audioConfig: {
        audioEncoding: "MP3",
      },
    });
    expect(audio).toEqual(Buffer.from("audio-bytes"));
  });

  it("uses explicit JSON credentials when configured", async () => {
    vi.stubEnv("GOOGLE_APPLICATION_CREDENTIALS_JSON", JSON.stringify({ client_email: "tts@example.test" }));

    await synthesizeGoogleSpeech({
      text: "Pada suatu malam",
      voiceName: "ms-MY-Wavenet-A",
    });

    expect(mocks.textToSpeechClientMock).toHaveBeenCalledWith({
      credentials: {
        client_email: "tts@example.test",
      },
    });
  });
});
