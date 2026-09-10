import React, { useState } from 'react';
import { useMinesweeper } from './useMinesweeper';
import { MinesweeperHUD } from './components/MinesweeperHUD';
import { MinesweeperBoard } from './components/MinesweeperBoard';
import { MinesweeperControls } from './components/MinesweeperControls';
import { CustomGameModal } from './components/CustomGameModal';
import { MinesweeperEndModal } from './components/MinesweeperEndModal';
import { PauseModal } from '../../components/PauseModal';

export const MinesweeperView: React.FC = () => {
  const {
    difficulty,
    customConfig,
    board,
    status,
    touchMode,
    isPaused,
    timerSeconds,
    remainingMines,
    stats,
    setTouchMode,
    toggleTouchMode,
    setIsPaused,
    startNewGame,
    restartCurrentGame,
    handleCellClick,
    handleCellLongPress,
    handleToggleFlag,
  } = useMinesweeper();

  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [showEndModal, setShowEndModal] = useState(true);

  // Re-enable end modal on status change to won/lost
  const handleRestart = () => {
    setShowEndModal(true);
    restartCurrentGame();
  };

  return (
    <div className="flex flex-col flex-1 w-full justify-between select-none">
      {/* Top HUD: LED stats, face button, difficulty selector */}
      <MinesweeperHUD
        difficulty={difficulty}
        status={status}
        remainingMines={remainingMines}
        timerSeconds={timerSeconds}
        isPaused={isPaused}
        onSelectDifficulty={(diff) => {
          setShowEndModal(true);
          startNewGame(diff);
        }}
        onRestart={handleRestart}
        onTogglePause={() => setIsPaused((prev) => !prev)}
        onOpenCustomModal={() => setIsCustomModalOpen(true)}
      />

      {/* Main Board Area with Blueprint Viewport Frame */}
      <main className="flex-1 flex flex-col items-center justify-center my-auto py-1">
        <MinesweeperBoard
          board={board}
          onCellClick={handleCellClick}
          onCellLongPress={handleCellLongPress}
          onCellRightClick={handleToggleFlag}
        />
      </main>

      {/* Bottom Controls: Ergonomic Thumb Dig / Flag Mode Switcher */}
      <MinesweeperControls
        touchMode={touchMode}
        onToggleTouchMode={toggleTouchMode}
        onSetTouchMode={setTouchMode}
        onRestart={handleRestart}
        onOpenCustomModal={() => setIsCustomModalOpen(true)}
      />

      {/* Pause Modal */}
      <PauseModal
        isOpen={isPaused}
        onResume={() => setIsPaused(false)}
      />

      {/* Custom Game Dimension Modal */}
      <CustomGameModal
        isOpen={isCustomModalOpen}
        initialConfig={customConfig}
        onApply={(config) => {
          setShowEndModal(true);
          startNewGame('custom', config);
        }}
        onClose={() => setIsCustomModalOpen(false)}
      />

      {/* Victory / Defeat Modal */}
      <MinesweeperEndModal
        status={showEndModal ? status : 'idle'}
        difficulty={difficulty}
        timeSeconds={timerSeconds}
        stats={stats}
        onPlayAgain={handleRestart}
        onClose={() => setShowEndModal(false)}
      />
    </div>
  );
};
