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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-xl border border-slate-200">
        <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
          <Trophy className="w-8 h-8" />
        </div>

        <h2 className="font-puzzle-serif text-2xl font-bold text-slate-900 mb-1">
          Puzzle Solved!
        </h2>
        <p className="text-sm text-slate-600 mb-4 capitalize">
          {difficulty} Puzzle Completed
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
          <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
            Completion Time
          </div>
          <div className="text-3xl font-bold tabular-nums text-slate-900 mb-2">
            {formatTime(timeSeconds)}
          </div>
          {isNewBest && (
            <span className="inline-block bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              ★ New Best Time!
            </span>
          )}
          {currentDiffStats.bestTime !== null && !isNewBest && (
            <div className="text-xs text-slate-500 mt-1">
              Best: {formatTime(currentDiffStats.bestTime)}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <button
            onClick={() => onPlayAgain(difficulty)}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold transition-colors shadow-sm"
          >
            <span>Play Next {difficulty.toUpperCase()}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 text-slate-600 hover:text-slate-900 text-sm font-semibold transition-colors"
          >
            Review Board
          </button>
        </div>
      </div>
    </div>
  );
};
