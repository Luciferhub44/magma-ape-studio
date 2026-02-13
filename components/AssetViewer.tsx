
import React, { useState } from 'react';
import { X, Fingerprint, ExternalLink, ScrollText, Dna, Download, Trash2, Volume2 } from 'lucide-react';
import { GeneratedAsset, AssetType } from '../types';
import { Button } from './Button';
import { textToMagmaApeSpeech } from '../services/gemini-tts';
import { decodeBase64, decodeAudioData } from '../services/gemini-utils';

interface AssetViewerProps {
  asset: GeneratedAsset;
  onClose: () => void;
  onEvolve: (prompt: string) => void;
  onDelete: (id: string) => void;
  onDecodeLore: () => void;
  isEvolving: boolean;
  isGeneratingLore: boolean;
  characterLore: string | null;
}

export const AssetViewer: React.FC<AssetViewerProps> = ({
  asset,
  onClose,
  onEvolve,
  onDelete,
  onDecodeLore,
  isEvolving,
  isGeneratingLore,
  characterLore
}) => {
  const [evolutionPrompt, setEvolutionPrompt] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = async () => {
    if (!characterLore || isSpeaking) return;
    setIsSpeaking(true);
    try {
      const base64 = await textToMagmaApeSpeech(characterLore);
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const buffer = await decodeAudioData(decodeBase64(base64), audioCtx, 24000);
      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtx.destination);
      source.onended = () => setIsSpeaking(false);
      source.start();
    } catch (e) {
      console.error("Speech playback failed:", e);
      setIsSpeaking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] bg-black/98 flex items-center justify-center p-4 backdrop-blur-md">
      <button 
        onClick={onClose} 
        className="absolute top-6 right-6 z-[100] p-4 bg-black/60 border-4 border-black text-white hover:text-toxic transition-all hover:rotate-90 hover:bg-black/90 group"
        title="Close (Esc)"
      >
        <X className="w-10 h-10 group-hover:scale-110" />
      </button>
      
      <div className="max-w-6xl w-full bg-charcoal border-8 border-black flex flex-col md:flex-row shadow-[0_0_150px_rgba(255,69,0,0.15)] overflow-hidden halftone">
        <div className="flex-1 bg-black flex items-center justify-center relative gritty">
          {asset.type === AssetType.VIDEO ? (
            <video src={asset.url} controls autoPlay loop className="max-h-[85vh] w-full object-contain" />
          ) : (
            <img src={asset.url} className="max-h-[85vh] w-full object-contain" alt="Preview" />
          )}
          <div className="absolute top-6 left-6 flex flex-col gap-3">
             <div className="bg-black/80 backdrop-blur-md px-5 py-2 border-2 border-toxic flex items-center gap-3">
                <Fingerprint className="w-5 h-5 text-toxic" />
                <span className="comic-font text-2xl uppercase text-toxic">ID_{asset.id.slice(-6)}</span>
             </div>
             {asset.sources && asset.sources.length > 0 && (
               <div className="bg-black/80 backdrop-blur-md p-4 border-2 border-blue-500/50 space-y-3">
                 <span className="text-[10px] font-black uppercase text-blue-400 block mb-1">DATA CITATIONS</span>
                 {asset.sources.map((src, i) => (
                   <a key={i} href={src.web?.uri} target="_blank" className="flex items-center gap-3 text-[11px] text-zinc-300 hover:text-white group transition-all">
                      <ExternalLink className="w-4 h-4 text-blue-400 group-hover:scale-125" />
                      {src.web?.title?.slice(0, 30)}
                   </a>
                 ))}
               </div>
             )}
          </div>
        </div>
        <div className="w-full md:w-[450px] p-10 space-y-10 border-t-8 md:border-t-0 md:border-l-8 border-black bg-zinc-950 relative overflow-y-auto max-h-screen">
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <span className="px-3 py-1 bg-toxic text-black font-black uppercase text-[10px] italic">GENOMIC_DATA_V3.1</span>
              <span className="text-zinc-600 text-[10px] font-mono">Q_RATE: {asset.quality}</span>
            </div>
            <h3 className="comic-font text-6xl leading-none uppercase italic tracking-tighter text-white">{asset.prompt.slice(0, 60)}...</h3>
            
            {characterLore ? (
              <div className="bg-black/50 p-6 border-2 border-toxic/20 italic text-xs leading-relaxed text-zinc-400 border-l-8 border-l-toxic shadow-inner halftone relative group">
                <div className="flex justify-between items-center mb-4">
                  <p className="comic-font text-toxic text-3xl flex items-center gap-3"><ScrollText className="w-6 h-6" /> CHARACTER BIO</p>
                  <button 
                    onClick={handleSpeak} 
                    disabled={isSpeaking}
                    className="p-2 bg-toxic/10 border border-toxic/20 text-toxic hover:bg-toxic hover:text-black transition-all rounded-full disabled:opacity-50"
                  >
                    <Volume2 className={`w-5 h-5 ${isSpeaking ? 'animate-pulse' : ''}`} />
                  </button>
                </div>
                {characterLore}
              </div>
            ) : (
              <Button onClick={onDecodeLore} isLoading={isGeneratingLore} variant="secondary" className="w-full text-sm">
                 DECODE GENETIC HISTORY
              </Button>
            )}

            <div className="space-y-6 pt-8 border-t-2 border-zinc-900">
              <div className="flex items-center gap-3 text-toxic font-black uppercase text-xs">
                <Dna className="w-5 h-5" /> RE-SEQUENCING INTERFACE
              </div>
              <textarea 
                value={evolutionPrompt} 
                onChange={(e) => setEvolutionPrompt(e.target.value)}
                placeholder="Inject new mutations (Cyber-Armor, Fire Breath, Wasteland Setting)..."
                className="w-full bg-black border-4 border-black p-5 text-sm italic text-toxic placeholder:text-zinc-800 outline-none h-32 resize-none shadow-inner"
              />
              <Button onClick={() => onEvolve(evolutionPrompt)} isLoading={isEvolving} variant="toxic" className="w-full h-16 text-xl">
                MUTATE GENOME
              </Button>
            </div>
          </div>

          <div className="space-y-4 pt-10 border-t border-zinc-900">
            <a href={asset.url} download className="w-full bg-white text-black py-5 font-black uppercase text-sm border-4 border-black hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 shadow-[8px_8px_0_0_#000] active:shadow-none active:translate-x-1 active:translate-y-1">
              <Download className="w-5 h-5" /> EXPORT ASSET
            </a>
            <button onClick={() => onDelete(asset.id)} className="w-full text-red-600 py-3 font-black uppercase text-[10px] hover:text-red-400 flex items-center justify-center gap-2">
              PURGE RECORD FROM DATABASE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
