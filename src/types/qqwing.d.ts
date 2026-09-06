declare module 'qqwing' {
  class QQWing {
    constructor();
    static Symmetry: {
      NONE: number;
      ROTATE90: number;
      ROTATE180: number;
      MIRROR: number;
      FLIP: number;
      RANDOM: number;
    };
    static Difficulty: {
      UNKNOWN: number;
      SIMPLE: number;
      EASY: number;
      INTERMEDIATE: number;
      EXPERT: number;
    };
    setRecordHistory(record: boolean): void;
    setLogHistory(log: boolean): void;
    generatePuzzle(): boolean;
    generatePuzzleSymmetry(symmetry: number): boolean;
    solve(round?: number): boolean;
    countSolutions(): number;
    isSolved(): boolean;
    getPuzzleString(): string;
    getSolutionString(): string;
    setPuzzle(puzzle: number[]): boolean;
    getDifficulty(): number;
    getDifficultyAsString(): string;
    getGivenCount(): number;
    getSingleCount(): number;
    getHiddenSingleCount(): number;
    getNakedPairCount(): number;
    getHiddenPairCount(): number;
    getPointingPairTripleCount(): number;
    getBoxLineReductionCount(): number;
    getGuessCount(): number;
    getBacktrackCount(): number;
  }

  export default QQWing;
}
