import React, { useRef, useMemo } from 'react';
import type { MinesweeperBoard as BoardType } from '../types';
import { MinesweeperCell } from './MinesweeperCell';

interface MinesweeperBoardProps {
  board: BoardType;
  onCellClick: (row: number, col: number) => void;
  onCellLongPress: (row: number, col: number) => void;
  onCellRightClick: (row: number, col: number) => void;
}

export const MinesweeperBoard: React.FC<MinesweeperBoardProps> = ({
  board,
  onCellClick,
  onCellLongPress,
  onCellRightClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const rows = board.length;
  const cols = board[0]?.length || 0;

  // Responsive cell size calculation
  // Beginner (9x9): ~36-38px
  // Intermediate (16x16): ~26-28px
  // Custom (>16): ~24-26px
  const cellSize = useMemo(() => {
    if (cols <= 9) return 36;
    if (cols <= 16) return 26;
    return 24;
  }, [cols]);

  // Letters for column coordinate markers (A..Z, AA..)
  const colLetters = useMemo(() => {
    return Array.from({ length: cols }, (_, i) => {
      return String.fromCharCode(65 + (i % 26));
    });
  }, [cols]);

  return (
    <div className="w-full flex flex-col items-center justify-center max-w-[500px] mx-auto px-1 sm:px-2">
      {/* Blueprint Card Frame */}
      <div
        className="relative w-full rounded-lg p-1.5 sm:p-2 backdrop-blur-md transition-all shadow-[0_0_24px_rgba(0,255,255,0.12)] [data-theme='light']:shadow-[0_4px_24px_rgba(29,78,216,0.10)] border border-cyan-500/30 bg-black/40"
      >
        {/* Scrollable Viewport with touch pan support & pinch-zoom prevention */}
        <div
          ref={containerRef}
          className="w-full max-h-[60vh] sm:max-h-[65vh] overflow-auto touch-pan-x touch-pan-y overscroll-contain rounded border border-cyan-500/20 bg-black/60 [data-theme='light']:bg-blue-50/80 p-1 sm:p-2 flex flex-col items-center select-none"
          style={{
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-x pan-y',
          }}
        >
          {/* Inner Grid with Blueprint Coordinates */}
          <div className="inline-block mx-auto">
            {/* Top Column Coordinate Ticks */}
            <div className="flex pl-6 pb-0.5">
              {colLetters.map((letter, idx) => (
                <div
                  key={idx}
                  style={{ width: cellSize }}
                  className="font-tech text-[9px] text-cyan-400/60 [data-theme='light']:text-blue-600/70 text-center uppercase tracking-tighter"
                >
                  {letter}
                </div>
              ))}
            </div>

            {/* Board Rows with Left Row Ticks */}
            <div className="flex flex-col">
              {board.map((rowCells, rIdx) => (
                <div key={rIdx} className="flex items-center">
                  {/* Row coordinate tick */}
                  <div className="w-6 pr-1 font-tech text-[9px] text-cyan-400/60 [data-theme='light']:text-blue-600/70 text-right tabular-nums">
                    {(rIdx + 1).toString().padStart(2, '0')}
                  </div>

                  {/* Row Cells */}
                  <div className="flex">
                    {rowCells.map((cell) => (
                      <MinesweeperCell
                        key={`${cell.row}-${cell.col}`}
                        cell={cell}
                        cellSize={cellSize}
                        onClick={onCellClick}
                        onLongPress={onCellLongPress}
                        onRightClick={onCellRightClick}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Blueprint Spec Label Footer */}
        <div className="flex items-center justify-between pt-1.5 px-1">
          <span className="font-tech text-[10px] text-cyan-500/70 uppercase tracking-widest">
            GRID: {cols}x{rows} // CAD HAIRLINE
          </span>
          <span className="font-tech text-[10px] text-slate-400 [data-theme='light']:text-slate-600">
            TAP: ACT • HOLD: FLAG • CHORD: TAP NUM
          </span>
        </div>
      </div>
    </div>
  );
};
