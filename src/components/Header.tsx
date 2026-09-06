import React from 'react';
import { Play, Pause, Settings, RotateCcw } from 'lucide-react';
import type { Difficulty } from '../types/sudoku';
import { formatTime } from '../utils/storage';

interface HeaderProps {
  difficulty: Difficulty;
  timerSeconds: number;
  isPaused: boolean;
  isLoading: boolean;
  onSelectDifficulty: (diff: Difficulty) => void;
  onTogglePause: () => void;
  onRestart: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  difficulty,
  timerSeconds,
  isPaused,
  isLoading,
  onSelectDifficulty,
  onTogglePause,
  onRestart,
  onOpenSettings,
}) => {
  const difficulties: { id: Difficulty; label: string }[] = [
    { id: 'easy', label: 'Easy' },
    { id: 'medium', label: 'Medium' },
    { id: 'hard', label: 'Hard' },
  ];

  return (
    <header className="w-full max-w-[480px] mx-auto px-2 sm:px-4 pt-safe pt-2 pb-1">
      {/* Top row: Brand & Timer & Settings */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
        <div className="flex items-baseline gap-2">
          <h1 className="font-puzzle-serif text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">
            SUDOKU
          </h1>
          <span className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold hidden xs:inline">
            PWA
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Timer & Pause */}
          <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
            <span className="text-xs sm:text-sm font-semibold tabular-nums text-slate-800">
              {formatTime(timerSeconds)}
            </span>
            <button
              onClick={onTogglePause}
              aria-label={isPaused ? 'Resume game' : 'Pause game'}
              className="text-slate-600 hover:text-slate-900 transition-colors p-0.5"
              title={isPaused ? 'Resume' : 'Pause'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
            </button>
          </div>

          {/* Restart puzzle */}
          <button
            onClick={onRestart}
            aria-label="Restart current puzzle"
            className="p-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Restart current board"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            aria-label="Open settings"
            className="p-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Game Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Difficulty segmented pills */}
      <div className="flex items-center justify-between gap-1 sm:gap-2 mb-1">
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 w-full sm:w-auto">
          {difficulties.map((d) => {
            const isActive = difficulty === d.id;
            return (
              <button
                key={d.id}
                onClick={() => onSelectDifficulty(d.id)}
                disabled={isLoading}
                className={`flex-1 sm:flex-initial text-xs sm:text-sm font-semibold px-3 py-1 rounded-md transition-all ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {d.label}
              </button>
            );
          })}
        </div>

        {isLoading && (
          <div className="flex items-center gap-1.5 text-xs text-blue-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
            <span>Generating...</span>
          </div>
        )}
      </div>
    </header>
  );
};
