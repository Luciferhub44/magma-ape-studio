
import React, { useEffect, useRef } from 'react';
import { Activity, ShieldCheck, MicOff, Mic } from 'lucide-react';

interface NeuralBridgeProps {
  isActive: boolean;
  isConnecting: boolean;
  onToggle: () => void;
  audioStream: Float32Array | null;
  hasApiKey: boolean;
  onKeySelection: () => void;
}

export const NeuralBridge: React.FC<NeuralBridgeProps> = ({
  isActive,
  isConnecting,
  onToggle,
  audioStream,
  hasApiKey,
  onKeySelection
}) => {
  const visualizerRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!visualizerRef.current || !audioStream || !isActive) return;
    const canvas = visualizerRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#ADFF2F';
    ctx.lineWidth = 3;
    ctx.beginPath();
    const sliceWidth = canvas.width / audioStream.length;
    let x = 0;
    for (let i = 0; i < audioStream.length; i++) {
      const v = audioStream[i] * 120;
      const y = (canvas.height / 2) + v;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      x += sliceWidth;
    }
    ctx.stroke();
  }, [audioStream, isActive]);

  return (
    <section className={`p-10 border-8 border-black transition-all duration-1000 relative overflow-hidden ${isActive ? 'bg-zinc-950 toxic-glow h-80' : 'bg-charcoal'}`}>
       <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
          <div className="space-y-4">
            <h2 className="comic-font text-7xl flex items-center gap-5 italic text-white leading-none">
              <Activity className={`w-14 h-14 ${isActive ? 'text-toxic animate-pulse' : 'text-zinc-800'}`} />
              NEURAL <span className="text-toxic">BRIDGE</span>
            </h2>
            <div className="flex items-center gap-4">
               <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-toxic shadow-[0_0_10px_#ADFF2F]' : 'bg-zinc-800'}`}></div>
               <p className="text-xs font-black text-zinc-500 uppercase tracking-[0.4em] italic">
                 ENCRYPTION: MAGMA_AES_256 // SYNC STATE: {isActive ? 'LOCKED' : 'IDLE'}
               </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            {!hasApiKey && (
              <button onClick={onKeySelection} className="text-xs font-black uppercase text-toxic/50 hover:text-toxic transition-colors flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> RE-VERIFY CORE
              </button>
            )}
            <button 
              onClick={onToggle}
              disabled={isConnecting}
              className={`flex items-center gap-6 px-14 py-6 border-4 border-black comic-font text-4xl uppercase transition-all shadow-[12px_12px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none ${isActive ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-toxic hover:bg-[#99e629] text-black'}`}
            >
              {isConnecting ? 'SYNCING...' : isActive ? <><MicOff /> SEVER LINK</> : <><Mic /> ENGAGE UPLINK</>}
            </button>
          </div>
       </div>
       
       {isActive && (
         <div className="mt-12">
           <div className="h-32 bg-black/80 border-4 border-toxic/20 relative flex items-center justify-center p-6 shadow-inner halftone">
             <canvas ref={visualizerRef} width={1000} height={150} className="w-full h-full opacity-90" />
             <div className="absolute top-4 left-4 flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-toxic animate-ping"></div>
                <span className="text-[10px] font-black text-toxic uppercase tracking-widest">LIVE_SIGNAL_NOMINAL</span>
             </div>
           </div>
         </div>
       )}
    </section>
  );
};
