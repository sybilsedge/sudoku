import type { Difficulty, GameStats, InputMode, NoteMode, Move } from '../types/sudoku';

const STORAGE_KEY = 'sudoku_active_game_v1';
const STATS_KEY = 'sudoku_stats_v1';
const SETTINGS_KEY = 'sudoku_settings_v1';

export interface SavedGame {
  difficulty: Difficulty;
  puzzle: number[];
  solution: number[];
  currentValues: number[];
  cornerNotes: number[][];
  centerNotes: number[][];
  notesLocked?: boolean[];
  history: Move[];
  redoStack: Move[];
  timerSeconds: number;
  isCompleted: boolean;
  inputMode: InputMode;
  noteMode: NoteMode;
  timestamp: number;
}

export interface UserSettings {
  autoCheckErrors: boolean;
  highlightCrosshairs: boolean;
  highlightDuplicates: boolean;
  autoEraseNotes: boolean;
  autoCandidateMode: boolean;
  theme: 'dark' | 'light';
}

export const defaultSettings: UserSettings = {
  autoCheckErrors: false,
  highlightCrosshairs: true,
  highlightDuplicates: true,
  autoEraseNotes: true,
  autoCandidateMode: false,
  theme: 'dark',
};

export function applyTheme(theme: 'dark' | 'light'): void {
  if (typeof document !== 'undefined') {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }
}

export const defaultStats: GameStats = {
  easy: { played: 0, completed: 0, bestTime: null },
  medium: { played: 0, completed: 0, bestTime: null },
  hard: { played: 0, completed: 0, bestTime: null },
};

export function saveGame(data: SavedGame): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn('Failed to save game to localStorage:', err);
  }
}

export function loadGame(): SavedGame | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedGame;
  } catch (err) {
    console.warn('Failed to load game from localStorage:', err);
    return null;
  }
}

export function clearSavedGame(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear saved game:', err);
  }
}

export function saveStats(stats: GameStats): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (err) {
    console.warn('Failed to save stats to localStorage:', err);
  }
}

export function loadStats(): GameStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return defaultStats;
    return { ...defaultStats, ...JSON.parse(raw) };
  } catch (err) {
    console.warn('Failed to load stats from localStorage:', err);
    return defaultStats;
  }
}

export function saveSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.warn('Failed to save settings to localStorage:', err);
  }
}

export function loadSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return defaultSettings;
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch (err) {
    console.warn('Failed to load settings from localStorage:', err);
    return defaultSettings;
  }
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
