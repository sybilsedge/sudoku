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
  const borderRight =
    col % 3 === 2 && col !== 8
      ? 'border-r-2 border-r-cyan-400/80'
      : col !== 8
      ? 'border-r border-r-cyan-500/20'
      : '';

  const borderBottom =
    row % 3 === 2 && row !== 8
      ? 'border-b-2 border-b-cyan-400/80'
      : row !== 8
      ? 'border-b border-b-cyan-500/20'
      : '';

  // Background hierarchy: Selected > Conflict/Error > Same Digit > Crosshair > Base
  let bgColor = 'bg-transparent';
  let extraStyles = '';

  if (isError || isConflict) {
    bgColor = 'bg-red-950/45';
    extraStyles = 'shadow-[inset_0_0_12px_rgba(239,68,68,0.35)]';
  } else if (isSelected) {
    bgColor = 'bg-cyan-500/30';
    extraStyles = 'shadow-[inset_0_0_14px_rgba(0,255,255,0.4),0_0_12px_rgba(0,255,255,0.3)] ring-1 ring-cyan-300 z-10';
  } else if (isSameDigit) {
    bgColor = 'bg-cyan-500/18';
    extraStyles = 'shadow-[inset_0_0_8px_rgba(0,255,255,0.2)]';
  } else if (isCrosshair && highlightCrosshairs) {
    bgColor = 'bg-cyan-500/6';
  }

  // Text color & luminous HUD glow
  let textColor = given
    ? 'text-slate-100 font-bold drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]'
    : 'text-cyan-300 font-bold drop-shadow-[0_0_8px_rgba(0,255,255,0.45)]';

  if (isError || isConflict) {
    textColor = 'text-red-400 font-bold drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]';
  }

  return (
    <div
      onClick={() => onClick(index)}
      role="button"
      tabIndex={0}
      aria-label={`Row ${row + 1}, Column ${col + 1}${value ? `, Value ${value}` : ''}`}
      className={`relative flex items-center justify-center cursor-pointer select-none aspect-square transition-all duration-75 ${borderRight} ${borderBottom} ${bgColor} ${extraStyles} hover:bg-cyan-500/10`}
    >
      {value !== 0 ? (
        <span className={`font-tech text-2xl sm:text-3xl tabular-nums leading-none ${textColor}`}>
          {value}
        </span>
      ) : (
        <div className="absolute inset-0 p-0.5 pointer-events-none flex flex-col justify-between">
          {/* Corner Notes (candidates placed in perimeter positions) */}
          <div className="grid grid-cols-3 grid-rows-3 w-full h-full font-tech text-[9px] sm:text-[11px] font-semibold text-cyan-400/80 leading-none">
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
              <span className="font-tech text-[10px] sm:text-[12px] font-bold tracking-tight text-neon tabular-nums drop-shadow-[0_0_6px_rgba(57,255,20,0.4)]">
                {centerNotes.join('')}
              </span>
            </div>
          )}

          {/* Both Corner and Center active in same cell */}
          {centerNotes.length > 0 && cornerNotes.length > 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="font-tech text-[9px] sm:text-[10px] font-bold text-neon bg-black/75 border border-emerald-500/40 px-1 rounded shadow-[0_0_8px_rgba(57,255,20,0.3)]">
                {centerNotes.join('')}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
});
