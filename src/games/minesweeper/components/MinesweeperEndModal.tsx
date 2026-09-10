import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import type { MinesweeperDifficulty, MinesweeperStatus, MinesweeperStats } from '../types';
import { Trophy, Skull, RotateCcw, X, Clock, Award } from 'lucide-react';
import { formatTime } from '../../../utils/storage';

interface MinesweeperEndModalProps {
  status: MinesweeperStatus;
  difficulty: MinesweeperDifficulty;
  timeSeconds: number;
  stats: MinesweeperStats;
  onPlayAgain: () => void;
  onClose: () => void;
}

export const MinesweeperEndModal: React.FC<MinesweeperEndModalProps> = ({
  status,
  difficulty,
  timeSeconds,
  stats,
  onPlayAgain,
  onClose,
}) => {
  const isWon = status === 'won';
  const isLost = status === 'lost';

  // Confetti on win
  useEffect(() => {
    if (isWon) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00ffff', '#39ff14', '#38bdf8', '#ffffff'],
      });
    }
  }, [isWon]);

  if (!isWon && !isLost) return null;

  const currentDiffStats = stats[difficulty];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className={`relative w-full max-w-sm rounded-xl border p-5 shadow-2xl backdrop-blur-md bg-[#0a0f18] ${
          isWon
            ? 'border-emerald-400/60 shadow-[0_0_35px_rgba(52,211,153,0.25)]'
            : 'border-red-500/60 shadow-[0_0_35px_rgba(239,68,68,0.25)]'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-3 right-3 p-1 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Status Badge & Title */}
        <div className="flex flex-col items-center text-center pt-2 pb-4">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 border ${
              isWon
                ? 'border-emerald-400 bg-emerald-500/20 text-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.4)]'
                : 'border-red-500 bg-red-500/20 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.4)]'
            }`}
          >
            {isWon ? <Trophy className="w-6 h-6" /> : <Skull className="w-6 h-6" />}
          </div>

          <h2
            className={`font-orbitron text-xl font-bold tracking-widest uppercase ${
              isWon ? 'text-emerald-300' : 'text-red-400'
            }`}
          >
            {isWon ? 'SECTOR CLEARED' : 'DETONATION DETECTED'}
          </h2>

          <p className="font-tech text-xs text-slate-400 mt-1 uppercase tracking-wider">
            {isWon
              ? `All ordnance safely identified (${difficulty})`
              : `Hull integrity compromised in ${difficulty} sector`}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 my-3 font-tech text-xs">
          <div className="p-3 rounded-lg border border-cyan-500/20 bg-black/50 flex flex-col items-center justify-center">
            <div className="flex items-center gap-1.5 text-cyan-400/80 mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase">TIME</span>
            </div>
            <span className="text-base font-bold text-slate-100 tabular-nums">
              {formatTime(timeSeconds)}
            </span>
          </div>

          <div className="p-3 rounded-lg border border-cyan-500/20 bg-black/50 flex flex-col items-center justify-center">
            <div className="flex items-center gap-1.5 text-cyan-400/80 mb-1">
              <Award className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase">BEST TIME</span>
            </div>
            <span className="text-base font-bold text-slate-100 tabular-nums">
              {currentDiffStats?.bestTime !== null
                ? formatTime(currentDiffStats.bestTime)
                : '--:--'}
            </span>
          </div>
        </div>

        {/* Win Rate Info */}
        <div className="flex justify-between items-center py-2 px-3 rounded-md border border-cyan-500/15 bg-black/30 font-tech text-[11px] text-cyan-400/70 mb-4">
          <span>CLEARED: {currentDiffStats.won} / {currentDiffStats.played}</span>
          <span>
            RATE:{' '}
            {currentDiffStats.played > 0
              ? `${Math.round((currentDiffStats.won / currentDiffStats.played) * 100)}%`
              : '0%'}
          </span>
        </div>

        {/* Action Button */}
        <button
          onClick={onPlayAgain}
          className={`w-full py-2.5 rounded-lg border font-tech font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
            isWon
              ? 'border-emerald-400 bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30 hover:shadow-[0_0_20px_rgba(52,211,153,0.3)]'
              : 'border-cyan-400 bg-cyan-500/20 text-cyan-200 hover:bg-cyan-500/30 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>INITIALIZE NEW GRID</span>
        </button>
      </div>
    </div>
  );
};
