import React, { useRef } from 'react';
import type { MinesweeperCell as CellType } from '../types';
import { Flag, Bomb, Flame } from 'lucide-react';

interface MinesweeperCellProps {
  cell: CellType;
  cellSize: number;
  onClick: (row: number, col: number) => void;
  onLongPress: (row: number, col: number) => void;
  onRightClick: (row: number, col: number) => void;
}

// Blueprint high-contrast colors for numbers 1-8
const NUMBER_COLORS: Record<number, string> = {
  1: '#38bdf8', // Cyan-blue
  2: '#34d399', // Emerald green
  3: '#f87171', // Coral red
  4: '#a78bfa', // Lavender purple
  5: '#fbbf24', // Amber gold
  6: '#2dd4bf', // Mint teal
  7: '#f1f5f9', // Slate white
  8: '#94a3b8', // Cool muted gray
};

export const MinesweeperCell: React.FC<MinesweeperCellProps> = React.memo(
  ({ cell, cellSize, onClick, onLongPress, onRightClick }) => {
    const { row, col, isMine, adjacentMines, state } = cell;

    const longPressTimerRef = useRef<number | null>(null);
    const touchStartPosRef = useRef<{ x: number; y: number } | null>(null);
    const didLongPressRef = useRef<boolean>(false);

    // Handle touch start for long-press flagging
    const handleTouchStart = (e: React.TouchEvent) => {
      didLongPressRef.current = false;
      const touch = e.touches[0];
      touchStartPosRef.current = { x: touch.clientX, y: touch.clientY };

      longPressTimerRef.current = window.setTimeout(() => {
        didLongPressRef.current = true;
        onLongPress(row, col);
      }, 300);
    };

    // If moved more than 8px, cancel long-press so user can scroll/pan
    const handleTouchMove = (e: React.TouchEvent) => {
      if (!touchStartPosRef.current || !longPressTimerRef.current) return;
      const touch = e.touches[0];
      const dx = Math.abs(touch.clientX - touchStartPosRef.current.x);
      const dy = Math.abs(touch.clientY - touchStartPosRef.current.y);

      if (dx > 8 || dy > 8) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }

      if (didLongPressRef.current) {
        // Prevent synthesize click after long-press
        e.preventDefault();
        didLongPressRef.current = false;
      }
    };

    const handleTouchCancel = () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
      didLongPressRef.current = false;
    };

    const handleContextMenu = (e: React.MouseEvent) => {
      e.preventDefault();
      onRightClick(row, col);
    };

    // Render cell content based on state
    let cellContent: React.ReactNode = null;
    let bgStyle: React.CSSProperties = {};
    let borderClass = 'border';

    if (state === 'hidden') {
      bgStyle = {
        backgroundColor: 'var(--ms-cell-hidden-bg)',
        borderTopColor: 'var(--ms-cell-hidden-border-top)',
        borderLeftColor: 'var(--ms-cell-hidden-border-top)',
        borderBottomColor: 'var(--ms-cell-hidden-border-bottom)',
        borderRightColor: 'var(--ms-cell-hidden-border-bottom)',
      };
      borderClass = 'border-t border-l border-b border-r shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]';
    } else if (state === 'flagged') {
      bgStyle = {
        backgroundColor: 'var(--ms-cell-hidden-bg)',
        borderTopColor: 'var(--ms-cell-hidden-border-top)',
        borderLeftColor: 'var(--ms-cell-hidden-border-top)',
        borderBottomColor: 'var(--ms-cell-hidden-border-bottom)',
        borderRightColor: 'var(--ms-cell-hidden-border-bottom)',
      };
      borderClass = 'border-t border-l border-b border-r shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]';
      cellContent = (
        <span className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)] animate-pulse">
          <Flag className="w-3.5 h-3.5 fill-current" />
        </span>
      );
    } else if (state === 'exploded') {
      bgStyle = {
        backgroundColor: 'var(--ms-mine-exploded-bg)',
        borderColor: 'var(--ms-mine-exploded-border)',
      };
      borderClass = 'border ring-1 ring-red-500/50';
      cellContent = (
        <span className="text-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-bounce">
          <Flame className="w-4 h-4 fill-current" />
        </span>
      );
    } else if (state === 'revealed') {
      bgStyle = {
        backgroundColor: 'var(--ms-cell-revealed-bg)',
        borderColor: 'var(--ms-cell-border)',
      };
      borderClass = 'border shadow-[inset_0_0_6px_rgba(0,0,0,0.4)]';

      if (isMine) {
        cellContent = (
          <span className="text-cyan-400/80 drop-shadow-[0_0_6px_rgba(0,255,255,0.4)]">
            <Bomb className="w-3.5 h-3.5" />
          </span>
        );
      } else if (adjacentMines > 0) {
        const color = NUMBER_COLORS[adjacentMines] || '#ffffff';
        cellContent = (
          <span
            className="font-tech font-bold tabular-nums select-none leading-none"
            style={{
              color,
              fontSize: Math.max(12, Math.floor(cellSize * 0.55)),
              textShadow: `0 0 6px ${color}55`,
            }}
          >
            {adjacentMines}
          </span>
        );
      }
    }

    return (
      <div
        role="button"
        tabIndex={0}
        aria-label={`Row ${row + 1}, Col ${col + 1}${
          state === 'revealed' ? (adjacentMines ? `, ${adjacentMines} adjacent mines` : ', Blank') : ''
        }`}
        onClick={() => onClick(row, col)}
        onContextMenu={handleContextMenu}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
        style={{
          width: cellSize,
          height: cellSize,
          minWidth: cellSize,
          minHeight: cellSize,
          ...bgStyle,
        }}
        className={`flex items-center justify-center cursor-pointer select-none transition-colors duration-75 relative ${borderClass} hover:opacity-90 active:scale-95`}
      >
        {cellContent}
      </div>
    );
  }
);
