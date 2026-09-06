import React from 'react';
import type { CellData } from '../types/sudoku';

interface CellProps {
  cell: CellData;
  index: number;
  isSelected: boolean;
  isCrosshair: boolean;
  isSameDigit: boolean;
  highlightCrosshairs: boolean;
  onClick: (index: number) => void;
}

export const Cell: React.FC<CellProps> = React.memo(({
  cell,
  index,
  isSelected,
  isCrosshair,
  isSameDigit,
  highlightCrosshairs,
  onClick,
}) => {
  const { row, col, value, given, cornerNotes, centerNotes, isConflict, isError } = cell;

  // Grid border thickness for 3x3 blocks
  const borderRight = col % 3 === 2 && col !== 8 ? 'border-r-2 border-r-slate-900' : 'border-r border-r-slate-300';
  const borderBottom = row % 3 === 2 && row !== 8 ? 'border-b-2 border-b-slate-900' : 'border-b border-b-slate-300';

  // Compute background color hierarchy: Selected > Conflict/Error > Same Digit > Crosshair > Base
  let bgColor = 'bg-white';

  if (isError || isConflict) {
    bgColor = 'bg-red-100';
  } else if (isSelected) {
    bgColor = 'bg-[#bbdefb]'; // Distinct selected cell blue
  } else if (isSameDigit) {
    bgColor = 'bg-[#d1e7fd]'; // Same-number matching tint
  } else if (isCrosshair && highlightCrosshairs) {
    bgColor = 'bg-[#f0f4f9]'; // Soft row/col/box crosshair
  }

  // Text color: Clue/Given is dark slate/black, User entry is royal blue
  let textColor = given ? 'text-slate-950 font-bold' : 'text-blue-700 font-semibold';
  if (isError || isConflict) {
    textColor = 'text-red-600 font-bold';
  }

  return (
    <div
      onClick={() => onClick(index)}
      role="button"
      tabIndex={0}
      aria-label={`Row ${row + 1}, Column ${col + 1}${value ? `, Value ${value}` : ''}`}
      className={`relative flex items-center justify-center cursor-pointer select-none aspect-square transition-colors duration-75 ${borderRight} ${borderBottom} ${bgColor}`}
    >
      {value !== 0 ? (
        <span className={`text-2xl sm:text-3xl tabular-nums leading-none ${textColor}`}>
          {value}
        </span>
      ) : (
        <div className="absolute inset-0 p-0.5 pointer-events-none flex flex-col justify-between">
          {/* Corner Notes (candidates placed in perimeter positions) */}
          <div className="grid grid-cols-3 grid-rows-3 w-full h-full text-[9px] sm:text-[11px] font-medium text-slate-500 leading-none">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => {
              const inCorner = cornerNotes.includes(digit);
              return (
                <div key={digit} className="flex items-center justify-center">
                  {inCorner ? <span>{digit}</span> : null}
                </div>
              );
            })}
          </div>

          {/* Center Notes (clustered candidate group) */}
          {centerNotes.length > 0 && cornerNotes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center px-1">
              <span className="text-[10px] sm:text-[12px] font-medium tracking-tight text-slate-600 tabular-nums">
                {centerNotes.join('')}
              </span>
            </div>
          )}

          {/* Both Corner and Center active in same cell */}
          {centerNotes.length > 0 && cornerNotes.length > 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-[9px] sm:text-[10px] font-bold text-sky-700 bg-sky-100/80 px-0.5 rounded">
                {centerNotes.join('')}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
});
