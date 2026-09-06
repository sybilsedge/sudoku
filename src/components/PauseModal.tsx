import React from 'react';
import { Play } from 'lucide-react';

interface PauseModalProps {
  isOpen: boolean;
  onResume: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({ isOpen, onResume }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-xs w-full p-6 text-center shadow-xl border border-slate-200">
        <h3 className="font-puzzle-serif text-xl font-bold text-slate-900 mb-2">
          Puzzle Paused
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Timer is stopped while you are away.
        </p>

        <button
          onClick={onResume}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl font-semibold transition-colors shadow-sm"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Resume Puzzle</span>
        </button>
      </div>
    </div>
  );
};
