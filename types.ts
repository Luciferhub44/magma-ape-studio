
export enum AssetType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO'
}

export type RenderQuality = '1K' | '2K' | '4K' | 'ULTRA';

export interface ApeAttribute {
  trait_type: string;
  value: string;
}

export interface ApeMetadata {
  name: string;
  image: string;
  description: string;
  attributes: ApeAttribute[];
}

export interface GroundingSource {
  web?: { uri: string; title: string };
  maps?: { uri: string; title: string };
}

export interface GeneratedAsset {
  id: string;
  url: string; 
  type: AssetType;
  prompt: string;
  timestamp: number;
  quality?: RenderQuality;
  sources?: GroundingSource[];
}

export enum SceneOption {
  THRONE = 'Throne Scene',
  ACTION = 'Action Scene',
  TECHNICAL = 'Reference Sheet',
  CINEMATIC = 'Cinematic Close-up',
  CUSTOM = 'Custom Scene'
}

export interface GenerationConfig {
  scene: SceneOption;
  customPrompt?: string;
  aspectRatio: "1:1" | "3:4" | "4:3" | "9:16" | "16:9";
  referenceImages?: string[]; 
  type: AssetType;
  quality: RenderQuality;
}
