import { db } from './database';
import {
  MASTER_DSA_PROBLEMS,
  INITIAL_SKILLS,
  DAY1_PLAN,
  INITIAL_PROJECT_STATE,
  INITIAL_CHECKPOINTS,
  INITIAL_USER_SETTINGS,
  SAMPLE_DEV_JOB_APPLICATIONS,
} from './seedData';
import {
  addDaysKolkata,
  getKolkataDateString,
  calculateRoadmapWeek,
  calculateRoadmapPhase,
  ROADMAP_START_DATE,
  TOTAL_DAYS,
} from '../utils/dateUtils';
import type { DailyPlan, DsaStatus, RevisionItem, RoadmapTaskProgress, UserSettings } from '../types';

export async function initializeDatabase(): Promise<void> {
  const settingsCount = await db.settings.count();
  if (settingsCount === 0) {
    await resetToCleanBaseline();
  }
}

/**
 * Resets database to pristine Day 1 state as documented in roadmap.md
 * Real progress baseline with 0 fake statistics.
 */
export async function resetToCleanBaseline(): Promise<void> {
  await db.transaction(
    'rw',
    [
      db.dsaProblems,
      db.dailyPlans,
      db.revisionQueue,
      db.skills,
      db.projectState,
      db.jobApplications,
      db.checkpoints,
      db.mockInterviews,
      db.settings,
      db.roadmapProgress,
    ],
    async () => {
      await db.dsaProblems.clear();
      await db.dailyPlans.clear();
      await db.revisionQueue.clear();
      await db.skills.clear();
      await db.projectState.clear();
      await db.jobApplications.clear();
      await db.checkpoints.clear();
      await db.mockInterviews.clear();
      await db.settings.clear();
      await db.roadmapProgress.clear();

      await db.dsaProblems.bulkAdd(MASTER_DSA_PROBLEMS);
      await db.dailyPlans.add(DAY1_PLAN);
      await db.skills.bulkAdd(INITIAL_SKILLS);
      await db.projectState.add(INITIAL_PROJECT_STATE);
      await db.checkpoints.bulkAdd(INITIAL_CHECKPOINTS);
      await db.settings.add({ ...INITIAL_USER_SETTINGS, isSampleDataMode: false });
    }
  );
}

/**
 * Populates realistic sample development data so the user can inspect how charts,
 * revision queues, job applications, and skill ratings render when populated.
 */
export async function loadSampleDevelopmentData(): Promise<void> {
  const today = getKolkataDateString();

  await db.transaction(
    'rw',
    [
      db.dsaProblems,
      db.dailyPlans,
      db.revisionQueue,
      db.skills,
      db.projectState,
      db.jobApplications,
      db.mockInterviews,
      db.settings,
      db.roadmapProgress,
    ],
    async () => {
      // Mark a few problems as solved/mastered for preview
      await db.dsaProblems.update(1, {
        status: 'mastered',
        lastSolvedDate: today,
        nextReviewDate: undefined,
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        notes: 'One-pass hash map storing complement index.',
      });
      await db.dsaProblems.update(2, {
        status: 'solved',
        lastSolvedDate: today,
        nextReviewDate: addDaysKolkata(today, 1),
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        notes: 'Set lookup pattern.',
      });
      await db.dsaProblems.update(9, {
        status: 'solved',
        lastSolvedDate: today,
        nextReviewDate: addDaysKolkata(today, 1),
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        notes: 'Two pointers inwards ignoring non-alphanumeric.',
      });

      // Sample revision items
      await db.revisionQueue.clear();
      const sampleRevision: RevisionItem[] = [
        {
          problemId: 2,
          problemTitle: 'Contains Duplicate',
          pattern: 'Arrays & Hashing',
          difficulty: 'Easy',
          solvedDate: today,
          reviewStage: 1,
          nextReviewDate: addDaysKolkata(today, 1),
          status: 'pending',
          notes: 'Review set vs sorting trade-offs.',
        },
        {
          problemId: 9,
          problemTitle: 'Valid Palindrome',
          pattern: 'Two Pointers',
          difficulty: 'Easy',
          solvedDate: today,
          reviewStage: 1,
          nextReviewDate: addDaysKolkata(today, 1),
          status: 'pending',
          notes: 'Explain while l < r and isalnum check.',
        },
      ];
      await db.revisionQueue.bulkAdd(sampleRevision);

      // Sample skills update
      await db.skills.update('python_fundamentals', {
        score: 3,
        status: 'Developing',
        evidence: '[Sample Preview] Completed Day 1 diagnostic, solid on mutability, decorators need review.',
      });
      await db.skills.update('dsa_problem_solving', {
        score: 2,
        status: 'Novice',
        evidence: '[Sample Preview] Can verbalize Two Sum approach, working on sliding window.',
      });

      // Sample job applications
      await db.jobApplications.clear();
      await db.jobApplications.bulkAdd(SAMPLE_DEV_JOB_APPLICATIONS);

      // Sample mock interview
      await db.mockInterviews.clear();
      await db.mockInterviews.add({
        date: today,
        type: 'Coding (45m)',
        interviewerOrPlatform: 'Self-Diagnostic Aloud',
        score: 7,
        strengths: 'Clearly articulated hash table lookup time vs brute-force nested loops.',
        weaknesses: 'Stumbled on edge cases (empty array, negative numbers) before prompt reminder.',
        actionPlan: 'Write down constraint bounds before writing any code.',
        problemsCovered: 'Two Sum (LC #1)',
      });

      // Sample roadmap progress: Day 1 first 2 tasks completed
      await db.roadmapProgress.clear();
      await db.roadmapProgress.bulkAdd([
        {
          taskId: 'w1-d1-dsa-1',
          completed: true,
          completedAt: today,
          notes: 'Completed Big-O diagnostic snippets (all 5 correct).',
        },
        {
          taskId: 'w1-d1-technical-2',
          completed: true,
          completedAt: today,
          notes: 'Completed exercises 1-4 in day1_diagnostic.py.',
        },
      ]);

      // Update settings
      const currentSetting = await db.settings.toCollection().first();
      if (currentSetting && currentSetting.id) {
        await db.settings.update(currentSetting.id, { isSampleDataMode: true });
      }
    }
  );
}

