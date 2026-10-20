import React from 'react';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../utils/cn';

interface TimerWidgetProps {
  compact?: boolean;
  className?: string;
}

export const TimerWidget: React.FC<TimerWidgetProps> = ({ compact = false, className }) => {
  const {
    timerBlock,
    timerSecondsRemaining,
    isTimerRunning,
    startTimer,
    pauseTimer,
    resetTimer,
    setTimerBlock,
  } = useApp();

  const minutes = Math.floor(timerSecondsRemaining / 60);
  const seconds = timerSecondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const blockNames: Record<'dsa' | 'technical' | 'interview' | 'log', { title: string; defaultMins: number }> = {
    dsa: { title: 'DSA Practice', defaultMins: 40 },
    technical: { title: 'Technical / Python', defaultMins: 60 },
    interview: { title: 'Interview Practice', defaultMins: 10 },
    log: { title: 'Daily Log', defaultMins: 10 },
  };

  const totalBlockSeconds = blockNames[timerBlock].defaultMins * 60;
  const progressPercent = Math.round(((totalBlockSeconds - timerSecondsRemaining) / totalBlockSeconds) * 100);

  if (compact) {
    return (
      <div className={cn('flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60', className)}>
        <Clock className={cn('w-4 h-4', isTimerRunning ? 'text-emerald-500 animate-pulse' : 'text-slate-400')} />
        <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
          {formattedTime}
        </span>
        <button
          onClick={isTimerRunning ? pauseTimer : startTimer}
          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
          title={isTimerRunning ? 'Pause' : 'Start'}
        >
          {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>
        <button
          onClick={() => resetTimer()}
          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          title="Reset"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>
    );
  }

  return (
    <div className={cn('p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm', className)}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className={cn('w-4 h-4', isTimerRunning ? 'text-emerald-500 animate-pulse' : 'text-slate-400')} />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Study Block Timer
          </span>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          {progressPercent}% elapsed
        </span>
      </div>

      {/* Block Selector */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 dark:bg-slate-800/60 rounded-lg mb-4 text-xs font-medium">
        {(['dsa', 'technical', 'interview', 'log'] as const).map((block) => (
          <button
            key={block}
            onClick={() => setTimerBlock(block)}
            className={cn(
              'py-1.5 px-2 rounded-md transition-all text-center truncate',
              timerBlock === block
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            )}
          >
            {block === 'dsa' && 'DSA 40m'}
            {block === 'technical' && 'Tech 60m'}
            {block === 'interview' && 'Int 10m'}
            {block === 'log' && 'Log 10m'}
          </button>
        ))}
      </div>

      {/* Timer Display */}
      <div className="text-center py-2">
        <div className="font-mono text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          {formattedTime}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {blockNames[timerBlock].title} ({blockNames[timerBlock].defaultMins} min target)
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 mt-4">
        <button
          onClick={isTimerRunning ? pauseTimer : startTimer}
          className={cn(
            'flex items-center gap-1.5 px-5 py-2 rounded-lg font-medium text-xs transition-all shadow-sm',
            isTimerRunning
              ? 'bg-amber-600 hover:bg-amber-700 text-white'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
          )}
        >
          {isTimerRunning ? (
            <>
              <Pause className="w-3.5 h-3.5" /> Pause
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" /> Start
            </>
          )}
        </button>
        <button
          onClick={() => resetTimer()}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>
    </div>
  );
};
