import textToSpeech from "@google-cloud/text-to-speech";

import { requireServerEnv } from "@/lib/env";

type SynthesizeSpeechInput = {
  text: string;
  voiceName: string;
};

function getLanguageCode(voiceName: string) {
  return voiceName.split("-").slice(0, 2).join("-");
}

export async function synthesizeGoogleSpeech({ text, voiceName }: SynthesizeSpeechInput) {
  const credentialsJson = requireServerEnv("GOOGLE_APPLICATION_CREDENTIALS_JSON");
  const credentials = JSON.parse(credentialsJson) as Record<string, unknown>;
  const client = new textToSpeech.TextToSpeechClient({ credentials });
  const [response] = await client.synthesizeSpeech({
    input: { text },
    voice: {
      languageCode: getLanguageCode(voiceName),
      name: voiceName,
    },
    audioConfig: {
      audioEncoding: "MP3",
    },
  });

  if (!response.audioContent) {
    throw new Error("Google TTS returned no audio content.");
  }

  return Buffer.from(response.audioContent as Uint8Array);
}