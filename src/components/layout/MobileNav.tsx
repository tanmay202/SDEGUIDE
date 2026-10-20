import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  LayoutDashboard,
  CalendarCheck2,
  Code2,
  Repeat,
  Sparkles,
  Layers,
  Briefcase,
  Award,
  Settings as SettingsIcon,
  Map,
  Target,
  Sun,
  Moon,
  Clock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../utils/cn';
import { TimerWidget } from '../common/TimerWidget';

const ALL_PAGES = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: "Today's Plan", path: '/today', icon: CalendarCheck2 },
  { name: 'Roadmap (24 Wks)', path: '/roadmap', icon: Map },
  { name: 'DSA Tracker (67)', path: '/dsa', icon: Code2 },
  { name: 'Revision Queue', path: '/revision', icon: Repeat },
  { name: 'Skills Matrix', path: '/skills', icon: Sparkles },
  { name: 'Project (FastAPI)', path: '/project', icon: Layers },
  { name: 'Job Applications', path: '/jobs', icon: Briefcase },
  { name: 'Reviews & Mocks', path: '/reviews', icon: Award },
  { name: 'Settings', path: '/settings', icon: SettingsIcon },
];

export const MobileNav: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [timerModalOpen, setTimerModalOpen] = useState(false);
  const { theme, toggleTheme, kolkataTimeStr, dayNumber, isSampleDataMode } = useApp();
  const location = useLocation();

  const closeDrawer = () => setDrawerOpen(false);

  return (
    <>
      {/* Mobile Top Header */}
      <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between h-14 px-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-xs tracking-tight text-slate-900 dark:text-white">
              SDE PREP
            </span>
            <span className="ml-1.5 text-[10px] text-emerald-700 dark:text-emerald-400 font-mono font-medium">
              Day {dayNumber}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setTimerModalOpen(!timerModalOpen)}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-mono flex items-center gap-1"
            title="Open Focus Timer"
          >
            <Clock className="w-4 h-4 text-emerald-500" />
          </button>
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className="p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Open menu"
          >
            {drawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Floating Timer Drawer for Mobile */}
      {timerModalOpen && (
        <div className="lg:hidden fixed inset-x-0 top-14 z-40 p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative">
            <TimerWidget />
            <button
              onClick={() => setTimerModalOpen(false)}
              className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Slide-out Menu Drawer for Mobile */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm">
          <div className="fixed inset-y-0 right-0 w-72 bg-white dark:bg-slate-900 shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-200">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Navigation</h3>
                <p className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                  {kolkataTimeStr}
                </p>
              </div>
              <button
                onClick={closeDrawer}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isSampleDataMode && (
              <div className="mx-3 mt-3 p-2 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded-lg text-xs text-amber-800 dark:text-amber-300">
                Sample Dev Data Mode Active
              </div>
            )}

            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
              {ALL_PAGES.map((page) => {
                const Icon = page.icon;
                const isActive = location.pathname === page.path;
                return (
                  <NavLink
                    key={page.path}
                    to={page.path}
                    onClick={closeDrawer}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors',
                      isActive
                        ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 font-semibold'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{page.name}</span>
                  </NavLink>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 text-center">
              24-Week ₹10+ LPA Preparation OS
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar (Primary Quick Access) */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex items-center justify-around px-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center w-14 h-full text-[10px] font-medium transition-colors',
              isActive
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            )
          }
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span>Home</span>
        </NavLink>
        <NavLink
          to="/today"
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center w-14 h-full text-[10px] font-medium transition-colors',
              isActive
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            )
          }
        >
          <CalendarCheck2 className="w-5 h-5 mb-0.5" />
          <span>Today</span>
        </NavLink>
        <NavLink
          to="/dsa"
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center w-14 h-full text-[10px] font-medium transition-colors',
              isActive
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            )
          }
        >
          <Code2 className="w-5 h-5 mb-0.5" />
          <span>DSA</span>
        </NavLink>
        <NavLink
          to="/revision"
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center w-14 h-full text-[10px] font-medium transition-colors',
              isActive
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            )
          }
        >
          <Repeat className="w-5 h-5 mb-0.5" />
          <span>Revision</span>
        </NavLink>
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex flex-col items-center justify-center w-14 h-full text-[10px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span>More</span>
        </button>
      </nav>
    </>
  );
};
