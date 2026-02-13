
import { GoogleGenAI, VideoGenerationReferenceType } from "@google/genai";
import { SceneOption } from "../types";
import { SCENE_PROMPTS } from "../constants/prompts";
import { compressImage, getMimeType, withRetry } from "./gemini-utils";

export async function generateMagmaApeVideo(
  scene: SceneOption,
  customPrompt?: string,
  aspectRatio: "16:9" | "9:16" = "16:9",
  referenceImages: string[] = [],
  startingImage?: string
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  let userPrompt = (scene === SceneOption.CUSTOM && customPrompt) ? customPrompt : SCENE_PROMPTS[scene] + (customPrompt ? `. ${customPrompt}` : "");
  const videoPrompt = `High-octane urban comic action animation with heavy cel-shading and speed lines. Motion: ${userPrompt}`;

  return withRetry(async () => {
    let modelToUse = 'veo-3.1-fast-generate-preview';
    let finalAspectRatio = aspectRatio;
    let finalResolution: '720p' | '1080p' = '720p';
    let referencePayload: any = undefined;
    let startFrame: any = undefined;

    if (startingImage) {
      const compressedStart = await compressImage(startingImage, 720);
      startFrame = { imageBytes: compressedStart.split(',')[1] || compressedStart, mimeType: getMimeType(compressedStart) };
    } else if (referenceImages.length > 0) {
      modelToUse = 'veo-3.1-generate-preview';
      finalAspectRatio = '16:9';
      finalResolution = '720p';
      const compressedRefs = await Promise.all(referenceImages.slice(0, 3).map(img => compressImage(img, 720)));
      referencePayload = compressedRefs.map(base64 => ({
        image: { imageBytes: base64.split(',')[1] || base64, mimeType: getMimeType(base64) },
        referenceType: VideoGenerationReferenceType.ASSET,
      }));
    }

    let operation = await ai.models.generateVideos({
      model: modelToUse,
      prompt: videoPrompt,
      image: startFrame,
      config: {
        numberOfVideos: 1,
        resolution: finalResolution,
        aspectRatio: finalAspectRatio,
        referenceImages: referencePayload
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({operation: operation});
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  });
}
