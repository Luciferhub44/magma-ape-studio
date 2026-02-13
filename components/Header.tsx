
import React from 'react';
import { Flame, Radio, ShieldAlert } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="border-b-8 border-black bg-charcoal p-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 group">
          <div className="p-3 bg-[#FF4500] border-4 border-black magma-glow group-hover:rotate-12 transition-transform">
            <Flame className="w-8 h-8 text-black" />
          </div>
          <div>
            <h1 className="comic-font text-4xl md:text-5xl leading-none tracking-tighter">
              MAGMA <span className="text-toxic">APE</span> STUDIO
            </h1>
            <p className="text-xs uppercase tracking-[0.3em] font-bold text-zinc-500">
              High-Octane Concept Protocol v3.1
            </p>
          </div>
        </div>
        
        <nav className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-2 text-zinc-400 text-xs font-bold uppercase">
            <ShieldAlert className="w-4 h-4 text-[#FF4500]" />
            <span>Core Status: Stable</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold uppercase">
            <Radio className="w-4 h-4 text-toxic" />
            <span className="text-toxic">Network: Connected</span>
          </div>
        </nav>
      </div>
    </header>
  );
};
