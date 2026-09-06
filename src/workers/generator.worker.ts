import { generateSudoku } from '../engine/qqwing';
import type { Difficulty, PuzzleDefinition, WorkerRequest, WorkerResponse } from '../types/sudoku';

// Pre-cached puzzle pool for instantaneous generation
const cache: Partial<Record<Difficulty, PuzzleDefinition[]>> = {
  easy: [],
  medium: [],
  hard: [],
};

function refillCache() {
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];
  for (const diff of difficulties) {
    const list = cache[diff] || [];
    if (list.length < 2) {
      try {
        const puzzle = generateSudoku(diff);
        list.push(puzzle);
        cache[diff] = list;
      } catch (err) {
        console.error('Worker cache refill error:', err);
      }
    }
  }
}

// Initial background refill
setTimeout(refillCache, 100);

self.onmessage = (e: MessageEvent<WorkerRequest>) => {
  const { type, id, difficulty } = e.data;

  if (type === 'GENERATE') {
    try {
      let result: PuzzleDefinition | undefined;
      const cachedList = cache[difficulty];
      if (cachedList && cachedList.length > 0) {
        result = cachedList.shift();
      } else {
        result = generateSudoku(difficulty);
      }

      // Schedule background cache replenishment
      setTimeout(refillCache, 50);

      const response: WorkerResponse = {
        type: 'GENERATED',
        id,
        payload: result!,
      };
      self.postMessage(response);
    } catch (err) {
      const response: WorkerResponse = {
        type: 'GENERATED',
        id,
        payload: generateSudoku('easy'), // fallback
        error: String(err),
      };
      self.postMessage(response);
    }
  }
};
