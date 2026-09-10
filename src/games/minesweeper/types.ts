export type MinesweeperDifficulty = 'beginner' | 'intermediate' | 'custom';

export type CellState = 'hidden' | 'revealed' | 'flagged' | 'exploded';

export interface MinesweeperCell {
  row: number;
  col: number;
  isMine: boolean;
  adjacentMines: number;
  state: CellState;
}

export type MinesweeperBoard = MinesweeperCell[][];

export type MinesweeperStatus = 'idle' | 'in_progress' | 'won' | 'lost';

export type TouchMode = 'dig' | 'flag';

export interface CustomConfig {
  rows: number;
  cols: number;
  mines: number;
}

export interface DifficultyStats {
  played: number;
  won: number;
  bestTime: number | null;
}

export interface MinesweeperStats {
  beginner: DifficultyStats;
  intermediate: DifficultyStats;
  custom: DifficultyStats;
}

export const DIFFICULTY_PRESETS: Record<'beginner' | 'intermediate', { rows: number; cols: number; mines: number }> = {
  beginner: { rows: 9, cols: 9, mines: 10 },
  intermediate: { rows: 16, cols: 16, mines: 40 },
};
