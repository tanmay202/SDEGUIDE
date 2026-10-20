import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { db } from '../db/database';
import {
  resetToCleanBaseline,
  toggleRoadmapTask,
  updateRoadmapTaskProgress,
  resetRoadmapTaskProgress,
  getRoadmapTaskProgress,
  getAllRoadmapProgress,
  updateUserSettings,
} from '../db/dbService';
import {
  ROADMAP_CONTENT,
  ROADMAP_METADATA,
  ROADMAP_PHASES,
  ROADMAP_MILESTONES,
  ROADMAP_WEEKS,
  getAllRoadmapTasks,
  getOriginalSourceTasks,
  getGeneratedPlanningTasks,
} from '../data/roadmapData';
import { MASTER_DSA_PROBLEMS } from '../db/seedData';
import {
  calculateRoadmapDay,
  calculateRoadmapWeek,
  calculateRoadmapPhase,
  getDaysRemaining,
} from '../utils/dateUtils';

describe('Roadmap Import & Data Layer Verification (Prompt 4)', () => {
  let sourceMarkdown: string;

  beforeEach(async () => {
    await resetToCleanBaseline();
    const roadmapPath = path.resolve(__dirname, '../../roadmap.md');
    sourceMarkdown = fs.readFileSync(roadmapPath, 'utf-8');
  });

  it('preserves header metadata, candidate details, and target dates from roadmap.md', () => {
    expect(sourceMarkdown).toContain('Tanmay');
    expect(sourceMarkdown).toContain('October 20, 2026');
    expect(sourceMarkdown).toContain('April 20, 2027');
    expect(sourceMarkdown).toContain('₹10+ LPA');
    expect(sourceMarkdown).toContain('120 minutes');

    expect(ROADMAP_METADATA.candidate).toBe('Tanmay');
    expect(ROADMAP_METADATA.startDate).toBe('2026-10-20');
    expect(ROADMAP_METADATA.targetDate).toBe('2027-04-20');
    expect(ROADMAP_METADATA.dailyBudgetMinutes).toBe(120);
    expect(ROADMAP_METADATA.targetCtc).toBe('₹10+ LPA');

    // ROADMAP_CONTENT structure check
    expect(ROADMAP_CONTENT.weeks).toHaveLength(24);
    expect(ROADMAP_CONTENT.phases).toHaveLength(3);
    expect(ROADMAP_CONTENT.milestones).toHaveLength(ROADMAP_MILESTONES.length);
  });

  it('preserves the 3 authoritative phases and their exact week spans', () => {
    expect(ROADMAP_PHASES).toHaveLength(3);

    // Phase 1
    expect(ROADMAP_PHASES[0].phase).toBe(1);
    expect(ROADMAP_PHASES[0].weeksRange).toBe('Weeks 1–6');
    expect(ROADMAP_PHASES[0].startWeek).toBe(1);
    expect(ROADMAP_PHASES[0].endWeek).toBe(6);
    expect(sourceMarkdown).toContain('Phase 1: Foundations (Weeks 1–6)');

    // Phase 2
    expect(ROADMAP_PHASES[1].phase).toBe(2);
    expect(ROADMAP_PHASES[1].weeksRange).toBe('Weeks 7–14');
    expect(ROADMAP_PHASES[1].startWeek).toBe(7);
    expect(ROADMAP_PHASES[1].endWeek).toBe(14);
    expect(sourceMarkdown).toContain('Phase 2: Backend Engineering & Project (Weeks 7–14)');

    // Phase 3
    expect(ROADMAP_PHASES[2].phase).toBe(3);
    expect(ROADMAP_PHASES[2].weeksRange).toBe('Weeks 15–24');
    expect(ROADMAP_PHASES[2].startWeek).toBe(15);
    expect(ROADMAP_PHASES[2].endWeek).toBe(24);
    expect(sourceMarkdown).toContain('Phase 3: Interview Preparation & Job Search (Weeks 15–24)');
  });

  it('represents all 24 individual weeks in structured representation', () => {
    expect(ROADMAP_WEEKS).toHaveLength(24);

    for (let i = 1; i <= 24; i++) {
      const week = ROADMAP_WEEKS[i - 1];
      expect(week.weekNumber).toBe(i);
      expect(week.title).toBeTruthy();
      expect(week.topics.length).toBeGreaterThan(0);
      expect(week.deliverables.length).toBeGreaterThan(0);
      expect(week.checkpointFocus).toBeTruthy();
      expect(week.tasks.length).toBeGreaterThan(0);
    }
  });

  it('faithfully preserves the detailed Days 1–14 daily assignments from source table', () => {
    // Days 1-7 in Week 1, Days 8-14 in Week 2
    const week1 = ROADMAP_WEEKS[0];
    const week2 = ROADMAP_WEEKS[1];

    for (let day = 1; day <= 7; day++) {
      const dayTasks = week1.tasks.filter((t) => t.dayNumber === day);
      expect(dayTasks.length).toBe(4); // DSA, Technical, Interview, Log blocks
      for (const t of dayTasks) {
        expect(t.source).toBe('original');
        expect(t.isGeneratedPlanning).toBe(false);
      }
    }

    for (let day = 8; day <= 14; day++) {
      const dayTasks = week2.tasks.filter((t) => t.dayNumber === day);
      expect(dayTasks.length).toBe(4); // DSA, Technical, Interview, Log blocks
      for (const t of dayTasks) {
        expect(t.source).toBe('original');
        expect(t.isGeneratedPlanning).toBe(false);
      }
    }

    // Verify specific day contents match source markdown
    // Day 1
    const day1Dsa = week1.tasks.find((t) => t.dayNumber === 1 && t.category === 'dsa');
    expect(day1Dsa?.title).toContain('Big-O quiz + 1 easy array problem');

    // Day 3
    const day3Dsa = week1.tasks.find((t) => t.dayNumber === 3 && t.category === 'dsa');
    expect(day3Dsa?.title).toContain('Two Sum (LC #1)');

    // Day 8
    const day8Dsa = week2.tasks.find((t) => t.dayNumber === 8 && t.category === 'dsa');
    expect(day8Dsa?.title).toContain('Group Anagrams (LC #49)');

    // Day 12
    const day12Tech = week2.tasks.find((t) => t.dayNumber === 12 && t.category === 'technical');
    expect(day12Tech?.title).toContain('pytest');

    // Day 13
    const day13Sql = week2.tasks.find((t) => t.dayNumber === 13 && t.category === 'sql');
    expect(day13Sql?.title).toContain('SELECT, WHERE, ORDER BY');
  });

  it('marks later day-by-day distribution as editable generated planning, and preserves original source tasks', () => {
    const originalTasks = getOriginalSourceTasks();
    const generatedTasks = getGeneratedPlanningTasks();

    expect(originalTasks.length).toBeGreaterThan(0);
    expect(generatedTasks.length).toBeGreaterThan(0);

    // Days 1-14 must NOT be generated planning
    for (let d = 1; d <= 14; d++) {
      const tasks = originalTasks.filter((t) => t.dayNumber === d);
      expect(tasks.length).toBe(4);
      for (const t of tasks) {
        expect(t.isGeneratedPlanning).toBe(false);
        expect(t.source).toBe('original');
      }
    }

    // Weeks 3 to 24 proposed daily distributions must be marked as generated planning
    for (const task of generatedTasks) {
      expect(task.isGeneratedPlanning).toBe(true);
      expect(task.source).toBe('generated');
    }
  });

  it('preserves the complete list of 67 Master DSA Problems and 75–100 target range', () => {
    expect(MASTER_DSA_PROBLEMS).toHaveLength(67);
    expect(ROADMAP_METADATA.targetDsaCountRange).toBe('75–100');

    // Verify source contains Master Problem List section
    expect(sourceMarkdown).toContain('## 5. DSA PROBLEM TRACKER');
    expect(sourceMarkdown).toContain('Master Problem List');
    expect(sourceMarkdown).toContain('Total Target: ~75-100 problems');

    // Check specific problems across key patterns
    const twoSum = MASTER_DSA_PROBLEMS.find((p) => p.leetcodeNumber === 1);
    expect(twoSum).toBeDefined();
    expect(twoSum?.title).toBe('Two Sum');
    expect(twoSum?.pattern).toBe('Arrays & Hashing');
    expect(twoSum?.difficulty).toBe('Easy');

    const longestSubstring = MASTER_DSA_PROBLEMS.find((p) => p.leetcodeNumber === 3);
    expect(longestSubstring).toBeDefined();
    expect(longestSubstring?.pattern).toBe('Sliding Window');
    expect(longestSubstring?.difficulty).toBe('Medium');

    const invertTree = MASTER_DSA_PROBLEMS.find((p) => p.leetcodeNumber === 226);
    expect(invertTree).toBeDefined();
    expect(invertTree?.pattern).toBe('Trees');

    const numIslands = MASTER_DSA_PROBLEMS.find((p) => p.leetcodeNumber === 200);
    expect(numIslands).toBeDefined();
    expect(numIslands?.pattern).toBe('Graphs');

    const nQueens = MASTER_DSA_PROBLEMS.find((p) => p.leetcodeNumber === 51);
    expect(nQueens).toBeDefined();
    expect(nQueens?.pattern).toBe('Backtracking');
    expect(nQueens?.difficulty).toBe('Hard');

    const coinChance = MASTER_DSA_PROBLEMS.find((p) => p.leetcodeNumber === 322);
    expect(coinChance).toBeDefined();
    expect(coinChance?.pattern).toBe('Dynamic Programming');
  });

  it('preserves milestones across Python, SQL, FastAPI, PostgreSQL, testing, deployment, CS fundamentals, job-search, and interview', () => {
    const categories = new Set(ROADMAP_MILESTONES.map((m) => m.category));

    expect(categories.has('python')).toBe(true);
    expect(categories.has('sql')).toBe(true);
    expect(categories.has('fastapi')).toBe(true);
    expect(categories.has('postgresql')).toBe(true);
    expect(categories.has('testing')).toBe(true);
    expect(categories.has('deployment')).toBe(true);
    expect(categories.has('cs_fundamentals')).toBe(true);
    expect(categories.has('job_search')).toBe(true);
    expect(categories.has('interview')).toBe(true);

    expect(ROADMAP_MILESTONES.length).toBeGreaterThanOrEqual(12);
  });

  it('keeps roadmap content separate from progress records in IndexedDB', async () => {
    // Clean baseline: 0 progress records
    const initialRecords = await getAllRoadmapProgress();
    expect(initialRecords).toHaveLength(0);

    // Initial check: roadmap static tasks exist
    const allTasks = getAllRoadmapTasks();
    const taskToToggle = allTasks[0];
    expect(taskToToggle).toBeDefined();

    // Mark task complete
    await toggleRoadmapTask(taskToToggle.id, true, 'Solved cleanly in 20 min');

    // Progress record in IndexedDB should now exist
    const progress = await getRoadmapTaskProgress(taskToToggle.id);
    expect(progress).toBeDefined();
    expect(progress?.completed).toBe(true);
    expect(progress?.completedAt).toBeDefined();
    expect(progress?.notes).toBe('Solved cleanly in 20 min');

    // The static roadmap definition itself remains unchanged
    expect(taskToToggle.source).toBe('original');
    expect('completed' in taskToToggle).toBe(false);

    // Reopen task
    await toggleRoadmapTask(taskToToggle.id, false);
    const reopenedProgress = await getRoadmapTaskProgress(taskToToggle.id);
    expect(reopenedProgress?.completed).toBe(false);
    expect(reopenedProgress?.completedAt).toBeUndefined();
  });

  it('does not mark tasks as completed automatically on clean baseline', async () => {
    const progressCount = await db.roadmapProgress.count();
    expect(progressCount).toBe(0);

    // All tasks evaluate to incomplete when no progress record exists
    const progressRecords = await db.roadmapProgress.toArray();
    const progressMap = new Map(progressRecords.map((r) => [r.taskId, r]));

    const allTasks = getAllRoadmapTasks();
    const completedCount = allTasks.filter((t) => progressMap.get(t.id)?.completed === true).length;

    expect(completedCount).toBe(0);
  });

  it('records the date discrepancy identified in Prompt 1 for resolution in Settings', async () => {
    const discrepancy = ROADMAP_METADATA.dateDiscrepancy;
    expect(discrepancy).toBeDefined();
    expect(discrepancy.curriculumWeeks).toBe(24);
    expect(discrepancy.curriculumDays).toBe(168);
    expect(discrepancy.curriculumEndDate).toBe('2027-04-06');
    expect(discrepancy.targetDate).toBe('2027-04-20');
    expect(discrepancy.bufferDays).toBe(14);
    expect(discrepancy.explanation).toContain('14-day');

    // Update settings to resolve discrepancy
    await updateUserSettings({
      startDate: '2026-10-20',
      targetDate: '2027-04-20',
      dateDiscrepancyResolution: 'buffer_14_days',
      dateDiscrepancyNotes: 'Preserved 24-week curriculum with 14-day interview buffer.',
    });

    const settings = await db.settings.toCollection().first();
    expect(settings?.dateDiscrepancyResolution).toBe('buffer_14_days');
    expect(settings?.startDate).toBe('2026-10-20');
    expect(settings?.targetDate).toBe('2027-04-20');
  });

  it('allows start date and target date to be configurable', () => {
    // Default start date (2026-10-20)
    expect(calculateRoadmapDay('2026-10-20', '2026-10-20')).toBe(1);
    expect(calculateRoadmapDay('2026-10-21', '2026-10-20')).toBe(2);

    // Custom configured start date (e.g. 2026-11-01)
    expect(calculateRoadmapDay('2026-11-01', '2026-11-01')).toBe(1);
    expect(calculateRoadmapDay('2026-11-08', '2026-11-01')).toBe(8);
    expect(calculateRoadmapWeek(8)).toBe(2);
    expect(calculateRoadmapPhase(2)).toBe(1);

    // Configurable target date
    const remainingToDefault = getDaysRemaining('2026-10-20', '2027-04-20');
    const remainingToExact24Weeks = getDaysRemaining('2026-10-20', '2027-04-06');
    expect(remainingToDefault).toBe(182);
    expect(remainingToExact24Weeks).toBe(168);
    expect(remainingToDefault - remainingToExact24Weeks).toBe(14); // 14-day discrepancy buffer
  });

  it('faithfully preserves review schedule including spaced repetition intervals and weekly checkpoints', () => {
    // Check roadmap.md mentions Spaced Repetition queue
    expect(sourceMarkdown).toContain('### Revision Queue (Spaced Repetition)');
    expect(sourceMarkdown).toContain('Review 1 (Day+1)');
    expect(sourceMarkdown).toContain('Review 2 (Day+3)');
    expect(sourceMarkdown).toContain('Review 3 (Day+7)');
    expect(sourceMarkdown).toContain('Review 4 (Day+14)');
    expect(sourceMarkdown).toContain('WEEKLY CHECKPOINT');

    // Structured review schedule in metadata
    const rs = ROADMAP_METADATA.reviewSchedule;
    expect(rs).toBeDefined();
    expect(rs.spacedRepetitionIntervals).toHaveLength(4);
    expect(rs.spacedRepetitionIntervals[0].offsetDays).toBe(1);
    expect(rs.spacedRepetitionIntervals[1].offsetDays).toBe(3);
    expect(rs.spacedRepetitionIntervals[2].offsetDays).toBe(7);
    expect(rs.spacedRepetitionIntervals[3].offsetDays).toBe(14);
    expect(rs.weeklyCheckpointInterval).toBe(7);
    expect(ROADMAP_CONTENT.reviewSchedule).toBe(rs);
  });

  it('enables tracking of deliverables in IndexedDB without modifying static roadmap content', async () => {
    const week1 = ROADMAP_WEEKS[0];
    expect(week1.deliverables.length).toBeGreaterThan(0);

    const delivId = `w1-deliv-0`;
    // Initial: not completed
    const initial = await getRoadmapTaskProgress(delivId);
    expect(initial).toBeUndefined();

    // Mark deliverable as achieved
    await toggleRoadmapTask(delivId, true);
    const completedProgress = await getRoadmapTaskProgress(delivId);
    expect(completedProgress?.completed).toBe(true);
    expect(completedProgress?.completedAt).toBeDefined();

    // Reopen deliverable
    await toggleRoadmapTask(delivId, false);
    const reopenedProgress = await getRoadmapTaskProgress(delivId);
    expect(reopenedProgress?.completed).toBe(false);
    expect(reopenedProgress?.completedAt).toBeUndefined();

    // Static week deliverables remain immutable strings
    expect(typeof week1.deliverables[0]).toBe('string');
  });

  it('supports editable generated planning with custom title and description, and allows resetting to default plan', async () => {
    const generatedTasks = getGeneratedPlanningTasks();
    expect(generatedTasks.length).toBeGreaterThan(0);

    const plannedTask = generatedTasks[0];
    expect(plannedTask.isGeneratedPlanning).toBe(true);
    expect(plannedTask.source).toBe('generated');

    // User edits the planned distribution title & description
    await updateRoadmapTaskProgress(plannedTask.id, {
      completed: false,
      customTitle: 'Day 15 Custom: Accelerated Two Pointers practice',
      customDescription: 'Swapped problem order to focus on 3Sum edge cases first.',
      notes: 'Reviewed editorial ahead of time.',
    });

    const edited = await getRoadmapTaskProgress(plannedTask.id);
    expect(edited?.customTitle).toBe('Day 15 Custom: Accelerated Two Pointers practice');
    expect(edited?.customDescription).toBe('Swapped problem order to focus on 3Sum edge cases first.');
    expect(edited?.notes).toBe('Reviewed editorial ahead of time.');

    // The original static definition remains unchanged
    expect(plannedTask.title).not.toBe('Day 15 Custom: Accelerated Two Pointers practice');

    // Reset back to clean baseline for this task
    await resetRoadmapTaskProgress(plannedTask.id);
    const afterReset = await getRoadmapTaskProgress(plannedTask.id);
    expect(afterReset).toBeUndefined();
  });

  it('correctly identifies upcoming milestones relative to candidate current week', () => {
    // At Week 1: all 17 milestones are upcoming (targetWeek >= 1)
    const atWeek1 = ROADMAP_MILESTONES.filter((m) => m.targetWeek >= 1);
    expect(atWeek1).toHaveLength(ROADMAP_MILESTONES.length);

    // At Week 10: only milestones targeting Week 10+ are upcoming
    const atWeek10 = ROADMAP_MILESTONES.filter((m) => m.targetWeek >= 10);
    const pastWeek10 = ROADMAP_MILESTONES.filter((m) => m.targetWeek < 10);
    expect(atWeek10.length).toBeGreaterThan(0);
    expect(pastWeek10.length).toBeGreaterThan(0);
    expect(atWeek10.length + pastWeek10.length).toBe(ROADMAP_MILESTONES.length);

    // Week 10 milestone ms-fastapi-3 is upcoming/current at Week 10
    const week10Ms = atWeek10.find((m) => m.id === 'ms-fastapi-3');
    expect(week10Ms).toBeDefined();
    expect(week10Ms?.targetWeek).toBe(10);
  });

  it('initializes clean baseline with date discrepancy recorded in settings', async () => {
    await resetToCleanBaseline();
    const settings = await db.settings.toCollection().first();
    expect(settings).toBeDefined();
    expect(settings?.dateDiscrepancyResolution).toBe('buffer_14_days');
    expect(settings?.dateDiscrepancyNotes).toContain('buffer');
  });
});

