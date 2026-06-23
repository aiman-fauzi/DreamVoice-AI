import textToSpeech from "@google-cloud/text-to-speech";

type SynthesizeSpeechInput = {
  text: string;
  voiceName: string;
};

function getLanguageCode(voiceName: string) {
  return voiceName.split("-").slice(0, 2).join("-");
}

function createTextToSpeechClient() {
  const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;

  if (!credentialsJson || credentialsJson.trim().length === 0) {
    return new textToSpeech.TextToSpeechClient();
  }

  const credentials = JSON.parse(credentialsJson) as Record<string, unknown>;

  return new textToSpeech.TextToSpeechClient({ credentials });
}

export async function synthesizeGoogleSpeech({ text, voiceName }: SynthesizeSpeechInput) {
  const client = createTextToSpeechClient();
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
