
import React from 'react';
import { Radio } from 'lucide-react';

interface FooterProps {
  integrityScore: number;
}

export const Footer: React.FC<FooterProps> = ({ integrityScore }) => {
  return (
    <footer className="bg-charcoal border-t-8 border-black p-24 mt-40 relative overflow-hidden gritty">
      <div className="absolute top-0 left-0 w-full h-full halftone opacity-20"></div>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-16 relative z-10">
        <div className="flex items-center gap-8 group">
          <div className="relative">
            <Radio className="w-24 h-24 text-toxic animate-pulse group-hover:scale-110 transition-all" />
            <div className="absolute inset-0 bg-toxic/10 blur-xl animate-pulse"></div>
          </div>
          <div>
            <h2 className="comic-font text-8xl italic leading-none text-white tracking-tighter">MAGMA <span className="text-toxic">APE</span></h2>
            <p className="text-xs font-black text-zinc-600 uppercase tracking-[0.6em] mt-4 flex items-center gap-3 italic">
              <span className="w-12 h-[2px] bg-zinc-800"></span>
              UPLINK_ENCRYPTION_MAX
              <span className="w-12 h-[2px] bg-zinc-800"></span>
            </p>
          </div>
        </div>
        <div className="text-center md:text-right space-y-6">
          <p className="text-sm font-black text-zinc-500 uppercase italic tracking-[0.2em] leading-relaxed">
            MAGMA STUDIO CONCEPT PROTOCOL © 2025. <br />
            <span className="text-zinc-700">CHARACTER DNA ARCHIVED IN TRIBE ODYSSEY CLUSTER.</span><br />
            SYSTEM_HEARTBEAT: <span className="text-toxic">NOMINAL</span>
          </p>
          <div className="flex justify-center md:justify-end gap-3">
             {[...Array(12)].map((_, i) => (
               <div key={i} className={`w-5 h-2 transition-all duration-500 ${i < (integrityScore / 8) ? 'bg-toxic shadow-[0_0_5px_#ADFF2F]' : 'bg-zinc-950'}`}></div>
             ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
