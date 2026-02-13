
import { GoogleGenAI, Modality } from "@google/genai";
import { withRetry } from "./gemini-utils";

/**
 * Generates audio speech for character bios or messages using the Magma Ape voice (Charon).
 */
export async function textToMagmaApeSpeech(text: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const lorePrompt = `Say in a gritty, gravelly survivor voice: ${text}`;

  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: lorePrompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Charon' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("Audio synthesis failed.");
    return base64Audio;
  });
}