/**
 * Updates a DSA problem status and automatically manages the Spaced Repetition queue
 */
export async function updateDsaProblemStatus(
  problemId: number,
  newStatus: DsaStatus,
  notes?: string
): Promise<void> {
  const today = getKolkataDateString();

  await db.transaction('rw', [db.dsaProblems, db.revisionQueue], async () => {
    const problem = await db.dsaProblems.get(problemId);
    if (!problem) return;

    const existing = await db.revisionQueue.where('problemId').equals(problemId).first();

    if (newStatus === 'unsolved') {
      await db.dsaProblems.update(problemId, {
        status: 'unsolved',
        nextReviewDate: undefined,
        ...(notes !== undefined ? { notes } : {}),
      });
      if (existing && existing.id) {
        await db.revisionQueue.update(existing.id, { status: 'completed' });
      }
      return;
    }

    if (newStatus === 'mastered') {
      await db.dsaProblems.update(problemId, {
        status: 'mastered',
        lastSolvedDate: today,
        nextReviewDate: undefined,
        ...(notes !== undefined ? { notes } : {}),
      });
      if (existing && existing.id) {
        await db.revisionQueue.update(existing.id, { status: 'completed' });
      }
      return;
    }

    // newStatus is 'solved' or 'revision'
    let targetReviewDate: string;

    if (existing && existing.status !== 'completed') {
      // PRESERVE the existing review stage and scheduled date
      targetReviewDate = existing.nextReviewDate;
      if (existing.id) {
        await db.revisionQueue.update(existing.id, {
          status: 'pending',
          ...(notes !== undefined ? { notes } : {}),
        });
      }
    } else {
      // First time solved or re-solving
      targetReviewDate = addDaysKolkata(today, 1);
      if (existing && existing.id) {
        await db.revisionQueue.update(existing.id, {
          status: 'pending',
          reviewStage: 1,
          nextReviewDate: targetReviewDate,
          solvedDate: today,
          ...(notes !== undefined ? { notes } : {}),
        });
      } else {
        await db.revisionQueue.add({
          problemId: problem.id,
          problemTitle: problem.title,
          pattern: problem.pattern,
          difficulty: problem.difficulty,
          solvedDate: today,
          reviewStage: 1,
          nextReviewDate: targetReviewDate,
          status: 'pending',
          notes: notes || 'Scheduled for Day+1 review.',
        });
      }
    }

    await db.dsaProblems.update(problemId, {
      status: newStatus,
      lastSolvedDate: today,
      nextReviewDate: targetReviewDate,
      ...(notes !== undefined ? { notes } : {}),
    });
  });
}

