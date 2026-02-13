
import React from 'react';
import { BrainCircuit, Zap } from 'lucide-react';
import { GeneratedAsset, AssetType } from '../types';

interface MainPreviewProps {
  latestAsset: GeneratedAsset | null;
  onView: (asset: GeneratedAsset) => void;
  onAnimate: (url: string) => void;
}

export const MainPreview: React.FC<MainPreviewProps> = ({ latestAsset, onView, onAnimate }) => {
  return (
    <div className="border-[12px] border-black bg-zinc-950 aspect-video relative group overflow-hidden shadow-2xl gritty hud-border">
      {latestAsset ? (
        <>
          <div className="absolute top-6 right-6 z-20 flex flex-col items-end gap-3">
            <div className="bg-toxic text-black font-black text-xs px-5 py-2 italic shadow-2xl comic-font tracking-widest">NEW_GEN_DETECTED</div>
            {latestAsset.quality === 'ULTRA' && <div className="bg-[#FF4500] text-white font-black text-xs px-5 py-2 italic shadow-2xl comic-font tracking-widest">ULTRA_4K_STABLE</div>}
          </div>
          {latestAsset.type === AssetType.VIDEO ? (
            <video src={latestAsset.url} controls autoPlay loop className="w-full h-full object-cover" />
          ) : (
            <img src={latestAsset.url} className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 p-12 flex flex-col justify-end gap-8 bg-black/60 backdrop-blur-[4px]">
            <h4 className="comic-font text-8xl italic uppercase leading-none truncate text-white tracking-tighter drop-shadow-[0_10px_30px_rgba(0,0,0,1)]">{latestAsset.prompt}</h4>
            <div className="flex gap-6">
              <button onClick={() => onView(latestAsset)} className="px-12 py-5 bg-white text-black font-black uppercase text-base border-4 border-black hover:scale-105 transition-all shadow-[10px_10px_0_0_#000] active:shadow-none active:translate-x-1 active:translate-y-1 comic-font tracking-widest">
                EXPAND PROFILE
              </button>
              {latestAsset.type === AssetType.IMAGE && (
                <button onClick={() => onAnimate(latestAsset.url)} className="px-12 py-5 bg-toxic text-black font-black uppercase text-base border-4 border-black hover:scale-105 transition-all shadow-[10px_10px_0_0_#000] active:shadow-none active:translate-x-1 active:translate-y-1 comic-font tracking-widest">
                  ANIMATE DNA
                </button>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="h-full flex flex-col items-center justify-center text-zinc-900 bg-[radial-gradient(circle_at_center,_#111_0%,_#000_100%)] p-20 text-center relative halftone">
          <BrainCircuit className="w-48 h-48 opacity-10 animate-pulse mb-10 text-[#FF4500]" />
          <p className="comic-font text-6xl uppercase tracking-[0.2em] opacity-10 italic text-white">CORE INTERFACE IDLE</p>
          <div className="flex items-center gap-10 mt-10 opacity-5">
             {[...Array(5)].map((_, i) => <Zap key={i} className="w-12 h-12" />)}
          </div>
        </div>
      )}
    </div>
  );
};
