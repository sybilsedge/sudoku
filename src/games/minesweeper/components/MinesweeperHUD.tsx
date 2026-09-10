import React from 'react';
import type { MinesweeperDifficulty, MinesweeperStatus } from '../types';
import { Play, Pause, RotateCcw, Sliders } from 'lucide-react';

interface MinesweeperHUDProps {
  difficulty: MinesweeperDifficulty;
  status: MinesweeperStatus;
  remainingMines: number;
  timerSeconds: number;
  isPaused: boolean;
  onSelectDifficulty: (diff: MinesweeperDifficulty) => void;
  onRestart: () => void;
  onTogglePause: () => void;
  onOpenCustomModal: () => void;
}

export const MinesweeperHUD: React.FC<MinesweeperHUDProps> = ({
  difficulty,
  status,
  remainingMines,
  timerSeconds,
  isPaused,
  onSelectDifficulty,
  onRestart,
  onTogglePause,
  onOpenCustomModal,
}) => {
  // Format remaining mines as 3-digit LED display (e.g., "010", "-05")
  const formatMines = (count: number) => {
    if (count < 0) {
      return `-${Math.abs(count).toString().padStart(2, '0')}`;
    }
    return count.toString().padStart(3, '0');
  };

  const formatTimer = (seconds: number) => {
    return Math.min(seconds, 999).toString().padStart(3, '0');
  };

  // Status face indicator
  const getFaceGlyph = () => {
    if (status === 'won') return 'B-)';
    if (status === 'lost') return 'X_X';
    if (isPaused) return 'Z_Z';
    return '^o^';
  };

  const difficulties: { id: MinesweeperDifficulty; label: string }[] = [
    { id: 'beginner', label: 'BEGINNER' },
    { id: 'intermediate', label: 'INTERMEDIATE' },
    { id: 'custom', label: 'CUSTOM' },
  ];

  return (
    <div className="w-full max-w-[500px] mx-auto px-2 sm:px-4 pt-1 pb-1">
      {/* Top HUD Panel: Mines Counter, Interactive CAD Face, Timer */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 mb-2">
        {/* Mines Remaining LED */}
        <div
          style={{
            backgroundColor: 'var(--ms-hud-bg)',
            borderColor: 'var(--ms-hud-border)',
          }}
          className="flex items-center gap-1.5 px-3 py-1 rounded-md border shadow-[0_0_12px_rgba(0,255,255,0.1)] transition-colors"
        >
          <span
            style={{ color: 'var(--ms-hud-label)' }}
            className="font-tech text-[10px] uppercase font-bold tracking-wider"
          >
            MINES:
          </span>
          <span
            style={{
              color:
                remainingMines < 0
                  ? 'var(--ms-hud-digit-negative)'
                  : 'var(--ms-hud-digit)',
            }}
            className="font-tech text-base font-extrabold tabular-nums tracking-widest"
          >
            {formatMines(remainingMines)}
          </span>
        </div>

        {/* CAD Interactive Face Reset Button */}
        <button
          onClick={onRestart}
          aria-label="Restart puzzle"
          style={
            status === 'won' || status === 'lost'
              ? {}
              : {
                  backgroundColor: 'var(--ms-hud-btn-bg)',
                  borderColor: 'var(--ms-hud-btn-border)',
                  color: 'var(--ms-hud-btn-text)',
                }
          }
          className={`flex items-center justify-center px-3 py-1 rounded-md border text-sm font-tech font-bold tracking-wider transition-all backdrop-blur-sm ${
            status === 'won'
              ? 'border-emerald-400/80 bg-emerald-500/20 text-emerald-300 shadow-[0_0_16px_rgba(52,211,153,0.4)]'
              : status === 'lost'
              ? 'border-red-500/80 bg-red-500/20 text-red-300 shadow-[0_0_16px_rgba(239,68,68,0.4)]'
              : 'hover:opacity-90 shadow-[0_0_12px_rgba(0,255,255,0.15)]'
          }`}
          title="Click to reset board"
        >
          <span className="mr-1 font-mono">[{getFaceGlyph()}]</span>
          <RotateCcw className="w-3.5 h-3.5 opacity-75" />
        </button>

        {/* Timer & Pause Controls */}
        <div className="flex items-center gap-2">
          <div
            style={{
              backgroundColor: 'var(--ms-hud-bg)',
              borderColor: 'var(--ms-hud-border)',
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md border shadow-[0_0_12px_rgba(0,255,255,0.1)] transition-colors"
          >
            <span
              style={{ color: 'var(--ms-hud-label)' }}
              className="font-tech text-[10px] uppercase font-bold tracking-wider"
            >
              TIME:
            </span>
            <span
              style={{ color: 'var(--ms-hud-digit)' }}
              className="font-tech text-base font-extrabold tabular-nums tracking-widest"
            >
              {formatTimer(timerSeconds)}
            </span>
          </div>

          <button
            onClick={onTogglePause}
            aria-label={isPaused ? 'Resume game' : 'Pause game'}
            disabled={status === 'won' || status === 'lost'}
            style={{
              backgroundColor: 'var(--ms-hud-btn-bg)',
              borderColor: 'var(--ms-hud-btn-border)',
              color: 'var(--ms-hud-btn-text)',
            }}
            className="p-1.5 rounded-md border disabled:opacity-40 transition-all backdrop-blur-sm hover:opacity-90 shadow-[0_0_12px_rgba(0,255,255,0.15)]"
            title={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4 fill-current" />}
          </button>
        </div>
      </div>

      {/* Preset Difficulty Pills */}
      <div className="flex items-center justify-between gap-1 sm:gap-2">
        <div
          style={{
            backgroundColor: 'var(--ms-hud-bg)',
            borderColor: 'var(--ms-hud-border)',
          }}
          className="flex items-center border p-0.5 rounded-lg backdrop-blur-sm w-full transition-colors shadow-sm"
        >
          {difficulties.map((d) => {
            const isActive = difficulty === d.id;
            return (
              <button
                key={d.id}
                onClick={() => {
                  if (d.id === 'custom') {
                    onOpenCustomModal();
                  } else {
                    onSelectDifficulty(d.id);
                  }
                }}
                className={`flex-1 font-tech text-[11px] sm:text-xs font-semibold px-2 sm:px-3 py-1 rounded-md transition-all uppercase tracking-wider flex items-center justify-center gap-1 ${
                  isActive
                    ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-400/60 shadow-[0_0_12px_rgba(0,255,255,0.25)] [data-theme="light"]:bg-blue-600 [data-theme="light"]:text-white [data-theme="light"]:border-blue-700'
                    : 'text-slate-400 hover:text-cyan-300 [data-theme="light"]:text-slate-600 [data-theme="light"]:hover:text-blue-700'
                }`}
              >
                <span>{d.label}</span>
                {d.id === 'custom' && <Sliders className="w-3 h-3" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
