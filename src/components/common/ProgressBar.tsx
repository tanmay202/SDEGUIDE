import React from 'react';
import { cn } from '../../utils/cn';

interface ProgressBarProps {
  value: number; // 0 to 100 or current value
  max?: number;
  className?: string;
  barClassName?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'brand' | 'accent' | 'amber' | 'emerald';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  className,
  barClassName,
  showLabel = false,
  size = 'md',
  color = 'brand',
}) => {
  const percentage = Math.min(Math.max(Math.round((value / max) * 100), 0), 100);

  const colorMap = {
    brand: 'bg-emerald-600 dark:bg-emerald-500',
    accent: 'bg-indigo-600 dark:bg-indigo-500',
    amber: 'bg-amber-500 dark:bg-amber-400',
    emerald: 'bg-emerald-500 dark:bg-emerald-400',
  };

  const heightMap = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
          <span>{percentage}% complete</span>
          <span>
            {value} / {max}
          </span>
        </div>
      )}
      <div
        className={cn(
          'w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden',
          heightMap[size]
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300 ease-out',
            colorMap[color],
            barClassName
          )}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
};
