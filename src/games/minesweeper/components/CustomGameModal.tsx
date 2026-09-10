import React, { useState } from 'react';
import type { CustomConfig } from '../types';
import { X, Check, Sliders } from 'lucide-react';

interface CustomGameModalProps {
  isOpen: boolean;
  initialConfig: CustomConfig;
  onApply: (config: CustomConfig) => void;
  onClose: () => void;
}

export const CustomGameModal: React.FC<CustomGameModalProps> = ({
  isOpen,
  initialConfig,
  onApply,
  onClose,
}) => {
  const [rows, setRows] = useState(initialConfig.rows);
  const [cols, setCols] = useState(initialConfig.cols);
  const [mines, setMines] = useState(initialConfig.mines);

  if (!isOpen) return null;

  // Max allowed mines ensures safe 3x3 starting cascade (total - 9)
  const maxMines = Math.max(1, rows * cols - 9);
  const safeMines = Math.min(mines, maxMines);

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    onApply({
      rows: Math.max(8, Math.min(24, rows)),
      cols: Math.max(8, Math.min(24, cols)),
      mines: Math.max(1, safeMines),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-sm rounded-xl border border-cyan-500/40 bg-[#0d1117] p-5 shadow-[0_0_30px_rgba(0,255,255,0.2)]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-cyan-500/25">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h2 className="font-orbitron text-lg font-bold text-cyan-300 tracking-wider">
              CUSTOM GRID SPEC
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 rounded text-slate-400 hover:text-cyan-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inputs */}
        <form onSubmit={handleConfirm} className="space-y-4 py-4 font-tech text-xs">
          {/* Rows */}
          <div>
            <div className="flex justify-between mb-1.5">
              <label className="text-cyan-300 uppercase">Rows (8 - 24):</label>
              <span className="font-bold text-cyan-400 tabular-nums">{rows}</span>
            </div>
            <input
              type="range"
              min={8}
              max={24}
              value={rows}
              onChange={(e) => {
                const newRows = parseInt(e.target.value, 10);
                setRows(newRows);
                const limit = Math.max(1, newRows * cols - 9);
                if (mines > limit) setMines(limit);
              }}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Cols */}
          <div>
            <div className="flex justify-between mb-1.5">
              <label className="text-cyan-300 uppercase">Columns (8 - 24):</label>
              <span className="font-bold text-cyan-400 tabular-nums">{cols}</span>
            </div>
            <input
              type="range"
              min={8}
              max={24}
              value={cols}
              onChange={(e) => {
                const newCols = parseInt(e.target.value, 10);
                setCols(newCols);
                const limit = Math.max(1, rows * newCols - 9);
                if (mines > limit) setMines(limit);
              }}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Mines */}
          <div>
            <div className="flex justify-between mb-1.5">
              <label className="text-cyan-300 uppercase">Mines (1 - {maxMines}):</label>
              <span className="font-bold text-cyan-400 tabular-nums">{safeMines}</span>
            </div>
            <input
              type="range"
              min={1}
              max={maxMines}
              value={safeMines}
              onChange={(e) => setMines(parseInt(e.target.value, 10))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Density metadata badge */}
          <div className="p-2 rounded bg-cyan-950/40 border border-cyan-500/20 flex justify-between text-[11px] text-cyan-400/80">
            <span>TOTAL CELLS: {rows * cols}</span>
            <span>MINE DENSITY: {Math.round((safeMines / (rows * cols)) * 100)}%</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-slate-700 text-slate-400 hover:text-slate-200 transition-colors uppercase"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-md border border-cyan-400 bg-cyan-500/20 text-cyan-200 font-bold hover:bg-cyan-500/30 hover:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all uppercase"
            >
              <Check className="w-4 h-4" />
              <span>Apply Grid</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
