import { X } from 'lucide-react';
import type { GameStats } from '../types/sudoku';
import { formatTime, type UserSettings } from '../utils/storage';

interface SettingsModalProps {
  isOpen: boolean;
  settings: UserSettings;
  stats: GameStats;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settings,
  stats,
  onUpdateSettings,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
          <h2 className="font-puzzle-serif text-xl font-bold text-slate-900">
            Game Settings
          </h2>
          <button
            onClick={onClose}
            aria-label="Close settings"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toggles */}
        <div className="space-y-4 mb-6">
          {/* Auto-check errors */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-900">Auto-Check Errors</div>
              <div className="text-xs text-slate-500">Highlight incorrect numbers in red</div>
            </div>
            <button
              onClick={() => onUpdateSettings({ autoCheckErrors: !settings.autoCheckErrors })}
              role="switch"
              aria-checked={settings.autoCheckErrors}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                settings.autoCheckErrors ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  settings.autoCheckErrors ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Crosshair highlights */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-900">Row & Column Crosshairs</div>
              <div className="text-xs text-slate-500">Shade intersecting cells when selecting</div>
            </div>
            <button
              onClick={() => onUpdateSettings({ highlightCrosshairs: !settings.highlightCrosshairs })}
              role="switch"
              aria-checked={settings.highlightCrosshairs}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                settings.highlightCrosshairs ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  settings.highlightCrosshairs ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Same-digit highlights */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-900">Highlight Matching Digits</div>
              <div className="text-xs text-slate-500">Highlight all identical numbers on grid</div>
            </div>
            <button
              onClick={() => onUpdateSettings({ highlightDuplicates: !settings.highlightDuplicates })}
              role="switch"
              aria-checked={settings.highlightDuplicates}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                settings.highlightDuplicates ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  settings.highlightDuplicates ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Auto-erase notes */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-900">Auto-Erase Pencilmarks</div>
              <div className="text-xs text-slate-500">Remove notes in row/col/box on placement</div>
            </div>
            <button
              onClick={() => onUpdateSettings({ autoEraseNotes: !settings.autoEraseNotes })}
              role="switch"
              aria-checked={settings.autoEraseNotes}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                settings.autoEraseNotes ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  settings.autoEraseNotes ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Auto-Candidate Mode */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-900">Auto-Candidate Mode</div>
              <div className="text-xs text-slate-500">Automatically calculate and populate pencilmarks</div>
            </div>
            <button
              onClick={() => onUpdateSettings({ autoCandidateMode: !settings.autoCandidateMode })}
              role="switch"
              aria-checked={settings.autoCandidateMode}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                settings.autoCandidateMode ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  settings.autoCandidateMode ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Statistics section */}
        <div className="border-t border-slate-200 pt-4">
          <h3 className="font-puzzle-serif text-base font-bold text-slate-900 mb-3">
            Career Statistics
          </h3>
          <div className="grid grid-cols-3 gap-2 text-center">
            {(['easy', 'medium', 'hard'] as const).map((diff) => {
              const dStats = stats[diff];
              return (
                <div key={diff} className="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                  <div className="text-xs font-bold uppercase text-slate-700 mb-1">{diff}</div>
                  <div className="text-xs text-slate-500">
                    Won: <span className="font-semibold text-slate-900">{dStats.completed}</span>/{dStats.played}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Best:{' '}
                    <span className="font-semibold text-slate-900 tabular-nums">
                      {dStats.bestTime !== null ? formatTime(dStats.bestTime) : '—'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold text-sm transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
};
