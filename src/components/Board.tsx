import React from 'react';
import type { CellData, InputMode } from '../types/sudoku';
import { Cell } from './Cell';

interface BoardProps {
  cells: CellData[];
  selectedCellIndex: number | null;
  selectedDigit: number | null;
  inputMode: InputMode;
  highlightCrosshairs: boolean;
  highlightDuplicates: boolean;
  onCellClick: (index: number) => void;
}

export const Board: React.FC<BoardProps> = ({
  cells,
  selectedCellIndex,
  selectedDigit,
  inputMode,
  highlightCrosshairs,
  highlightDuplicates,
  onCellClick,
}) => {
  const selectedCell = selectedCellIndex !== null ? cells[selectedCellIndex] : null;

  // Determine which digit to highlight
  let activeDigitHighlight: number | null = null;
  if (inputMode === 'digit-first' && selectedDigit !== null) {
    activeDigitHighlight = selectedDigit;
  } else if (selectedCell && selectedCell.value !== 0 && highlightDuplicates) {
    activeDigitHighlight = selectedCell.value;
  }

  return (
    <div className="w-full max-w-[480px] mx-auto px-2 sm:px-4">
      <div
        className="rounded-lg p-1 sm:p-1.5 backdrop-blur-md transition-all shadow-[0_0_28px_rgba(0,255,255,0.12)] [data-theme='light']:shadow-[0_4px_24px_rgba(29,78,216,0.10)]"
        style={{
          backgroundColor: 'var(--sudoku-board-card-bg)',
          border: '1px solid var(--sudoku-board-card-border)',
        }}
      >
        <div
          className="grid grid-cols-9 grid-rows-9 w-full aspect-square rounded-sm overflow-hidden transition-colors"
          style={{
            backgroundColor: 'var(--sudoku-grid-bg)',
            border: '2px solid var(--sudoku-border-block)',
          }}
        >
          {cells.map((cell, idx) => {
            const isSelected = idx === selectedCellIndex;

            // Crosshair: same row, col, or 3x3 box
            const isCrosshair =
              selectedCell !== null &&
              !isSelected &&
              (cell.row === selectedCell.row ||
                cell.col === selectedCell.col ||
                cell.box === selectedCell.box);

            // Same digit highlight
            const isSameDigit =
              activeDigitHighlight !== null &&
              cell.value !== 0 &&
              cell.value === activeDigitHighlight;

            return (
              <Cell
                key={idx}
                cell={cell}
                index={idx}
                isSelected={isSelected}
                isCrosshair={isCrosshair}
                isSameDigit={isSameDigit}
                highlightCrosshairs={highlightCrosshairs}
                onClick={onCellClick}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
