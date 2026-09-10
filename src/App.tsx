import { useState, useEffect } from 'react';
import type { ActiveGame } from './types/navigation';
import { applyTheme, loadSettings, saveSettings } from './utils/storage';
import { NavHeader } from './components/NavHeader';
import { SudokuView } from './components/SudokuView';
import { MinesweeperView } from './games/minesweeper/MinesweeperView';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return loadSettings().theme || 'dark';
  });

  // Active game view with hash router support
  const [activeGame, setActiveGame] = useState<ActiveGame>(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#/minesweeper') {
      return 'minesweeper';
    }
    return 'sudoku';
  });

  // Sync theme with DOM
  useEffect(() => {
    applyTheme(theme);
    const settings = loadSettings();
    saveSettings({ ...settings, theme });
  }, [theme]);

  // Sync hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#/minesweeper') {
        setActiveGame('minesweeper');
      } else if (hash === '#/sudoku') {
        setActiveGame('sudoku');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSelectGame = (game: ActiveGame) => {
    setActiveGame(game);
    window.location.hash = `#/${game}`;
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="flex flex-col min-h-screen min-h-[100dvh] justify-between selection:bg-cyan-500/30">
      {/* Top Architectural Navigation & Game Switcher */}
      <NavHeader
        activeGame={activeGame}
        onSelectGame={handleSelectGame}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Active Game View */}
      {activeGame === 'sudoku' ? (
        <SudokuView theme={theme} onToggleTheme={toggleTheme} />
      ) : (
        <MinesweeperView />
      )}
    </div>
  );
}
