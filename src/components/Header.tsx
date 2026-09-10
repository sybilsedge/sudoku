import React from 'react';
import { Play, Pause, Settings, RotateCcw, Sun, Moon } from 'lucide-react';
import type { Difficulty } from '../types/sudoku';
import { formatTime } from '../utils/storage';

interface HeaderProps {
  difficulty: Difficulty;
  timerSeconds: number;
  isPaused: boolean;
  isLoading: boolean;
  theme?: 'dark' | 'light';
  onSelectDifficulty: (diff: Difficulty) => void;
  onTogglePause: () => void;
  onRestart: () => void;
  onOpenSettings: () => void;
  onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  difficulty,
  timerSeconds,
  isPaused,
  isLoading,
  theme = 'dark',
  onSelectDifficulty,
  onTogglePause,
  onRestart,
  onOpenSettings,
  onToggleTheme,
}) => {
  const difficulties: { id: Difficulty; label: string }[] = [
    { id: 'easy', label: 'EASY' },
    { id: 'medium', label: 'MEDIUM' },
    { id: 'hard', label: 'HARD' },
  ];

  return (
    <header className="w-full max-w-[480px] mx-auto px-2 sm:px-4 pt-1 pb-1">
      {/* Top row: Brand HUD, Timer, Quick Actions */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 mb-2">
        <div className="flex items-center gap-2">
          <h1 className="font-orbitron text-xl sm:text-2xl font-bold tracking-widest text-cyan-300 drop-shadow-[0_0_12px_rgba(0,255,255,0.3)]">
            SUDOKU
          </h1>
          <span className="font-tech text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded border border-cyan-500/30 text-cyan-400 bg-cyan-500/10">
            [HUD]
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Timer & Pause Status */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-md border border-cyan-500/35 bg-black/40 backdrop-blur-sm shadow-[0_0_12px_rgba(0,255,255,0.1)]">
            <span className="font-tech text-xs sm:text-sm font-bold tabular-nums text-cyan-300">
              {formatTime(timerSeconds)}
            </span>
            <button
              onClick={onTogglePause}
              aria-label={isPaused ? 'Resume game' : 'Pause game'}
              className="text-cyan-400 hover:text-cyan-100 transition-colors p-0.5"
              title={isPaused ? 'Resume' : 'Pause'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
            </button>
          </div>

          {/* Restart puzzle */}
          <button
            onClick={onRestart}
            aria-label="Restart current puzzle"
            className="p-1.5 rounded-md border border-cyan-500/30 bg-black/40 text-cyan-400 hover:text-cyan-100 hover:border-cyan-400 hover:shadow-[0_0_12px_rgba(0,255,255,0.25)] transition-all backdrop-blur-sm"
            title="Restart current board"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Theme switcher */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light blueprint paper' : 'Switch to dark cyberpunk terminal'}
              className="p-1.5 rounded-md border border-cyan-500/30 bg-black/40 text-cyan-400 hover:text-cyan-100 hover:border-cyan-400 hover:shadow-[0_0_12px_rgba(0,255,255,0.25)] transition-all backdrop-blur-sm"
              title={`Current: ${theme.toUpperCase()} theme (Click to switch)`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            aria-label="Open settings"
            className="p-1.5 rounded-md border border-cyan-500/30 bg-black/40 text-cyan-400 hover:text-cyan-100 hover:border-cyan-400 hover:shadow-[0_0_12px_rgba(0,255,255,0.25)] transition-all backdrop-blur-sm"
            title="Game Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Difficulty segmented pills */}
      <div className="flex items-center justify-between gap-1 sm:gap-2 mb-1">
        <div className="flex items-center blueprint-border bg-black/40 p-0.5 rounded-lg backdrop-blur-sm w-full sm:w-auto">
          {difficulties.map((d) => {
            const isActive = difficulty === d.id;
            return (
              <button
                key={d.id}
                onClick={() => onSelectDifficulty(d.id)}
                disabled={isLoading}
                className={`flex-1 sm:flex-initial font-tech text-xs sm:text-xs font-semibold px-3 py-1 rounded-md transition-all uppercase tracking-wider ${
                  isActive
                    ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-400/60 shadow-[0_0_12px_rgba(0,255,255,0.25)]'
                    : 'text-slate-400 hover:text-cyan-300'
                }`}
              >
                {d.label}
              </button>
            );
          })}
        </div>

        {isLoading && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-tech border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 shadow-[0_0_10px_rgba(0,255,255,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>CALCULATING...</span>
          </div>
        )}
      </div>
    </header>
  );
};