/**
 * Advance spaced repetition review stage:
 * Stage 1 (Day+1) -> Stage 2 (Day+3) -> Stage 3 (Day+7) -> Stage 4 (Day+14) -> Mastered
 */
export async function advanceRevisionItem(itemId: number): Promise<void> {
  const today = getKolkataDateString();

  await db.transaction('rw', [db.dsaProblems, db.revisionQueue], async () => {
    const item = await db.revisionQueue.get(itemId);
    if (!item) return;

    let nextStage: 1 | 2 | 3 | 4 = 1;
    let nextDate: string | undefined;

    if (item.reviewStage === 1) {
      nextStage = 2;
      nextDate = addDaysKolkata(today, 3);
      await db.revisionQueue.update(itemId, {
        reviewStage: nextStage,
        nextReviewDate: nextDate,
        status: 'pending',
      });
      await db.dsaProblems.update(item.problemId, {
        nextReviewDate: nextDate,
        status: 'revision',
      });
    } else if (item.reviewStage === 2) {
      nextStage = 3;
      nextDate = addDaysKolkata(today, 7);
      await db.revisionQueue.update(itemId, {
        reviewStage: nextStage,
        nextReviewDate: nextDate,
        status: 'pending',
      });
      await db.dsaProblems.update(item.problemId, {
        nextReviewDate: nextDate,
        status: 'revision',
      });
    } else if (item.reviewStage === 3) {
      nextStage = 4;
      nextDate = addDaysKolkata(today, 14);
      await db.revisionQueue.update(itemId, {
        reviewStage: nextStage,
        nextReviewDate: nextDate,
        status: 'pending',
      });
      await db.dsaProblems.update(item.problemId, {
        nextReviewDate: nextDate,
        status: 'revision',
      });
    } else {
      // Stage 4 completed -> Mastered
      await db.revisionQueue.update(itemId, { status: 'completed' });
      await db.dsaProblems.update(item.problemId, {
        status: 'mastered',
        nextReviewDate: undefined,
      });
    }
  });
}

/**
 * Curated daily schedule from roadmap.md (Section 2.1)
 */
const ROADMAP_DAILY_SCHEDULE: Record<
  number,
  { targetFocus: string; dsaDesc: string; techDesc: string; intDesc: string; logDesc: string }
