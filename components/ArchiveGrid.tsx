
import React from 'react';
import { LayoutGrid, Trash2 } from 'lucide-react';
import { GeneratedAsset, AssetType } from '../types';

interface ArchiveGridProps {
  assets: GeneratedAsset[];
  onView: (asset: GeneratedAsset) => void;
  onDelete: (id: string) => void;
}

export const ArchiveGrid: React.FC<ArchiveGridProps> = ({ assets, onView, onDelete }) => {
  return (
    <section className="pt-20 border-t-8 border-black space-y-12 relative">
       <div className="flex items-center gap-8">
          <div className="p-5 bg-charcoal border-4 border-toxic/50 toxic-glow halftone">
            <LayoutGrid className="w-16 h-16 text-toxic" />
          </div>
          <h2 className="comic-font text-[10rem] italic tracking-tighter uppercase leading-none text-white/5 absolute -top-12 left-0 pointer-events-none select-none">DATABASE</h2>
          <h2 className="comic-font text-9xl italic tracking-tighter uppercase leading-none z-10">THE <span className="text-[#FF4500]">EVO</span> ARCHIVE</h2>
       </div>
       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 relative z-10">
          {assets.map(asset => (
            <div key={asset.id} className="bg-charcoal border-8 border-black group relative aspect-[3/4] overflow-hidden hover:border-toxic transition-all shadow-2xl halftone hover:scale-105 duration-500">
               {asset.type === AssetType.VIDEO ? (
                 <video src={asset.url} className="w-full h-full object-cover cursor-pointer grayscale group-hover:grayscale-0 transition-all duration-700" onClick={() => onView(asset)} muted loop />
               ) : (
                 <img src={asset.url} className="w-full h-full object-cover cursor-pointer grayscale group-hover:grayscale-0 transition-all duration-700" onClick={() => onView(asset)} />
               )}
               <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <div className="bg-black text-toxic px-3 py-1 text-[9px] font-black border-2 border-toxic uppercase italic tracking-widest">{asset.type}</div>
                  <div className="bg-black text-white px-3 py-1 text-[9px] font-black border-2 border-zinc-800 uppercase italic tracking-widest">{asset.quality}</div>
               </div>
               <button onClick={(e) => { e.stopPropagation(); onDelete(asset.id); }} className="absolute bottom-4 right-4 p-4 bg-black/90 text-zinc-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:rotate-90">
                 <Trash2 className="w-6 h-6" />
               </button>
            </div>
          ))}
       </div>
    </section>
  );
};
