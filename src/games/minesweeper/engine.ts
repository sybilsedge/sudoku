import type { MinesweeperBoard, MinesweeperCell, MinesweeperStatus } from './types';

/**
 * Creates an empty uninitialized board of given dimensions.
 */
export function createEmptyBoard(rows: number, cols: number): MinesweeperBoard {
  const board: MinesweeperBoard = [];
  for (let r = 0; r < rows; r++) {
    const row: MinesweeperCell[] = [];
    for (let c = 0; c < cols; c++) {
      row.push({
        row: r,
        col: c,
        isMine: false,
        adjacentMines: 0,
        state: 'hidden',
      });
    }
    board.push(row);
  }
  return board;
}

/**
 * Returns valid neighbors within bounds.
 */
export function getNeighbors(board: MinesweeperBoard, row: number, col: number): MinesweeperCell[] {
  const rows = board.length;
  const cols = board[0].length;
  const neighbors: MinesweeperCell[] = [];

  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = row + dr;
      const nc = col + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        neighbors.push(board[nr][nc]);
      }
    }
  }
  return neighbors;
}

/**
 * Populates mines while guaranteeing that the starting cell (safeRow, safeCol)
 * and all its 8 adjacent neighbors have zero mines (Safe First Click Guarantee).
 */
export function populateMines(
  board: MinesweeperBoard,
  mineCount: number,
  safeRow: number,
  safeCol: number
): MinesweeperBoard {
  const rows = board.length;
  const cols = board[0].length;

  // Deep clone board
  const newBoard: MinesweeperBoard = board.map((r) =>
    r.map((c) => ({ ...c, isMine: false, adjacentMines: 0 }))
  );

  // Eligible positions: all cells EXCEPT the safe cell and its 8 adjacent neighbors
  const eligibleCoords: [number, number][] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const isSafeZone = Math.abs(r - safeRow) <= 1 && Math.abs(c - safeCol) <= 1;
      if (!isSafeZone) {
        eligibleCoords.push([r, c]);
      }
    }
  }

  // Adjust mineCount if grid is too small for safe 3x3 zone
  const actualMines = Math.min(mineCount, Math.max(1, eligibleCoords.length));

  // Fisher-Yates shuffle for true random distribution
  for (let i = eligibleCoords.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = eligibleCoords[i];
    eligibleCoords[i] = eligibleCoords[j];
    eligibleCoords[j] = temp;
  }

  // Place mines
  for (let i = 0; i < actualMines; i++) {
    const [mr, mc] = eligibleCoords[i];
    newBoard[mr][mc].isMine = true;
  }

  // Calculate adjacent mine counts
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (newBoard[r][c].isMine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && newBoard[nr][nc].isMine) {
            count++;
          }
        }
      }
      newBoard[r][c].adjacentMines = count;
    }
  }

  return newBoard;
}

/**
 * Checks if the player has won: all non-mine cells are revealed.
 */
export function checkWin(board: MinesweeperBoard): boolean {
  const rows = board.length;
  const cols = board[0].length;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = board[r][c];
      if (!cell.isMine && cell.state !== 'revealed') {
        return false;
      }
    }
  }
  return true;
}

/**
 * Auto-flags all remaining unrevealed mines when player wins.
 */
export function autoFlagMines(board: MinesweeperBoard): MinesweeperBoard {
  return board.map((r) =>
    r.map((cell) => {
      if (cell.isMine && cell.state !== 'revealed') {
        return { ...cell, state: 'flagged' };
      }
      return cell;
    })
  );
}

/**
 * Reveals all mines and highlights errors when player loses.
 */
export function revealAllMinesOnLoss(
  board: MinesweeperBoard,
  detonatedRow: number,
  detonatedCol: number
): MinesweeperBoard {
  return board.map((r, rIdx) =>
    r.map((cell, cIdx) => {
      if (rIdx === detonatedRow && cIdx === detonatedCol) {
        return { ...cell, state: 'exploded' };
      }
      if (cell.isMine && cell.state !== 'flagged') {
        return { ...cell, state: 'revealed' };
      }
      return cell;
    })
  );
}

export interface RevealResult {
  nextBoard: MinesweeperBoard;
  status: MinesweeperStatus;
  hitMine: boolean;
}

/**
 * Reveals a cell at (row, col) with recursive flood-fill for zero tiles.
 */
