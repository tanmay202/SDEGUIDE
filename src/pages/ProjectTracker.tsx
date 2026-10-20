import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  Server,
  Terminal,
  Code,
} from 'lucide-react';
import { db } from '../db/database';
import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';

export const ProjectTracker: React.FC = () => {
  const projectState = useLiveQuery(() => db.projectState.toCollection().first(), []);

  const toggleTask = async (milestoneId: string, taskId: string) => {
    if (!projectState || !projectState.id) return;

    const updatedMilestones = projectState.milestones.map((m) => {
      if (m.id !== milestoneId) return m;
      const updatedTasks = m.tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t));
      const allDone = updatedTasks.every((t) => t.done);
      return {
        ...m,
        tasks: updatedTasks,
        completed: allDone,
      };
    });

    const anyInProgress = updatedMilestones.some((m) => m.tasks.some((t) => t.done));
    const allCompleted = updatedMilestones.every((m) => m.completed);

    let newStatus: typeof projectState.status = 'Not Started';
    if (allCompleted) newStatus = 'Completed';
    else if (anyInProgress) newStatus = 'In Progress';

    await db.projectState.update(projectState.id, {
      milestones: updatedMilestones,
      status: newStatus,
    });
  };

  const totalTasks =
    projectState?.milestones.reduce((acc, m) => acc + m.tasks.length, 0) ?? 0;
  const completedTasks =
    projectState?.milestones.reduce(
      (acc, m) => acc + m.tasks.filter((t) => t.done).length,
      0
    ) ?? 0;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="purple" size="sm">Primary Portfolio Project</Badge>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs text-slate-500 font-medium">Weeks 5 through 14 Focus</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {projectState?.projectName || 'AgroVision-ML Backend'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Upgrading ML prototype to a production-grade FastAPI service with PostgreSQL and Docker
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge
            variant={
              projectState?.status === 'Completed'
                ? 'success'
                : projectState?.status === 'In Progress'
                ? 'warning'
                : 'outline'
            }
            size="md"
          >
            Status: {projectState?.status || 'Not Started'}
          </Badge>
        </div>
      </div>

      {/* Tech Stack & Architecture Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-600" /> Architectural Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {projectState?.architectureSummary}
            </p>

            {/* Architecture Flow Diagram */}
            <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto border border-slate-800">
              <div className="flex items-center justify-between min-w-[500px] text-center gap-2">
                <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700 flex-1">
                  <div className="text-[10px] text-emerald-400 font-bold">CLIENT / FRONTEND</div>
                  <div className="text-[11px] mt-0.5 text-slate-300">HTTP REST + JWT</div>
                </div>
                <span className="text-slate-500">→</span>
                <div className="p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-700/60 flex-1">
                  <div className="text-[10px] text-emerald-300 font-bold">FASTAPI GATEWAY</div>
                  <div className="text-[11px] mt-0.5 text-slate-300">Pydantic v2 Validation</div>
                </div>
                <span className="text-slate-500">→</span>
                <div className="p-2.5 rounded-lg bg-indigo-950/80 border border-indigo-700/60 flex-1">
                  <div className="text-[10px] text-indigo-300 font-bold">SERVICE & ORM</div>
                  <div className="text-[11px] mt-0.5 text-slate-300">SQLAlchemy 2.0 Async</div>
                </div>
                <span className="text-slate-500">→</span>
                <div className="p-2.5 rounded-lg bg-amber-950/80 border border-amber-700/60 flex-1">
                  <div className="text-[10px] text-amber-300 font-bold">POSTGRESQL</div>
                  <div className="text-[11px] mt-0.5 text-slate-300">Alembic Migrations</div>
                </div>
              </div>
            </div>

            {/* Tech Stack Badges */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {projectState?.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quality & Test Health Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Test & Deployment Readiness</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-500">Milestone Tasks Completed:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {completedTasks} / {totalTasks}
                </span>
              </div>
              <ProgressBar value={completedTasks} max={totalTasks || 1} size="sm" />
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Pytest Suite:</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                  {projectState?.testsCount || 0} passing (Target: 10+)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Docker Container:</span>
                <Badge variant="outline" size="sm">Planned (Week 11)</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">CI Pipeline:</span>
                <Badge variant="outline" size="sm">GitHub Actions</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Live Hosting:</span>
                <Badge variant="outline" size="sm">Render / Railway</Badge>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 dark:text-slate-400 italic">
              "Honest engineering rule: In interviews, speak only to what is tested and deployed with real evidence."
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 5 Milestone Checklists */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-600" /> Backend Roadmap Milestones
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projectState?.milestones.map((milestone) => (
            <Card key={milestone.id} className={milestone.completed ? 'border-emerald-500/50' : ''}>
              <CardHeader className="pb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                      {milestone.phaseWeeks}
                    </span>
                    {milestone.completed && <Badge variant="success" size="sm">Completed</Badge>}
                  </div>
                  <CardTitle className="text-sm font-semibold mt-1">{milestone.title}</CardTitle>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {milestone.description}
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  {milestone.tasks.map((task) => (
                    <label
                      key={task.id}
                      className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={task.done}
                        onChange={() => toggleTask(milestone.id, task.id)}
                        className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800"
                      />
                      <span className={task.done ? 'line-through text-slate-400 dark:text-slate-500' : ''}>
                        {task.text}
                      </span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Key Endpoints Spec Table */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Code className="w-4 h-4 text-indigo-500" /> Target REST Endpoints Specification
          </CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-4 w-24">Method</th>
                <th className="py-2.5 px-4">Endpoint Path</th>
                <th className="py-2.5 px-4">Description</th>
                <th className="py-2.5 px-4 w-28">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {projectState?.keyEndpoints.map((ep, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-4">
                    <span
                      className={`font-mono font-bold text-[11px] px-2 py-0.5 rounded ${
                        ep.method === 'GET'
                          ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                          : ep.method === 'POST'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {ep.method}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 font-mono font-medium text-slate-900 dark:text-white">
                    {ep.path}
                  </td>
                  <td className="py-2.5 px-4 text-slate-500">{ep.description}</td>
                  <td className="py-2.5 px-4">
                    <Badge variant={ep.status === 'tested' ? 'success' : 'outline'} size="sm">
                      {ep.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
