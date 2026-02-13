
import React from 'react';
import { Terminal } from 'lucide-react';

interface StatusLogsProps {
  logs: string[];
}

export const StatusLogs: React.FC<StatusLogsProps> = ({ logs }) => {
  return (
    <div className="bg-black border-4 border-black p-6 font-mono text-[10px] space-y-3 shadow-2xl h-56 overflow-y-auto gritty relative">
      <div className="sticky top-0 bg-black/90 backdrop-blur-md flex items-center justify-between text-zinc-700 mb-4 border-b border-zinc-900 pb-2 z-10">
        <span className="flex items-center gap-3"><Terminal className="w-4 h-4" /> MAGMA_CORE.FEED</span>
        <span className="animate-pulse">STABLE</span>
      </div>
      {logs.map((log, i) => (
        <div key={i} className={`pl-3 border-l-2 transition-all duration-500 leading-relaxed ${log.includes('ERROR') || log.includes('FATAL') ? 'border-red-600 text-red-500 font-black' : 'border-toxic text-toxic/60'}`}>
          {log}
        </div>
      ))}
      <div className="animate-pulse text-toxic/30 text-xs">█</div>
    </div>
  );
};
