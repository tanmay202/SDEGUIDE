import React from 'react';
import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  ArrowRight,
  Code2,
  Sparkles,
  Layers,
  Briefcase,
  Play,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { db } from '../db/database';
import { useApp } from '../context/AppContext';
import { getOrCreateDailyPlan } from '../db/dbService';
import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';

export const Dashboard: React.FC = () => {
  const {
    dayNumber,
    phaseNumber,
    isSampleDataMode,
    startTimer,
    setTimerBlock,
  } = useApp();

  const dsaProblems = useLiveQuery(() => db.dsaProblems.toArray(), []);
  const todayPlan = useLiveQuery(async () => {
    return await getOrCreateDailyPlan(dayNumber);
  }, [dayNumber]);
  const revisionItems = useLiveQuery(() => db.revisionQueue.toArray(), []);
  const skills = useLiveQuery(() => db.skills.toArray(), []);
  const jobApps = useLiveQuery(() => db.jobApplications.toArray(), []);

  // Compute Metrics
  const totalMasterProblems = 67;
  const masteredCount = dsaProblems?.filter((p) => p.status === 'mastered').length ?? 0;
  const solvedCount = dsaProblems?.filter((p) => p.status === 'solved').length ?? 0;
  const inRevisionCount = dsaProblems?.filter((p) => p.status === 'revision').length ?? 0;

  const totalDsaProgress = masteredCount + solvedCount;

  // Blocks completed today
  const completedBlocksCount = todayPlan?.blocks.filter((b) => b.completed).length ?? 0;
  const totalBlocks = 4;

  // Assessed skills count
  const assessedSkills = skills?.filter((s) => s.score > 0) ?? [];
  const overallSkillAvg =
    skills && skills.length > 0
      ? (skills.reduce((acc, s) => acc + s.score, 0) / skills.length).toFixed(1)
      : '0.0';
  const assessedSkillAvg =
    assessedSkills.length > 0
      ? (assessedSkills.reduce((acc, s) => acc + s.score, 0) / assessedSkills.length).toFixed(1)
      : '0.0';

  // Chart data: 4 Blocks Daily Distribution
  const blockDistributionData = [
    { name: 'DSA', minutes: 40, target: 40, fill: '#10b981' },
    { name: 'Technical', minutes: 60, target: 60, fill: '#6366f1' },
    { name: 'Interview', minutes: 10, target: 10, fill: '#f59e0b' },
    { name: 'Log', minutes: 10, target: 10, fill: '#8b5cf6' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Notice for Truthful Data */}
      {!isSampleDataMode && (
        <div className="p-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>
              <strong>Clean Day 1 Baseline</strong>: Real progress tracking initiated. No fake metrics are shown.
            </span>
          </div>
          <span className="font-mono text-[11px] text-slate-500">Day {dayNumber} of 168</span>
        </div>
      )}

      {/* Prominent TODAY'S MISSION Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-950 text-white p-6 sm:p-8 shadow-lg border border-emerald-800/40">
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold tracking-wide uppercase">
                Day {dayNumber} of 168 • Phase {phaseNumber}
              </span>
              <span className="text-slate-400 text-xs hidden sm:inline">•</span>
              <span className="text-slate-300 text-xs font-mono">120 min daily target</span>
            </div>
            <Badge variant="success" size="sm" className="bg-emerald-500 text-white border-none font-medium">
              {completedBlocksCount}/{totalBlocks} Blocks Completed
            </Badge>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2">
            🎯 Today's Mission: {todayPlan?.targetFocus || 'Systematic Preparation Execution'}
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl mb-6">
            {todayPlan?.blocks[0]?.description ||
              'Execute the 4-block daily framework: DSA (40m), Technical (60m), Interview (10m), and Progress Log (10m).'}
          </p>

          {/* Quick Block Launchers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {(todayPlan?.blocks || []).map((block) => {
              const themeStyles = {
                dsa: { border: 'hover:border-emerald-500/50', text: 'text-emerald-300', btn: 'bg-emerald-500/30 hover:bg-emerald-500' },
                technical: { border: 'hover:border-indigo-500/50', text: 'text-indigo-300', btn: 'bg-indigo-500/30 hover:bg-indigo-500' },
                interview: { border: 'hover:border-amber-500/50', text: 'text-amber-300', btn: 'bg-amber-500/30 hover:bg-amber-500' },
                log: { border: 'hover:border-purple-500/50', text: 'text-purple-300', btn: 'bg-purple-500/30 hover:bg-purple-500' },
              }[block.id];

              return (
                <div
                  key={block.id}
                  className={`bg-white/10 backdrop-blur-sm p-3.5 rounded-xl border border-white/10 ${themeStyles.border} transition-all`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-semibold ${themeStyles.text} flex items-center gap-1.5`}>
                      {block.completed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                      {block.name}
                    </span>
                    <button
                      onClick={() => {
                        setTimerBlock(block.id);
                        startTimer();
                      }}
                      className={`p-1 rounded ${themeStyles.btn} text-white transition-colors`}
                      title={`Start ${block.durationMinutes}m Timer`}
                    >
                      <Play className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-200 line-clamp-1">{block.description}</p>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/today"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold transition-all shadow-md shadow-emerald-500/20"
            >
              Open Today's Checklist & Notes <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/dsa"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium backdrop-blur-sm transition-all"
            >
              View 67 Master DSA List
            </Link>
          </div>
        </div>
      </div>

      {/* Key Metric Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">DSA Solved</span>
              <Code2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                {totalDsaProgress}
              </span>
              <span className="text-xs text-slate-400">/ {totalMasterProblems}</span>
            </div>
            <ProgressBar value={totalDsaProgress} max={totalMasterProblems} size="sm" className="mt-3" />
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
              {masteredCount} Mastered • {inRevisionCount} In Review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Revision Queue</span>
              <RotateCcw className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                {revisionItems?.length ?? 0}
              </span>
              <span className="text-xs text-slate-400">items</span>
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Spaced repetition (1, 3, 7, 14d)</span>
            </div>
            <Link to="/revision" className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline mt-2 inline-block">
              Review queue →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Skills Average</span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                {overallSkillAvg}
              </span>
              <span className="text-xs text-slate-400">/ 5.0</span>
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {assessedSkills.length} of 9 assessed (avg {assessedSkillAvg})
              </span>
            </div>
            <Link to="/skills" className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline mt-2 inline-block">
              Skills matrix →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Target Role</span>
              <Briefcase className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            </div>
            <div className="text-base font-bold text-slate-900 dark:text-white leading-tight">
              SDE-1 (₹10+ LPA)
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Python Backend • MCA '27
            </p>
            <div className="mt-3">
              <Badge variant="info" size="sm">
                {jobApps?.length ?? 0} Applications Tracked
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts & Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily 4-Block Allocation Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Daily 120-Minute Architecture</CardTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Target allocation per day across the 4 systematic preparation blocks
              </p>
            </div>
            <span className="font-mono text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
              Total: 120m
            </span>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={blockDistributionData} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 5 }}>
                  <XAxis type="number" domain={[0, 70]} tick={{ fontSize: 11, fill: '#64748b' }} unit=" min" />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} width={80} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      color: '#f8fafc',
                      fontSize: '12px',
                    }}
                    formatter={(val: number) => [`${val} minutes`, 'Target Duration']}
                  />
                  <Bar dataKey="target" radius={[0, 6, 6, 0]}>
                    {blockDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
              <div>
                <span className="block text-xs font-semibold text-slate-800 dark:text-slate-200">Block 1</span>
                <span className="text-[11px] text-emerald-600 font-mono">DSA 40m</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-slate-800 dark:text-slate-200">Block 2</span>
                <span className="text-[11px] text-indigo-600 font-mono">Tech 60m</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-slate-800 dark:text-slate-200">Block 3</span>
                <span className="text-[11px] text-amber-600 font-mono">Int 10m</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-slate-800 dark:text-slate-200">Block 4</span>
                <span className="text-[11px] text-purple-600 font-mono">Log 10m</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Checkpoint & Phase Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Milestone Radar</CardTitle>
            <Badge variant="warning" size="sm">Phase {phaseNumber}</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Current Milestone
              </span>
              <h4 className="font-semibold text-xs text-slate-800 dark:text-slate-200 mt-1">
                Week 1 Checkpoint: Foundations Diagnostic
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Target: 8-10 DSA problems solved, Python exercises verified, GitHub repo baseline.
              </p>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                <span>Checkpoint Due:</span>
                <span className="font-mono font-medium text-emerald-600">Day 7 (Oct 26, 2026)</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Primary Project Track
              </span>
              <h4 className="font-semibold text-xs text-slate-800 dark:text-slate-200 mt-1 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-500" /> AgroVision-ML Backend
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                FastAPI, PostgreSQL, SQLAlchemy 2.0, Alembic, Docker, Pytest.
              </p>
              <div className="mt-2 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                <span>Kickoff:</span>
                <span className="font-mono text-slate-500">Week 5 (Nov 17, 2026)</span>
              </div>
            </div>

            <Link
              to="/roadmap"
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Explore Full 24-Week Roadmap <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
