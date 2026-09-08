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

  // Grid border thickness for 3x3 blocks and hairline cells
  const isBlockBorderRight = col % 3 === 2 && col !== 8;
  const isCellBorderRight = col !== 8;
  const borderRightClass = isBlockBorderRight ? 'border-r-2' : isCellBorderRight ? 'border-r' : '';
  const borderRightColor = isBlockBorderRight
    ? 'var(--sudoku-border-block)'
    : isCellBorderRight
    ? 'var(--sudoku-border-cell)'
    : 'transparent';

  const isBlockBorderBottom = row % 3 === 2 && row !== 8;
  const isCellBorderBottom = row !== 8;
  const borderBottomClass = isBlockBorderBottom ? 'border-b-2' : isCellBorderBottom ? 'border-b' : '';
  const borderBottomColor = isBlockBorderBottom
    ? 'var(--sudoku-border-block)'
    : isCellBorderBottom
    ? 'var(--sudoku-border-cell)'
    : 'transparent';

  // Background hierarchy: Selected > Conflict/Error > Same Digit > Crosshair > Base
  let cellBg = 'var(--sudoku-cell-bg)';
  let cellShadow = '';
  let cellRing = '';

  if (isError || isConflict) {
    cellBg = 'var(--sudoku-cell-error)';
    cellShadow = 'inset 0 0 12px rgba(239, 68, 68, 0.35)';
  } else if (isSelected) {
    cellBg = 'var(--sudoku-cell-selected)';
    cellShadow = 'inset 0 0 10px rgba(0, 255, 255, 0.3)';
    cellRing = 'ring-1 ring-cyan-400 [data-theme="light"]:ring-blue-600 z-10';
  } else if (isSameDigit) {
    cellBg = 'var(--sudoku-cell-match)';
    cellShadow = 'inset 0 0 8px rgba(0, 255, 255, 0.15)';
  } else if (isCrosshair && highlightCrosshairs) {
    cellBg = 'var(--sudoku-cell-crosshair)';
  }

  // Text color & luminous HUD glow
  let cellTextColor = given ? 'var(--sudoku-text-given)' : 'var(--sudoku-text-user)';
  if (isError || isConflict) {
    cellTextColor = 'var(--sudoku-text-error)';
  }

  return (
    <div
      onClick={() => onClick(index)}
      role="button"
      tabIndex={0}
      aria-label={`Row ${row + 1}, Column ${col + 1}${value ? `, Value ${value}` : ''}`}
      style={{
        backgroundColor: cellBg,
        boxShadow: cellShadow,
        borderRightColor,
        borderBottomColor,
      }}
      className={`relative flex items-center justify-center cursor-pointer select-none aspect-square transition-all duration-75 ${borderRightClass} ${borderBottomClass} ${cellRing} hover:opacity-90`}
    >
      {value !== 0 ? (
        <span
          className="font-tech text-2xl sm:text-3xl tabular-nums font-bold leading-none"
          style={{ color: cellTextColor }}
        >
          {value}
        </span>
      ) : (
        <div className="absolute inset-0 p-0.5 pointer-events-none flex flex-col justify-between">
          {/* Corner Notes (candidates placed in perimeter positions) */}
          <div
            className="grid grid-cols-3 grid-rows-3 w-full h-full font-tech text-[9px] sm:text-[11px] font-semibold leading-none"
            style={{ color: 'var(--sudoku-text-notes)' }}
          >
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
              <span
                className="font-tech text-[10px] sm:text-[12px] font-bold tracking-tight tabular-nums"
                style={{ color: 'var(--sudoku-text-center)' }}
              >
                {centerNotes.join('')}
              </span>
            </div>
          )}

          {/* Both Corner and Center active in same cell */}
          {centerNotes.length > 0 && cornerNotes.length > 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span
                className="font-tech text-[9px] sm:text-[10px] font-bold bg-black/60 [data-theme='light']:bg-blue-100/90 border border-emerald-500/40 [data-theme='light']:border-blue-400 px-1 rounded"
                style={{ color: 'var(--sudoku-text-center)' }}
              >
                {centerNotes.join('')}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
});
