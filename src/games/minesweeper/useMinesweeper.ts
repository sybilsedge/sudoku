import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  MinesweeperBoard,
  MinesweeperDifficulty,
  MinesweeperStatus,
  TouchMode,
  CustomConfig,
  MinesweeperStats,
} from './types';
import { DIFFICULTY_PRESETS } from './types';
import {
  createEmptyBoard,
  populateMines,
  revealCell,
  toggleFlag,
  chordCell,
} from './engine';

const STATS_STORAGE_KEY = 'minesweeper_stats_v1';
const SETTINGS_STORAGE_KEY = 'minesweeper_settings_v1';

const defaultStats: MinesweeperStats = {
  beginner: { played: 0, won: 0, bestTime: null },
  intermediate: { played: 0, won: 0, bestTime: null },
  custom: { played: 0, won: 0, bestTime: null },
};

function loadStats(): MinesweeperStats {
  try {
    const raw = localStorage.getItem(STATS_STORAGE_KEY);
    if (!raw) return defaultStats;
    return { ...defaultStats, ...JSON.parse(raw) };
  } catch {
    return defaultStats;
  }
}

function saveStats(stats: MinesweeperStats) {
  try {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch (err) {
    console.warn('Failed to save minesweeper stats:', err);
  }
}

function loadSettings(): { difficulty: MinesweeperDifficulty; customConfig: CustomConfig } {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return { difficulty: 'beginner', customConfig: { rows: 12, cols: 12, mines: 20 } };
    return { difficulty: 'beginner', customConfig: { rows: 12, cols: 12, mines: 20 }, ...JSON.parse(raw) };
  } catch {
    return { difficulty: 'beginner', customConfig: { rows: 12, cols: 12, mines: 20 } };
  }
}

function saveSettings(settings: { difficulty: MinesweeperDifficulty; customConfig: CustomConfig }) {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (err) {
    console.warn('Failed to save minesweeper settings:', err);
  }
}

