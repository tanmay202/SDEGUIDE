import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  CheckCircle2,
  Circle,
  Play,
  Save,
  FileText,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from 'lucide-react';
import { db } from '../db/database';
import { useApp } from '../context/AppContext';
import { formatKolkataDateDisplay, calculateRoadmapWeek, calculateRoadmapPhase } from '../utils/dateUtils';
import { getOrCreateDailyPlan } from '../db/dbService';
import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { TimerWidget } from '../components/common/TimerWidget';

export const TodayPlan: React.FC = () => {
  const { dayNumber, setTimerBlock, startTimer } = useApp();
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(dayNumber);

  // Keep selectedDayNumber in sync with app dayNumber on mount
  React.useEffect(() => {
    setSelectedDayNumber(dayNumber);
  }, [dayNumber]);

  const plan = useLiveQuery(
    async () => {
      return await getOrCreateDailyPlan(selectedDayNumber);
    },
    [selectedDayNumber]
  );

  const [struggledWith, setStruggledWith] = useState('');
  const [keyLearnings, setKeyLearnings] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync state once plan is loaded
  React.useEffect(() => {
    if (plan) {
      setStruggledWith(plan.struggledWith || '');
      setKeyLearnings(plan.keyLearnings || '');
    }
  }, [plan]);

  const toggleSubtask = async (blockId: string, subtaskId: string) => {
    if (!plan || !plan.id) return;
    const updatedBlocks = plan.blocks.map((block) => {
      if (block.id !== blockId) return block;
      const updatedSubtasks = block.subtasks?.map((task) =>
        task.id === subtaskId ? { ...task, done: !task.done } : task
      );
      const allDone = updatedSubtasks?.every((t) => t.done) ?? false;
      return {
        ...block,
        subtasks: updatedSubtasks,
        completed: allDone,
      };
    });

    const allBlocksDone = updatedBlocks.every((b) => b.completed);

    await db.dailyPlans.update(plan.id, {
      blocks: updatedBlocks,
      status: allBlocksDone ? 'completed' : 'in-progress',
    });
  };

  const toggleBlockCompleted = async (blockId: string) => {
    if (!plan || !plan.id) return;
    const updatedBlocks = plan.blocks.map((block) => {
      if (block.id !== blockId) return block;
      const newStatus = !block.completed;
      const updatedSubtasks = block.subtasks?.map((task) => ({ ...task, done: newStatus }));
      return {
        ...block,
        completed: newStatus,
        subtasks: updatedSubtasks,
      };
    });

    const allBlocksDone = updatedBlocks.every((b) => b.completed);

    await db.dailyPlans.update(plan.id, {
      blocks: updatedBlocks,
      status: allBlocksDone ? 'completed' : 'in-progress',
    });
  };

  const handleSaveNotes = async () => {
    if (!plan || !plan.id) return;
    await db.dailyPlans.update(plan.id, {
      struggledWith,
      keyLearnings,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const currentWeek = calculateRoadmapWeek(selectedDayNumber);
  const currentPhase = calculateRoadmapPhase(currentWeek);
  const completedBlocksCount = plan?.blocks.filter((b) => b.completed).length ?? 0;

  return (
    <div className="space-y-6">
      {/* Top Header with Day Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono">
              Day {selectedDayNumber} of 168
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs text-slate-500 font-medium">
              Week {currentWeek} / 24 (Phase {currentPhase})
            </span>
            {selectedDayNumber === dayNumber && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                Today
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Daily Preparation Plan
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {formatKolkataDateDisplay(plan?.date || '')} • 120-Minute Focus Architecture
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Day Navigation Controls */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setSelectedDayNumber((prev) => Math.max(1, prev - 1))}
              disabled={selectedDayNumber <= 1}
              className="p-1 rounded hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 text-slate-700 dark:text-slate-200 transition-colors"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-semibold px-2 text-slate-700 dark:text-slate-200">
              Day {selectedDayNumber}
            </span>
            <button
              onClick={() => setSelectedDayNumber((prev) => Math.min(168, prev + 1))}
              disabled={selectedDayNumber >= 168}
              className="p-1 rounded hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 text-slate-700 dark:text-slate-200 transition-colors"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {selectedDayNumber !== dayNumber && (
            <button
              onClick={() => setSelectedDayNumber(dayNumber)}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
            >
              Jump to Today (Day {dayNumber})
            </button>
          )}

          <Badge variant={completedBlocksCount === 4 ? 'success' : 'warning'} size="md">
            {completedBlocksCount} of 4 Blocks Completed
          </Badge>
        </div>
      </div>

      {/* Target Focus Banner */}
      {plan?.targetFocus && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 to-slate-900/60 border border-emerald-800/40 text-slate-200 text-xs">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
            <Calendar className="w-4 h-4" />
            <span>Target Mission Focus:</span>
          </div>
          <p className="text-slate-100 font-medium">{plan.targetFocus}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main 4 Blocks Column */}
        <div className="lg:col-span-2 space-y-4">
          {plan?.blocks.map((block) => {
            const blockColors = {
              dsa: 'border-l-4 border-l-emerald-500',
              technical: 'border-l-4 border-l-indigo-500',
              interview: 'border-l-4 border-l-amber-500',
              log: 'border-l-4 border-l-purple-500',
            };

            return (
              <Card key={block.id} className={blockColors[block.id]}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleBlockCompleted(block.id)}
                      className="text-slate-400 hover:text-emerald-600 transition-colors"
                      title={block.completed ? 'Mark incomplete' : 'Mark block complete'}
                    >
                      {block.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                    <div>
                      <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        {block.name}
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {block.durationMinutes} min
                        </span>
                      </CardTitle>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {block.description}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setTimerBlock(block.id);
                      startTimer();
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors"
                    title={`Start ${block.durationMinutes}m timer`}
                  >
                    <Play className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Focus</span>
                  </button>
                </CardHeader>

                {block.subtasks && block.subtasks.length > 0 && (
                  <CardContent className="pt-2 border-t border-slate-100 dark:border-slate-800/60 mt-2">
                    <div className="space-y-2">
                      {block.subtasks.map((task) => (
                        <label
                          key={task.id}
                          className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={task.done}
                            onChange={() => toggleSubtask(block.id, task.id)}
                            className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800"
                          />
                          <span className={task.done ? 'line-through text-slate-400 dark:text-slate-500' : ''}>
                            {task.text}
                          </span>
                        </label>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}

          {/* Daily Reflection & Log Form */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" /> Day {selectedDayNumber} Reflection & Log
                </CardTitle>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Record gaps encountered, solutions verbalized, and key learnings.
                </p>
              </div>
              {saveSuccess && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Saved!
                </span>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Struggled With / Identified Gaps:
                </label>
                <textarea
                  value={struggledWith}
                  onChange={(e) => setStruggledWith(e.target.value)}
                  placeholder="e.g. Explaining generator memory model aloud, or recursion tree complexity bounds..."
                  rows={3}
                  className="w-full text-xs p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Key Learnings & Takeaways:
                </label>
                <textarea
                  value={keyLearnings}
                  onChange={(e) => setKeyLearnings(e.target.value)}
                  placeholder="e.g. Two Sum hash table complement pattern O(N) time and O(N) space..."
                  rows={3}
                  className="w-full text-xs p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSaveNotes}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" /> Save Day {selectedDayNumber} Reflection
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Column: Timer & Deliverables */}
        <div className="space-y-4">
          <TimerWidget />

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Today's Checkpoints</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2 text-slate-600 dark:text-slate-400">
              {plan?.blocks.flatMap((b) => b.subtasks || []).map((task) => (
                <div key={task.id} className="flex items-start gap-2">
                  <CheckCircle2
                    className={`w-4 h-4 mt-0.5 shrink-0 ${
                      task.done ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-700'
                    }`}
                  />
                  <span className={task.done ? 'line-through text-slate-400' : ''}>
                    {task.text}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/50 dark:border-amber-900/40">
            <CardHeader className="pb-1">
              <span className="text-xs font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" /> Spaced Repetition Note
              </span>
            </CardHeader>
            <CardContent className="text-xs text-amber-900/80 dark:text-amber-300/80 leading-relaxed">
              When problems are marked solved in the DSA Tracker, they enter the Spaced Repetition Queue automatically (+1d, +3d, +7d, +14d).
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
