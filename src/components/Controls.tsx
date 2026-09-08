import React from 'react';
import { Undo2, Redo2, Eraser, Sparkles, Pen, Edit3, Type, Touchpad, MousePointerClick } from 'lucide-react';
import type { InputMode, NoteMode } from '../types/sudoku';

interface ControlsProps {
  inputMode: InputMode;
  noteMode: NoteMode;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onErase: () => void;
  onAutoFillNotes: () => void;
  onSelectNoteMode: (mode: NoteMode) => void;
  onToggleInputMode: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  inputMode,
  noteMode,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onErase,
  onAutoFillNotes,
  onSelectNoteMode,
  onToggleInputMode,
}) => {
  return (
    <div className="w-full max-w-[480px] mx-auto px-2 sm:px-4 py-2">
      {/* Top action bar: Undo, Redo, Erase, Auto-Fill Notes, Input Mode toggle */}
      <div className="flex items-center justify-between gap-1 sm:gap-2 mb-2">
        <div className="flex items-center gap-1 sm:gap-1.5">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            aria-label="Undo move"
            className="flex items-center justify-center p-2 rounded-lg text-slate-700 hover:bg-slate-100 active:bg-slate-200 disabled:opacity-30 disabled:pointer-events-none transition-colors border border-slate-200"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            onClick={onRedo}
            disabled={!canRedo}
            aria-label="Redo move"
            className="flex items-center justify-center p-2 rounded-lg text-slate-700 hover:bg-slate-100 active:bg-slate-200 disabled:opacity-30 disabled:pointer-events-none transition-colors border border-slate-200"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            onClick={onErase}
            aria-label="Erase cell"
            className="flex items-center justify-center p-2 rounded-lg text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition-colors border border-slate-200"
            title="Erase (Backspace/Del)"
          >
            <Eraser className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            onClick={onAutoFillNotes}
            aria-label="Auto-fill candidate notes"
            className="flex items-center gap-1 px-2 py-2 sm:px-2.5 rounded-lg text-slate-700 hover:bg-amber-50 active:bg-amber-100 hover:text-amber-800 hover:border-amber-300 transition-colors border border-slate-200"
            title="Auto-Fill Notes (A)"
          >
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
            <span className="hidden sm:inline text-xs font-semibold">Auto Notes</span>
          </button>
        </div>

        {/* Input mode switcher (Cell First vs Digit First) */}
        <button
          onClick={onToggleInputMode}
          aria-label="Toggle input mode"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors shadow-2xs"
          title="Toggle between Cell-First and Digit-First"
        >
          {inputMode === 'cell-first' ? (
            <>
              <MousePointerClick className="w-3.5 h-3.5 text-blue-600" />
              <span>Cell First</span>
            </>
          ) : (
            <>
              <Touchpad className="w-3.5 h-3.5 text-indigo-600" />
              <span>Digit First</span>
            </>
          )}
        </button>
      </div>

      {/* Note Mode Segmented Control: Normal | Corner Notes | Center Notes */}
      <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
        <button
          onClick={() => onSelectNoteMode('normal')}
          className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
            noteMode === 'normal'
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Pen className="w-3.5 h-3.5" />
          <span>Normal</span>
        </button>

        <button
          onClick={() => onSelectNoteMode('corner')}
          className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
            noteMode === 'corner'
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Corner</span>
        </button>

        <button
          onClick={() => onSelectNoteMode('center')}
          className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
            noteMode === 'center'
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>Center</span>
        </button>
      </div>
    </div>
  );
};
