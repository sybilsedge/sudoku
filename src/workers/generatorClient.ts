import type { Difficulty, PuzzleDefinition, WorkerRequest, WorkerResponse } from '../types/sudoku';

class SudokuGeneratorClient {
  private worker: Worker | null = null;
  private pendingRequests = new Map<string, {
    resolve: (res: PuzzleDefinition) => void;
    reject: (err: Error) => void;
  }>();

  constructor() {
    this.initWorker();
  }

  private initWorker() {
    try {
      this.worker = new Worker(
        new URL('./generator.worker.ts', import.meta.url),
        { type: 'module' }
      );

      this.worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
        const { id, payload, error } = e.data;
        const pending = this.pendingRequests.get(id);
        if (pending) {
          this.pendingRequests.delete(id);
          if (error) {
            console.warn('Worker returned error:', error);
          }
          pending.resolve(payload);
        }
      };

      this.worker.onerror = (err) => {
        console.error('Worker error:', err);
      };
    } catch (err) {
      console.error('Failed to create Sudoku Web Worker:', err);
    }
  }

  public async generate(difficulty: Difficulty): Promise<PuzzleDefinition> {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    if (!this.worker) {
      // Fallback if workers aren't supported
      const { generateSudoku } = await import('../engine/qqwing');
      return generateSudoku(difficulty);
    }

    return new Promise((resolve, reject) => {
      this.pendingRequests.set(id, { resolve, reject });
      const req: WorkerRequest = {
        type: 'GENERATE',
        id,
        difficulty,
      };
      this.worker!.postMessage(req);
    });
  }
}

export const generatorClient = new SudokuGeneratorClient();
