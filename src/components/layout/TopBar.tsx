import React from 'react';
import { Sun, Moon, AlertCircle, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatKolkataDateDisplay } from '../../utils/dateUtils';
import { TimerWidget } from '../common/TimerWidget';

export const TopBar: React.FC = () => {
  const {
    theme,
    toggleTheme,
    kolkataDateStr,
    kolkataTimeStr,
    dayNumber,
    isSampleDataMode,
    switchToBaseline,
    switchToSampleData,
  } = useApp();

  return (
    <header className="sticky top-0 z-20 hidden lg:flex items-center justify-between h-16 px-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
      {/* Date & Time in IST */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
          <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="font-medium">{formatKolkataDateDisplay(kolkataDateStr)}</span>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span className="font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded text-[11px] font-semibold border border-emerald-200/50 dark:border-emerald-800/40">
            {kolkataTimeStr}
          </span>
        </div>

        {/* Real Baseline vs Sample Data Pill */}
        {isSampleDataMode ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 text-xs">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-semibold">Sample Dev Data Active</span>
            <button
              onClick={switchToBaseline}
              className="ml-1 text-[11px] underline hover:text-amber-950 dark:hover:text-amber-100 font-medium"
              title="Reset to Day 1 unassessed baseline"
            >
              Reset to Clean Baseline
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Real Progress: Day {dayNumber} Baseline</span>
            <button
              onClick={switchToSampleData}
              className="ml-1 text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
              title="Preview charts with sample development data"
            >
              (Preview Sample Data)
            </button>
          </div>
        )}
      </div>

      {/* Right Actions: Compact Timer, Theme Toggle, Profile */}
      <div className="flex items-center gap-3">
        {/* Compact Timer Widget */}
        <TimerWidget compact />

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* User Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-semibold text-xs flex items-center justify-center shadow-xs">
            T
          </div>
          <div className="text-left text-xs">
            <p className="font-medium text-slate-800 dark:text-slate-200 leading-tight">Tanmay</p>
            <p className="text-[10px] text-slate-400">MCA Grad Aug '27</p>
          </div>
        </div>
      </div>
    </header>
  );
};
