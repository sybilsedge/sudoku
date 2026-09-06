import { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import type {
  CellData,
  Difficulty,
  InputMode,
  NoteMode,
  Move,
  CellSnapshot,
  GameStats,
} from '../types/sudoku';
import { generatorClient } from '../workers/generatorClient';
import { recalculateConflicts, getRelatedCellIndices } from '../utils/conflicts';
import {
  saveGame,
  loadGame,
  clearSavedGame,
  saveStats,
  loadStats,
  saveSettings,
  loadSettings,
  type UserSettings,
} from '../utils/storage';

function createCellsFromPuzzle(puzzle: number[], solution: number[]): CellData[] {
  const cells: CellData[] = [];
  for (let i = 0; i < 81; i++) {
    const row = Math.floor(i / 9);
    const col = i % 9;
    const box = Math.floor(row / 3) * 3 + Math.floor(col / 3);
    const val = puzzle[i];
    cells.push({
      row,
      col,
      box,
      value: val,
      given: val !== 0,
      solution: solution[i],
      cornerNotes: [],
      centerNotes: [],
      isConflict: false,
      isError: false,
    });
  }
  return cells;
}

export function useSudoku() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [cells, setCells] = useState<CellData[]>([]);
  const [solution, setSolution] = useState<number[]>([]);
  const [givens, setGivens] = useState<number[]>([]);
  const [selectedCellIndex, setSelectedCellIndex] = useState<number | null>(0);
  const [selectedDigit, setSelectedDigit] = useState<number | null>(null);
  const [inputMode, setInputMode] = useState<InputMode>('cell-first');
  const [noteMode, setNoteMode] = useState<NoteMode>('normal');
  const [history, setHistory] = useState<Move[]>([]);
  const [redoStack, setRedoStack] = useState<Move[]>([]);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<GameStats>(loadStats);
  const [settings, setSettings] = useState<UserSettings>(loadSettings);
  const [showVictoryModal, setShowVictoryModal] = useState<boolean>(false);

  const timerRef = useRef<number | null>(null);

  // Initialize game: try loading from storage, else generate new
  useEffect(() => {
    const saved = loadGame();
    if (saved && saved.puzzle && saved.puzzle.length === 81 && !saved.isCompleted) {
      setDifficulty(saved.difficulty);
      setSolution(saved.solution);
      setGivens(saved.puzzle);
      setTimerSeconds(saved.timerSeconds || 0);
      setInputMode(saved.inputMode || 'cell-first');
      setNoteMode(saved.noteMode || 'normal');
      setHistory(saved.history || []);
      setRedoStack(saved.redoStack || []);

      const restoredCells: CellData[] = [];
      for (let i = 0; i < 81; i++) {
        const row = Math.floor(i / 9);
        const col = i % 9;
        const box = Math.floor(row / 3) * 3 + Math.floor(col / 3);
        restoredCells.push({
          row,
          col,
          box,
          value: saved.currentValues[i] || 0,
          given: saved.puzzle[i] !== 0,
          solution: saved.solution[i],
          cornerNotes: saved.cornerNotes?.[i] || [],
          centerNotes: saved.centerNotes?.[i] || [],
          isConflict: false,
          isError: false,
        });
      }
      setCells(recalculateConflicts(restoredCells, settings.autoCheckErrors));
      setIsLoading(false);
    } else {
      startNewGame('medium');
    }
  }, []);

  // Timer interval
  useEffect(() => {
    if (isLoading || isPaused || isCompleted) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = window.setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isLoading, isPaused, isCompleted]);

  // Persist game state
  useEffect(() => {
    if (isLoading || cells.length !== 81 || givens.length !== 81) return;

    saveGame({
      difficulty,
      puzzle: givens,
      solution,
      currentValues: cells.map((c) => c.value),
      cornerNotes: cells.map((c) => c.cornerNotes),
      centerNotes: cells.map((c) => c.centerNotes),
      history,
      redoStack,
      timerSeconds,
      isCompleted,
      inputMode,
      noteMode,
      timestamp: Date.now(),
    });
  }, [cells, difficulty, givens, solution, history, redoStack, timerSeconds, isCompleted, inputMode, noteMode, isLoading]);

  // Start new game
  const startNewGame = useCallback(async (newDiff: Difficulty) => {
    setIsLoading(true);
    setIsCompleted(false);
    setShowVictoryModal(false);
    setIsPaused(false);
    setTimerSeconds(0);
    setHistory([]);
    setRedoStack([]);
    setSelectedCellIndex(0);
    setSelectedDigit(null);
    setDifficulty(newDiff);

    try {
      const data = await generatorClient.generate(newDiff);
      const newCells = createCellsFromPuzzle(data.puzzle, data.solution);
      setGivens(data.puzzle);
      setSolution(data.solution);
      setCells(recalculateConflicts(newCells, settings.autoCheckErrors));

      // Update played stats
      setStats((prev) => {
        const next = {
          ...prev,
          [newDiff]: {
            ...prev[newDiff],
            played: prev[newDiff].played + 1,
          },
        };
        saveStats(next);
        return next;
      });
    } catch (err) {
      console.error('Failed to generate new game:', err);
    } finally {
      setIsLoading(false);
    }
  }, [settings.autoCheckErrors]);

  // Restart current puzzle
  const restartCurrentPuzzle = useCallback(() => {
    if (givens.length !== 81 || solution.length !== 81) return;
    const newCells = createCellsFromPuzzle(givens, solution);
    setCells(recalculateConflicts(newCells, settings.autoCheckErrors));
    setHistory([]);
    setRedoStack([]);
    setTimerSeconds(0);
    setIsCompleted(false);
    setShowVictoryModal(false);
  }, [givens, solution, settings.autoCheckErrors]);

  // Check victory condition
  const checkVictory = useCallback((updatedCells: CellData[], sol: number[]) => {
    if (updatedCells.length !== 81 || sol.length !== 81) return;

    for (let i = 0; i < 81; i++) {
      if (updatedCells[i].value === 0 || updatedCells[i].value !== sol[i]) {
        return;
      }
    }

    // Solved!
    setIsCompleted(true);
    setShowVictoryModal(true);
    clearSavedGame();

    // Trigger celebration confetti
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#0284c7', '#38bdf8', '#f59e0b', '#10b981', '#6366f1'],
    });

    // Update stats
    setStats((prev) => {
      const currentDiffStats = prev[difficulty];
      const newBest =
        currentDiffStats.bestTime === null
          ? timerSeconds
          : Math.min(currentDiffStats.bestTime, timerSeconds);

      const next = {
        ...prev,
        [difficulty]: {
          ...currentDiffStats,
          completed: currentDiffStats.completed + 1,
          bestTime: newBest,
        },
      };
      saveStats(next);
      return next;
    });
  }, [difficulty, timerSeconds]);

  // Apply a move to a cell
  const applyCellAction = useCallback((targetIndex: number, digit: number, targetNoteMode: NoteMode) => {
    if (targetIndex < 0 || targetIndex >= 81) return;
    const targetCell = cells[targetIndex];
    if (targetCell.given || isCompleted) return;

    const beforeSnapshots: CellSnapshot[] = [];
    const afterSnapshots: CellSnapshot[] = [];

    // Capture initial target state
    beforeSnapshots.push({
      index: targetIndex,
      value: targetCell.value,
      cornerNotes: [...targetCell.cornerNotes],
      centerNotes: [...targetCell.centerNotes],
    });

    let newCells = [...cells];

    if (targetNoteMode === 'normal') {
      // If digit is already placed, toggle off (clear)
      const newValue = targetCell.value === digit ? 0 : digit;

      newCells[targetIndex] = {
        ...targetCell,
        value: newValue,
        cornerNotes: [],
        centerNotes: [],
      };

      afterSnapshots.push({
        index: targetIndex,
        value: newValue,
        cornerNotes: [],
        centerNotes: [],
      });

      // Automatic pencilmark erasure if enabled
      if (newValue !== 0 && settings.autoEraseNotes) {
        const peers = getRelatedCellIndices(targetIndex);
        for (const peerIdx of peers) {
          const peer = newCells[peerIdx];
          const hasInCorner = peer.cornerNotes.includes(newValue);
          const hasInCenter = peer.centerNotes.includes(newValue);

          if (hasInCorner || hasInCenter) {
            beforeSnapshots.push({
              index: peerIdx,
              value: peer.value,
              cornerNotes: [...peer.cornerNotes],
              centerNotes: [...peer.centerNotes],
            });

            const newCorner = peer.cornerNotes.filter((n) => n !== newValue);
            const newCenter = peer.centerNotes.filter((n) => n !== newValue);

            newCells[peerIdx] = {
              ...peer,
              cornerNotes: newCorner,
              centerNotes: newCenter,
            };

            afterSnapshots.push({
              index: peerIdx,
              value: peer.value,
              cornerNotes: newCorner,
              centerNotes: newCenter,
            });
          }
        }
      }
    } else if (targetNoteMode === 'corner') {
      // Toggle in corner notes
      const exists = targetCell.cornerNotes.includes(digit);
      const updatedNotes = exists
        ? targetCell.cornerNotes.filter((d) => d !== digit)
        : [...targetCell.cornerNotes, digit].sort((a, b) => a - b);

      newCells[targetIndex] = {
        ...targetCell,
        value: 0, // entering notes clears placed value
        cornerNotes: updatedNotes,
      };

      afterSnapshots.push({
        index: targetIndex,
        value: 0,
        cornerNotes: updatedNotes,
        centerNotes: [...targetCell.centerNotes],
      });
    } else if (targetNoteMode === 'center') {
      // Toggle in center notes
      const exists = targetCell.centerNotes.includes(digit);
      const updatedNotes = exists
        ? targetCell.centerNotes.filter((d) => d !== digit)
        : [...targetCell.centerNotes, digit].sort((a, b) => a - b);

      newCells[targetIndex] = {
        ...targetCell,
        value: 0,
        centerNotes: updatedNotes,
      };

      afterSnapshots.push({
        index: targetIndex,
        value: 0,
        cornerNotes: [...targetCell.cornerNotes],
        centerNotes: updatedNotes,
      });
    }

    const validatedCells = recalculateConflicts(newCells, settings.autoCheckErrors);
    setCells(validatedCells);

    // Push move onto history stack
    const move: Move = {
      before: beforeSnapshots,
      after: afterSnapshots,
    };
    setHistory((prev) => [...prev, move]);
    setRedoStack([]);

    // Check victory
    checkVictory(validatedCells, solution);
  }, [cells, isCompleted, settings.autoCheckErrors, settings.autoEraseNotes, solution, checkVictory]);

  // Erase cell content (value and notes)
  const eraseCell = useCallback((targetIndex?: number) => {
    const idx = targetIndex !== undefined ? targetIndex : selectedCellIndex;
    if (idx === null || idx < 0 || idx >= 81) return;

    const cell = cells[idx];
    if (cell.given || isCompleted) return;
    if (cell.value === 0 && cell.cornerNotes.length === 0 && cell.centerNotes.length === 0) return;

    const before: CellSnapshot = {
      index: idx,
      value: cell.value,
      cornerNotes: [...cell.cornerNotes],
      centerNotes: [...cell.centerNotes],
    };

    const after: CellSnapshot = {
      index: idx,
      value: 0,
      cornerNotes: [],
      centerNotes: [],
    };

    const newCells = [...cells];
    newCells[idx] = {
      ...cell,
      value: 0,
      cornerNotes: [],
      centerNotes: [],
    };

    const validatedCells = recalculateConflicts(newCells, settings.autoCheckErrors);
    setCells(validatedCells);
    setHistory((prev) => [...prev, { before: [before], after: [after] }]);
    setRedoStack([]);
  }, [cells, isCompleted, selectedCellIndex, settings.autoCheckErrors]);

  // Handle cell click depending on input mode
  const handleCellClick = useCallback((index: number) => {
    if (isPaused || isCompleted) return;

    if (inputMode === 'cell-first') {
      setSelectedCellIndex(index);
    } else {
      // Digit-first mode: tap cell to place or toggle selectedDigit
      setSelectedCellIndex(index);
      if (selectedDigit !== null) {
        applyCellAction(index, selectedDigit, noteMode);
      }
    }
  }, [inputMode, isPaused, isCompleted, selectedDigit, noteMode, applyCellAction]);

  // Handle keypad digit tap
  const handleKeypadDigit = useCallback((digit: number) => {
    if (isPaused || isCompleted) return;

    if (inputMode === 'cell-first') {
      if (selectedCellIndex !== null) {
        applyCellAction(selectedCellIndex, digit, noteMode);
      }
    } else {
      // Digit-first mode: toggle or select active digit
      setSelectedDigit((prev) => (prev === digit ? null : digit));
    }
  }, [inputMode, isPaused, isCompleted, selectedCellIndex, noteMode, applyCellAction]);

  // Undo
  const undo = useCallback(() => {
    if (history.length === 0 || isCompleted) return;
    const lastMove = history[history.length - 1];
    const newHistory = history.slice(0, -1);

    const newCells = [...cells];
    for (const snap of lastMove.before) {
      const current = newCells[snap.index];
      newCells[snap.index] = {
        ...current,
        value: snap.value,
        cornerNotes: [...snap.cornerNotes],
        centerNotes: [...snap.centerNotes],
      };
    }

    const validated = recalculateConflicts(newCells, settings.autoCheckErrors);
    setCells(validated);
    setHistory(newHistory);
    setRedoStack((prev) => [...prev, lastMove]);
  }, [history, isCompleted, cells, settings.autoCheckErrors]);

  // Redo
  const redo = useCallback(() => {
    if (redoStack.length === 0 || isCompleted) return;
    const nextMove = redoStack[redoStack.length - 1];
    const newRedoStack = redoStack.slice(0, -1);

    const newCells = [...cells];
    for (const snap of nextMove.after) {
      const current = newCells[snap.index];
      newCells[snap.index] = {
        ...current,
        value: snap.value,
        cornerNotes: [...snap.cornerNotes],
        centerNotes: [...snap.centerNotes],
      };
    }

    const validated = recalculateConflicts(newCells, settings.autoCheckErrors);
    setCells(validated);
    setRedoStack(newRedoStack);
    setHistory((prev) => [...prev, nextMove]);
    checkVictory(validated, solution);
  }, [redoStack, isCompleted, cells, settings.autoCheckErrors, checkVictory, solution]);

  // Toggle note mode: normal -> corner -> center -> normal
  const cycleNoteMode = useCallback(() => {
    setNoteMode((prev) => {
      if (prev === 'normal') return 'corner';
      if (prev === 'corner') return 'center';
      return 'normal';
    });
  }, []);

  // Update settings
  const updateSettings = useCallback((newSettings: Partial<UserSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      saveSettings(updated);
      setCells((currentCells) => recalculateConflicts(currentCells, updated.autoCheckErrors));
      return updated;
    });
  }, []);

  // Digit counts (remaining counts of 1-9)
  const digitCounts = useCallback(() => {
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
    for (const c of cells) {
      if (c.value >= 1 && c.value <= 9) {
        counts[c.value] = (counts[c.value] || 0) + 1;
      }
    }
    return counts;
  }, [cells])();

  return {
    difficulty,
    cells,
    solution,
    givens,
    selectedCellIndex,
    selectedDigit,
    inputMode,
    noteMode,
    history,
    redoStack,
    timerSeconds,
    isPaused,
    isCompleted,
    isLoading,
    stats,
    settings,
    digitCounts,
    showVictoryModal,
    setSelectedCellIndex,
    setSelectedDigit,
    setInputMode,
    setNoteMode,
    setIsPaused,
    setShowVictoryModal,
    startNewGame,
    restartCurrentPuzzle,
    handleCellClick,
    handleKeypadDigit,
    eraseCell,
    undo,
    redo,
    cycleNoteMode,
    updateSettings,
  };
}
