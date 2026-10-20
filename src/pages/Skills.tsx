import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Edit2 } from 'lucide-react';
import { db } from '../db/database';
import type { SkillVertical } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import { Modal } from '../components/common/Modal';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from 'recharts';

export const Skills: React.FC = () => {
  const skills = useLiveQuery(() => db.skills.toArray(), []);

  const [editingSkill, setEditingSkill] = useState<SkillVertical | null>(null);
  const [editScore, setEditScore] = useState<number>(0);
  const [editEvidence, setEditEvidence] = useState('');

  const openEditModal = (skill: SkillVertical) => {
    setEditingSkill(skill);
    setEditScore(skill.score);
    setEditEvidence(skill.evidence || '');
  };

  const handleSaveSkill = async () => {
    if (!editingSkill) return;

    const statusMap: Record<number, SkillVertical['status']> = {
      0: 'Unassessed',
      1: 'Novice',
      2: 'Developing',
      3: 'Competent',
      4: 'Proficient',
      5: 'Mastered',
    };

    await db.skills.update(editingSkill.id, {
      score: editScore,
      status: statusMap[editScore] || 'Unassessed',
      evidence: editEvidence,
      lastAssessedDate: new Date().toISOString().slice(0, 10),
    });

    setEditingSkill(null);
  };

  // Metrics
  const assessedSkills = (skills || []).filter((s) => s.score > 0);
  const totalSkillsCount = skills?.length || 9;
  const overallAvg =
    skills && skills.length > 0
      ? (skills.reduce((sum, s) => sum + s.score, 0) / totalSkillsCount).toFixed(1)
      : '0.0';
  const assessedAvg =
    assessedSkills.length > 0
      ? (assessedSkills.reduce((sum, s) => sum + s.score, 0) / assessedSkills.length).toFixed(1)
      : '0.0';

  // Radar chart data
  const radarData = (skills || []).map((s) => ({
    subject: s.name.split(' ')[0] + (s.name.includes('FastAPI') ? ' (FastAPI)' : ''),
    score: s.score,
    target: 4.5,
    fullMark: 5,
  }));

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="purple" size="sm">9 Core Verticals</Badge>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs text-slate-500 font-medium">0 to 5 Evaluation Scale</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Skills Matrix & Competency Radar
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Evaluated weekly based on concrete test evidence, mock reviews, and code artifacts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-medium text-slate-600 dark:text-slate-300">
            Overall Average: <strong>{overallAvg}</strong> / 5.0 • {assessedSkills.length} of 9 assessed (avg {assessedAvg})
          </span>
        </div>
      </div>

      {/* Radar Chart & Summary Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 flex flex-col">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Competency Polygon</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center p-2">
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#64748b" strokeOpacity={0.2} />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748b' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fontSize: 9 }} />
                  <Radar name="Current Score" dataKey="score" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      color: '#f8fafc',
                      fontSize: '11px',
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 mt-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>Current Level</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                <span>Target: 4.0 - 5.0</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Evaluation Scale Criteria */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">0–5 Evaluation Criteria</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
              <span className="font-bold text-slate-700 dark:text-slate-300">0 — Unassessed</span>
              <p className="text-[11px] text-slate-400 mt-0.5">No diagnostic evidence or project audit yet</p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
              <span className="font-bold text-slate-700 dark:text-slate-300">1 — Novice</span>
              <p className="text-[11px] text-slate-400 mt-0.5">Knows basic syntax, needs frequent assistance</p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
              <span className="font-bold text-slate-700 dark:text-slate-300">2 — Developing</span>
              <p className="text-[11px] text-slate-400 mt-0.5">Understands patterns, solves with guidance</p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
              <span className="font-bold text-emerald-600 dark:text-emerald-400">3 — Competent</span>
              <p className="text-[11px] text-slate-400 mt-0.5">Can build endpoints and solve standard problems independently</p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
              <span className="font-bold text-indigo-600 dark:text-indigo-400">4 — Proficient</span>
              <p className="text-[11px] text-slate-400 mt-0.5">Defends trade-offs, writes tests, explains system design</p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
              <span className="font-bold text-amber-600 dark:text-amber-400">5 — Mastered</span>
              <p className="text-[11px] text-slate-400 mt-0.5">Interview-ready, solves mediums in 20m, architectural mastery</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 9 Skill Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills?.map((skill) => {
          const badgeVariants: Record<SkillVertical['status'], 'outline' | 'secondary' | 'warning' | 'info' | 'purple' | 'success'> = {
            Unassessed: 'outline',
            Novice: 'secondary',
            Developing: 'warning',
            Competent: 'info',
            Proficient: 'purple',
            Mastered: 'success',
          };

          return (
            <Card key={skill.id} className="flex flex-col justify-between">
              <CardHeader className="pb-2">
                <div>
                  <CardTitle className="text-sm font-semibold">{skill.name}</CardTitle>
                  <p className="text-[11px] text-slate-400 mt-0.5 capitalize">{skill.category} vertical</p>
                </div>
                <button
                  onClick={() => openEditModal(skill)}
                  className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Update Score & Evidence"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                      {skill.score}
                    </span>
                    <span className="text-xs text-slate-400">/ 5</span>
                  </div>
                  <Badge variant={badgeVariants[skill.status]} size="sm">
                    {skill.status}
                  </Badge>
                </div>

                <ProgressBar value={skill.score} max={5} size="sm" />

                <div className="text-xs space-y-1.5 pt-1">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 uppercase block">Benchmark:</span>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px] line-clamp-2">
                      {skill.benchmark}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 uppercase block">Evidence:</span>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] line-clamp-2 italic">
                      "{skill.evidence || 'No evidence recorded yet'}"
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Edit Score Modal */}
      {editingSkill && (
        <Modal
          isOpen={!!editingSkill}
          onClose={() => setEditingSkill(null)}
          title={`Evaluate: ${editingSkill.name}`}
          description="Update skill rating based on completed exercises, tests, and mock feedback."
        >
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Score (0 to 5):
              </label>
              <div className="flex items-center gap-2">
                {[0, 1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setEditScore(num)}
                    className={`w-10 h-10 rounded-lg font-bold font-mono text-sm transition-all ${
                      editScore === num
                        ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500/50'
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Benchmark Criteria:
              </label>
              <p className="text-slate-500 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
                {editingSkill.benchmark}
              </p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Concrete Assessment Evidence:
              </label>
              <textarea
                value={editEvidence}
                onChange={(e) => setEditEvidence(e.target.value)}
                placeholder="What test results, problem commits, or interview questions prove this rating?"
                rows={3}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingSkill(null)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSkill}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              >
                Save Rating
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
