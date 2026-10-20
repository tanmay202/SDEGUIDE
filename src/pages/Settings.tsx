import React, { useRef, useState, useEffect } from 'react';
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
  Calendar,
  AlertTriangle,
  Clock,
  Save,
} from 'lucide-react';
import { db } from '../db/database';
import {
  exportDatabaseBackup,
  importDatabaseBackup,
} from '../db/dbService';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { addDaysKolkata, isValidDateString } from '../utils/dateUtils';

export const Settings: React.FC = () => {
  const {
    settings,
    theme,
    setTheme,
    kolkataDateStr,
    kolkataTimeStr,
    dayNumber,
    isSampleDataMode,
    switchToBaseline,
    switchToSampleData,
    updateSettings,
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Timeline inputs state
  const [startDateInput, setStartDateInput] = useState<string>(settings?.startDate || '2026-10-20');
  const [targetDateInput, setTargetDateInput] = useState<string>(settings?.targetDate || '2027-04-20');
  const [resolutionChoice, setResolutionChoice] = useState<'buffer_14_days' | 'align_24_weeks' | 'custom'>(
    settings?.dateDiscrepancyResolution || 'buffer_14_days'
  );

  useEffect(() => {
    if (settings?.startDate) setStartDateInput(settings.startDate);
    if (settings?.targetDate) setTargetDateInput(settings.targetDate);
    if (settings?.dateDiscrepancyResolution) setResolutionChoice(settings.dateDiscrepancyResolution);
  }, [settings?.startDate, settings?.targetDate, settings?.dateDiscrepancyResolution]);

  // Database Counts
  const dsaCount = useLiveQuery(() => db.dsaProblems.count(), []);
  const revisionCount = useLiveQuery(() => db.revisionQueue.count(), []);
  const skillsCount = useLiveQuery(() => db.skills.count(), []);
  const jobsCount = useLiveQuery(() => db.jobApplications.count(), []);
  const mocksCount = useLiveQuery(() => db.mockInterviews.count(), []);
  const roadmapProgressCount = useLiveQuery(() => db.roadmapProgress.count(), []);

  const showNotification = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 3500);
  };

  const handleResolutionChange = (choice: 'buffer_14_days' | 'align_24_weeks' | 'custom') => {
    setResolutionChoice(choice);
    if (choice === 'align_24_weeks') {
      // Exactly 24 weeks (168 days) from start date (day 1 to day 168 -> +167 days)
      const exact24WeeksEnd = addDaysKolkata(startDateInput, 167);
      setTargetDateInput(exact24WeeksEnd);
    } else if (choice === 'buffer_14_days') {
      // 24 weeks + 14 days buffer = 181 days offset -> 2027-04-20
      const withBufferEnd = addDaysKolkata(startDateInput, 181);
      setTargetDateInput(withBufferEnd);
    }
  };

  const handleSaveTimeline = async () => {
    if (!isValidDateString(startDateInput) || !isValidDateString(targetDateInput)) {
      alert('Please enter valid dates in YYYY-MM-DD format.');
      return;
    }

    try {
      await updateSettings({
        startDate: startDateInput,
        targetDate: targetDateInput,
        dateDiscrepancyResolution: resolutionChoice,
        dateDiscrepancyNotes:
          resolutionChoice === 'buffer_14_days'
            ? 'Preserved 24-week curriculum with 14-day interview scheduling & buffer window (Target: April 20, 2027).'
            : resolutionChoice === 'align_24_weeks'
            ? 'Aligned Target Date strictly to 24-week curriculum completion.'
            : 'Custom user-specified timeline.',
      });
      showNotification('Timeline configuration and date discrepancy resolution saved!');
    } catch (err) {
      alert('Failed to save settings: ' + err);
    }
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
            Candidate profile, timeline & date discrepancy resolution, timezone verification, and data backups
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
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {settings?.candidateName || 'Tanmay'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Education:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">B.Sc. CS + MCA ('27)</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Target Role:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {settings?.targetRole || 'SDE-1 / Python Backend'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Target CTC:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {settings?.targetCtc || '₹10+ LPA Total'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Daily Budget:</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                  {settings?.dailyBudgetMinutes || 120} Minutes
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Timeline:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">
                  {startDateInput} → {targetDateInput}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              Matches the authoritative preparation contract in `roadmap.md`.
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

        {/* Timeline & Date Discrepancy Resolution Card (Prompt 1 & Prompt 4 Requirement) */}
        <Card className="md:col-span-2 border-indigo-200/80 dark:border-indigo-900/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" /> Timeline Configuration & Date Discrepancy Resolution
              </CardTitle>
              <Badge variant="purple" size="sm">Configurable Schedule</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            {/* Notice Callout */}
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Date Discrepancy Identified in Prompt 1</span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
                The roadmap specifies a <strong>24-week curriculum</strong> (168 days) starting on <code>October 20, 2026</code>.
                Completing exactly 24 weeks places the curriculum completion on <strong>April 6, 2027</strong>.
                However, the header states a <strong>Target Date of April 20, 2027</strong> (182 days / 26 weeks from start).
                Rather than silently altering the curriculum or dates, this <strong>14-day (2-week) discrepancy</strong> is explicitly recorded as a post-curriculum interview buffer for scheduling technical screening rounds, mock interview remediation, and offer evaluations.
              </p>
            </div>

            {/* Configurable Start Date & Target Date Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  Roadmap Start Date (YYYY-MM-DD):
                </label>
                <input
                  type="date"
                  value={startDateInput}
                  onChange={(e) => setStartDateInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  Target Offer Date (YYYY-MM-DD):
                </label>
                <input
                  type="date"
                  value={targetDateInput}
                  onChange={(e) => {
                    setTargetDateInput(e.target.value);
                    setResolutionChoice('custom');
                  }}
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            {/* Resolution Strategy Radio Options */}
            <div>
              <span className="block text-slate-700 dark:text-slate-300 font-semibold mb-2">
                Timeline Resolution Strategy:
              </span>
              <div className="space-y-2">
                <label
                  onClick={() => handleResolutionChange('buffer_14_days')}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    resolutionChoice === 'buffer_14_days'
                      ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800'
                      : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="timeline_resolution"
                    checked={resolutionChoice === 'buffer_14_days'}
                    onChange={() => handleResolutionChange('buffer_14_days')}
                    className="mt-0.5 text-indigo-600"
                  />
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white block">
                      Preserve 24-Week Curriculum + 14-Day Post-Curriculum Interview Buffer (Recommended)
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                      Curriculum ends April 6, 2027 (Day 168). Target offer date remains April 20, 2027 (Day 182) to account for multi-stage interview scheduling and final negotiations.
                    </span>
                  </div>
                </label>

                <label
                  onClick={() => handleResolutionChange('align_24_weeks')}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    resolutionChoice === 'align_24_weeks'
                      ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800'
                      : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="timeline_resolution"
                    checked={resolutionChoice === 'align_24_weeks'}
                    onChange={() => handleResolutionChange('align_24_weeks')}
                    className="mt-0.5 text-indigo-600"
                  />
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white block">
                      Align Target Date Strictly to 24-Week Curriculum (April 6, 2027)
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                      Adjusts Target Date to exactly match the end of Week 24 (168 days) without post-curriculum buffer.
                    </span>
                  </div>
                </label>

                <label
                  onClick={() => handleResolutionChange('custom')}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    resolutionChoice === 'custom'
                      ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800'
                      : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="timeline_resolution"
                    checked={resolutionChoice === 'custom'}
                    onChange={() => handleResolutionChange('custom')}
                    className="mt-0.5 text-indigo-600"
                  />
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white block">
                      Custom Timeline
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                      Manually set arbitrary start and target dates above.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleSaveTimeline}
                className="flex items-center gap-1.5 py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors shadow-xs"
              >
                <Save className="w-3.5 h-3.5" /> Save Timeline Configuration
              </button>
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
              In accordance with project guidelines, the dashboard defaults to your real, unmanipulated progress (Day 1 baseline with 0 fake statistics). You may toggle sample development data to preview populated charts.
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
            <div className="grid grid-cols-6 gap-1.5 text-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 font-mono text-[11px]">
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
              <div>
                <span className="text-slate-400 block text-[9px]">Roadmap</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{roadmapProgressCount ?? 0}</span>
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