export function revealCell(board: MinesweeperBoard, row: number, col: number): RevealResult {
  const target = board[row][col];
  if (target.state !== 'hidden') {
    return { nextBoard: board, status: 'in_progress', hitMine: false };
  }

  // Clone board for immutability
  const nextBoard: MinesweeperBoard = board.map((r) => r.map((c) => ({ ...c })));

  // If mine clicked: Game Over
  if (target.isMine) {
    const finalBoard = revealAllMinesOnLoss(nextBoard, row, col);
    return {
      nextBoard: finalBoard,
      status: 'lost',
      hitMine: true,
    };
  }

  // Iterative BFS/Queue flood-fill for zero cells
  const queue: [number, number][] = [[row, col]];
  nextBoard[row][col].state = 'revealed';

  while (queue.length > 0) {
    const [cr, cc] = queue.shift()!;
    const current = nextBoard[cr][cc];

    if (current.adjacentMines === 0) {
      const neighbors = getNeighbors(nextBoard, cr, cc);
      for (const n of neighbors) {
        if (n.state === 'hidden' && !n.isMine) {
          n.state = 'revealed';
          if (n.adjacentMines === 0) {
            queue.push([n.row, n.col]);
          }
        }
      }
    }
  }

  // Check victory condition
  if (checkWin(nextBoard)) {
    const wonBoard = autoFlagMines(nextBoard);
    return {
      nextBoard: wonBoard,
      status: 'won',
      hitMine: false,
    };
  }

  return {
    nextBoard,
    status: 'in_progress',
    hitMine: false,
  };
}

/**
 * Toggles flag on a hidden cell.
 */
export function toggleFlag(board: MinesweeperBoard, row: number, col: number): MinesweeperBoard {
  const cell = board[row][col];
  if (cell.state !== 'hidden' && cell.state !== 'flagged') {
    return board;
  }

  return board.map((r, rIdx) =>
    r.map((c, cIdx) => {
      if (rIdx === row && cIdx === col) {
        return {
          ...c,
          state: c.state === 'hidden' ? 'flagged' : 'hidden',
        };
      }
      return c;
    })
  );
}

export interface ChordResult {
  nextBoard: MinesweeperBoard;
  status: MinesweeperStatus;
  chorded: boolean;
}

/**
 * Performs Chording: If a revealed number tile has its adjacent flag count
 * equal to its adjacentMines number, automatically reveal all other adjacent hidden cells.
 */
export function chordCell(board: MinesweeperBoard, row: number, col: number): ChordResult {
  const cell = board[row][col];
  if (cell.state !== 'revealed' || cell.adjacentMines === 0) {
    return { nextBoard: board, status: 'in_progress', chorded: false };
  }

  const neighbors = getNeighbors(board, row, col);
  const flagCount = neighbors.filter((n) => n.state === 'flagged').length;

  // Only chord if adjacent flags match the digit
  if (flagCount !== cell.adjacentMines) {
    return { nextBoard: board, status: 'in_progress', chorded: false };
  }

  const unrevealedNeighbors = neighbors.filter((n) => n.state === 'hidden');
  if (unrevealedNeighbors.length === 0) {
    return { nextBoard: board, status: 'in_progress', chorded: false };
  }

  let currentBoard: MinesweeperBoard = board.map((r) => r.map((c) => ({ ...c })));
  let hitMine = false;
  let detonatedR = -1;
  let detonatedC = -1;

  // Check if any unflagged neighbor is a mine
  for (const n of unrevealedNeighbors) {
    if (n.isMine) {
      hitMine = true;
      detonatedR = n.row;
      detonatedC = n.col;
      break;
    }
  }

  if (hitMine) {
    const finalBoard = revealAllMinesOnLoss(currentBoard, detonatedR, detonatedC);
    return {
      nextBoard: finalBoard,
      status: 'lost',
      chorded: true,
    };
  }

  // Reveal all unrevealed neighbors and flood-fill if any are 0
  const queue: [number, number][] = [];
  for (const n of unrevealedNeighbors) {
    const c = currentBoard[n.row][n.col];
    c.state = 'revealed';
    if (c.adjacentMines === 0) {
      queue.push([c.row, c.col]);
    }
  }

  while (queue.length > 0) {
    const [cr, cc] = queue.shift()!;
    const current = currentBoard[cr][cc];

    if (current.adjacentMines === 0) {
      const adjNeighbors = getNeighbors(currentBoard, cr, cc);
      for (const an of adjNeighbors) {
        if (an.state === 'hidden' && !an.isMine) {
          an.state = 'revealed';
          if (an.adjacentMines === 0) {
            queue.push([an.row, an.col]);
          }
        }
      }
    }
  }

  if (checkWin(currentBoard)) {
    const wonBoard = autoFlagMines(currentBoard);
    return {
      nextBoard: wonBoard,
      status: 'won',
      chorded: true,
    };
  }

  return {
    nextBoard: currentBoard,
    status: 'in_progress',
    chorded: true,
  };
}
