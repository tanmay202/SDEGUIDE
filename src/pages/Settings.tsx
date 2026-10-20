import React, { useRef, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  Database,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  Globe,
  Sun,
  Moon,
  User,
  ShieldCheck,
} from 'lucide-react';
import { db } from '../db/database';
import {
  exportDatabaseBackup,
  importDatabaseBackup,
} from '../db/dbService';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card';
import { Badge } from '../components/common/Badge';

export const Settings: React.FC = () => {
  const {
    theme,
    setTheme,
    kolkataDateStr,
    kolkataTimeStr,
    dayNumber,
    isSampleDataMode,
    switchToBaseline,
    switchToSampleData,
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Database Counts
  const dsaCount = useLiveQuery(() => db.dsaProblems.count(), []);
  const revisionCount = useLiveQuery(() => db.revisionQueue.count(), []);
  const skillsCount = useLiveQuery(() => db.skills.count(), []);
  const jobsCount = useLiveQuery(() => db.jobApplications.count(), []);
  const mocksCount = useLiveQuery(() => db.mockInterviews.count(), []);

  const showNotification = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 3000);
  };

  const handleExport = async () => {
    try {
      const json = await exportDatabaseBackup();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sde-prep-backup-${kolkataDateStr}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showNotification('Backup exported successfully!');
    } catch (err) {
      alert('Export failed: ' + err);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      const success = await importDatabaseBackup(content);
      if (success) {
        showNotification('Database restored from backup!');
      } else {
        alert('Invalid backup file. Import failed.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleResetToBaseline = async () => {
    if (
      confirm(
        'Reset to Clean Day 1 Baseline? This clears mock entries and sets unassessed initial state (0 fake statistics).'
      )
    ) {
      await switchToBaseline();
      showNotification('Clean Day 1 Baseline restored!');
    }
  };

  const handleLoadSample = async () => {
    await switchToSampleData();
    showNotification('Sample development data loaded for preview!');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="purple" size="sm">System Configuration</Badge>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs text-slate-500 font-medium">Local-first Dexie.js IndexedDB</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Application Settings
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Candidate profile, timezone verification, data backups, and sample mode toggling
          </p>
        </div>

        {actionMessage && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{actionMessage}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Candidate Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-600" /> Candidate Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
              <div>
                <span className="text-slate-400 block text-[11px]">Candidate:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">Tanmay</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Education:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">B.Sc. CS + MCA ('27)</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Target Role:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">SDE-1 / Python Backend</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Target CTC:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">₹10+ LPA Total</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Daily Budget:</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">120 Minutes</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Timeline:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">Oct 20, '26 → Apr 20, '27</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              Locked to match the authoritative preparation contract in `roadmap.md`.
            </p>
          </CardContent>
        </Card>

        {/* Timezone & Date Correctness Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-500" /> Timezone & Calendar Correctness
            </CardTitle>
            <Badge variant="success" size="sm">Active: Asia/Kolkata</Badge>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Current IST Date:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {kolkataDateStr}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Live IST Clock:</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {kolkataTimeStr}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Roadmap Day Number:</span>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  Day {dayNumber} of 168
                </span>
              </div>
            </div>
            <div className="flex items-start gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                All calendar queries and day calculations are strictly pinned to <code>Asia/Kolkata (UTC+05:30)</code> to guarantee zero date shifting across browser locales.
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Development Data & Mode Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-amber-500" /> Development Seed & Data Mode
            </CardTitle>
            <Badge variant={isSampleDataMode ? 'warning' : 'outline'} size="sm">
              {isSampleDataMode ? 'Sample Data Active' : 'Clean Baseline'}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              In accordance with project guidelines, the dashboard defaults to your real, unmanipulated progress (Day 1 baseline). You may toggle sample development data to preview populated charts.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <button
                onClick={handleResetToBaseline}
                className="flex-1 py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold transition-colors"
              >
                Reset to Clean Baseline
              </button>
              <button
                onClick={handleLoadSample}
                className="flex-1 py-2 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-xs transition-colors"
              >
                Load Sample Dev Data
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Database & Backup Operations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Database className="w-4 h-4 text-sky-500" /> Local Storage & Backups
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="grid grid-cols-5 gap-1.5 text-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 font-mono text-[11px]">
              <div>
                <span className="text-slate-400 block text-[9px]">DSA</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{dsaCount ?? 0}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px]">Revision</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{revisionCount ?? 0}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px]">Skills</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{skillsCount ?? 0}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px]">Jobs</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{jobsCount ?? 0}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px]">Mocks</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{mocksCount ?? 0}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleExport}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5" /> Export JSON
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold transition-colors"
              >
                <Upload className="w-3.5 h-3.5" /> Restore JSON
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </div>
          </CardContent>
        </Card>

        {/* Theme Settings */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-500" /> Interface Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <button
              onClick={() => setTheme('light')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                theme === 'light'
                  ? 'bg-slate-100 border-slate-300 text-slate-900 shadow-xs'
                  : 'border-slate-200 text-slate-500 hover:text-slate-800'
              }`}
            >
              <Sun className="w-4 h-4 text-amber-500" />
              <span>Light Mode</span>
            </button>

            <button
              onClick={() => setTheme('dark')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                theme === 'dark'
                  ? 'bg-slate-800 border-slate-700 text-white shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:text-white'
              }`}
            >
              <Moon className="w-4 h-4 text-indigo-400" />
              <span>Dark Mode</span>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
