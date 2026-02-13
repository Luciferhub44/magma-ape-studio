
import React, { useRef } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface DnaArchiveProps {
  images: string[];
  onInject: (files: FileList) => void;
  onRemove: (index: number) => void;
  onClear: () => void;
}

export const DnaArchive: React.FC<DnaArchiveProps> = ({ images, onInject, onRemove, onClear }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-charcoal border-4 border-black p-8 space-y-6 toxic-glow halftone">
      <div className="flex justify-between items-center px-1">
         <h3 className="comic-font text-4xl italic tracking-tighter text-white">DNA_ARCHIVE</h3>
         <div className="flex items-center gap-4 text-[10px] font-black text-zinc-800 italic uppercase">
            <span>{images.length} / 40 SLOTS</span>
            <button onClick={onClear} className="hover:text-red-800 transition-colors">CLEAR_ALL</button>
         </div>
      </div>
      <div className="grid grid-cols-5 md:grid-cols-10 gap-3 p-6 bg-black/40 border-4 border-dashed border-zinc-900 relative min-h-[140px]">
        {images.map((img, idx) => (
          <div key={idx} className="relative aspect-square border-4 border-zinc-900 group overflow-hidden hover:border-toxic transition-all">
            <img src={img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
            <button onClick={() => onRemove(idx)} className="absolute inset-0 bg-red-600/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
              <Trash2 className="w-6 h-6 text-white" />
            </button>
          </div>
        ))}
        {images.length < 40 && (
          <button onClick={() => fileInputRef.current?.click()} className="aspect-square border-4 border-dashed border-zinc-900 flex flex-col items-center justify-center hover:bg-toxic/10 hover:border-toxic transition-all text-zinc-800 group relative">
            <Plus className="w-8 h-8 group-hover:scale-125 transition-all mb-1" />
            <span className="text-[8px] font-black uppercase tracking-tighter">INJECT</span>
          </button>
        )}
      </div>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={(e) => e.target.files && onInject(e.target.files)} 
        className="hidden" 
        multiple 
        accept="image/*" 
      />
    </div>
  );
};
