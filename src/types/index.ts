export type DsaDifficulty = 'Easy' | 'Medium' | 'Hard';

export type DsaStatus = 'unsolved' | 'solved' | 'mastered' | 'revision';

export type DsaPattern =
  | 'Arrays & Hashing'
  | 'Two Pointers'
  | 'Sliding Window'
  | 'Stack'
  | 'Binary Search'
  | 'Linked List'
  | 'Trees'
  | 'Heap / Priority Queue'
  | 'Graphs'
  | 'Intervals'
  | 'Greedy'
  | 'Backtracking'
  | 'Dynamic Programming'
  | 'Prefix Sum';

export interface DsaProblem {
  id: number; // 1 to 67
  title: string;
  leetcodeNumber: number;
  difficulty: DsaDifficulty;
  pattern: DsaPattern;
  status: DsaStatus;
  leetcodeUrl: string;
  notes?: string;
  lastSolvedDate?: string; // YYYY-MM-DD
  nextReviewDate?: string; // YYYY-MM-DD
  timeComplexity?: string;
  spaceComplexity?: string;
}

export interface DailyBlock {
  id: 'dsa' | 'technical' | 'interview' | 'log';
  name: string;
  durationMinutes: number;
  description: string;
  completed: boolean;
  notes?: string;
  subtasks?: { id: string; text: string; done: boolean }[];
}

export interface DailyPlan {
  id?: number;
  date: string; // YYYY-MM-DD in Asia/Kolkata
  dayNumber: number; // 1 to 168
  weekNumber: number; // 1 to 24
  phaseNumber: 1 | 2 | 3;
  targetFocus: string;
  blocks: DailyBlock[];
  reflections?: string;
  struggledWith?: string;
  keyLearnings?: string;
  status: 'planned' | 'in-progress' | 'completed';
}

export interface RevisionItem {
  id?: number;
  problemId: number;
  problemTitle: string;
  pattern: DsaPattern;
  difficulty: DsaDifficulty;
  solvedDate: string; // YYYY-MM-DD
  reviewStage: 1 | 2 | 3 | 4; // Day+1, Day+3, Day+7, Day+14
  nextReviewDate: string; // YYYY-MM-DD
  status: 'pending' | 'due' | 'overdue' | 'completed';
  notes?: string;
}

export interface SkillVertical {
  id: string; // e.g. 'python_fundamentals'
  name: string;
  score: number; // 0 to 5
  status: 'Unassessed' | 'Novice' | 'Developing' | 'Competent' | 'Proficient' | 'Mastered';
  benchmark: string;
  evidence: string;
  lastAssessedDate?: string;
  category: 'core' | 'backend' | 'systems' | 'professional';
}

export interface ProjectMilestone {
  id: string;
  phaseWeeks: string; // e.g. "Weeks 5-6"
  title: string;
  description: string;
  completed: boolean;
  tasks: { id: string; text: string; done: boolean }[];
}

export interface ProjectState {
  id?: number;
  projectName: string;
  techStack: string[];
  repoUrl?: string;
  deploymentUrl?: string;
  status: 'Not Started' | 'In Progress' | 'MVP Ready' | 'Deployed' | 'Completed';
  testsCount: number;
  milestones: ProjectMilestone[];
  architectureSummary: string;
  keyEndpoints: { method: 'GET' | 'POST' | 'PUT' | 'DELETE'; path: string; description: string; status: 'planned' | 'implemented' | 'tested' }[];
}

export type JobTier = 'tier_1_product_high' | 'tier_2_product_mid' | 'tier_3_service_plus' | 'tier_4_startups';

export type JobStatus = 'wishlist' | 'applied' | 'oa_screening' | 'technical_round' | 'hr_round' | 'offer' | 'rejected';

export interface JobApplication {
  id?: number;
  companyName: string;
  roleTitle: string;
  tier: JobTier;
  location?: string;
  jobUrl?: string;
  appliedDate?: string;
  status: JobStatus;
  expectedCtc?: string;
  salaryBreakdown?: {
    fixed?: string;
    variable?: string;
    esops?: string;
  };
  notes?: string;
  nextFollowUpDate?: string;
}

export interface WeeklyCheckpoint {
  id?: number;
  weekNumber: number;
  phase: number;
  title: string;
  targetDeliverables: string[];
  actualDeliverables?: string[];
  status: 'upcoming' | 'current' | 'passed' | 'needs_work';
  score?: number; // out of 10
  identifiedBottleneck?: string;
  actionItems?: string;
  dateEvaluated?: string;
}

export interface MockInterviewLog {
  id?: number;
  date: string;
  type: 'Coding (45m)' | 'Backend Design (30m)' | 'CS Theory (20m)' | 'Behavioral (15m)';
  interviewerOrPlatform: string;
  score: number; // 1-10
  strengths: string;
  weaknesses: string;
  actionPlan: string;
  problemsCovered?: string;
}

export interface UserSettings {
  id?: number;
  candidateName: string;
  targetRole: string;
  targetCtc: string;
  dailyBudgetMinutes: number;
  startDate: string; // 2026-10-20
  targetDate: string; // 2027-04-20
  timeZone: string; // 'Asia/Kolkata'
  theme: 'light' | 'dark' | 'system';
  isSampleDataMode: boolean;
  dateDiscrepancyResolution?: 'buffer_14_days' | 'align_24_weeks' | 'custom';
  dateDiscrepancyNotes?: string;
}

export type RoadmapTaskCategory =
  | 'dsa'
  | 'technical'
  | 'sql'
  | 'interview'
  | 'log'
  | 'backend'
  | 'devops'
  | 'project'
  | 'career'
  | 'cs_theory'
  | 'system_design'
  | 'deliverable';

export interface RoadmapTask {
  id: string;
  weekNumber: number;
  phase: 1 | 2 | 3;
  dayNumber?: number; // 1 to 14 for detailed Day 1-14 assignments
  title: string;
  description?: string;
  category: RoadmapTaskCategory;
  source: 'original' | 'generated';
  isGeneratedPlanning: boolean;
  problemNumber?: number;
  problemDifficulty?: DsaDifficulty;
}

export type MilestoneCategory =
  | 'python'
  | 'sql'
  | 'fastapi'
  | 'postgresql'
  | 'testing'
  | 'deployment'
  | 'cs_fundamentals'
  | 'job_search'
  | 'interview';

export interface RoadmapMilestone {
  id: string;
  category: MilestoneCategory;
  title: string;
  targetWeek: number;
  phase: 1 | 2 | 3;
  description: string;
  deliverables: string[];
}

export interface RoadmapWeekTopic {
  category: string;
  content: string;
}

export interface RoadmapWeek {
  weekNumber: number;
  weekRange: string; // e.g. "Week 1", "Week 2"
  blockRange: string; // e.g. "Weeks 1–2", "Weeks 3–4"
  phase: 1 | 2 | 3;
  phaseTitle: string;
  title: string;
  summary: string;
  topics: RoadmapWeekTopic[];
  deliverables: string[];
  checkpointFocus: string;
  tasks: RoadmapTask[];
  dsaProblems?: {
    title: string;
    leetcodeNumber?: number;
    pattern?: string;
    difficulty?: string;
  }[];
}

export interface RoadmapTaskProgress {
  taskId: string;
  completed: boolean;
  completedAt?: string;
  notes?: string;
  userEdited?: boolean;
  customTitle?: string;
  customDescription?: string;
}


