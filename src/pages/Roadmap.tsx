import React, { useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronRight,
  Filter,
  Search,
  Award,
  ListTodo,
  Sparkles,
  FileText,
  Save,
  RotateCcw,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { db } from '../db/database';
import { toggleRoadmapTask, updateRoadmapTaskProgress } from '../db/dbService';
import { useApp } from '../context/AppContext';
import { Card, CardContent } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import { Modal } from '../components/common/Modal';
import {
  ROADMAP_CONTENT,
  ROADMAP_MILESTONES,
  ROADMAP_WEEKS,
  getAllRoadmapTasks,
} from '../data/roadmapData';
import type { RoadmapTask } from '../types';

export const Roadmap: React.FC = () => {
  const { weekNumber, phaseNumber, settings } = useApp();

  // Tab: 'schedule' or 'milestones'
  const [activeTab, setActiveTab] = useState<'schedule' | 'milestones'>('schedule');

  // Filters
  const [selectedPhase, setSelectedPhase] = useState<'all' | 1 | 2 | 3>('all');
  const [completionFilter, setCompletionFilter] = useState<'all' | 'incomplete' | 'completed'>('all');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'original' | 'generated'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [milestoneCategoryFilter, setMilestoneCategoryFilter] = useState<string>('all');
  const [milestoneTimelineFilter, setMilestoneTimelineFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  // Expanded weeks state (default current week expanded)
  const [expandedWeeks, setExpandedWeeks] = useState<Record<number, boolean>>({
    [weekNumber]: true,
    1: true,
  });

  // Modal task inspection & editing
  const [selectedTask, setSelectedTask] = useState<RoadmapTask | null>(null);
  const [taskNotesInput, setTaskNotesInput] = useState<string>('');
  const [customTitleInput, setCustomTitleInput] = useState<string>('');
  const [customDescInput, setCustomDescInput] = useState<string>('');

  // Live query for separate task progress from IndexedDB
  const progressRecords = useLiveQuery(() => db.roadmapProgress.toArray(), []);

  // Map of taskId -> RoadmapTaskProgress
  const progressMap = useMemo(() => {
    const map = new Map<
      string,
      {
        completed: boolean;
        completedAt?: string;
        notes?: string;
        customTitle?: string;
        customDescription?: string;
        userEdited?: boolean;
      }
    >();
    if (progressRecords) {
      for (const record of progressRecords) {
        map.set(record.taskId, record);
      }
    }
    return map;
  }, [progressRecords]);

  const toggleExpand = (weekNum: number) => {
    setExpandedWeeks((prev) => ({
      ...prev,
      [weekNum]: !prev[weekNum],
    }));
  };

  const expandAll = () => {
    const allExpanded: Record<number, boolean> = {};
    for (let i = 1; i <= 24; i++) {
      allExpanded[i] = true;
    }
    setExpandedWeeks(allExpanded);
  };

  const collapseAll = () => {
    setExpandedWeeks({});
  };

  // Handle task completion toggle
  const handleToggleTask = async (task: RoadmapTask, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const current = progressMap.get(task.id);
    const newCompleted = !(current?.completed === true);
    await toggleRoadmapTask(task.id, newCompleted);
  };

  // Handle deliverable toggle
  const handleToggleDeliverable = async (delivId: string, currentStatus: boolean, e?: React.MouseEvent) => {
    e?.stopPropagation();
    await toggleRoadmapTask(delivId, !currentStatus);
  };

  // Open Task Inspector Modal
  const openTaskModal = (task: RoadmapTask, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedTask(task);
    const existingProgress = progressMap.get(task.id);
    setTaskNotesInput(existingProgress?.notes || '');
    setCustomTitleInput(existingProgress?.customTitle || task.title);
    setCustomDescInput(existingProgress?.customDescription || task.description || '');
  };

  const handleSaveModalNotes = async () => {
    if (!selectedTask) return;
    const isCompleted = progressMap.get(selectedTask.id)?.completed === true;
    await updateRoadmapTaskProgress(selectedTask.id, {
      completed: isCompleted,
      notes: taskNotesInput,
      customTitle: selectedTask.isGeneratedPlanning ? customTitleInput.trim() : undefined,
      customDescription: selectedTask.isGeneratedPlanning ? customDescInput.trim() : undefined,
    });
    setSelectedTask(null);
  };

  const handleResetToDefaultPlanning = async () => {
    if (!selectedTask) return;
    setCustomTitleInput(selectedTask.title);
    setCustomDescInput(selectedTask.description || '');
    const isCompleted = progressMap.get(selectedTask.id)?.completed === true;
    await updateRoadmapTaskProgress(selectedTask.id, {
      completed: isCompleted,
      notes: taskNotesInput,
      customTitle: undefined,
      customDescription: undefined,
    });
  };

  // Upcoming Milestones relative to current week
  const upcomingMilestones = useMemo(() => {
    return ROADMAP_MILESTONES.filter((m) => m.targetWeek >= weekNumber).sort(
      (a, b) => a.targetWeek - b.targetWeek
    );
  }, [weekNumber]);

  // Total tasks count and progress
  const allTasks = useMemo(() => getAllRoadmapTasks(), []);

  const totalTasksCount = allTasks.length;
  const completedTasksCount = useMemo(() => {
    let count = 0;
    for (const task of allTasks) {
      if (progressMap.get(task.id)?.completed === true) {
        count++;
      }
    }
    return count;
  }, [allTasks, progressMap]);

  const overallProgressPercent = totalTasksCount > 0
    ? Math.round((completedTasksCount / totalTasksCount) * 100)
    : 0;

  // Filtered Weeks
  const filteredWeeks = useMemo(() => {
    return ROADMAP_WEEKS.filter((week) => {
      // Phase match
      if (selectedPhase !== 'all' && week.phase !== selectedPhase) return false;

      // Source filter check on week tasks
      if (sourceFilter === 'original') {
        const hasOriginal = week.tasks.some((t) => t.source === 'original');
        if (!hasOriginal) return false;
      } else if (sourceFilter === 'generated') {
        const hasGenerated = week.tasks.some((t) => t.isGeneratedPlanning);
        if (!hasGenerated) return false;
      }

      // Completion filter check on week tasks
      if (completionFilter === 'completed') {
        const hasCompleted = week.tasks.some((t) => progressMap.get(t.id)?.completed === true);
        if (!hasCompleted) return false;
      } else if (completionFilter === 'incomplete') {
        const hasIncomplete = week.tasks.some((t) => !(progressMap.get(t.id)?.completed === true));
        if (!hasIncomplete) return false;
      }

      // Search query check
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = week.title.toLowerCase().includes(q);
        const matchesSummary = week.summary.toLowerCase().includes(q);
        const matchesTopics = week.topics.some((t) => t.content.toLowerCase().includes(q));
        const matchesDeliverables = week.deliverables.some((d) => d.toLowerCase().includes(q));
        const matchesTasks = week.tasks.some((t) => {
          const customTitle = progressMap.get(t.id)?.customTitle;
          const customDesc = progressMap.get(t.id)?.customDescription;
          const title = customTitle || t.title;
          const desc = customDesc || t.description;
          return title.toLowerCase().includes(q) || (desc && desc.toLowerCase().includes(q));
        });
        const matchesDsa = week.dsaProblems?.some((d) => d.title.toLowerCase().includes(q));
        if (!matchesTitle && !matchesSummary && !matchesTopics && !matchesDeliverables && !matchesTasks && !matchesDsa) {
          return false;
        }
      }

      return true;
    });
  }, [selectedPhase, sourceFilter, completionFilter, searchQuery, progressMap]);

  // Filtered Milestones
  const filteredMilestones = useMemo(() => {
    return ROADMAP_MILESTONES.filter((m) => {
      if (selectedPhase !== 'all' && m.phase !== selectedPhase) return false;
      if (milestoneCategoryFilter !== 'all' && m.category !== milestoneCategoryFilter) return false;
      if (milestoneTimelineFilter === 'upcoming' && m.targetWeek < weekNumber) return false;
      if (milestoneTimelineFilter === 'past' && m.targetWeek >= weekNumber) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          m.title.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.deliverables.some((d) => d.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [selectedPhase, milestoneCategoryFilter, milestoneTimelineFilter, searchQuery, weekNumber]);

  // Helper to get difficulty badge variant
  const getDiffVariant = (diff?: string): 'success' | 'warning' | 'danger' | 'outline' => {
    if (diff === 'Easy') return 'success';
    if (diff === 'Medium') return 'warning';
    if (diff === 'Hard') return 'danger';
    return 'outline';
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="purple" size="sm">24-Week Authoritative Curriculum</Badge>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs text-slate-500 font-medium">
              Start: {settings?.startDate || ROADMAP_CONTENT.metadata.startDate} → Target: {settings?.targetDate || ROADMAP_CONTENT.metadata.targetDate}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Structured Preparation Roadmap
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            2 hours/day systematic strategy to achieve ₹10+ LPA Software Engineering role
          </p>
        </div>

        {/* Tab Switcher: Schedule vs Milestones */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'schedule'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ListTodo className="w-3.5 h-3.5" />
            <span>24 Weeks Schedule</span>
          </button>
          <button
            onClick={() => setActiveTab('milestones')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'milestones'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>Key Milestones (17)</span>
          </button>
        </div>
      </div>

      {/* Overall Progress & Phase Highlights */}
      <Card className="border-indigo-200/60 dark:border-indigo-900/40 bg-gradient-to-r from-slate-50 to-indigo-50/30 dark:from-slate-900 dark:to-indigo-950/20">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                Curriculum Progress
              </span>
              <div className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{completedTasksCount} / {totalTasksCount} Tasks Completed</span>
                <span className="text-xs font-normal text-slate-500">({overallProgressPercent}%)</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Current Pace:</span>
              <Badge variant="purple" size="sm">
                Week {weekNumber} • Phase {phaseNumber}
              </Badge>
            </div>
          </div>

          <ProgressBar value={completedTasksCount} max={totalTasksCount} color="emerald" showLabel={false} />

          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-slate-600 dark:text-slate-400">Phase 1: Foundations (W1–6)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0" />
              <span className="text-slate-600 dark:text-slate-400">Phase 2: Backend (W7–14)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
              <span className="text-slate-600 dark:text-slate-400">Phase 3: Interviews (W15–24)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter and Search Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs">
        {/* Phase Filter Buttons */}
        <div className="flex items-center flex-wrap gap-1">
          <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Phase:
          </span>
          <button
            onClick={() => setSelectedPhase('all')}
            className={`px-2.5 py-1 rounded-md transition-colors font-medium ${
              selectedPhase === 'all'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedPhase(1)}
            className={`px-2.5 py-1 rounded-md transition-colors font-medium ${
              selectedPhase === 1
                ? 'bg-emerald-600 text-white font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            Phase 1 (W1–6)
          </button>
          <button
            onClick={() => setSelectedPhase(2)}
            className={`px-2.5 py-1 rounded-md transition-colors font-medium ${
              selectedPhase === 2
                ? 'bg-indigo-600 text-white font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            Phase 2 (W7–14)
          </button>
          <button
            onClick={() => setSelectedPhase(3)}
            className={`px-2.5 py-1 rounded-md transition-colors font-medium ${
              selectedPhase === 3
                ? 'bg-amber-600 text-white font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            Phase 3 (W15–24)
          </button>
        </div>

        {/* Completion Filter (Schedule Tab only) */}
        {activeTab === 'schedule' && (
          <div className="flex items-center flex-wrap gap-1 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 md:pl-3 pt-2 md:pt-0">
            <span className="text-slate-400 font-medium mr-1">Tasks:</span>
            <button
              onClick={() => setCompletionFilter('all')}
              className={`px-2 py-1 rounded-md ${
                completionFilter === 'all'
                  ? 'bg-slate-200 dark:bg-slate-700 font-bold text-slate-900 dark:text-white'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setCompletionFilter('incomplete')}
              className={`px-2 py-1 rounded-md ${
                completionFilter === 'incomplete'
                  ? 'bg-slate-200 dark:bg-slate-700 font-bold text-slate-900 dark:text-white'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Incomplete Only
            </button>
            <button
              onClick={() => setCompletionFilter('completed')}
              className={`px-2 py-1 rounded-md ${
                completionFilter === 'completed'
                  ? 'bg-slate-200 dark:bg-slate-700 font-bold text-slate-900 dark:text-white'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Completed Only
            </button>
          </div>
        )}

        {/* Source Filter (Schedule Tab only) */}
        {activeTab === 'schedule' && (
          <div className="flex items-center flex-wrap gap-1 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 md:pl-3 pt-2 md:pt-0">
            <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" /> Source:
            </span>
            <button
              onClick={() => setSourceFilter('all')}
              className={`px-2 py-1 rounded-md transition-colors ${
                sourceFilter === 'all'
                  ? 'bg-slate-200 dark:bg-slate-700 font-bold text-slate-900 dark:text-white'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSourceFilter('original')}
              className={`px-2 py-1 rounded-md transition-colors ${
                sourceFilter === 'original'
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 font-bold text-emerald-800 dark:text-emerald-300'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Original Source
            </button>
            <button
              onClick={() => setSourceFilter('generated')}
              className={`px-2 py-1 rounded-md transition-colors ${
                sourceFilter === 'generated'
                  ? 'bg-amber-100 dark:bg-amber-950/60 font-bold text-amber-800 dark:text-amber-300'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Generated Planning
            </button>
          </div>
        )}

        {/* Milestone Timeline Filter (Milestones Tab only) */}
        {activeTab === 'milestones' && (
          <div className="flex items-center flex-wrap gap-1 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 md:pl-3 pt-2 md:pt-0">
            <span className="text-slate-400 font-medium mr-1">Status:</span>
            <button
              onClick={() => setMilestoneTimelineFilter('all')}
              className={`px-2 py-1 rounded-md ${
                milestoneTimelineFilter === 'all'
                  ? 'bg-slate-200 dark:bg-slate-700 font-bold text-slate-900 dark:text-white'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All ({ROADMAP_MILESTONES.length})
            </button>
            <button
              onClick={() => setMilestoneTimelineFilter('upcoming')}
              className={`px-2 py-1 rounded-md ${
                milestoneTimelineFilter === 'upcoming'
                  ? 'bg-amber-100 dark:bg-amber-950/60 font-bold text-amber-800 dark:text-amber-300'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Upcoming ({ROADMAP_MILESTONES.filter((m) => m.targetWeek >= weekNumber).length})
            </button>
            <button
              onClick={() => setMilestoneTimelineFilter('past')}
              className={`px-2 py-1 rounded-md ${
                milestoneTimelineFilter === 'past'
                  ? 'bg-slate-200 dark:bg-slate-700 font-bold text-slate-900 dark:text-white'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Past ({ROADMAP_MILESTONES.filter((m) => m.targetWeek < weekNumber).length})
            </button>
          </div>
        )}

        {/* Category Filter (Milestones Tab only) */}
        {activeTab === 'milestones' && (
          <div className="flex items-center flex-wrap gap-1 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 md:pl-3 pt-2 md:pt-0">
            <span className="text-slate-400 font-medium mr-1">Category:</span>
            <select
              value={milestoneCategoryFilter}
              onChange={(e) => setMilestoneCategoryFilter(e.target.value)}
              className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
            >
              <option value="all">All Categories</option>
              <option value="python">Python</option>
              <option value="sql">SQL</option>
              <option value="fastapi">FastAPI</option>
              <option value="postgresql">PostgreSQL</option>
              <option value="testing">Testing (pytest)</option>
              <option value="deployment">Deployment (Docker/CI)</option>
              <option value="cs_fundamentals">CS Fundamentals</option>
              <option value="job_search">Job Search</option>
              <option value="interview">Interview Readiness</option>
            </select>
          </div>
        )}

        {/* Search Input & Expand/Collapse */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search roadmap..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
            />
          </div>

          {activeTab === 'schedule' && (
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={expandAll}
                className="px-2 py-1.5 rounded text-[11px] font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800"
              >
                Expand All
              </button>
              <button
                onClick={collapseAll}
                className="px-2 py-1.5 rounded text-[11px] font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800"
              >
                Collapse
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Milestones Quick-Glance Banner on Schedule Tab */}
      {activeTab === 'schedule' && upcomingMilestones.length > 0 && (
        <Card className="border-amber-200/70 dark:border-amber-900/50 bg-gradient-to-r from-amber-50/50 via-white to-slate-50 dark:from-amber-950/20 dark:via-slate-900 dark:to-slate-900">
          <CardContent className="p-3.5 sm:p-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Upcoming Milestones
                </span>
                <Badge variant="warning" size="sm">
                  {upcomingMilestones.length} ahead
                </Badge>
              </div>
              <button
                onClick={() => setActiveTab('milestones')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                View all 17 milestones <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {upcomingMilestones.slice(0, 3).map((m) => {
                const weeksAway = m.targetWeek - weekNumber;
                return (
                  <div
                    key={m.id}
                    onClick={() => {
                      setActiveTab('milestones');
                      setMilestoneCategoryFilter(m.category);
                    }}
                    className="p-2.5 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-700 cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between gap-1.5 mb-1">
                      <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400">
                        {m.category}
                      </span>
                      <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                        {weeksAway === 0 ? 'Current Week' : `in ${weeksAway} wk${weeksAway > 1 ? 's' : ''} (W${m.targetWeek})`}
                      </span>
                    </div>
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                      {m.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                      {m.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 1: 24-WEEK SCHEDULE */}
      {activeTab === 'schedule' && (
        <div className="space-y-4">
          {filteredWeeks.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-slate-400 text-xs">
                No weeks found matching the current filters.
              </CardContent>
            </Card>
          ) : (
            filteredWeeks.map((week) => {
              const isExpanded = !!expandedWeeks[week.weekNumber];
              const isCurrentWeek = week.weekNumber === weekNumber;

              // Calculate week task progress
              const totalWeekTasks = week.tasks.length;
              const completedWeekTasks = week.tasks.filter(
                (t) => progressMap.get(t.id)?.completed === true
              ).length;
              const weekProgressPercent = totalWeekTasks > 0
                ? Math.round((completedWeekTasks / totalWeekTasks) * 100)
                : 0;

              // Check if tasks should be filtered within the week
              const visibleTasks = week.tasks.filter((t) => {
                const isComplete = progressMap.get(t.id)?.completed === true;
                if (completionFilter === 'completed' && !isComplete) return false;
                if (completionFilter === 'incomplete' && isComplete) return false;
                if (searchQuery.trim()) {
                  const q = searchQuery.toLowerCase();
                  return (
                    t.title.toLowerCase().includes(q) ||
                    (t.description && t.description.toLowerCase().includes(q))
                  );
                }
                return true;
              });

              // Check phase border color
              const phaseBorderColor =
                week.phase === 1
                  ? 'border-l-emerald-500'
                  : week.phase === 2
                  ? 'border-l-indigo-500'
                  : 'border-l-amber-500';

              return (
                <Card
                  key={week.weekNumber}
                  className={`border-l-4 ${phaseBorderColor} ${
                    isCurrentWeek ? 'ring-2 ring-emerald-500/40 shadow-sm' : ''
                  }`}
                >
                  {/* Week Accordion Header */}
                  <div
                    onClick={() => toggleExpand(week.weekNumber)}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <button className="mt-0.5 sm:mt-0 text-slate-400">
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        ) : (
                          <ChevronRight className="w-5 h-5" />
                        )}
                      </button>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                            Week {week.weekNumber}
                          </span>
                          <span className="text-slate-300 dark:text-slate-700">•</span>
                          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            {week.blockRange}
                          </span>
                          <span className="text-slate-300 dark:text-slate-700">•</span>
                          <span className="text-xs text-slate-500">{week.phaseTitle}</span>

                          {isCurrentWeek && (
                            <Badge variant="success" size="sm">
                              Current Week
                            </Badge>
                          )}
                        </div>

                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
                          {week.title}
                        </h3>
                      </div>
                    </div>

                    {/* Progress Indicator & DSA target */}
                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <div className="text-right">
                        <span className="text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400">
                          {completedWeekTasks}/{totalWeekTasks} done ({weekProgressPercent}%)
                        </span>
                        <div className="w-24 mt-1">
                          <ProgressBar
                            value={completedWeekTasks}
                            max={totalWeekTasks}
                            color={weekProgressPercent === 100 ? 'emerald' : 'accent'}
                            showLabel={false}
                          />
                        </div>
                      </div>

                      {week.dsaProblems && week.dsaProblems.length > 0 && (
                        <span className="hidden md:inline-flex items-center gap-1 text-xs font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                          🎯 {week.dsaProblems.length} DSA
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Expanded Week Content */}
                  {isExpanded && (
                    <CardContent className="pt-0 pb-5 px-4 sm:px-6 border-t border-slate-100 dark:border-slate-800 mt-1">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4">
                        {/* Left Column (5 cols): Overview, Topics, Deliverables, Checkpoint */}
                        <div className="lg:col-span-5 space-y-4">
                          {/* Summary */}
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                            {week.summary}
                          </p>

                          {/* Focus Topics */}
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                              Focus Topics
                            </h4>
                            <div className="space-y-1.5">
                              {week.topics.map((topic, i) => (
                                <div
                                  key={i}
                                  className="text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800"
                                >
                                  <span className="font-semibold text-emerald-700 dark:text-emerald-400 mr-1.5">
                                    {topic.category}:
                                  </span>
                                  <span className="text-slate-700 dark:text-slate-300">
                                    {topic.content}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Deliverables */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Deliverables ({week.deliverables.length})
                              </h4>
                              <span className="text-[11px] text-slate-400">
                                {week.deliverables.filter((_, idx) => progressMap.get(`w${week.weekNumber}-deliv-${idx}`)?.completed === true).length}/{week.deliverables.length} achieved
                              </span>
                            </div>
                            <div className="space-y-1.5">
                              {week.deliverables.map((deliv, i) => {
                                const delivId = `w${week.weekNumber}-deliv-${i}`;
                                const isDelivDone = progressMap.get(delivId)?.completed === true;
                                return (
                                  <div
                                    key={i}
                                    onClick={(e) => handleToggleDeliverable(delivId, isDelivDone, e)}
                                    className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                    title={isDelivDone ? 'Click to mark incomplete' : 'Click to mark achieved'}
                                  >
                                    {isDelivDone ? (
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0 fill-emerald-100 dark:fill-emerald-950/40" />
                                    ) : (
                                      <Circle className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 hover:text-emerald-500 mt-0.5 shrink-0 transition-colors" />
                                    )}
                                    <span className={isDelivDone ? 'line-through text-slate-400 dark:text-slate-500' : ''}>
                                      {deliv}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Checkpoint Target */}
                          <div className="p-3 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-900/40">
                            <span className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 uppercase block">
                              Weekly Checkpoint Target
                            </span>
                            <p className="text-xs text-indigo-950 dark:text-indigo-200 mt-0.5">
                              {week.checkpointFocus}
                            </p>
                          </div>

                          {/* DSA Problems */}
                          {week.dsaProblems && week.dsaProblems.length > 0 && (
                            <div>
                              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                                Target DSA Problems ({week.dsaProblems.length})
                              </h4>
                              <div className="space-y-1.5">
                                {week.dsaProblems.map((prob, i) => (
                                  <div
                                    key={i}
                                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-xs"
                                  >
                                    <div className="flex items-center gap-1.5 truncate">
                                      <span className="font-mono text-slate-400">
                                        {prob.leetcodeNumber ? `#${prob.leetcodeNumber}` : '•'}
                                      </span>
                                      <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                                        {prob.title}
                                      </span>
                                    </div>
                                    <Badge variant={getDiffVariant(prob.difficulty)} size="sm">
                                      {prob.difficulty || 'Target'}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Right Column (7 cols): Detailed Task List with Checkboxes and Metadata */}
                        <div className="lg:col-span-7">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                              Week Tasks ({visibleTasks.length})
                            </h4>
                            <span className="text-[11px] text-slate-400">
                              Click task to inspect details or notes
                            </span>
                          </div>

                          {visibleTasks.length === 0 ? (
                            <div className="p-4 text-center text-slate-400 text-xs rounded-lg border border-dashed border-slate-200 dark:border-slate-800">
                              No tasks matching current filter.
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {visibleTasks.map((task) => {
                                const progress = progressMap.get(task.id);
                                const isCompleted = progress?.completed === true;
                                const displayTitle = (task.isGeneratedPlanning && progress?.customTitle) ? progress.customTitle : task.title;
                                const displayDesc = (task.isGeneratedPlanning && progress?.customDescription) ? progress.customDescription : task.description;
                                const hasCustomEdits = task.isGeneratedPlanning && (!!progress?.customTitle || !!progress?.customDescription);

                                return (
                                  <div
                                    key={task.id}
                                    onClick={(e) => openTaskModal(task, e)}
                                    className={`group flex items-start gap-3 p-2.5 rounded-lg border transition-all cursor-pointer ${
                                      isCompleted
                                        ? 'bg-emerald-50/30 dark:bg-emerald-950/10 border-emerald-200/60 dark:border-emerald-900/40'
                                        : 'bg-white dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                    }`}
                                  >
                                    {/* Toggle Checkbox Button */}
                                    <button
                                      type="button"
                                      onClick={(e) => handleToggleTask(task, e)}
                                      className="mt-0.5 shrink-0 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                                      title={isCompleted ? 'Mark incomplete / reopen' : 'Mark complete'}
                                    >
                                      {isCompleted ? (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-950/40" />
                                      ) : (
                                        <Circle className="w-4 h-4 text-slate-300 hover:text-slate-400 dark:text-slate-600" />
                                      )}
                                    </button>

                                    {/* Task Body */}
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        {/* Day Badge if available */}
                                        {task.dayNumber && (
                                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                            Day {task.dayNumber}
                                          </span>
                                        )}

                                        {/* Category Badge */}
                                        <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                          {task.category}
                                        </span>

                                        {/* Source Indicator: Original vs Generated Planning */}
                                        {task.source === 'original' ? (
                                          <span className="text-[10px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-900/40">
                                            Original Source
                                          </span>
                                        ) : (
                                          <span className="text-[10px] font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-900/40 flex items-center gap-1">
                                            <Sparkles className="w-2.5 h-2.5" /> {hasCustomEdits ? 'Edited Plan' : 'Generated Planning'}
                                          </span>
                                        )}

                                        {isCompleted && progress?.completedAt && (
                                          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                                            ✓ {progress.completedAt}
                                          </span>
                                        )}
                                      </div>

                                      <p
                                        className={`text-xs mt-1 font-medium leading-snug ${
                                          isCompleted
                                            ? 'line-through text-slate-400 dark:text-slate-500'
                                            : 'text-slate-800 dark:text-slate-200'
                                        }`}
                                      >
                                        {displayTitle}
                                      </p>

                                      {displayDesc && (
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                                          {displayDesc}
                                        </p>
                                      )}

                                      {progress?.notes && (
                                        <p className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-1 italic line-clamp-1">
                                          Note: {progress.notes}
                                        </p>
                                      )}
                                    </div>

                                    {/* Inspect Action */}
                                    <button
                                      type="button"
                                      className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 text-xs shrink-0 p-1"
                                      title="Open task details"
                                    >
                                      <FileText className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: KEY MILESTONES (17 Milestones) */}
      {activeTab === 'milestones' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMilestones.map((m) => {
              const phaseBadge =
                m.phase === 1
                  ? { variant: 'success' as const, label: 'Phase 1: Foundations' }
                  : m.phase === 2
                  ? { variant: 'purple' as const, label: 'Phase 2: Backend' }
                  : { variant: 'warning' as const, label: 'Phase 3: Interviews' };

              const weeksAway = m.targetWeek - weekNumber;
              const isCurrentWeek = weeksAway === 0;
              const isUpcoming = weeksAway > 0;

              return (
                <Card
                  key={m.id}
                  className={`flex flex-col justify-between transition-all ${
                    isCurrentWeek
                      ? 'ring-2 ring-amber-500/50 shadow-sm'
                      : isUpcoming
                      ? 'border-slate-200 dark:border-slate-800'
                      : 'opacity-85'
                  }`}
                >
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant={phaseBadge.variant} size="sm">
                        {phaseBadge.label}
                      </Badge>
                      <span
                        className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                          isCurrentWeek
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300'
                            : isUpcoming
                            ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300'
                            : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {isCurrentWeek
                          ? 'Current Week'
                          : isUpcoming
                          ? `in ${weeksAway} wk${weeksAway > 1 ? 's' : ''} (W${m.targetWeek})`
                          : `Past (Week ${m.targetWeek})`}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 tracking-wider">
                        {m.category}
                      </span>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                        {m.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {m.description}
                      </p>
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                        Deliverable Criteria:
                      </span>
                      <div className="space-y-1">
                        {m.deliverables.map((item, idx) => {
                          const mDelivId = `${m.id}-deliv-${idx}`;
                          const isMDelivDone = progressMap.get(mDelivId)?.completed === true;
                          return (
                            <div
                              key={idx}
                              onClick={() => toggleRoadmapTask(mDelivId, !isMDelivDone)}
                              className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title={isMDelivDone ? 'Click to mark incomplete' : 'Click to mark achieved'}
                            >
                              {isMDelivDone ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5 fill-emerald-100 dark:fill-emerald-950/40" />
                              ) : (
                                <Circle className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 hover:text-emerald-500 shrink-0 mt-0.5" />
                              )}
                              <span className={isMDelivDone ? 'line-through text-slate-400 dark:text-slate-500' : ''}>
                                {item}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Task Inspection & Notes Modal */}
      {selectedTask && (
        <Modal
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          title={`Task Inspection: ${selectedTask.title}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            {/* Metadata Tags */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={selectedTask.phase === 1 ? 'success' : selectedTask.phase === 2 ? 'purple' : 'warning'} size="sm">
                Phase {selectedTask.phase}
              </Badge>
              <Badge variant="outline" size="sm">
                Week {selectedTask.weekNumber}
              </Badge>
              {selectedTask.dayNumber && (
                <Badge variant="outline" size="sm">
                  Day {selectedTask.dayNumber}
                </Badge>
              )}
              <span className="font-mono text-slate-400">ID: {selectedTask.id}</span>
            </div>

            {/* Source Classification */}
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 space-y-1">
              <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                Provenance & Content Type:
              </span>
              {selectedTask.source === 'original' ? (
                <p className="text-emerald-700 dark:text-emerald-400">
                  ✓ <strong>Authoritative Source Content:</strong> Sourced directly from `roadmap.md`.
                </p>
              ) : (
                <p className="text-amber-700 dark:text-amber-400">
                  ⚡ <strong>Generated Planning Content:</strong> Proposed day-by-day distribution of weekly work; editable and non-authoritative.
                </p>
              )}
            </div>

            {/* Editable Planning Content if Generated Planning */}
            {selectedTask.isGeneratedPlanning && (
              <div className="p-3 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Editable Planning Details
                  </span>
                  {(progressMap.get(selectedTask.id)?.customTitle || progressMap.get(selectedTask.id)?.customDescription) && (
                    <button
                      type="button"
                      onClick={handleResetToDefaultPlanning}
                      className="text-[10px] text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1"
                    >
                      <RotateCcw className="w-2.5 h-2.5" /> Reset to Original Plan
                    </button>
                  )}
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Planned Task Title:
                  </label>
                  <input
                    type="text"
                    value={customTitleInput}
                    onChange={(e) => setCustomTitleInput(e.target.value)}
                    placeholder="Customize planned task title..."
                    className="w-full p-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Planned Task Description & Focus:
                  </label>
                  <textarea
                    value={customDescInput}
                    onChange={(e) => setCustomDescInput(e.target.value)}
                    placeholder="Customize planned scope, problem numbers, or focus..."
                    rows={2}
                    className="w-full p-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>
            )}

            {/* Description (Read-only for original source content) */}
            {!selectedTask.isGeneratedPlanning && selectedTask.description && (
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Full Description & Scope:
                </span>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed p-2.5 rounded bg-slate-50 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-800">
                  {selectedTask.description}
                </p>
              </div>
            )}

            {/* Completion Status Toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white block">
                  Task Completion Status:
                </span>
                <span className="text-[11px] text-slate-500">
                  {progressMap.get(selectedTask.id)?.completed === true
                    ? `Completed (${progressMap.get(selectedTask.id)?.completedAt || 'Recorded'})`
                    : 'Incomplete'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleToggleTask(selectedTask)}
                className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors ${
                  progressMap.get(selectedTask.id)?.completed === true
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 hover:bg-amber-200'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {progressMap.get(selectedTask.id)?.completed === true
                  ? 'Reopen Task'
                  : 'Mark Complete'}
              </button>
            </div>

            {/* Personal Notes */}
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Personal Progress Notes & Reflection:
              </label>
              <textarea
                value={taskNotesInput}
                onChange={(e) => setTaskNotesInput(e.target.value)}
                placeholder="Add notes, edge cases learned, or implementation references..."
                rows={3}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setSelectedTask(null)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveModalNotes}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs"
              >
                <Save className="w-3.5 h-3.5" /> Save Changes
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
