import React from 'react';
import type { InputMode } from '../types/sudoku';

interface KeypadProps {
  digitCounts: Record<number, number>;
  selectedDigit: number | null;
  inputMode: InputMode;
  onDigitClick: (digit: number) => void;
}

export const Keypad: React.FC<KeypadProps> = ({
  digitCounts,
  selectedDigit,
  inputMode,
  onDigitClick,
}) => {
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="w-full max-w-[480px] mx-auto px-2 sm:px-4 py-1 pb-4 pb-safe">
      <div className="grid grid-cols-9 gap-1 sm:gap-1.5">
        {digits.map((digit) => {
          const count = digitCounts[digit] || 0;
          const isComplete = count >= 9;
          const isSelected = inputMode === 'digit-first' && selectedDigit === digit;

          let btnStyles = 'bg-slate-50 border-slate-200 text-slate-900 hover:bg-slate-100 active:bg-slate-200';
          if (isSelected) {
            btnStyles = 'bg-blue-600 border-blue-700 text-white shadow-md ring-2 ring-blue-300';
          } else if (isComplete) {
            btnStyles = 'bg-slate-100/60 border-slate-100 text-slate-300 pointer-events-auto';
          }

          return (
            <button
              key={digit}
              onClick={() => onDigitClick(digit)}
              aria-label={`Digit ${digit}, ${9 - count} remaining`}
              className={`flex flex-col items-center justify-center py-2 sm:py-3 rounded-lg border text-xl sm:text-2xl font-bold tabular-nums transition-all select-none touch-manipulation active:scale-95 ${btnStyles}`}
            >
              <span>{digit}</span>
              <span className={`text-[9px] sm:text-[10px] font-medium leading-none mt-0.5 ${isSelected ? 'text-blue-100' : isComplete ? 'text-slate-300' : 'text-slate-400'}`}>
                {isComplete ? '✓' : 9 - count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