> = {
  1: {
    targetFocus: 'Establish baseline diagnostic: Python fluency, Big-O analysis, and Git workflow',
    dsaDesc: 'Baseline diagnostic: Big-O quiz (5 snippets) + Two Sum (LC #1)',
    techDesc: 'Python diagnostic: 7 exercises in day1_diagnostic.py',
    intDesc: 'Practice 60-second self-introduction aloud & write list vs tuple explanation',
    logDesc: 'Record today’s diagnostic findings, struggles, and learnings in progress_log.md',
  },
  2: {
    targetFocus: 'Big-O analysis practice and Python data structures & mutability',
    dsaDesc: 'Big-O analysis practice (5 snippets) — time & space trade-offs',
    techDesc: 'Python lists, dicts, sets, tuples — operations, mutability & references',
    intDesc: 'Explain Big-O complexity to an imaginary interviewer aloud',
    logDesc: 'Document identified weak spots and review Day 1 takeaways',
  },
  3: {
    targetFocus: 'Arrays & Two Sum optimal hash table pattern',
    dsaDesc: 'Arrays: Two Sum (LC #1) optimal O(N) hash map solution',
    techDesc: 'Python string operations, slicing, common string methods',
    intDesc: 'Verbalize Two Sum approach and edge case handling aloud',
    logDesc: 'Log array and hash map complementary lookup pattern',
  },
  4: {
    targetFocus: 'Sliding window / one-pass min-tracking and Python generators',
    dsaDesc: 'Arrays: Best Time to Buy/Sell Stock (LC #121)',
    techDesc: 'Python comprehensions, iterators, and memory-efficient generators',
    intDesc: 'Explain generator vs list comprehension memory models',
    logDesc: 'Log generator performance trade-offs',
  },
  5: {
    targetFocus: 'Arrays: Contains Duplicate & Day 3 revision + Exception handling',
    dsaDesc: 'Arrays: Contains Duplicate (LC #217) + Spaced Revision of Two Sum',
    techDesc: 'Python exception handling, file I/O, and JSON reading/writing',
    intDesc: 'What are ACID database properties? First conceptual exposure',
    logDesc: 'Log error handling best practices',
  },
  6: {
    targetFocus: 'Hash Maps: Valid Anagram and Python modular architecture',
    dsaDesc: 'Hash Maps: Valid Anagram (LC #242) frequency map comparisons',
    techDesc: 'Python modules, packages, imports, and virtual environment hygiene',
    intDesc: 'Explain hash map time complexity, collision resolution aloud',
    logDesc: 'Log module packaging notes and prepare for Week 1 checkpoint',
  },
  7: {
    targetFocus: 'Week 1 Checkpoint: Foundations diagnostic test & Git branching',
    dsaDesc: 'Week 1 Checkpoint: Self-test on Days 1-6 problem patterns',
    techDesc: 'Git workflow: branching, conventional commits, PRs, .gitignore',
    intDesc: 'Review Week 1 progress and plan Week 2 commitments',
    logDesc: 'Complete Week 1 checkpoint scorecard & identify primary bottleneck',
  },
  8: {
    targetFocus: 'Hash Maps: Group Anagrams and Python OOP foundations',
    dsaDesc: 'Hash Maps: Group Anagrams (LC #49) sorted tuple key pattern',
    techDesc: 'Python OOP: classes, __init__, inheritance, encapsulation',
    intDesc: 'Explain class variables vs instance variables aloud with examples',
    logDesc: 'Log anagram categorization pattern and OOP design notes',
  },
  9: {
    targetFocus: 'Hash Maps: Top K Frequent Elements and Python dunder methods',
    dsaDesc: 'Hash Maps: Top K Frequent Elements (LC #347) frequency map + bucket sort',
    techDesc: 'Python OOP: composition, polymorphism, dunder methods (__repr__, __str__)',
    intDesc: 'Explain polymorphism with a real-world software example',
    logDesc: 'Log Top K algorithms complexity comparison',
  },
  10: {
    targetFocus: 'Spaced repetition re-solve and Python decorators & context managers',
    dsaDesc: 'Revision: re-solve Two Sum and Buy/Sell Stock from scratch in < 15 mins',
    techDesc: 'Python decorators and context managers (with statement, contextlib)',
    intDesc: 'What is a decorator? Explain decorator closure mechanics to an interviewer',
    logDesc: 'Log decorator execution lifecycle and revision speed metrics',
  },
  11: {
    targetFocus: 'Two Pointers: Valid Palindrome and Python type hints',
    dsaDesc: 'Two Pointers: Valid Palindrome (LC #125) inward scan ignoring non-alphanumeric',
    techDesc: 'Python type hints, typing module, debugging techniques, common pitfalls',
    intDesc: 'Explain mutable default argument pitfall (def func(arr=[])) in Python',
    logDesc: 'Log Two Pointers boundary termination criteria',
  },
  12: {
    targetFocus: 'Sliding Window: Longest Substring and pytest unit testing',
    dsaDesc: 'Sliding Window: Longest Substring Without Repeating Characters (LC #3) attempt',
    techDesc: 'Python unit testing with pytest: write 5 test functions with assertions',
    intDesc: 'What is a pytest fixture and when should you use one?',
    logDesc: 'Log dynamic sliding window window-expansion vs contraction criteria',
  },
  13: {
    targetFocus: 'Finish LC #3 sliding window & SQL foundational queries',
    dsaDesc: 'Complete Longest Substring Without Repeating (LC #3) optimal solution & complexity',
    techDesc: 'SQL: SELECT, WHERE, ORDER BY — 5 practice queries on sample schema',
    intDesc: 'What does ORDER BY do with NULL values in PostgreSQL and MySQL?',
    logDesc: 'Log SQL execution order: FROM -> WHERE -> SELECT -> ORDER BY',
  },
  14: {
    targetFocus: 'Week 2 Checkpoint: Test Weeks 1-2 foundations & gap analysis',
    dsaDesc: 'Week 2 Checkpoint: Test pattern recognition under 30-min timer',
    techDesc: 'Baseline gap analysis document: write honest assessment of strengths/weaknesses',
    intDesc: 'Deliver full 2-minute elevator pitch and technical background summary',
    logDesc: 'Complete Week 2 checkpoint scorecard and set Phase 1 goals',
  },
};

/**
 * Returns existing plan or dynamically initializes a standard 4-block DailyPlan
 * for the requested day based on roadmap.md.
 */
