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
      <div className="border-2 sm:border-[2.5px] border-slate-900 rounded-sm shadow-sm overflow-hidden bg-white">
        <div className="grid grid-cols-9 grid-rows-9 w-full aspect-square">
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
