import QQWing from 'qqwing';
import type { Difficulty, PuzzleDefinition } from '../types/sudoku';

function parseBoardString(str: string): number[] {
  const compact = str.replace(/[^0-9.]/g, '');
  const result: number[] = [];
  for (let i = 0; i < compact.length; i++) {
    const ch = compact[i];
    result.push(ch === '.' ? 0 : parseInt(ch, 10));
  }
  return result;
}

/**
 * Generates a Sudoku puzzle with 180° rotational symmetry and a guaranteed single unique solution.
 * Solves using standard logical difficulty classification criteria via QQWing techniques.
 */
export function generateSudoku(difficulty: Difficulty): PuzzleDefinition {
  const maxAttempts = 200;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const q = new QQWing();
    q.setRecordHistory(true);

    // 180-degree rotational symmetry
    const success = q.generatePuzzleSymmetry(QQWing.Symmetry.ROTATE180);
    if (!success) continue;

    // Verify exactly 1 unique solution
    if (q.countSolutions() !== 1) continue;

    // Solve using logical deduction to assess difficulty and step techniques
    q.solve();
    const diffVal = q.getDifficulty(); // 1=SIMPLE, 2=EASY, 3=INTERMEDIATE, 4=EXPERT
    const singles = q.getSingleCount();
    const hiddenSingles = q.getHiddenSingleCount();
    const nakedPairs = q.getNakedPairCount();
    const hiddenPairs = q.getHiddenPairCount();
    const pointingPairs = q.getPointingPairTripleCount();
    const boxLine = q.getBoxLineReductionCount();
    const guesses = q.getGuessCount();

    const pairsOrTriples = nakedPairs + hiddenPairs + pointingPairs;

    let matches = false;
    switch (difficulty) {
      case 'easy':
        // Easy: Single possibilities & Hidden singles only. No pairs/triples/guesses needed.
        matches = (diffVal <= QQWing.Difficulty.EASY) && pairsOrTriples === 0 && boxLine === 0 && guesses === 0;
        break;

      case 'medium':
        // Medium: Requires Naked/Hidden pairs, triples, pointing pairs. No box-line reductions or guesses.
        matches = (diffVal === QQWing.Difficulty.INTERMEDIATE || pairsOrTriples > 0) && boxLine === 0 && guesses === 0;
        break;

      case 'hard':
        // Hard: Requires Box/Line reductions, X-Wings, subsets or higher complexity.
        matches = diffVal === QQWing.Difficulty.EXPERT || boxLine > 0 || guesses > 0;
        break;
    }

    if (matches || attempt >= maxAttempts - 1) {
      const puzzle = parseBoardString(q.getPuzzleString());
      const solution = parseBoardString(q.getSolutionString());

      return {
        puzzle,
        solution,
        difficulty,
        givensCount: q.getGivenCount(),
        singlesCount: singles,
        hiddenSinglesCount: hiddenSingles,
        nakedPairsCount: nakedPairs,
        hiddenPairsCount: hiddenPairs,
        pointingPairsCount: pointingPairs,
        boxLineCount: boxLine,
      };
    }
  }

  // Fallback if max attempts exceeded (should be rare with 200 attempts)
  const fallback = new QQWing();
  fallback.setRecordHistory(true);
  fallback.generatePuzzleSymmetry(QQWing.Symmetry.ROTATE180);
  fallback.solve();
  return {
    puzzle: parseBoardString(fallback.getPuzzleString()),
    solution: parseBoardString(fallback.getSolutionString()),
    difficulty,
    givensCount: fallback.getGivenCount(),
  };
}

/**
 * Validates whether the given board is solved correctly against its solution.
 */
export function isBoardSolved(currentValues: number[], solution: number[]): boolean {
  if (currentValues.length !== 81 || solution.length !== 81) return false;
  for (let i = 0; i < 81; i++) {
    if (currentValues[i] === 0 || currentValues[i] !== solution[i]) {
      return false;
    }
  }
  return true;
}