export async function getOrCreateDailyPlan(dayNumber: number, dateStr?: string): Promise<DailyPlan> {
  const safeDayNumber = Math.max(1, Math.min(dayNumber, TOTAL_DAYS));
  const existing = await db.dailyPlans.where('dayNumber').equals(safeDayNumber).first();
  if (existing) {
    return existing;
  }

  const computedDate = dateStr || addDaysKolkata(ROADMAP_START_DATE, safeDayNumber - 1);
  const weekNumber = calculateRoadmapWeek(safeDayNumber);
  const phaseNumber = calculateRoadmapPhase(weekNumber);

  const curated = ROADMAP_DAILY_SCHEDULE[safeDayNumber];

  const targetFocus = curated
    ? curated.targetFocus
    : `Week ${weekNumber} Phase ${phaseNumber} Preparation Focus: Systematic 4-block execution`;

  const dsaDesc = curated
    ? curated.dsaDesc
    : `Solve NeetCode Blind 75 pattern problem scheduled for Week ${weekNumber}`;
  const techDesc = curated
    ? curated.techDesc
    : `Engineering focus: Backend architecture, PostgreSQL, Docker, or CS theory`;
  const intDesc = curated
    ? curated.intDesc
    : `Verbalize solution aloud & practice interview communication (10m)`;
  const logDesc = curated
    ? curated.logDesc
    : `Document day ${safeDayNumber} struggles, learnings, and checkpoint progress`;

  const newPlan: DailyPlan = {
    date: computedDate,
    dayNumber: safeDayNumber,
    weekNumber,
    phaseNumber,
    targetFocus,
    status: 'planned',
    blocks: [
      {
        id: 'dsa',
        name: 'Block 1 — DSA & Problem-Solving',
        durationMinutes: 40,
        description: dsaDesc,
        completed: false,
        subtasks: [
          {
            id: `dsa-${safeDayNumber}-1`,
            text: 'Analyze problem constraints & verbalize Big-O before coding',
            done: false,
          },
          {
            id: `dsa-${safeDayNumber}-2`,
            text: 'Implement optimal solution & verify edge cases',
            done: false,
          },
        ],
      },
      {
        id: 'technical',
        name: 'Block 2 — Technical & Backend',
        durationMinutes: 60,
        description: techDesc,
        completed: false,
        subtasks: [
          {
            id: `tech-${safeDayNumber}-1`,
            text: 'Review core concepts and write code verification',
            done: false,
          },
          {
            id: `tech-${safeDayNumber}-2`,
            text: 'Commit code changes with clean conventional commit message',
            done: false,
          },
        ],
      },
      {
        id: 'interview',
        name: 'Block 3 — Interview Readiness',
        durationMinutes: 10,
        description: intDesc,
        completed: false,
        subtasks: [
          {
            id: `int-${safeDayNumber}-1`,
            text: 'Deliver structured explanation out loud under timer',
            done: false,
          },
        ],
      },
      {
        id: 'log',
        name: 'Block 4 — Progress Log',
        durationMinutes: 10,
        description: logDesc,
        completed: false,
        subtasks: [
          {
            id: `log-${safeDayNumber}-1`,
            text: 'Log 2 struggles and 2 key learnings in daily reflection',
            done: false,
          },
        ],
      },
    ],
    reflections: '',
    struggledWith: '',
    keyLearnings: '',
  };

  const id = await db.dailyPlans.add(newPlan);
  return { ...newPlan, id };
}

/**
 * Export all data as a backup JSON string
 */
export async function exportDatabaseBackup(): Promise<string> {
  const exportData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    dsaProblems: await db.dsaProblems.toArray(),
    dailyPlans: await db.dailyPlans.toArray(),
    revisionQueue: await db.revisionQueue.toArray(),
    skills: await db.skills.toArray(),
    projectState: await db.projectState.toArray(),
    jobApplications: await db.jobApplications.toArray(),
    checkpoints: await db.checkpoints.toArray(),
    mockInterviews: await db.mockInterviews.toArray(),
    settings: await db.settings.toArray(),
    roadmapProgress: await db.roadmapProgress.toArray(),
  };
  return JSON.stringify(exportData, null, 2);
}

/**
 * Import and replace database from backup JSON
 */
