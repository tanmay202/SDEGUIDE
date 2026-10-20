import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarCheck2,
  Map,
  Code2,
  Repeat,
  Sparkles,
  Layers,
  Briefcase,
  Award,
  Settings as SettingsIcon,
  Flame,
  Target,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../utils/cn';

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: "Today's Plan", path: '/today', icon: CalendarCheck2, badge: 'Day 1' },
  { name: 'Roadmap', path: '/roadmap', icon: Map },
  { name: 'DSA Tracker', path: '/dsa', icon: Code2, badge: '67' },
  { name: 'Revision Queue', path: '/revision', icon: Repeat },
  { name: 'Skills Matrix', path: '/skills', icon: Sparkles },
  { name: 'Project (FastAPI)', path: '/project', icon: Layers },
  { name: 'Job Applications', path: '/jobs', icon: Briefcase },
  { name: 'Reviews & Mocks', path: '/reviews', icon: Award },
  { name: 'Settings', path: '/settings', icon: SettingsIcon },
];

export const Sidebar: React.FC = () => {
  const { dayNumber, weekNumber, phaseNumber } = useApp();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 border-r border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm h-screen sticky top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
              SDE PREP <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-1.5 py-0.5 rounded font-mono">₹10+ LPA</span>
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Tanmay • Day {dayNumber} of 168
            </p>
          </div>
        </div>
      </div>

      {/* Preparation Track Status Card */}
      <div className="px-4 py-3 mx-3 my-3 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/70 dark:border-slate-800">
        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
          <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-500" /> Phase {phaseNumber}
          </span>
          <span className="font-mono text-[11px]">Week {weekNumber} / 24</span>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
          {phaseNumber === 1
            ? 'Phase 1: Foundations (DSA & Python)'
            : phaseNumber === 2
            ? 'Phase 2: Backend & AgroVision-ML'
            : 'Phase 3: Interview Prep & Jobs'}
        </p>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group',
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 font-semibold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                )
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 transition-transform group-hover:scale-105" />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Target Spec Footer */}
      <div className="p-4 border-t border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500">
        <div className="flex justify-between items-center mb-1">
          <span>Daily Budget:</span>
          <span className="font-mono font-medium text-slate-700 dark:text-slate-300">120 mins</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Target Deadline:</span>
          <span className="font-mono text-slate-700 dark:text-slate-300">Apr 20, 2027</span>
        </div>
      </div>
    </aside>
  );
};
