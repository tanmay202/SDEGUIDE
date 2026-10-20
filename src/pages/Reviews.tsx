import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  Award,
  Plus,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';
import { db } from '../db/database';
import { useApp } from '../context/AppContext';
import type { MockInterviewLog, WeeklyCheckpoint } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';

export const Reviews: React.FC = () => {
  const { weekNumber } = useApp();
  const checkpoints = useLiveQuery(() => db.checkpoints.toArray(), []);
  const mockLogs = useLiveQuery(() => db.mockInterviews.toArray(), []);

  const [activeTab, setActiveTab] = useState<'checkpoints' | 'mocks'>('checkpoints');

  // Checkpoint evaluation modal
  const [evaluatingCheckpoint, setEvaluatingCheckpoint] = useState<WeeklyCheckpoint | null>(null);
  const [evalScore, setEvalScore] = useState<number>(8);
  const [evalBottleneck, setEvalBottleneck] = useState('');
  const [evalActionPlan, setEvalActionPlan] = useState('');
  const [evalStatus, setEvalStatus] = useState<WeeklyCheckpoint['status']>('passed');

  // Mock Interview log modal
  const [isLogMockOpen, setIsLogMockOpen] = useState(false);
  const [mockType, setMockType] = useState<MockInterviewLog['type']>('Coding (45m)');
  const [mockPlatform, setMockPlatform] = useState('Pramp / Peer Mock');
  const [mockScore, setMockScore] = useState<number>(7);
  const [mockProblems, setMockProblems] = useState('');
  const [mockStrengths, setMockStrengths] = useState('');
  const [mockWeaknesses, setMockWeaknesses] = useState('');
  const [mockActionPlan, setMockActionPlan] = useState('');

  const openCheckpointModal = (cp: WeeklyCheckpoint) => {
    setEvaluatingCheckpoint(cp);
    setEvalScore(cp.score || 8);
    setEvalBottleneck(cp.identifiedBottleneck || '');
    setEvalActionPlan(cp.actionItems || '');
    setEvalStatus(cp.status || 'passed');
  };

  const handleSaveCheckpoint = async () => {
    if (!evaluatingCheckpoint || !evaluatingCheckpoint.id) return;
    await db.checkpoints.update(evaluatingCheckpoint.id, {
      score: evalScore,
      identifiedBottleneck: evalBottleneck,
      actionItems: evalActionPlan,
      status: evalStatus,
      dateEvaluated: new Date().toISOString().slice(0, 10),
    });
    setEvaluatingCheckpoint(null);
  };

  const handleSaveMockLog = async (e: React.FormEvent) => {
    e.preventDefault();
    await db.mockInterviews.add({
      date: new Date().toISOString().slice(0, 10),
      type: mockType,
      interviewerOrPlatform: mockPlatform,
      score: mockScore,
      problemsCovered: mockProblems,
      strengths: mockStrengths,
      weaknesses: mockWeaknesses,
      actionPlan: mockActionPlan,
    });
    setIsLogMockOpen(false);
    setMockProblems('');
    setMockStrengths('');
    setMockWeaknesses('');
    setMockActionPlan('');
  };

  const completedCheckpointsCount = checkpoints?.filter((c) => c.status === 'passed').length ?? 0;
  const avgMockScore =
    mockLogs && mockLogs.length > 0
      ? (mockLogs.reduce((acc, m) => acc + m.score, 0) / mockLogs.length).toFixed(1)
      : '0.0';

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="purple" size="sm">Evidence & Quality Control</Badge>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs text-slate-500 font-medium">Weekly Checkpoints & Mock Audits</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Reviews & Performance Checkpoints
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track weekly milestones, identify real bottlenecks, and log mock interview calibrations
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'mocks' && (
            <button
              onClick={() => setIsLogMockOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" /> Log Mock Interview
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('checkpoints')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'checkpoints'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileCheck className="w-4 h-4" /> 24 Weekly Checkpoints ({completedCheckpointsCount}/24 passed)
        </button>
        <button
          onClick={() => setActiveTab('mocks')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'mocks'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Award className="w-4 h-4" /> Mock Interview Logs ({mockLogs?.length ?? 0} logged • Avg {avgMockScore}/10)
        </button>
      </div>

      {/* Checkpoints Tab */}
      {activeTab === 'checkpoints' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {checkpoints?.map((cp) => {
            const isCurrent = cp.weekNumber === weekNumber;

            return (
              <Card
                key={cp.id}
                className={`flex flex-col justify-between ${
                  isCurrent ? 'border-emerald-500/80 shadow-md ring-1 ring-emerald-500/20' : ''
                }`}
              >
                <CardHeader className="pb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                        Week {cp.weekNumber}
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <span className="text-[11px] text-slate-500">Phase {cp.phase}</span>
                      {isCurrent && <Badge variant="success" size="sm">Current Week</Badge>}
                    </div>
                    <CardTitle className="text-sm font-semibold mt-1">{cp.title}</CardTitle>
                  </div>
                  <Badge
                    variant={
                      cp.status === 'passed'
                        ? 'success'
                        : cp.status === 'needs_work'
                        ? 'danger'
                        : cp.status === 'current'
                        ? 'warning'
                        : 'outline'
                    }
                    size="sm"
                  >
                    {cp.status.replace('_', ' ')}
                  </Badge>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="text-xs space-y-1">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase block">Targets:</span>
                    {cp.targetDeliverables.map((td, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-slate-600 dark:text-slate-400 text-[11px]">
                        <CheckCircle2 className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                        <span>{td}</span>
                      </div>
                    ))}
                  </div>

                  {cp.score !== undefined && (
                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 text-xs">
                      <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200">
                        <span>Evaluation Score:</span>
                        <span className="font-mono text-emerald-600">{cp.score} / 10</span>
                      </div>
                      {cp.identifiedBottleneck && (
                        <p className="text-[11px] text-slate-500 mt-1">
                          <strong>Bottleneck:</strong> {cp.identifiedBottleneck}
                        </p>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => openCheckpointModal(cp)}
                    className="w-full py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    {cp.score ? 'Update Evaluation' : 'Conduct Checkpoint'}
                  </button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Mock Interview Tab */}
      {activeTab === 'mocks' && (
        <div className="space-y-4">
          {mockLogs?.length === 0 ? (
            <Card className="p-8 text-center border-dashed">
              <Award className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                No mock interviews recorded yet
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                Mock sessions start on Day 1 with verbal explanations and scale to full coding, backend design, and behavioral mocks in Phase 3.
              </p>
              <button
                onClick={() => setIsLogMockOpen(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold"
              >
                Log First Mock Session
              </button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockLogs?.map((mock) => (
                <Card key={mock.id}>
                  <CardHeader className="pb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="purple" size="sm">{mock.type}</Badge>
                        <span className="text-slate-400 text-xs">•</span>
                        <span className="text-[11px] text-slate-500 font-mono">{mock.date}</span>
                      </div>
                      <CardTitle className="text-sm font-semibold mt-1">
                        Platform / Evaluator: {mock.interviewerOrPlatform}
                      </CardTitle>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-xl font-bold text-emerald-600 dark:text-emerald-400">
                        {mock.score}
                      </span>
                      <span className="text-xs text-slate-400"> / 10</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs">
                    {mock.problemsCovered && (
                      <p className="text-slate-700 dark:text-slate-300 font-medium">
                        Problems: <span className="font-normal">{mock.problemsCovered}</span>
                      </p>
                    )}
                    <div className="p-2.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/30">
                      <strong className="text-emerald-800 dark:text-emerald-300">Strengths:</strong>{' '}
                      <span className="text-emerald-900 dark:text-emerald-200">{mock.strengths}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/50 dark:border-rose-900/30">
                      <strong className="text-rose-800 dark:text-rose-300">Areas for Improvement:</strong>{' '}
                      <span className="text-rose-900 dark:text-rose-200">{mock.weaknesses}</span>
                    </div>
                    {mock.actionPlan && (
                      <p className="text-slate-500 text-[11px]">
                        <strong>Action Plan:</strong> {mock.actionPlan}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Checkpoint Evaluation Modal */}
      {evaluatingCheckpoint && (
        <Modal
          isOpen={!!evaluatingCheckpoint}
          onClose={() => setEvaluatingCheckpoint(null)}
          title={`Evaluate Week ${evaluatingCheckpoint.weekNumber} Checkpoint`}
          description="Record test scorecard and identify primary learning bottleneck."
        >
          <div className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Scorecard (out of 10):
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={evalScore}
                  onChange={(e) => setEvalScore(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Status:
                </label>
                <select
                  value={evalStatus}
                  onChange={(e) => setEvalStatus(e.target.value as WeeklyCheckpoint['status'])}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="passed">Passed</option>
                  <option value="needs_work">Needs Work</option>
                  <option value="current">Current</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Identified Primary Bottleneck:
              </label>
              <input
                type="text"
                value={evalBottleneck}
                onChange={(e) => setEvalBottleneck(e.target.value)}
                placeholder="e.g. Sliding window shrinking condition, or SQLAlchemy async sessions..."
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Action Items for Next Week:
              </label>
              <textarea
                value={evalActionPlan}
                onChange={(e) => setEvalActionPlan(e.target.value)}
                rows={3}
                placeholder="Specific drills to overcome bottleneck before advancing..."
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEvaluatingCheckpoint(null)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCheckpoint}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              >
                Save Checkpoint
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Log Mock Modal */}
      {isLogMockOpen && (
        <Modal
          isOpen={isLogMockOpen}
          onClose={() => setIsLogMockOpen(false)}
          title="Log Mock Interview Performance"
          description="Record feedback from live mocks or recorded self-drills."
        >
          <form onSubmit={handleSaveMockLog} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Interview Type:
                </label>
                <select
                  value={mockType}
                  onChange={(e) => setMockType(e.target.value as MockInterviewLog['type'])}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Coding (45m)">Coding (45m)</option>
                  <option value="Backend Design (30m)">Backend Design (30m)</option>
                  <option value="CS Theory (20m)">CS Theory (20m)</option>
                  <option value="Behavioral (15m)">Behavioral (15m)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Score (1 to 10):
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={mockScore}
                  onChange={(e) => setMockScore(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Platform / Peer / Evaluator:
              </label>
              <input
                type="text"
                required
                value={mockPlatform}
                onChange={(e) => setMockPlatform(e.target.value)}
                placeholder="Pramp, Self-Diagnostic, Mentor, etc."
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Problems or Questions Covered:
              </label>
              <input
                type="text"
                value={mockProblems}
                onChange={(e) => setMockProblems(e.target.value)}
                placeholder="e.g. Valid Anagram & Group Anagrams, ACID transaction questions"
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Strengths:
              </label>
              <textarea
                value={mockStrengths}
                onChange={(e) => setMockStrengths(e.target.value)}
                rows={2}
                placeholder="What went well? Clear communication, structured code?"
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Weaknesses & Missed Edge Cases:
              </label>
              <textarea
                value={mockWeaknesses}
                onChange={(e) => setMockWeaknesses(e.target.value)}
                rows={2}
                placeholder="What was missed? Blank stare on time complexity, poor variable naming?"
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsLogMockOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              >
                Save Mock Log
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