export async function importDatabaseBackup(jsonString: string): Promise<boolean> {
  try {
    const data = JSON.parse(jsonString);
    if (!data.dsaProblems || !data.settings) {
      throw new Error('Invalid backup schema');
    }

    await db.transaction(
      'rw',
      [
        db.dsaProblems,
        db.dailyPlans,
        db.revisionQueue,
        db.skills,
        db.projectState,
        db.jobApplications,
        db.checkpoints,
        db.mockInterviews,
        db.settings,
        db.roadmapProgress,
      ],
      async () => {
        await db.dsaProblems.clear();
        await db.dailyPlans.clear();
        await db.revisionQueue.clear();
        await db.skills.clear();
        await db.projectState.clear();
        await db.jobApplications.clear();
        await db.checkpoints.clear();
        await db.mockInterviews.clear();
        await db.settings.clear();
        await db.roadmapProgress.clear();

        if (data.dsaProblems?.length) await db.dsaProblems.bulkAdd(data.dsaProblems);
        if (data.dailyPlans?.length) await db.dailyPlans.bulkAdd(data.dailyPlans);
        if (data.revisionQueue?.length) await db.revisionQueue.bulkAdd(data.revisionQueue);
        if (data.skills?.length) await db.skills.bulkAdd(data.skills);
        if (data.projectState?.length) await db.projectState.bulkAdd(data.projectState);
        if (data.jobApplications?.length) await db.jobApplications.bulkAdd(data.jobApplications);
        if (data.checkpoints?.length) await db.checkpoints.bulkAdd(data.checkpoints);
        if (data.mockInterviews?.length) await db.mockInterviews.bulkAdd(data.mockInterviews);
        if (data.settings?.length) await db.settings.bulkAdd(data.settings);
        if (data.roadmapProgress?.length) await db.roadmapProgress.bulkAdd(data.roadmapProgress);
      }
    );
    return true;
  } catch (err) {
    console.error('Import failed:', err);
    return false;
  }
}

/**
 * Marks a roadmap task complete or reopens it in the separate progress store.
 * The roadmap source content itself is never mutated.
 */
export async function toggleRoadmapTask(
  taskId: string,
  completed: boolean,
  notes?: string,
  customTitle?: string,
  customDescription?: string
): Promise<void> {
  const today = getKolkataDateString();
  const existing = await db.roadmapProgress.get(taskId);

  if (existing) {
    await db.roadmapProgress.update(taskId, {
      completed,
      completedAt: completed ? (existing.completedAt || today) : undefined,
      notes: notes !== undefined ? notes : existing.notes,
      customTitle: customTitle !== undefined ? customTitle : existing.customTitle,
      customDescription: customDescription !== undefined ? customDescription : existing.customDescription,
      userEdited: true,
    });
  } else {
    await db.roadmapProgress.add({
      taskId,
      completed,
      completedAt: completed ? today : undefined,
      notes,
      customTitle,
      customDescription,
      userEdited: true,
    });
  }
}

/**
 * Updates full progress record for a roadmap task or deliverable
 */
export async function updateRoadmapTaskProgress(
  taskId: string,
  updates: Partial<RoadmapTaskProgress>
): Promise<void> {
  const today = getKolkataDateString();
  const existing = await db.roadmapProgress.get(taskId);

  if (existing) {
    const isCompleted = updates.completed !== undefined ? updates.completed : existing.completed;
    await db.roadmapProgress.update(taskId, {
      ...updates,
      completed: isCompleted,
      completedAt: isCompleted ? (existing.completedAt || today) : undefined,
      userEdited: true,
    });
  } else {
    const isCompleted = updates.completed ?? false;
    await db.roadmapProgress.add({
      taskId,
      completed: isCompleted,
      completedAt: isCompleted ? today : undefined,
      notes: updates.notes,
      customTitle: updates.customTitle,
      customDescription: updates.customDescription,
      userEdited: true,
    });
  }
}

/**
 * Resets a roadmap task back to clean baseline state (removes custom edits and progress)
 */
export async function resetRoadmapTaskProgress(taskId: string): Promise<void> {
  await db.roadmapProgress.delete(taskId);
}

/**
 * Returns single roadmap task progress record from IndexedDB
 */
export async function getRoadmapTaskProgress(taskId: string): Promise<RoadmapTaskProgress | undefined> {
  return await db.roadmapProgress.get(taskId);
}

/**
 * Returns all roadmap task progress records from IndexedDB
 */
export async function getAllRoadmapProgress(): Promise<RoadmapTaskProgress[]> {
  return await db.roadmapProgress.toArray();
}

/**
 * Updates user settings (such as startDate, targetDate, discrepancy resolution)
 */
export async function updateUserSettings(updates: Partial<UserSettings>): Promise<void> {
  const current = await db.settings.toCollection().first();
  if (current && current.id) {
    await db.settings.update(current.id, updates);
  }
}
