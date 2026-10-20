import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  Search,
  ExternalLink,
  CheckCircle2,
  RotateCcw,
  Circle,
  Check,
  Edit3,
} from 'lucide-react';
import { db } from '../db/database';
import { updateDsaProblemStatus } from '../db/dbService';
import type { DsaDifficulty, DsaPattern, DsaProblem, DsaStatus } from '../types';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import { Modal } from '../components/common/Modal';

const PATTERNS: (DsaPattern | 'All')[] = [
  'All',
  'Arrays & Hashing',
  'Two Pointers',
  'Sliding Window',
  'Stack',
  'Binary Search',
  'Linked List',
  'Trees',
  'Heap / Priority Queue',
  'Graphs',
  'Intervals',
  'Greedy',
  'Backtracking',
  'Dynamic Programming',
  'Prefix Sum',
];

export const DsaTracker: React.FC = () => {
  const problems = useLiveQuery(() => db.dsaProblems.toArray(), []);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPattern, setSelectedPattern] = useState<DsaPattern | 'All'>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DsaDifficulty | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<DsaStatus | 'All'>('All');

  // Modal for editing problem notes
  const [editingProblem, setEditingProblem] = useState<DsaProblem | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const [editTimeComplexity, setEditTimeComplexity] = useState('');
  const [editSpaceComplexity, setEditSpaceComplexity] = useState('');

  const openEditModal = (problem: DsaProblem) => {
    setEditingProblem(problem);
    setEditNotes(problem.notes || '');
    setEditTimeComplexity(problem.timeComplexity || '');
    setEditSpaceComplexity(problem.spaceComplexity || '');
  };

  const handleSaveNotes = async () => {
    if (!editingProblem) return;
    await db.dsaProblems.update(editingProblem.id, {
      notes: editNotes,
      timeComplexity: editTimeComplexity,
      spaceComplexity: editSpaceComplexity,
    });
    setEditingProblem(null);
  };

  const handleStatusChange = async (problemId: number, newStatus: DsaStatus) => {
    await updateDsaProblemStatus(problemId, newStatus);
  };

  // Metrics
  const totalCount = problems?.length ?? 67;
  const masteredCount = problems?.filter((p) => p.status === 'mastered').length ?? 0;
  const solvedCount = problems?.filter((p) => p.status === 'solved').length ?? 0;
  const revisionCount = problems?.filter((p) => p.status === 'revision').length ?? 0;
  const unsolvedCount = problems?.filter((p) => p.status === 'unsolved').length ?? 0;

  // Filtered problems
  const filteredProblems = (problems || []).filter((problem) => {
    const matchesSearch =
      problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(problem.leetcodeNumber).includes(searchQuery);
    const matchesPattern = selectedPattern === 'All' || problem.pattern === selectedPattern;
    const matchesDifficulty = selectedDifficulty === 'All' || problem.difficulty === selectedDifficulty;
    const matchesStatus = selectedStatus === 'All' || problem.status === selectedStatus;
    return matchesSearch && matchesPattern && matchesDifficulty && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="success" size="sm">67 Master Problems</Badge>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs text-slate-500 font-medium">NeetCode Blind 75 Core Subsets</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            DSA Problem Tracker
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Master the 14 foundational patterns with verbal complexity analysis before coding
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-medium text-slate-600 dark:text-slate-300">
            {masteredCount + solvedCount} / {totalCount} completed
          </span>
        </div>
      </div>

      {/* Summary KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Mastered</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="font-mono text-xl font-bold text-slate-900 dark:text-white">
            {masteredCount}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Solved</span>
            <Check className="w-3.5 h-3.5 text-indigo-500" />
          </div>
          <div className="font-mono text-xl font-bold text-slate-900 dark:text-white">
            {solvedCount}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>In Revision</span>
            <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="font-mono text-xl font-bold text-slate-900 dark:text-white">
            {revisionCount}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Unsolved</span>
            <Circle className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="font-mono text-xl font-bold text-slate-900 dark:text-white">
            {unsolvedCount}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <ProgressBar value={masteredCount + solvedCount} max={totalCount} showLabel size="md" />

      {/* Filters and Search Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search problem title or # number (e.g. Two Sum, 1)..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-2">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value as DsaDifficulty | 'All')}
              className="text-xs py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as DsaStatus | 'All')}
              className="text-xs py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="unsolved">❌ Unsolved</option>
              <option value="solved">⚡ Solved</option>
              <option value="mastered">✅ Mastered</option>
              <option value="revision">🔄 In Revision</option>
            </select>
          </div>
        </div>

        {/* Pattern Pills Filter (Horizontal Scrollable) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
          {PATTERNS.map((pat) => (
            <button
              key={pat}
              onClick={() => setSelectedPattern(pat)}
              className={`px-2.5 py-1 rounded-md shrink-0 transition-colors ${
                selectedPattern === pat
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              {pat}
            </button>
          ))}
        </div>
      </div>

      {/* Problems Table / List */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4 w-16">#</th>
                <th className="py-3 px-4">Problem</th>
                <th className="py-3 px-4">Pattern</th>
                <th className="py-3 px-4 w-28">Difficulty</th>
                <th className="py-3 px-4 w-40">Status</th>
                <th className="py-3 px-4 w-24 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredProblems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">
                    No problems match your current filter.
                  </td>
                </tr>
              ) : (
                filteredProblems.map((prob) => {
                  const difficultyBadge: Record<DsaDifficulty, 'success' | 'warning' | 'danger'> = {
                    Easy: 'success',
                    Medium: 'warning',
                    Hard: 'danger',
                  };

                  return (
                    <tr
                      key={prob.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono font-medium text-slate-400">
                        {prob.id}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <a
                            href={prob.leetcodeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 hover:underline flex items-center gap-1.5"
                          >
                            <span>{prob.title}</span>
                            <span className="text-[11px] font-mono text-slate-400">
                              (LC #{prob.leetcodeNumber})
                            </span>
                            <ExternalLink className="w-3 h-3 text-slate-400 opacity-60" />
                          </a>
                        </div>
                        {prob.notes && (
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            💡 {prob.notes}
                          </p>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px]">
                          {prob.pattern}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={difficultyBadge[prob.difficulty]} size="sm">
                          {prob.difficulty}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={prob.status}
                          onChange={(e) =>
                            handleStatusChange(prob.id, e.target.value as DsaStatus)
                          }
                          className={`text-xs py-1 px-2 rounded-lg font-medium border focus:outline-none cursor-pointer ${
                            prob.status === 'mastered'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
                              : prob.status === 'solved'
                              ? 'bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800'
                              : prob.status === 'revision'
                              ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800'
                              : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                          }`}
                        >
                          <option value="unsolved">❌ Unsolved</option>
                          <option value="solved">⚡ Solved</option>
                          <option value="revision">🔄 In Revision</option>
                          <option value="mastered">✅ Mastered</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => openEditModal(prob)}
                          className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Edit Notes & Complexity"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit Notes Modal */}
      {editingProblem && (
        <Modal
          isOpen={!!editingProblem}
          onClose={() => setEditingProblem(null)}
          title={`Notes: ${editingProblem.title} (LC #${editingProblem.leetcodeNumber})`}
          description="Document complexity derivation, pattern insights, and edge cases."
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Time Complexity
                </label>
                <input
                  type="text"
                  value={editTimeComplexity}
                  onChange={(e) => setEditTimeComplexity(e.target.value)}
                  placeholder="e.g. O(N) or O(N log N)"
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Space Complexity
                </label>
                <input
                  type="text"
                  value={editSpaceComplexity}
                  onChange={(e) => setEditSpaceComplexity(e.target.value)}
                  placeholder="e.g. O(1) or O(N)"
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Solution Insights & Edge Cases:
              </label>
              <textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Key realization, complementary lookup, empty array edge cases, etc."
                rows={4}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingProblem(null)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNotes}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              >
                Save
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
