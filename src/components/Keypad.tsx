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

          let btnStyles =
            'blueprint-border bg-black/40 backdrop-blur-sm text-slate-100 hover:border-cyan-400 hover:text-cyan-200 hover:shadow-[0_0_15px_rgba(0,255,255,0.3)]';

          if (isSelected) {
            btnStyles =
              'neon-border bg-cyan-500/25 text-cyan-100 shadow-[0_0_18px_rgba(0,255,255,0.45)] ring-1 ring-cyan-300';
          } else if (isComplete) {
            btnStyles =
              'border border-cyan-500/10 bg-black/20 text-slate-600 opacity-40 shadow-none';
          }

          return (
            <button
              key={digit}
              onClick={() => onDigitClick(digit)}
              aria-label={`Digit ${digit}, ${9 - count} remaining`}
              className={`flex flex-col items-center justify-center py-2 sm:py-3 rounded-lg font-tech text-xl sm:text-2xl font-bold tabular-nums transition-all select-none touch-manipulation active:scale-95 ${btnStyles}`}
            >
              <span>{digit}</span>
              <span
                className={`font-tech text-[9px] sm:text-[10px] font-semibold leading-none mt-0.5 ${
                  isSelected
                    ? 'text-cyan-100'
                    : isComplete
                    ? 'text-neon font-bold'
                    : 'text-cyan-400/80'
                }`}
              >
                {isComplete ? '✓' : 9 - count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
