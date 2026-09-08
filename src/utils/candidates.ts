import { getRelatedCellIndices } from './conflicts';

/**
 * Calculates the valid candidate digits (1-9) for a specific cell at `index`.
 * A candidate is valid if it does not already appear in the same row,
 * column, or 3x3 box.
 *
 * If the cell is already filled with a value, returns an empty array.
 */
export function getCellCandidates(cells: { value: number }[], index: number): number[] {
  if (cells[index].value !== 0) {
    return [];
  }

  const seen = new Set<number>();
  const peerIndices = getRelatedCellIndices(index);

  for (const peerIdx of peerIndices) {
    const val = cells[peerIdx].value;
    if (val >= 1 && val <= 9) {
      seen.add(val);
    }
  }

  const candidates: number[] = [];
  for (let digit = 1; digit <= 9; digit++) {
    if (!seen.has(digit)) {
      candidates.push(digit);
    }
  }

  return candidates;
}

/**
 * Calculates candidate lists for all 81 cells on the board.
 */
export function getAllCellCandidates(cells: { value: number }[]): number[][] {
  const result: number[][] = new Array(81);
  for (let i = 0; i < 81; i++) {
    result[i] = getCellCandidates(cells, i);
  }
  return result;
}
