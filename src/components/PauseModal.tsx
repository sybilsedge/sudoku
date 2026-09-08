import React from 'react';
import { Play } from 'lucide-react';

interface PauseModalProps {
  isOpen: boolean;
  onResume: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({ isOpen, onResume }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div data-theme="dark" className="blueprint-border bg-[#0e1114] max-w-xs w-full p-6 text-center shadow-[0_0_40px_rgba(0,255,255,0.2)] rounded-xl text-slate-100">
        <h3 className="font-orbitron text-xl font-bold tracking-wider text-cyan-300 uppercase mb-2">
          PAUSED
        </h3>
        <p className="font-tech text-xs text-slate-400 mb-6">
          [ TELEMETRY & TIMER HALTED ]
        </p>

        <button
          onClick={onResume}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-cyan-400 bg-cyan-500/20 text-cyan-200 hover:bg-cyan-500/30 hover:border-cyan-300 hover:shadow-[0_0_20px_rgba(0,255,255,0.4)] rounded-lg font-tech text-xs font-bold uppercase tracking-wider transition-all"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>RESUME EXECUTION</span>
        </button>
      </div>
    </div>
  );
};
