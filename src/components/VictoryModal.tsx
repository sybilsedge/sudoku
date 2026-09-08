import { Trophy, ArrowRight } from 'lucide-react';
import type { Difficulty, GameStats } from '../types/sudoku';
import { formatTime } from '../utils/storage';

interface VictoryModalProps {
  isOpen: boolean;
  difficulty: Difficulty;
  timeSeconds: number;
  stats: GameStats;
  onPlayAgain: (diff: Difficulty) => void;
  onClose: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  difficulty,
  timeSeconds,
  stats,
  onPlayAgain,
  onClose,
}) => {
  if (!isOpen) return null;

  const currentDiffStats = stats[difficulty];
  const isNewBest = currentDiffStats.bestTime === timeSeconds;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div data-theme="dark" className="blueprint-border bg-[#0e1114] max-w-sm w-full p-6 text-center shadow-[0_0_40px_rgba(0,255,255,0.25)] rounded-xl text-slate-100">
        <div className="neon-border bg-emerald-500/10 text-neon w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center shadow-[0_0_24px_rgba(57,255,20,0.3)]">
          <Trophy className="w-8 h-8" />
        </div>

        <h2 className="font-orbitron text-xl sm:text-2xl font-bold text-cyan-300 uppercase tracking-widest mb-1 drop-shadow-[0_0_12px_rgba(0,255,255,0.35)]">
          GRID SOLVED
        </h2>
        <p className="font-tech text-xs uppercase tracking-wider text-slate-400 mb-4">
          [ {difficulty.toUpperCase()} MATRIX DECRYPTED ]
        </p>

        <div className="blueprint-border bg-black/40 rounded-xl p-4 mb-6">
          <div className="font-tech text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
            ELAPSED TIME
          </div>
          <div className="font-tech text-3xl font-bold tabular-nums text-cyan-300 mb-2 drop-shadow-[0_0_10px_rgba(0,255,255,0.35)]">
            {formatTime(timeSeconds)}
          </div>
          {isNewBest && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-tech border border-emerald-500/40 bg-emerald-500/10 text-neon shadow-[0_0_12px_rgba(57,255,20,0.3)]">
              ★ NEW RECORD TELEMETRY
            </span>
          )}
          {currentDiffStats.bestTime !== null && !isNewBest && (
            <div className="font-tech text-xs text-slate-400 mt-1">
              BEST: <span className="text-neon tabular-nums">{formatTime(currentDiffStats.bestTime)}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <button
            onClick={() => onPlayAgain(difficulty)}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-cyan-400 bg-cyan-500/20 text-cyan-200 hover:bg-cyan-500/30 hover:border-cyan-300 hover:shadow-[0_0_20px_rgba(0,255,255,0.4)] rounded-lg font-tech text-xs uppercase tracking-wider font-bold transition-all"
          >
            <span>NEXT {difficulty.toUpperCase()} MATRIX</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 font-tech text-xs uppercase tracking-wider text-slate-400 hover:text-cyan-300 transition-colors"
          >
            INSPECT GRID
          </button>
        </div>
      </div>
    </div>
  );
};
