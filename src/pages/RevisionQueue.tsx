import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  Repeat,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  CalendarCheck2,
} from 'lucide-react';
import { db } from '../db/database';
import { advanceRevisionItem, updateDsaProblemStatus } from '../db/dbService';
import { useApp } from '../context/AppContext';
import { formatKolkataDateDisplay } from '../utils/dateUtils';
import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { Modal } from '../components/common/Modal';

export const RevisionQueue: React.FC = () => {
  const { kolkataDateStr } = useApp();
  const queueItems = useLiveQuery(() => db.revisionQueue.toArray(), []);
  const allProblems = useLiveQuery(() => db.dsaProblems.toArray(), []);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState<number | ''>('');
  const [customNotes, setCustomNotes] = useState('');

  const handleAdvance = async (itemId: number) => {
    await advanceRevisionItem(itemId);
  };

  const handleManualAdd = async () => {
    if (!selectedProblemId) return;
    await updateDsaProblemStatus(Number(selectedProblemId), 'revision', customNotes);
    setAddModalOpen(false);
    setSelectedProblemId('');
    setCustomNotes('');
  };

  const activeQueue = (queueItems || [])
    .filter((item) => item.status !== 'completed')
    .sort((a, b) => a.nextReviewDate.localeCompare(b.nextReviewDate));
  const completedQueue = (queueItems || []).filter((item) => item.status === 'completed');

  // Categorize items
  const overdueItems = activeQueue.filter((item) => item.nextReviewDate < kolkataDateStr);
  const dueTodayItems = activeQueue.filter((item) => item.nextReviewDate === kolkataDateStr);
  const upcomingItems = activeQueue.filter((item) => item.nextReviewDate > kolkataDateStr);

  const stageLabels: Record<1 | 2 | 3 | 4, string> = {
    1: 'Review 1 (Day+1)',
    2: 'Review 2 (Day+3)',
    3: 'Review 3 (Day+7)',
    4: 'Review 4 (Day+14)',
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="purple" size="sm">Spaced Repetition Protocol</Badge>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs text-slate-500 font-medium">Intervals: +1d, +3d, +7d, +14d</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            DSA Revision Queue
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Problems solved move through 4 review intervals before final mastery
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Problem to Queue
          </button>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Due Today</span>
            <Clock className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="font-mono text-xl font-bold text-slate-900 dark:text-white">
            {dueTodayItems.length}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Overdue</span>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="font-mono text-xl font-bold text-rose-600 dark:text-rose-400">
            {overdueItems.length}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Upcoming</span>
            <CalendarCheck2 className="w-3.5 h-3.5 text-indigo-500" />
          </div>
          <div className="font-mono text-xl font-bold text-slate-900 dark:text-white">
            {upcomingItems.length}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Completed (Mastered)</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="font-mono text-xl font-bold text-slate-900 dark:text-white">
            {completedQueue.length}
          </div>
        </div>
      </div>

      {/* Overdue Section */}
      {overdueItems.length > 0 && (
        <Card className="border-rose-200 dark:border-rose-900/50 bg-rose-50/20 dark:bg-rose-950/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-rose-700 dark:text-rose-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Overdue for Review ({overdueItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {overdueItems.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/50 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
                    {item.problemTitle}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {stageLabels[item.reviewStage]} • Scheduled: {item.nextReviewDate}
                  </p>
                </div>
                <button
                  onClick={() => item.id && handleAdvance(item.id)}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-semibold"
                >
                  Mark Reviewed
                </button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Main Active Queue Table */}
      {activeQueue.length === 0 ? (
        <EmptyState
          icon={Repeat}
          title="Revision queue is empty"
          description="Solve problems in the DSA Tracker, and they will automatically populate here according to the +1d, +3d, +7d, +14d spaced repetition curve."
          actionText="Add Problem Manually"
          onAction={() => setAddModalOpen(true)}
        />
      ) : (
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Active Review Schedule</CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200/80 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Problem</th>
                  <th className="py-3 px-4">Pattern</th>
                  <th className="py-3 px-4">Current Stage</th>
                  <th className="py-3 px-4">Next Due Date</th>
                  <th className="py-3 px-4">Notes</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {activeQueue.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      {item.problemTitle}
                    </td>
                    <td className="py-3 px-4 text-slate-500">{item.pattern}</td>
                    <td className="py-3 px-4">
                      <Badge variant="purple" size="sm">
                        {stageLabels[item.reviewStage]}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <div className="flex items-center gap-1.5">
                        <span>{formatKolkataDateDisplay(item.nextReviewDate)}</span>
                        {item.nextReviewDate === kolkataDateStr && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-sans font-semibold">
                            Due Today
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-400 max-w-xs truncate">
                      {item.notes || '—'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => item.id && handleAdvance(item.id)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold shadow-xs"
                      >
                        {item.reviewStage === 4 ? 'Advance to Mastered' : 'Next Interval →'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Add Problem Modal */}
      {addModalOpen && (
        <Modal
          isOpen={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          title="Add Problem to Spaced Repetition"
          description="Select a problem to schedule for Review 1 (Day+1)."
        >
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Select Problem:
              </label>
              <select
                value={selectedProblemId}
                onChange={(e) => setSelectedProblemId(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="">-- Choose a Problem --</option>
                {allProblems?.map((prob) => (
                  <option key={prob.id} value={prob.id}>
                    #{prob.id} - {prob.title} ({prob.pattern} • {prob.difficulty})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Revision Notes or Trap to Remember:
              </label>
              <textarea
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="e.g. Remember to handle negative targets, or check complement existence before index assignment..."
                rows={3}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setAddModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleManualAdd}
                disabled={!selectedProblemId}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold disabled:opacity-50"
              >
                Add to Queue
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
