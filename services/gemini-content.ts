
import { GoogleGenAI } from "@google/genai";
import { SceneOption, RenderQuality } from "../types";
import { SYSTEM_INSTRUCTION, SCENE_PROMPTS } from "../constants/prompts";
import { compressImage, getMimeType, withRetry } from "./gemini-utils";

export async function generateMagmaApeImage(
  scene: SceneOption,
  customPrompt?: string,
  aspectRatio: "1:1" | "3:4" | "4:3" | "9:16" | "16:9" = "1:1",
  referenceImages: string[] = [],
  quality: RenderQuality = '1K'
): Promise<{ url: string; sources?: any[] }> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  let userPrompt = SCENE_PROMPTS[scene];
  if (scene === SceneOption.CUSTOM && customPrompt) userPrompt = customPrompt;
  else if (customPrompt) userPrompt = `${userPrompt}. Additional details: ${customPrompt}`;

  const compressedRefs = await Promise.all(
    referenceImages.slice(0, 3).map(img => compressImage(img, 800))
  );

  const parts: any[] = [{ text: `${SYSTEM_INSTRUCTION}\n\nTask: ${userPrompt}` }];
  compressedRefs.forEach((base64) => {
    const mime = getMimeType(base64);
    const data = base64.includes(',') ? base64.split(',')[1] : base64;
    parts.push({ inlineData: { mimeType: mime, data: data } });
  });

  return withRetry(async () => {
    const isTechnical = scene === SceneOption.TECHNICAL;
    const modelName = isTechnical || quality !== '1K' ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
    
    const config: any = { imageConfig: { aspectRatio } };
    
    if (modelName === 'gemini-3-pro-image-preview') {
      config.imageConfig.imageSize = quality === 'ULTRA' ? '4K' : (quality === '1K' ? '1K' : quality);
      if (isTechnical) config.tools = [{ google_search: {} }];
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: [{ parts }],
      config: config,
    });

    const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (!part?.inlineData) throw new Error("Synthesis Failed: Core returned no image data.");
    
    return {
      url: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks
    };
  });
}

export async function generateMagmaApeLore(prompt: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{ parts: [{ text: `Generate a gritty, dark character biography (max 120 words) for an urban fantasy Ape character with these traits: ${prompt}. Tone: Hyper-stylized comic book noir. Mention Section 9 and the Radioactive Core.` }] }],
      config: { temperature: 0.85, topP: 0.9 }
    });
    return response.text || "History file corrupted. Data lost to the ruins.";
  });
}

export async function evolveMagmaApeAsset(
  baseImage: string,
  evolutionPrompt: string,
  quality: RenderQuality = '1K'
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const compressed = await compressImage(baseImage, 800);
  const mime = getMimeType(compressed);
  const data = compressed.includes(',') ? compressed.split(',')[1] : compressed;
  
  const parts = [
    { inlineData: { mimeType: mime, data: data } },
    { text: `${SYSTEM_INSTRUCTION}\n\nGenetic Evolution Directive: Mutate the current form. Mutation specifics: ${evolutionPrompt}. Ensure the cell-shaded comic art style is amplified.` }
  ];

  return withRetry(async () => {
    const modelName = quality === '1K' ? 'gemini-2.5-flash-image' : 'gemini-3-pro-image-preview';
    const config: any = {};
    if (modelName === 'gemini-3-pro-image-preview') {
       config.imageConfig = { imageSize: quality === 'ULTRA' ? '4K' : quality };
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: [{ parts }],
      config: config
    });
    const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (!part?.inlineData) throw new Error("Mutation rejected. The evolution path was blocked.");
    return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
  });
}
