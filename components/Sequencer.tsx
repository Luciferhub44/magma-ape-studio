
import React from 'react';
import { Zap, Image as ImageIcon, Video, Layers } from 'lucide-react';
import { Button } from './Button';
import { AssetType, SceneOption, RenderQuality } from '../types';

interface SequencerProps {
  assetType: AssetType;
  setAssetType: (t: AssetType) => void;
  variationCount: 1 | 4 | 8;
  setVariationCount: (n: 1 | 4 | 8) => void;
  selectedScene: SceneOption;
  setSelectedScene: (s: SceneOption) => void;
  customPrompt: string;
  setCustomPrompt: (p: string) => void;
  renderQuality: RenderQuality;
  setRenderQuality: (q: RenderQuality) => void;
  aspectRatio: string;
  setAspectRatio: (r: any) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export const Sequencer: React.FC<SequencerProps> = ({
  assetType,
  setAssetType,
  variationCount,
  setVariationCount,
  selectedScene,
  setSelectedScene,
  customPrompt,
  setCustomPrompt,
  renderQuality,
  setRenderQuality,
  aspectRatio,
  setAspectRatio,
  onGenerate,
  isLoading
}) => {
  return (
    <div className="bg-charcoal border-4 border-black p-8 space-y-8 magma-glow halftone relative">
      <h2 className="comic-font text-5xl flex items-center gap-4 italic text-[#FF4500]">
        <Zap className="text-toxic fill-toxic w-10 h-10" />
        SEQUENCER
      </h2>
      
      <div className="space-y-6">
        <div className="flex bg-black border-4 border-black p-1">
          <button onClick={() => setAssetType(AssetType.IMAGE)} className={`flex-1 flex items-center justify-center gap-3 py-4 text-xs font-black uppercase transition-all ${assetType === AssetType.IMAGE ? 'bg-[#FF4500] text-white shadow-lg' : 'text-zinc-700 hover:text-zinc-500'}`}>
            <ImageIcon className="w-4 h-4" /> IMAGE
          </button>
          <button onClick={() => setAssetType(AssetType.VIDEO)} className={`flex-1 flex items-center justify-center gap-3 py-4 text-xs font-black uppercase transition-all ${assetType === AssetType.VIDEO ? 'bg-toxic text-black shadow-lg' : 'text-zinc-700 hover:text-zinc-500'}`}>
            <Video className="w-4 h-4" /> VIDEO
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <label className="text-[11px] font-black text-zinc-500 uppercase flex items-center gap-2 italic">
              <Layers className="w-4 h-4 text-toxic" /> VARIATION BATCH
            </label>
            <span className="text-[10px] font-mono text-zinc-800">x{variationCount}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[1, 4, 8].map(n => (
              <button key={n} onClick={() => setVariationCount(n as any)} className={`py-3 text-sm font-black border-4 transition-all ${variationCount === n ? 'bg-white text-black border-black' : 'bg-black text-zinc-800 border-zinc-900 hover:border-zinc-700'}`}>
                {n}X
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black text-zinc-500 uppercase px-1 italic">SCENE CONFIG</label>
          <div className="grid grid-cols-2 gap-2">
            {Object.values(SceneOption).map((opt) => (
              <button key={opt} onClick={() => setSelectedScene(opt)} className={`px-3 py-3 text-[10px] font-black uppercase border-4 italic transition-all ${selectedScene === opt ? 'bg-[#FF4500] border-black text-white shadow-xl translate-x-1 -translate-y-1' : 'bg-zinc-950 border-zinc-900 text-zinc-700 hover:border-zinc-800'}`}>
                {opt === SceneOption.TECHNICAL ? 'TECH SHEET' : opt}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
           <label className="text-[11px] font-black text-zinc-500 uppercase px-1 italic">NEURAL OVERRIDE</label>
           <textarea value={customPrompt} onChange={(e) => setCustomPrompt(e.target.value)} placeholder="ENTER MODIFICATIONS..." className="w-full bg-black border-4 border-black p-5 text-sm italic text-toxic placeholder:text-zinc-950 outline-none h-32 resize-none shadow-inner scrollbar-hide" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-black text-zinc-700 block mb-2 uppercase italic tracking-widest">QUALITY</label>
            <select value={renderQuality} onChange={(e) => setRenderQuality(e.target.value as any)} className="w-full bg-black border-4 border-black p-3 text-xs font-black uppercase text-white outline-none cursor-pointer hover:border-zinc-800 transition-colors">
               {['1K', '2K', '4K', 'ULTRA'].map(q => <option key={q} value={q}>{q}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black text-zinc-700 block mb-2 uppercase italic tracking-widest">FORMAT</label>
            <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value as any)} className="w-full bg-black border-4 border-black p-3 text-xs font-black uppercase text-white outline-none cursor-pointer hover:border-zinc-800 transition-colors">
               {["1:1", "4:3", "16:9", "9:16"].map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>

        <Button onClick={onGenerate} isLoading={isLoading} className="w-full h-24 text-4xl shadow-[12px_12px_0_0_#000] active:shadow-none italic tracking-tighter">
          {variationCount > 1 ? `SYNTH BATCH` : 'SYNTHESIZE'}
        </Button>
      </div>
    </div>
  );
};
