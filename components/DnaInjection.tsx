
import React from 'react';
import { Search, Thermometer, Fingerprint, Database, Activity, ShieldCheck } from 'lucide-react';
import { Button } from './Button';
import { ApeMetadata } from '../types';

interface DnaInjectionProps {
  apeId: string;
  setApeId: (id: string) => void;
  onFetch: () => void;
  isFetching: boolean;
  metadata: ApeMetadata | null;
  integrityScore: number;
}

export const DnaInjection: React.FC<DnaInjectionProps> = ({
  apeId,
  setApeId,
  onFetch,
  isFetching,
  metadata,
  integrityScore
}) => {
  return (
    <section className="bg-charcoal border-8 border-black p-10 magma-glow grid md:grid-cols-2 gap-10 relative overflow-hidden halftone">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <Fingerprint className="w-72 h-72 text-[#FF4500] graphics-fill" />
      </div>
      <div className="space-y-8 relative z-10">
        <div className="space-y-4">
          <h2 className="comic-font text-8xl italic tracking-tighter text-white leading-none">DNA <span className="text-toxic">INJECTION</span></h2>
          <div className="flex items-center gap-4">
            <div className="h-1 flex-grow bg-zinc-900">
              <div className="h-full bg-toxic transition-all duration-1000" style={{ width: `${integrityScore}%` }}></div>
            </div>
            <div className="flex items-center gap-2">
              <Thermometer className={`w-5 h-5 ${integrityScore < 40 ? 'text-red-600 animate-ping' : 'text-toxic'}`} />
              <span className={`text-[11px] font-black uppercase ${integrityScore < 40 ? 'text-red-600' : 'text-zinc-500'}`}>Integrity: {integrityScore}%</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <div className="relative flex-grow">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-800" />
            <input 
              type="text" 
              value={apeId} 
              onChange={(e) => setApeId(e.target.value)}
              placeholder="APE_ID (8713)"
              className="w-full bg-black border-4 border-black p-5 pl-14 comic-font text-4xl text-toxic placeholder:text-zinc-900 focus:outline-none focus:ring-8 focus:ring-toxic/10 italic tracking-widest"
            />
          </div>
          <Button onClick={onFetch} isLoading={isFetching} variant="toxic" className="px-12 h-20 text-3xl">
            LINK
          </Button>
        </div>

        {metadata && (
          <div className="bg-black/60 border-4 border-toxic/30 p-8 space-y-6 backdrop-blur-md relative overflow-hidden toxic-glow">
             <div className="flex items-center gap-8 border-b border-zinc-800 pb-6">
                <div className="relative group">
                  <img src={metadata.image} className="w-28 h-28 border-4 border-toxic object-cover bg-black p-2 group-hover:scale-105 transition-transform" />
                  <div className="absolute -bottom-3 -right-3 bg-black border-2 border-toxic p-2">
                    <ShieldCheck className="w-5 h-5 text-toxic" />
                  </div>
                </div>
                <div>
                  <h4 className="comic-font text-5xl uppercase text-white italic tracking-tighter leading-none">{metadata.name}</h4>
                  <p className="text-xs text-zinc-500 font-bold uppercase tracking-[0.3em] mt-2">Authenticated Genome</p>
                </div>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {metadata.attributes.map((attr, i) => (
                  <div key={i} className="bg-zinc-950 p-3 border border-zinc-900 group hover:border-toxic transition-all flex flex-col justify-center">
                    <span className="text-[9px] font-black text-zinc-700 uppercase block mb-1 tracking-widest">{attr.trait_type}</span>
                    <span className="text-xs font-black text-toxic uppercase block truncate">{attr.value}</span>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>

      <div className="hidden md:flex flex-col justify-center items-center p-12 border-4 border-dashed border-zinc-800 bg-black/40 text-center space-y-8 relative overflow-hidden">
        <div className="relative">
          <Database className="w-20 h-20 text-zinc-900 animate-pulse" />
          <Activity className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-toxic/20" />
        </div>
        <div className="space-y-3">
          <p className="text-[11px] font-black text-zinc-700 uppercase tracking-widest italic">
            UPLINK STATUS: NOMINAL
          </p>
          <div className="grid grid-cols-2 gap-x-10 gap-y-2 text-[9px] font-mono text-zinc-900 text-left">
            <span>BUFFER_LOCK:</span> <span className="text-toxic/30">ENABLED</span>
            <span>PACKET_SYNC:</span> <span className="text-toxic/30">100%</span>
            <span>DNA_COMPRESSION:</span> <span className="text-toxic/30">LZ4_READY</span>
            <span>SAFETY_FILTERS:</span> <span className="text-red-900">BYPASSED</span>
          </div>
        </div>
        <div className="w-full h-8 flex items-end gap-1 px-4">
          {[...Array(30)].map((_, i) => (
            <div key={i} className="flex-1 bg-zinc-900 animate-pulse" style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.05}s` }}></div>
          ))}
        </div>
      </div>
    </section>
  );
};
