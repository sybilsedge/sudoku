import { X, Sun, Moon } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        data-theme="dark"
        className="blueprint-border bg-[#0e1114] max-w-md w-full p-6 shadow-[0_0_40px_rgba(0,255,255,0.25)] rounded-xl max-h-[90vh] overflow-y-auto text-slate-100"
      >
        <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3 mb-4">
          <h2 className="font-orbitron text-lg sm:text-xl font-bold tracking-wider text-cyan-300 uppercase">
            SYSTEM SETTINGS
          </h2>
          <button
            onClick={onClose}
            aria-label="Close settings"
            className="p-1.5 rounded-lg border border-cyan-500/40 text-cyan-300 hover:text-cyan-100 hover:border-cyan-300 hover:shadow-[0_0_10px_rgba(0,255,255,0.3)] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme Mode Selector */}
        <div className="mb-5 pb-4 border-b border-cyan-500/25">
          <div className="font-tech text-xs uppercase tracking-wider text-cyan-300 font-semibold mb-2">
            INTERFACE SCHEME
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onUpdateSettings({ theme: 'dark' })}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-tech text-xs uppercase tracking-wider transition-all ${
                settings.theme !== 'light'
                  ? 'bg-cyan-500/30 text-cyan-100 border border-cyan-400 shadow-[0_0_12px_rgba(0,255,255,0.35)] font-bold'
                  : 'border border-cyan-500/30 bg-black/50 text-slate-300 hover:text-cyan-200'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>DARK HUD</span>
            </button>
            <button
              onClick={() => onUpdateSettings({ theme: 'light' })}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-tech text-xs uppercase tracking-wider transition-all ${
                settings.theme === 'light'
                  ? 'bg-cyan-500/30 text-cyan-100 border border-cyan-400 shadow-[0_0_12px_rgba(0,255,255,0.35)] font-bold'
                  : 'border border-cyan-500/30 bg-black/50 text-slate-300 hover:text-cyan-200'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>LIGHT PAPER</span>
            </button>
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-4 mb-6">
          {/* Auto-check errors */}
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="font-tech text-xs sm:text-sm font-semibold text-slate-100">Auto-Check Errors</div>
              <div className="font-body text-[11px] text-slate-300">Highlight invalid numbers in red</div>
            </div>
            <button
              onClick={() => onUpdateSettings({ autoCheckErrors: !settings.autoCheckErrors })}
              role="switch"
              aria-checked={settings.autoCheckErrors}
              className={`w-12 h-6 flex items-center rounded-full p-1 border transition-all ${
                settings.autoCheckErrors
                  ? 'bg-cyan-500/35 border-cyan-400 shadow-[0_0_10px_rgba(0,255,255,0.3)]'
                  : 'bg-black/70 border-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full transition-all transform ${
                  settings.autoCheckErrors
                    ? 'bg-cyan-300 translate-x-6 shadow-[0_0_8px_rgba(0,255,255,0.8)]'
                    : 'bg-slate-500 translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Crosshair highlights */}
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="font-tech text-xs sm:text-sm font-semibold text-slate-100">Row & Column Crosshairs</div>
              <div className="font-body text-[11px] text-slate-300">Shade intersecting coordinate vectors</div>
            </div>
            <button
              onClick={() => onUpdateSettings({ highlightCrosshairs: !settings.highlightCrosshairs })}
              role="switch"
              aria-checked={settings.highlightCrosshairs}
              className={`w-12 h-6 flex items-center rounded-full p-1 border transition-all ${
                settings.highlightCrosshairs
                  ? 'bg-cyan-500/35 border-cyan-400 shadow-[0_0_10px_rgba(0,255,255,0.3)]'
                  : 'bg-black/70 border-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full transition-all transform ${
                  settings.highlightCrosshairs
                    ? 'bg-cyan-300 translate-x-6 shadow-[0_0_8px_rgba(0,255,255,0.8)]'
                    : 'bg-slate-500 translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Same-digit highlights */}
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="font-tech text-xs sm:text-sm font-semibold text-slate-100">Highlight Matching Digits</div>
              <div className="font-body text-[11px] text-slate-300">Illuminate identical values on grid</div>
            </div>
            <button
              onClick={() => onUpdateSettings({ highlightDuplicates: !settings.highlightDuplicates })}
              role="switch"
              aria-checked={settings.highlightDuplicates}
              className={`w-12 h-6 flex items-center rounded-full p-1 border transition-all ${
                settings.highlightDuplicates
                  ? 'bg-cyan-500/35 border-cyan-400 shadow-[0_0_10px_rgba(0,255,255,0.3)]'
                  : 'bg-black/70 border-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full transition-all transform ${
                  settings.highlightDuplicates
                    ? 'bg-cyan-300 translate-x-6 shadow-[0_0_8px_rgba(0,255,255,0.8)]'
                    : 'bg-slate-500 translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Auto-erase notes */}
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="font-tech text-xs sm:text-sm font-semibold text-slate-100">Auto-Erase Pencilmarks</div>
              <div className="font-body text-[11px] text-slate-300">Remove notes in row/col/box on entry</div>
            </div>
            <button
              onClick={() => onUpdateSettings({ autoEraseNotes: !settings.autoEraseNotes })}
              role="switch"
              aria-checked={settings.autoEraseNotes}
              className={`w-12 h-6 flex items-center rounded-full p-1 border transition-all ${
                settings.autoEraseNotes
                  ? 'bg-cyan-500/35 border-cyan-400 shadow-[0_0_10px_rgba(0,255,255,0.3)]'
                  : 'bg-black/70 border-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full transition-all transform ${
                  settings.autoEraseNotes
                    ? 'bg-cyan-300 translate-x-6 shadow-[0_0_8px_rgba(0,255,255,0.8)]'
                    : 'bg-slate-500 translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Auto-Candidate Mode */}
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="font-tech text-xs sm:text-sm font-semibold text-slate-100">Auto-Candidate Mode</div>
              <div className="font-body text-[11px] text-slate-300">Autonomously populate pencilmark vectors</div>
            </div>
            <button
              onClick={() => onUpdateSettings({ autoCandidateMode: !settings.autoCandidateMode })}
              role="switch"
              aria-checked={settings.autoCandidateMode}
              className={`w-12 h-6 flex items-center rounded-full p-1 border transition-all ${
                settings.autoCandidateMode
                  ? 'bg-cyan-500/35 border-cyan-400 shadow-[0_0_10px_rgba(0,255,255,0.3)]'
                  : 'bg-black/70 border-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full transition-all transform ${
                  settings.autoCandidateMode
                    ? 'bg-cyan-300 translate-x-6 shadow-[0_0_8px_rgba(0,255,255,0.8)]'
                    : 'bg-slate-500 translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Statistics section */}
        <div className="border-t border-cyan-500/25 pt-4">
          <h3 className="font-orbitron text-xs sm:text-sm font-bold tracking-wider text-cyan-300 uppercase mb-3">
            HISTORICAL TELEMETRY
          </h3>
          <div className="grid grid-cols-3 gap-2 text-center">
            {(['easy', 'medium', 'hard'] as const).map((diff) => {
              const dStats = stats[diff];
              return (
                <div key={diff} className="blueprint-border bg-black/50 rounded-lg p-2.5 font-tech">
                  <div className="text-[11px] font-bold uppercase text-cyan-300 mb-1">{diff}</div>
                  <div className="text-[10px] text-slate-300">
                    WON: <span className="font-semibold text-slate-100">{dStats.completed}</span>/{dStats.played}
                  </div>
                  <div className="text-[10px] text-slate-300 mt-0.5">
                    BEST:{' '}
                    <span className="font-semibold text-neon tabular-nums">
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
          className="mt-6 w-full py-2.5 px-4 border border-cyan-400 bg-cyan-500/20 text-cyan-200 hover:bg-cyan-500/30 hover:border-cyan-300 hover:text-cyan-100 hover:shadow-[0_0_20px_rgba(0,255,255,0.4)] rounded-lg font-tech text-xs uppercase tracking-wider font-bold transition-all"
        >
          DONE
        </button>
      </div>
    </div>
  );
};