export function useMinesweeper() {
  const [difficulty, setDifficulty] = useState<MinesweeperDifficulty>(() => loadSettings().difficulty);
  const [customConfig, setCustomConfig] = useState<CustomConfig>(() => loadSettings().customConfig);

  const [touchMode, setTouchMode] = useState<TouchMode>('dig');
  const [status, setStatus] = useState<MinesweeperStatus>('idle');
  const [isPaused, setIsPaused] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [stats, setStats] = useState<MinesweeperStats>(loadStats);

  // Get active dimensions and mine count
  const activeConfig =
    difficulty === 'custom'
      ? customConfig
      : DIFFICULTY_PRESETS[difficulty];

  const [board, setBoard] = useState<MinesweeperBoard>(() =>
    createEmptyBoard(activeConfig.rows, activeConfig.cols)
  );

  const isFirstClickRef = useRef<boolean>(true);
  const timerIntervalRef = useRef<number | null>(null);

  // Compute placed flags
  const flagsPlaced = board.reduce(
    (acc, row) => acc + row.filter((c) => c.state === 'flagged').length,
    0
  );
  const remainingMines = activeConfig.mines - flagsPlaced;

  // Trigger light haptic vibration if supported
  const triggerHaptic = useCallback((ms = 40) => {
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(ms);
      }
    } catch {
      // Haptics not allowed or unsupported
    }
  }, []);

  // Timer effect
  useEffect(() => {
    if (status === 'in_progress' && !isPaused) {
      timerIntervalRef.current = window.setInterval(() => {
        setTimerSeconds((prev) => Math.min(prev + 1, 999));
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [status, isPaused]);

  // Record outcome in stats
  const recordGameOutcome = useCallback(
    (outcome: 'won' | 'lost') => {
      if (outcome === 'won') {
        triggerHaptic(100);
        setStats((prev) => {
          const currentDiffStats = prev[difficulty];
          const newBestTime =
            currentDiffStats.bestTime === null
              ? timerSeconds
              : Math.min(currentDiffStats.bestTime, timerSeconds);

          const updated: MinesweeperStats = {
            ...prev,
            [difficulty]: {
              played: currentDiffStats.played + 1,
              won: currentDiffStats.won + 1,
              bestTime: newBestTime,
            },
          };
          saveStats(updated);
          return updated;
        });
      } else if (outcome === 'lost') {
        triggerHaptic(200);
        setStats((prev) => {
          const currentDiffStats = prev[difficulty];
          const updated: MinesweeperStats = {
            ...prev,
            [difficulty]: {
              ...currentDiffStats,
              played: currentDiffStats.played + 1,
            },
          };
          saveStats(updated);
          return updated;
        });
      }
    },
    [difficulty, timerSeconds, triggerHaptic]
  );

  // Start a new game
  const startNewGame = useCallback(
    (newDiff?: MinesweeperDifficulty, newCustom?: CustomConfig) => {
      const targetDiff = newDiff || difficulty;
      const targetCustom = newCustom || customConfig;

      if (newDiff) setDifficulty(newDiff);
      if (newCustom) setCustomConfig(newCustom);
      saveSettings({ difficulty: targetDiff, customConfig: targetCustom });

      const config =
        targetDiff === 'custom'
          ? targetCustom
          : DIFFICULTY_PRESETS[targetDiff];

      setBoard(createEmptyBoard(config.rows, config.cols));
      setStatus('idle');
      setIsPaused(false);
      setTimerSeconds(0);
      isFirstClickRef.current = true;
    },
    [difficulty, customConfig]
  );

  // Restart current puzzle dimensions with fresh board
  const restartCurrentGame = useCallback(() => {
    startNewGame(difficulty, customConfig);
  }, [startNewGame, difficulty, customConfig]);

  // Flag/Unflag a cell
  const handleToggleFlag = useCallback(
    (row: number, col: number) => {
      if (status === 'won' || status === 'lost' || isPaused) return;

      setBoard((prev) => {
        const next = toggleFlag(prev, row, col);
        if (next !== prev) {
          triggerHaptic(40);
        }
        return next;
      });
    },
    [status, isPaused, triggerHaptic]
  );

  // Reveal a cell with Safe First Click guarantee
  const handleReveal = useCallback(
    (row: number, col: number) => {
      if (status === 'won' || status === 'lost' || isPaused) return;

      let currentBoard = board;

      // Safe First Click guarantee: populate mines now if starting
      if (isFirstClickRef.current || status === 'idle') {
        currentBoard = populateMines(board, activeConfig.mines, row, col);
        isFirstClickRef.current = false;
        setStatus('in_progress');
      }

      const result = revealCell(currentBoard, row, col);
      setBoard(result.nextBoard);
      if (result.status === 'won' || result.status === 'lost') {
        setStatus(result.status);
        recordGameOutcome(result.status);
      }
    },
    [board, status, isPaused, activeConfig.mines, recordGameOutcome]
  );

  // Chord a cell
  const handleChord = useCallback(
    (row: number, col: number) => {
      if (status !== 'in_progress' || isPaused) return;

      const result = chordCell(board, row, col);
      if (result.chorded) {
        triggerHaptic(50);
        setBoard(result.nextBoard);
        if (result.status === 'won' || result.status === 'lost') {
          setStatus(result.status);
          recordGameOutcome(result.status);
        }
      }
    },
    [board, status, isPaused, triggerHaptic, recordGameOutcome]
  );

  // Cell primary interaction based on touch mode
  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (status === 'won' || status === 'lost' || isPaused) return;

      const cell = board[row][col];

      // If cell is already revealed: attempt chording on click
      if (cell.state === 'revealed') {
        handleChord(row, col);
        return;
      }

      // If hidden or flagged:
      if (touchMode === 'flag') {
        handleToggleFlag(row, col);
      } else {
        // Dig mode
        if (cell.state === 'flagged') {
          // If flagged in dig mode, tap does not reveal to prevent accidental deaths
          triggerHaptic(20);
          return;
        }
        handleReveal(row, col);
      }
    },
    [board, status, isPaused, touchMode, handleChord, handleToggleFlag, handleReveal, triggerHaptic]
  );

  // Cell long press interaction: always toggle flag
  const handleCellLongPress = useCallback(
    (row: number, col: number) => {
      if (status === 'won' || status === 'lost' || isPaused) return;
      const cell = board[row][col];
      if (cell.state === 'revealed') return;

      handleToggleFlag(row, col);
    },
    [board, status, isPaused, handleToggleFlag]
  );

  const toggleTouchMode = useCallback(() => {
    setTouchMode((prev) => (prev === 'dig' ? 'flag' : 'dig'));
    triggerHaptic(30);
  }, [triggerHaptic]);

  return {
    difficulty,
    customConfig,
    activeConfig,
    board,
    status,
    touchMode,
    isPaused,
    timerSeconds,
    flagsPlaced,
    remainingMines,
    stats,
    setTouchMode,
    toggleTouchMode,
    setIsPaused,
    startNewGame,
    restartCurrentGame,
    handleCellClick,
    handleCellLongPress,
    handleChord,
    handleToggleFlag,
  };
}
