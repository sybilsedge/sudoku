import React from 'react';
import type { ActiveGame } from '../types/navigation';
import { Sun, Moon, Grid3X3, Bomb } from 'lucide-react';

interface NavHeaderProps {
  activeGame: ActiveGame;
  onSelectGame: (game: ActiveGame) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const NavHeader: React.FC<NavHeaderProps> = ({
  activeGame,
  onSelectGame,
  theme,
  onToggleTheme,
}) => {
  return (
    <div className="w-full max-w-[500px] mx-auto px-2 sm:px-4 pt-safe pt-2 pb-1.5 flex items-center justify-between border-b border-cyan-500/20 [data-theme='light']:border-blue-200">
      {/* Blueprint Tab Switcher */}
      <nav className="flex items-center gap-1 p-0.5 rounded-lg border border-cyan-500/30 bg-black/40 [data-theme='light']:bg-white [data-theme='light']:border-blue-300 [data-theme='light']:shadow-sm backdrop-blur-md">
        <button
          onClick={() => onSelectGame('sudoku')}
          aria-label="Switch to Sudoku"
          className={`flex items-center gap-1.5 px-3 py-1 rounded font-tech text-xs sm:text-xs font-semibold tracking-wider uppercase transition-all ${
            activeGame === 'sudoku'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_12px_rgba(0,255,255,0.25)] [data-theme="light"]:bg-blue-600 [data-theme="light"]:text-white [data-theme="light"]:border-blue-700 [data-theme="light"]:shadow-sm'
              : 'text-slate-400 hover:text-cyan-200 border border-transparent [data-theme="light"]:text-slate-600 [data-theme="light"]:hover:text-blue-700'
          }`}
        >
          <Grid3X3 className="w-3.5 h-3.5" />
          <span>SUDOKU</span>
        </button>

        <button
          onClick={() => onSelectGame('minesweeper')}
          aria-label="Switch to Minesweeper"
          className={`flex items-center gap-1.5 px-3 py-1 rounded font-tech text-xs sm:text-xs font-semibold tracking-wider uppercase transition-all ${
            activeGame === 'minesweeper'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_12px_rgba(0,255,255,0.25)] [data-theme="light"]:bg-blue-600 [data-theme="light"]:text-white [data-theme="light"]:border-blue-700 [data-theme="light"]:shadow-sm'
              : 'text-slate-400 hover:text-cyan-200 border border-transparent [data-theme="light"]:text-slate-600 [data-theme="light"]:hover:text-blue-700'
          }`}
        >
          <Bomb className="w-3.5 h-3.5" />
          <span>MINESWEEPER</span>
        </button>
      </nav>

      {/* Right controls: Theme Switcher & Blueprint Spec Indicator */}
      <div className="flex items-center gap-2">
        <span className="hidden sm:inline-block font-tech text-[10px] text-cyan-500/70 [data-theme='light']:text-blue-600/70 uppercase tracking-widest">
          SYS.CAD // V2.0
        </span>
        <button
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light blueprint' : 'Switch to dark cyberpunk'}
          className="p-1.5 rounded-md border border-cyan-500/30 bg-black/40 text-cyan-400 [data-theme='light']:bg-white [data-theme='light']:border-blue-300 [data-theme='light']:text-blue-700 [data-theme='light']:hover:bg-blue-50 hover:text-cyan-100 hover:border-cyan-400 hover:shadow-[0_0_10px_rgba(0,255,255,0.2)] transition-all backdrop-blur-sm"
          title={`Theme: ${theme.toUpperCase()}`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
