export type Difficulty = 'easy' | 'medium' | 'hard';

export type InputMode = 'cell-first' | 'digit-first';

export type NoteMode = 'normal' | 'corner' | 'center';

export interface CellSnapshot {
  index: number;
  value: number;
  cornerNotes: number[];
  centerNotes: number[];
  notesLocked?: boolean;
}

export interface Move {
  description?: string;
  before: CellSnapshot[];
  after: CellSnapshot[];
}

export interface CellData {
  row: number;
  col: number;
  box: number;
  value: number; // 0 for empty, 1-9 for placed digit
  given: boolean;
  solution: number;
  cornerNotes: number[]; // numbers 1-9
  centerNotes: number[]; // numbers 1-9
  notesLocked?: boolean; // true if player manually entered/edited notes
  isConflict: boolean; // conflicts with another cell in row/col/box
  isError: boolean; // conflicts with puzzle solution (when check enabled)
}

export interface PuzzleDefinition {
  puzzle: number[]; // 81 integers (0 for empty)
  solution: number[]; // 81 integers
  difficulty: Difficulty;
  givensCount: number;
  singlesCount?: number;
  hiddenSinglesCount?: number;
  nakedPairsCount?: number;
  hiddenPairsCount?: number;
  pointingPairsCount?: number;
  boxLineCount?: number;
}

export interface GameStats {
  easy: { played: number; completed: number; bestTime: number | null };
  medium: { played: number; completed: number; bestTime: number | null };
  hard: { played: number; completed: number; bestTime: number | null };
}

export interface WorkerRequest {
  type: 'GENERATE';
  id: string;
  difficulty: Difficulty;
}

export interface WorkerResponse {
  type: 'GENERATED';
  id: string;
  payload: PuzzleDefinition;
  error?: string;
}
