import React from 'react';
import { cn } from '../../utils/cn';

export type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'purple'
  | 'outline';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  className,
  children,
  ...props
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-md tracking-tight',
        size === 'sm' && 'text-xs px-2 py-0.5',
        size === 'md' && 'text-xs px-2.5 py-1',
        variant === 'default' &&
          'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
        variant === 'secondary' &&
          'bg-slate-200/80 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
        variant === 'success' &&
          'bg-emerald-50 text-emerald-700 border border-emerald-200/60 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/50',
        variant === 'warning' &&
          'bg-amber-50 text-amber-700 border border-amber-200/60 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/50',
        variant === 'danger' &&
          'bg-rose-50 text-rose-700 border border-rose-200/60 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800/50',
        variant === 'info' &&
          'bg-sky-50 text-sky-700 border border-sky-200/60 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-800/50',
        variant === 'purple' &&
          'bg-indigo-50 text-indigo-700 border border-indigo-200/60 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800/50',
        variant === 'outline' &&
          'border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 bg-transparent',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
