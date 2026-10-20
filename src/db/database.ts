import Dexie, { type Table } from 'dexie';
import type {
  DsaProblem,
  DailyPlan,
  RevisionItem,
  SkillVertical,
  ProjectState,
  JobApplication,
  WeeklyCheckpoint,
  MockInterviewLog,
  UserSettings,
  RoadmapTaskProgress,
} from '../types';

export class AppDatabase extends Dexie {
  dsaProblems!: Table<DsaProblem, number>;
  dailyPlans!: Table<DailyPlan, number>;
  revisionQueue!: Table<RevisionItem, number>;
  skills!: Table<SkillVertical, string>;
  projectState!: Table<ProjectState, number>;
  jobApplications!: Table<JobApplication, number>;
  checkpoints!: Table<WeeklyCheckpoint, number>;
  mockInterviews!: Table<MockInterviewLog, number>;
  settings!: Table<UserSettings, number>;
  roadmapProgress!: Table<RoadmapTaskProgress, string>;

  constructor() {
    super('SdePrepDatabase');
    this.version(1).stores({
      dsaProblems: 'id, title, leetcodeNumber, difficulty, pattern, status, nextReviewDate',
      dailyPlans: '++id, date, dayNumber, weekNumber, phaseNumber, status',
      revisionQueue: '++id, problemId, reviewStage, nextReviewDate, status',
      skills: 'id, name, score, category',
      projectState: '++id, projectName, status',
      jobApplications: '++id, companyName, tier, status, appliedDate',
      checkpoints: '++id, weekNumber, phase, status',
      mockInterviews: '++id, date, type, score',
      settings: '++id, theme, isSampleDataMode',
    });
    this.version(2).stores({
      roadmapProgress: 'taskId, completed, completedAt',
    });
  }
}

export const db = new AppDatabase();
