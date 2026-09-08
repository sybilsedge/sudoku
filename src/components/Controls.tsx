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
            className="flex items-center justify-center p-2 rounded-lg font-tech border border-cyan-500/40 bg-black/40 text-cyan-300 hover:border-cyan-400 hover:text-cyan-100 hover:shadow-[0_0_15px_rgba(0,255,255,0.3)] active:bg-cyan-500/20 disabled:opacity-25 disabled:pointer-events-none transition-all backdrop-blur-sm"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            onClick={onRedo}
            disabled={!canRedo}
            aria-label="Redo move"
            className="flex items-center justify-center p-2 rounded-lg font-tech border border-cyan-500/40 bg-black/40 text-cyan-300 hover:border-cyan-400 hover:text-cyan-100 hover:shadow-[0_0_15px_rgba(0,255,255,0.3)] active:bg-cyan-500/20 disabled:opacity-25 disabled:pointer-events-none transition-all backdrop-blur-sm"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            onClick={onErase}
            aria-label="Erase cell"
            className="flex items-center justify-center p-2 rounded-lg font-tech border border-cyan-500/40 bg-black/40 text-cyan-300 hover:border-cyan-400 hover:text-cyan-100 hover:shadow-[0_0_15px_rgba(0,255,255,0.3)] active:bg-cyan-500/20 transition-all backdrop-blur-sm"
            title="Erase (Backspace/Del)"
          >
            <Eraser className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            onClick={onAutoFillNotes}
            aria-label="Auto-fill candidate notes"
            className="flex items-center gap-1 px-2 py-2 sm:px-2.5 rounded-lg font-tech border border-emerald-500/40 bg-black/40 text-neon hover:border-emerald-400 hover:text-emerald-100 hover:shadow-[0_0_15px_rgba(57,255,20,0.35)] active:bg-emerald-500/20 transition-all backdrop-blur-sm"
            title="Auto-Fill Notes (A)"
          >
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-neon" />
            <span className="hidden sm:inline text-xs font-semibold uppercase tracking-wider">Auto</span>
          </button>
        </div>

        {/* Input mode switcher (Cell First vs Digit First) */}
        <button
          onClick={onToggleInputMode}
          aria-label="Toggle input mode"
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg font-tech text-xs uppercase tracking-wider border border-cyan-500/40 bg-black/40 text-cyan-300 hover:border-cyan-400 hover:text-cyan-100 hover:shadow-[0_0_15px_rgba(0,255,255,0.3)] backdrop-blur-sm transition-all"
          title="Toggle between Cell-First and Digit-First"
        >
          {inputMode === 'cell-first' ? (
            <>
              <MousePointerClick className="w-3.5 h-3.5 text-cyan-300" />
              <span>Cell 1st</span>
            </>
          ) : (
            <>
              <Touchpad className="w-3.5 h-3.5 text-neon" />
              <span className="text-neon">Digit 1st</span>
            </>
          )}
        </button>
      </div>

      {/* Note Mode Segmented Control: Normal | Corner Notes | Center Notes */}
      <div className="grid grid-cols-3 gap-1 blueprint-border bg-black/40 p-1 rounded-xl backdrop-blur-sm">
        <button
          onClick={() => onSelectNoteMode('normal')}
          className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg font-tech text-xs sm:text-xs font-semibold uppercase tracking-wider transition-all ${
            noteMode === 'normal'
              ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-400/60 shadow-[0_0_12px_rgba(0,255,255,0.25)]'
              : 'text-slate-400 hover:text-cyan-300'
          }`}
        >
          <Pen className="w-3.5 h-3.5" />
          <span>Normal</span>
        </button>

        <button
          onClick={() => onSelectNoteMode('corner')}
          className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg font-tech text-xs sm:text-xs font-semibold uppercase tracking-wider transition-all ${
            noteMode === 'corner'
              ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-400/60 shadow-[0_0_12px_rgba(0,255,255,0.25)]'
              : 'text-slate-400 hover:text-cyan-300'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Corner</span>
        </button>

        <button
          onClick={() => onSelectNoteMode('center')}
          className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg font-tech text-xs sm:text-xs font-semibold uppercase tracking-wider transition-all ${
            noteMode === 'center'
              ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-400/60 shadow-[0_0_12px_rgba(0,255,255,0.25)]'
              : 'text-slate-400 hover:text-cyan-300'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>Center</span>
        </button>
      </div>
    </div>
  );
};
