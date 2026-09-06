import type { CellData } from '../types/sudoku';

/**
 * Returns an updated array of cells with `isConflict` flags set for cells
 * that duplicate another cell in the same row, column, or 3x3 box.
 * Also checks `isError` against the known solution when autoCheck is active.
 */
export function recalculateConflicts(cells: CellData[], autoCheck: boolean): CellData[] {
  const n = cells.length; // 81
  const conflictIndices = new Set<number>();

  for (let i = 0; i < n; i++) {
    const val = cells[i].value;
    if (val === 0) continue;

    for (let j = i + 1; j < n; j++) {
      if (cells[j].value !== val) continue;

      const sameRow = cells[i].row === cells[j].row;
      const sameCol = cells[i].col === cells[j].col;
      const sameBox = cells[i].box === cells[j].box;

      if (sameRow || sameCol || sameBox) {
        conflictIndices.add(i);
        conflictIndices.add(j);
      }
    }
  }

  return cells.map((cell, idx) => {
    const isConflict = conflictIndices.has(idx);
    const isError = autoCheck && cell.value !== 0 && !cell.given && cell.value !== cell.solution;

    if (cell.isConflict === isConflict && cell.isError === isError) {
      return cell;
    }
    return {
      ...cell,
      isConflict,
      isError,
    };
  });
}

/**
 * Returns all cell indices in the same row, column, or 3x3 box as index.
 */
export function getRelatedCellIndices(index: number): number[] {
  const row = Math.floor(index / 9);
  const col = index % 9;
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;

  const related = new Set<number>();

  for (let c = 0; c < 9; c++) {
    related.add(row * 9 + c);
  }
  for (let r = 0; r < 9; r++) {
    related.add(r * 9 + col);
  }
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      related.add((boxRow + r) * 9 + (boxCol + c));
    }
  }

  related.delete(index);
  return Array.from(related);
}
