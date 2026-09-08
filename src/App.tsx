import { useState, useEffect } from 'react';
import { useSudoku } from './hooks/useSudoku';
import { applyTheme } from './utils/storage';
import { Header } from './components/Header';
import { Board } from './components/Board';
import { Controls } from './components/Controls';
import { Keypad } from './components/Keypad';
import { PauseModal } from './components/PauseModal';
import { VictoryModal } from './components/VictoryModal';
import { SettingsModal } from './components/SettingsModal';

export default function App() {
  const {
    difficulty,
    cells,
    selectedCellIndex,
    selectedDigit,
    inputMode,
    noteMode,
    history,
    redoStack,
    timerSeconds,
    isPaused,
    isLoading,
    stats,
    settings,
    digitCounts,
    showVictoryModal,
    setSelectedCellIndex,
    setInputMode,
    setNoteMode,
    setIsPaused,
    setShowVictoryModal,
    startNewGame,
    restartCurrentPuzzle,
    handleCellClick,
    handleKeypadDigit,
    eraseCell,
    autoFillNotes,
    undo,
    redo,
    cycleNoteMode,
    updateSettings,
  } = useSudoku();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Synchronize theme attribute on mount and setting change
  useEffect(() => {
    applyTheme(settings.theme || 'dark');
  }, [settings.theme]);

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'light' ? 'dark' : 'light' });
  };

  // Keyboard navigation & inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if modals are open or target is an input
      if (isSettingsOpen || isPaused || showVictoryModal) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const key = e.key;

      // Undo / Redo shortcuts
      if ((e.ctrlKey || e.metaKey) && (key === 'z' || key === 'Z')) {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
        return;
      }
      if ((e.ctrlKey || e.metaKey) && (key === 'y' || key === 'Y')) {
        e.preventDefault();
        redo();
        return;
      }

      // Digits 1-9
      if (/^[1-9]$/.test(key)) {
        e.preventDefault();
        handleKeypadDigit(parseInt(key, 10));
        return;
      }

      // Erase
      if (key === 'Backspace' || key === 'Delete') {
        e.preventDefault();
        eraseCell();
        return;
      }

      // Arrow navigation
      if (selectedCellIndex !== null && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
        e.preventDefault();
        const r = Math.floor(selectedCellIndex / 9);
        const c = selectedCellIndex % 9;
        let nextR = r;
        let nextC = c;

        if (key === 'ArrowUp') nextR = Math.max(0, r - 1);
        if (key === 'ArrowDown') nextR = Math.min(8, r + 1);
        if (key === 'ArrowLeft') nextC = Math.max(0, c - 1);
        if (key === 'ArrowRight') nextC = Math.min(8, c + 1);

        setSelectedCellIndex(nextR * 9 + nextC);
        return;
      }

      // Space or 'n': cycle note modes
      if (key === ' ' || key === 'n' || key === 'N') {
        e.preventDefault();
        cycleNoteMode();
        return;
      }

      // Direct note mode keys: 'c' for Corner, 't' for Center, 'x' for Normal
      if (key === 'c' || key === 'C') {
        e.preventDefault();
        setNoteMode('corner');
        return;
      }
      if (key === 't' || key === 'T') {
        e.preventDefault();
        setNoteMode('center');
        return;
      }
      if (key === 'x' || key === 'X') {
        e.preventDefault();
        setNoteMode('normal');
        return;
      }

      // Auto-fill candidate notes shortcut
      if (key === 'a' || key === 'A') {
        e.preventDefault();
        autoFillNotes();
        return;
      }

      // Toggle input mode
      if (key === 'm' || key === 'M') {
        e.preventDefault();
        setInputMode((prev) => (prev === 'cell-first' ? 'digit-first' : 'cell-first'));
        return;
      }

      // Pause toggle
      if (key === 'p' || key === 'P') {
        e.preventDefault();
        setIsPaused((prev) => !prev);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isSettingsOpen,
    isPaused,
    showVictoryModal,
    selectedCellIndex,
    undo,
    redo,
    handleKeypadDigit,
    eraseCell,
    autoFillNotes,
    setSelectedCellIndex,
    cycleNoteMode,
    setNoteMode,
    setInputMode,
    setIsPaused,
  ]);

  return (
    <div className="flex flex-col min-h-screen min-h-[100dvh] justify-between selection:bg-cyan-500/30">
      {/* Top Header */}
      <Header
        difficulty={difficulty}
        timerSeconds={timerSeconds}
        isPaused={isPaused}
        isLoading={isLoading}
        theme={settings.theme || 'dark'}
        onSelectDifficulty={startNewGame}
        onTogglePause={() => setIsPaused((prev) => !prev)}
        onRestart={restartCurrentPuzzle}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleTheme={toggleTheme}
      />

      {/* Main Board Area */}
      <main className="flex-1 flex flex-col items-center justify-center my-auto py-1">
        <Board
          cells={cells}
          selectedCellIndex={selectedCellIndex}
          selectedDigit={selectedDigit}
          inputMode={inputMode}
          highlightCrosshairs={settings.highlightCrosshairs}
          highlightDuplicates={settings.highlightDuplicates}
          onCellClick={handleCellClick}
        />
      </main>

      {/* Action Controls & Keypad */}
      <section className="w-full">
        <Controls
          inputMode={inputMode}
          noteMode={noteMode}
          canUndo={history.length > 0}
          canRedo={redoStack.length > 0}
          onUndo={undo}
          onRedo={redo}
          onErase={() => eraseCell()}
          onAutoFillNotes={autoFillNotes}
          onSelectNoteMode={setNoteMode}
          onToggleInputMode={() =>
            setInputMode((prev) => (prev === 'cell-first' ? 'digit-first' : 'cell-first'))
          }
        />

        <Keypad
          digitCounts={digitCounts}
          selectedDigit={selectedDigit}
          inputMode={inputMode}
          onDigitClick={handleKeypadDigit}
        />
      </section>

      {/* Modals */}
      <PauseModal
        isOpen={isPaused}
        onResume={() => setIsPaused(false)}
      />

      <VictoryModal
        isOpen={showVictoryModal}
        difficulty={difficulty}
        timeSeconds={timerSeconds}
        stats={stats}
        onPlayAgain={startNewGame}
        onClose={() => setShowVictoryModal(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        settings={settings}
        stats={stats}
        onUpdateSettings={updateSettings}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
