
import React from 'react';
import { AlertTriangle, X, Flame } from 'lucide-react';

export const ErrorModal: React.FC<{ error: string; onClose: () => void }> = ({ error, onClose }) => (
  <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[110] bg-red-600/90 border-4 border-black p-6 flex items-center gap-4 magma-glow shadow-2xl backdrop-blur-md max-w-lg w-full">
    <AlertTriangle className="w-12 h-12 text-white animate-pulse shrink-0" />
    <div className="flex-grow">
      <h4 className="comic-font text-2xl uppercase">System Failure</h4>
      <p className="text-[10px] font-black uppercase text-zinc-100 italic">{error.slice(0, 100)}</p>
    </div>
    <button onClick={onClose} className="text-white/50 hover:text-white"><X /></button>
  </div>
);

export const LoadingModal: React.FC<{ message: string }> = ({ message }) => (
  <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-6 text-center halftone">
    <div className="relative mb-8 p-4 bg-charcoal border-4 border-toxic/40">
      <div className="w-48 h-48 border-8 border-toxic/10 rounded-full animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Flame className="w-20 h-20 text-[#FF4500] animate-pulse" />
      </div>
    </div>
    <h2 className="comic-font text-7xl italic tracking-tighter text-white mb-4">{message}</h2>
    <div className="w-80 h-4 bg-zinc-950 overflow-hidden relative border-2 border-toxic/20">
      <div className="absolute inset-0 bg-toxic animate-[progress_1.2s_ease-in-out_infinite]"></div>
    </div>
    <p className="mt-8 comic-font text-toxic text-2xl tracking-widest opacity-50">BYPASSING SAFETY PROTOCOLS...</p>
  </div>
);
