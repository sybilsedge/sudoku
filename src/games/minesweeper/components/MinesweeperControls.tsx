import React from 'react';
import type { TouchMode } from '../types';
import { Shovel, Flag, RotateCcw, Sliders } from 'lucide-react';

interface MinesweeperControlsProps {
  touchMode: TouchMode;
  onToggleTouchMode: () => void;
  onSetTouchMode: (mode: TouchMode) => void;
  onRestart: () => void;
  onOpenCustomModal: () => void;
}

export const MinesweeperControls: React.FC<MinesweeperControlsProps> = ({
  touchMode,
  onSetTouchMode,
  onRestart,
  onOpenCustomModal,
}) => {
  return (
    <div className="w-full max-w-[500px] mx-auto px-2 sm:px-4 pb-safe pb-3 pt-1">
      {/* Thumb Zone Ergonomic Control Bar */}
      <div className="flex items-center justify-between gap-2 p-1.5 rounded-xl border border-cyan-500/30 bg-black/50 [data-theme='light']:bg-white [data-theme='light']:border-blue-300 [data-theme='light']:shadow-sm backdrop-blur-md shadow-[0_0_20px_rgba(0,255,255,0.08)]">
        {/* Restart Button */}
        <button
          onClick={onRestart}
          aria-label="Restart game"
          className="flex flex-col items-center justify-center p-2 rounded-lg border border-cyan-500/30 bg-black/40 text-cyan-400 [data-theme='light']:bg-slate-50 [data-theme='light']:border-slate-300 [data-theme='light']:text-slate-700 [data-theme='light']:hover:bg-slate-100 hover:text-cyan-100 hover:border-cyan-400 hover:shadow-[0_0_12px_rgba(0,255,255,0.2)] transition-all min-w-[52px]"
          title="Restart puzzle"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="font-tech text-[9px] mt-0.5 tracking-wider uppercase">RESET</span>
        </button>

        {/* Primary Thumb Dig / Flag Toggle */}
        <div className="flex-1 flex items-center p-1 rounded-lg border border-cyan-500/25 bg-black/60 [data-theme='light']:bg-slate-100 [data-theme='light']:border-slate-200 gap-1">
          {/* Dig Mode Button */}
          <button
            onClick={() => onSetTouchMode('dig')}
            aria-label="Set mode to Dig / Reveal"
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-md font-tech font-bold text-xs tracking-wider uppercase transition-all ${
              touchMode === 'dig'
                ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400 shadow-[0_0_16px_rgba(0,255,255,0.3)] [data-theme="light"]:bg-blue-600 [data-theme="light"]:text-white [data-theme="light"]:border-blue-700 [data-theme="light"]:shadow-sm'
                : 'text-slate-400 hover:text-cyan-300 border border-transparent [data-theme="light"]:text-slate-600 [data-theme="light"]:hover:text-blue-700'
            }`}
          >
            <Shovel className="w-4 h-4" />
            <span>DIG</span>
          </button>

          {/* Flag Mode Button */}
          <button
            onClick={() => onSetTouchMode('flag')}
            aria-label="Set mode to Flag / Mark"
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-md font-tech font-bold text-xs tracking-wider uppercase transition-all ${
              touchMode === 'flag'
                ? 'bg-amber-500/30 text-amber-200 border border-amber-400 shadow-[0_0_16px_rgba(251,191,36,0.35)] [data-theme="light"]:bg-amber-500 [data-theme="light"]:text-white [data-theme="light"]:border-amber-600 [data-theme="light"]:shadow-sm'
                : 'text-slate-400 hover:text-amber-300 border border-transparent [data-theme="light"]:text-slate-600 [data-theme="light"]:hover:text-amber-700'
            }`}
          >
            <Flag className="w-4 h-4" />
            <span>FLAG</span>
          </button>
        </div>

        {/* Custom Config Button */}
        <button
          onClick={onOpenCustomModal}
          aria-label="Open Custom Game Settings"
          className="flex flex-col items-center justify-center p-2 rounded-lg border border-cyan-500/30 bg-black/40 text-cyan-400 [data-theme='light']:bg-slate-50 [data-theme='light']:border-slate-300 [data-theme='light']:text-slate-700 [data-theme='light']:hover:bg-slate-100 hover:text-cyan-100 hover:border-cyan-400 hover:shadow-[0_0_12px_rgba(0,255,255,0.2)] transition-all min-w-[52px]"
          title="Custom Settings"
        >
          <Sliders className="w-4 h-4" />
          <span className="font-tech text-[9px] mt-0.5 tracking-wider uppercase">GRID</span>
        </button>
      </div>
    </div>
  );
};
