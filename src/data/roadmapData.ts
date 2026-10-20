import type {
  RoadmapWeek,
  RoadmapMilestone,
  RoadmapTask,
  DsaDifficulty,
} from '../types';

export const ROADMAP_METADATA = {
  candidate: 'Tanmay',
  education: 'B.Sc. CS + MCA (graduating Aug 2027)',
  startDate: '2026-10-20',
  targetDate: '2027-04-20',
  dailyBudgetMinutes: 120,
  targetRoles: ['SDE-1', 'Python Backend Developer', 'Backend Software Engineer', 'Graduate SE'],
  targetCtc: '₹10+ LPA',
  totalWeeks: 24,
  totalDays: 168,
  targetDsaCountRange: '75–100',
  masterDsaProblemCount: 67,
  reviewSchedule: {
    spacedRepetitionIntervals: [
      { stage: 1, offsetDays: 1, label: 'Review 1 (Day+1)' },
      { stage: 2, offsetDays: 3, label: 'Review 2 (Day+3)' },
      { stage: 3, offsetDays: 7, label: 'Review 3 (Day+7)' },
      { stage: 4, offsetDays: 14, label: 'Review 4 (Day+14)' },
    ],
    weeklyCheckpointInterval: 7,
    checkpointDescription: 'Weekly scorecard and gap analysis at end of each week (Days 7, 14, 21, etc.)',
    description: 'Spaced Repetition Queue populated upon problem solving with 4 review stages (Day+1, Day+3, Day+7, Day+14).',
  },
  dateDiscrepancy: {
    curriculumWeeks: 24,
    curriculumDays: 168,
    curriculumEndDate: '2027-04-06',
    targetDate: '2027-04-20',
    calendarDays: 182,
    calendarWeeks: 26,
    bufferDays: 14,
    explanation:
      'The curriculum in roadmap.md specifies 24 weeks (168 days) ending April 6, 2027, while the target date is set to April 20, 2027 (182 days / 26 weeks). This leaves a deliberate 14-day (2-week) post-curriculum buffer for technical rounds, interview scheduling, and offer evaluation.',
    recommendedResolution: 'buffer_14_days' as const,
  },
};

export interface RoadmapPhaseInfo {
  phase: 1 | 2 | 3;
  title: string;
  subtitle: string;
  weeksRange: string;
  startWeek: number;
  endWeek: number;
  summary: string;
  color: string;
}

export const ROADMAP_PHASES: RoadmapPhaseInfo[] = [
  {
    phase: 1,
    title: 'Phase 1: Foundations',
    subtitle: 'Weeks 1–6 (42 Days)',
    weeksRange: 'Weeks 1–6',
    startWeek: 1,
    endWeek: 6,
    summary:
      'Build a rock-solid foundation — Python fluency, DSA problem-solving habits, SQL basics, and AgroVision-ML backend scoping.',
    color: 'emerald',
  },
  {
    phase: 2,
    title: 'Phase 2: Backend Engineering & Project',
    subtitle: 'Weeks 7–14 (56 Days)',
    weeksRange: 'Weeks 7–14',
    startWeek: 7,
    endWeek: 14,
    summary:
      'Build a credible, deployable backend project (AgroVision-ML upgraded to full FastAPI backend) while continuing DSA and learning backend engineering deeply.',
    color: 'indigo',
  },
  {
    phase: 3,
    title: 'Phase 3: Interview Preparation & Job Search',
    subtitle: 'Weeks 15–24 (70 Days)',
    weeksRange: 'Weeks 15–24',
    startWeek: 15,
    endWeek: 24,
    summary:
      'Complete DSA coverage, core CS interview prep, system design basics, resume finalization, and aggressive job applications.',
    color: 'amber',
  },
];

export const ROADMAP_MILESTONES: RoadmapMilestone[] = [
  {
    id: 'ms-python-1',
    category: 'python',
    title: 'Python Diagnostics & Fundamentals',
    targetWeek: 2,
    phase: 1,
    description: 'Diagnose and master core Python syntax, collections mutability, comprehensions, generators, and decorators.',
    deliverables: [
      'day1_diagnostic.py (7 exercises) completed and verified',
      'List vs Tuple and mutability model verbalized',
      'Generators vs comprehensions explained',
      'Decorators and context managers understood',
    ],
  },
  {
    id: 'ms-testing-1',
    category: 'testing',
    title: 'Pytest & Test Automation Basics',
    targetWeek: 4,
    phase: 1,
    description: 'Write deterministic unit tests using pytest with fixtures and API mocking.',
    deliverables: [
      'Write 5 unit test functions in pytest',
      'Understand pytest fixtures and test discovery',
      'Mock external API calls inside a unit test',
    ],
  },
  {
    id: 'ms-sql-1',
    category: 'sql',
    title: 'SQL Fundamentals & Relational Queries',
    targetWeek: 4,
    phase: 1,
    description: 'Master SELECT, WHERE, ORDER BY, NULL handling, INNER/LEFT/RIGHT JOINs, and GROUP BY / HAVING.',
    deliverables: [
      '5 practice queries on sample schema (SELECT, WHERE, ORDER BY)',
      '3 JOIN queries (employees + departments)',
      '2 GROUP BY + HAVING aggregation queries',
      'Explain INNER vs LEFT JOIN in writing',
    ],
  },
  {
    id: 'ms-postgres-1',
    category: 'postgresql',
    title: 'PostgreSQL Setup & Relational Modeling',
    targetWeek: 6,
    phase: 1,
    description: 'Install PostgreSQL locally, design database schemas, foreign keys, and normal forms (1NF, 2NF, 3NF).',
    deliverables: [
      'PostgreSQL running locally with dev database',
      'Create 2 tables with foreign keys and cascade constraints',
      'Normalization (1NF, 2NF, 3NF) explained with examples',
      'ERD diagram for AgroVision-ML backend',
    ],
  },
  {
    id: 'ms-fastapi-1',
    category: 'fastapi',
    title: 'FastAPI Skeleton & HTTP Architecture',
    targetWeek: 6,
    phase: 1,
    description: 'Understand HTTP request/response cycle, status codes, Pydantic validation, and initialize FastAPI skeleton.',
    deliverables: [
      'Explain HTTP methods (GET, POST, PUT, DELETE, PATCH) and status codes',
      'Pydantic request/response schemas for validation',
      'FastAPI skeleton with /health endpoint committed to Git',
      'AgroVision-ML 1-page architecture specification',
    ],
  },
  {
    id: 'ms-fastapi-2',
    category: 'fastapi',
    title: 'FastAPI Core CRUD & SQLAlchemy 2.0 ORM',
    targetWeek: 8,
    phase: 2,
    description: 'Implement structured FastAPI backend with SQLAlchemy 2.0 ORM, Alembic migrations, and modular layout.',
    deliverables: [
      'Set up app/, api/, models/, schemas/, db/, tests/ package structure',
      'SQLAlchemy connection pool with PostgreSQL',
      'Alembic migrations initialized and executed',
      'Core CRUD endpoints (GET /prices, POST /forecasts)',
    ],
  },
  {
    id: 'ms-testing-2',
    category: 'testing',
    title: 'API Route Integration Testing with TestClient',
    targetWeek: 8,
    phase: 2,
    description: 'Maintain high test reliability with FastAPI TestClient and structured error responses.',
    deliverables: [
      '5+ passing pytest tests for API endpoints',
      'Structured error responses (no raw 500 unhandled exceptions)',
      'Pytest test suite integrated with test runner',
    ],
  },
  {
    id: 'ms-fastapi-3',
    category: 'fastapi',
    title: 'JWT Authentication & Security Middleware',
    targetWeek: 10,
    phase: 2,
    description: 'Implement secure user authentication, bcrypt password hashing, pagination, and query filtering.',
    deliverables: [
      'JWT authentication with login, register, protected routes',
      'Password hashing using bcrypt/passlib',
      'Pagination and query filtering on list endpoints',
      'Custom exception handling middleware',
    ],
  },
  {
    id: 'ms-sql-2',
    category: 'sql',
    title: 'Advanced SQL & Query Optimization',
    targetWeek: 10,
    phase: 2,
    description: 'Master SQL window functions, CTEs, and EXPLAIN ANALYZE for database query performance.',
    deliverables: [
      'Window functions: ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD',
      'CTEs: rewrite complex subqueries for readability',
      'Run EXPLAIN ANALYZE on 3 queries and interpret execution plan',
    ],
  },
  {
    id: 'ms-deployment-1',
    category: 'deployment',
    title: 'Dockerization & Cloud CI/CD Deployment',
    targetWeek: 12,
    phase: 2,
    description: 'Containerize application with Docker & Docker Compose and set up GitHub Actions CI for automated cloud deployment.',
    deliverables: [
      'Multi-stage Dockerfile for FastAPI app',
      'docker-compose.yml running app + PostgreSQL locally',
      'GitHub Actions CI running tests and ruff linter on push/PR',
      'Live deployment to Render / Railway / Fly.io free tier',
    ],
  },
  {
    id: 'ms-postgres-2',
    category: 'postgresql',
    title: 'Database Indexing, Transactions & Security',
    targetWeek: 14,
    phase: 2,
    description: 'Optimize PostgreSQL performance with B-tree indexes, ACID transactions, isolation levels, and security hardening.',
    deliverables: [
      'B-tree indexes added for timestamp and crop_id queries',
      'Transaction isolation levels and locking reviewed',
      'Security review: SQL injection, XSS, CSRF, rate limiting',
      'Load test with concurrency script (10 req/s) & limitations documented',
    ],
  },
  {
    id: 'ms-cs-1',
    category: 'cs_fundamentals',
    title: 'Dynamic Programming & Timed Problem-Solving',
    targetWeek: 16,
    phase: 3,
    description: 'Cover Dynamic Programming patterns (recurrence + tabulation) and establish timed medium solving habits.',
    deliverables: [
      'Master DP patterns: 1D tabulation, LCS, LIS, Coin Change, Word Break',
      'Timed solving routine: 2 medium LC problems in 30m each',
      'Reach ~85 cumulative solved DSA problems',
      'First mock coding interview conducted (45m, 2 problems)',
    ],
  },
  {
    id: 'ms-cs-2',
    category: 'cs_fundamentals',
    title: 'Core CS Fundamentals (OS, DBMS, CN, OOP)',
    targetWeek: 18,
    phase: 3,
    description: 'Prepare concise, interview-ready notes covering Operating Systems, DBMS, Computer Networks, and OOP.',
    deliverables: [
      'OOP: 4 pillars, SOLID principles, composition vs inheritance',
      'DBMS: Normalization, B-trees, ACID, isolation levels, deadlocks',
      'OS: Process vs thread, virtual memory, paging, mutex vs semaphore',
      'Networks: OSI/TCP-IP, TCP vs UDP, DNS, HTTPS, TLS handshake',
    ],
  },
  {
    id: 'ms-fastapi-4',
    category: 'fastapi',
    title: 'Entry-Level System Design & Architectural Defense',
    targetWeek: 18,
    phase: 3,
    description: 'Practice designing entry-level distributed systems and defending AgroVision-ML architecture.',
    deliverables: [
      'Design URL shortener end-to-end (API, DB, hashing, cache)',
      'Design API rate limiter and explain token bucket algorithm',
      'Explain caching (Redis), message queues, horizontal scaling',
      'Walk through AgroVision-ML architecture in 3-5 minutes',
    ],
  },
  {
    id: 'ms-jobsearch-1',
    category: 'job_search',
    title: 'Targeted Job Search Across 4 Tiers',
    targetWeek: 20,
    phase: 3,
    description: 'Systematically execute job applications across Product High, Product Mid, Service+, and Startups tiers.',
    deliverables: [
      'Job tracking spreadsheet active with 10+ researched companies',
      'Send 8-12 targeted applications per week',
      'Send 3-5 professional referral requests per week',
      'Tailor resume and optimize LinkedIn profile',
    ],
  },
  {
    id: 'ms-interview-1',
    category: 'interview',
    title: 'Mock Interview Routine & Behavioral Calibration',
    targetWeek: 22,
    phase: 3,
    description: 'Weekly cadence of mock coding, system design, and behavioral interviews with debriefs.',
    deliverables: [
      '2 full coding mocks per week (45 min each)',
      '1 backend / system design mock per week',
      '1 behavioral mock per week (90s intro, bug story, strengths)',
      'Remediate identified weaknesses from mock feedback',
    ],
  },
  {
    id: 'ms-interview-2',
    category: 'interview',
    title: 'Final Readiness Audit & Offer Conversion',
    targetWeek: 24,
    phase: 3,
    description: 'Final checklist execution, offer evaluation (fixed vs variable vs ESOPs), and transition.',
    deliverables: [
      'Solve 2 medium LC problems in 45 min consistently',
      'Defend project architecture with trade-offs in 5 min',
      '60+ cumulative relevant applications submitted',
      'Offer evaluated using comprehensive CTC breakdown framework',
    ],
  },
];

// Helper to create tasks
let taskCounter = 1;
function makeTask(
  weekNumber: number,
  phase: 1 | 2 | 3,
  title: string,
  category: RoadmapTask['category'],
  source: 'original' | 'generated' = 'original',
  opts: {
    dayNumber?: number;
    description?: string;
    isGeneratedPlanning?: boolean;
    problemNumber?: number;
    problemDifficulty?: DsaDifficulty;
  } = {}
): RoadmapTask {
  const isGeneratedPlanning = opts.isGeneratedPlanning ?? (source === 'generated');
  const id = opts.dayNumber
    ? `w${weekNumber}-d${opts.dayNumber}-${category}-${taskCounter++}`
    : `w${weekNumber}-${category}-${taskCounter++}`;
  return {
    id,
    weekNumber,
    phase,
    dayNumber: opts.dayNumber,
    title,
    description: opts.description,
    category,
    source,
    isGeneratedPlanning,
    problemNumber: opts.problemNumber,
    problemDifficulty: opts.problemDifficulty,
  };
}

export const ROADMAP_WEEKS: RoadmapWeek[] = [
  // ==========================================
  // PHASE 1: FOUNDATIONS (WEEKS 1–6)
  // ==========================================
  {
    weekNumber: 1,
    weekRange: 'Week 1',
    blockRange: 'Weeks 1–2',
    phase: 1,
    phaseTitle: 'Phase 1: Foundations',
    title: 'Diagnose & Strengthen Foundations (Days 1–7)',
    summary:
      'Baseline diagnostics for Python, Big-O, arrays and hash maps (Two Sum, Buy/Sell Stock, Contains Duplicate, Anagrams), and Git workflow.',
    topics: [
      { category: 'DSA', content: 'Big-O quiz, Two Sum (LC #1), Buy/Sell Stock (LC #121), Contains Duplicate (LC #217), Valid Anagram (LC #242)' },
      { category: 'Python', content: 'Variables, types, mutability, comprehensions, iterators, generators, exception handling, JSON, modules' },
      { category: 'Workflow', content: 'Git branching, commits, PRs, .gitignore setup' },
      { category: 'Interview', content: '60s self-introduction, explaining Big-O aloud, hash map mechanics, ACID first exposure' },
    ],
    deliverables: [
      'Baseline assessment scores documented',
      'GitHub workflow established (repo with branches, clean commits)',
      'Solve Two Sum, Buy/Sell Stock, Contains Duplicate, Valid Anagram',
      'Complete Day 1-6 diagnostic exercises in day1_diagnostic.py',
      'Week 1 checkpoint scorecard completed',
    ],
    checkpointFocus: 'Week 1 Checkpoint: Test on Days 1-6 material (Day 7)',
    dsaProblems: [
      { title: 'Two Sum', leetcodeNumber: 1, pattern: 'Arrays & Hashing', difficulty: 'Easy' },
      { title: 'Best Time to Buy and Sell Stock', leetcodeNumber: 121, pattern: 'Sliding Window', difficulty: 'Easy' },
      { title: 'Contains Duplicate', leetcodeNumber: 217, pattern: 'Arrays & Hashing', difficulty: 'Easy' },
      { title: 'Valid Anagram', leetcodeNumber: 242, pattern: 'Arrays & Hashing', difficulty: 'Easy' },
    ],
    tasks: [
      // Day 1
      makeTask(1, 1, 'Day 1 Block 1: Baseline diagnostic: Big-O quiz + 1 easy array problem', 'dsa', 'original', { dayNumber: 1, description: 'Analyze 5 Big-O snippets & solve Two Sum (LC #1)' }),
      makeTask(1, 1, 'Day 1 Block 2: Python diagnostic: variables, types, control flow, functions, OOP', 'technical', 'original', { dayNumber: 1, description: 'Complete 7 exercises in day1_diagnostic.py' }),
      makeTask(1, 1, 'Day 1 Block 3: Introduce yourself in 60 seconds (practice)', 'interview', 'original', { dayNumber: 1, description: 'Verbalize 60-second intro aloud & answer List vs Tuple' }),
      makeTask(1, 1, 'Day 1 Block 4: Record results, gaps found in progress_log.md', 'log', 'original', { dayNumber: 1, description: 'Log struggles, key learnings, and tomorrow focus' }),
      // Day 2
      makeTask(1, 1, 'Day 2 Block 1: Big-O analysis practice (5 snippets)', 'dsa', 'original', { dayNumber: 2, description: 'Analyze nested loops, recursion tree, binary search bounds' }),
      makeTask(1, 1, 'Day 2 Block 2: Python: lists, dicts, sets, tuples — operations & mutability', 'technical', 'original', { dayNumber: 2, description: 'Deep dive into object references, shallow vs deep copy' }),
      makeTask(1, 1, 'Day 2 Block 3: Explain Big-O to an imaginary interviewer', 'interview', 'original', { dayNumber: 2, description: 'Articulate time and space bounds under timer' }),
      makeTask(1, 1, 'Day 2 Block 4: Log what is weak', 'log', 'original', { dayNumber: 2, description: 'Log findings in progress_log.md' }),
      // Day 3
      makeTask(1, 1, 'Day 3 Block 1: Arrays: Two Sum (LC #1)', 'dsa', 'original', { dayNumber: 3, description: 'Implement optimal O(N) hash map solution', problemNumber: 1, problemDifficulty: 'Easy' }),
      makeTask(1, 1, 'Day 3 Block 2: Python: string operations, slicing, common methods', 'technical', 'original', { dayNumber: 3, description: 'String immutability, split, join, formatting, slicing strides' }),
      makeTask(1, 1, 'Day 3 Block 3: Explain Two Sum approach aloud', 'interview', 'original', { dayNumber: 3, description: 'Explain complement lookup without looking at code' }),
      makeTask(1, 1, 'Day 3 Block 4: Log pattern learned', 'log', 'original', { dayNumber: 3, description: 'Document hash table trade-off notes' }),
      // Day 4
      makeTask(1, 1, 'Day 4 Block 1: Arrays: Best Time to Buy/Sell Stock (LC #121)', 'dsa', 'original', { dayNumber: 4, description: 'Single pass min-price tracking', problemNumber: 121, problemDifficulty: 'Easy' }),
      makeTask(1, 1, 'Day 4 Block 2: Python: comprehensions, iterators, generators', 'technical', 'original', { dayNumber: 4, description: 'Write generator expression and yield generator function' }),
      makeTask(1, 1, 'Day 4 Block 3: Explain generator vs list comprehension', 'interview', 'original', { dayNumber: 4, description: 'Explain memory consumption differences' }),
      makeTask(1, 1, 'Day 4 Block 4: Log reflection', 'log', 'original', { dayNumber: 4 }),
      // Day 5
      makeTask(1, 1, 'Day 5 Block 1: Arrays: Contains Duplicate (LC #217) + Revision of Day 3', 'dsa', 'original', { dayNumber: 5, description: 'Hash set lookup and re-solve Two Sum', problemNumber: 217, problemDifficulty: 'Easy' }),
      makeTask(1, 1, 'Day 5 Block 2: Python: exception handling, file I/O, JSON', 'technical', 'original', { dayNumber: 5, description: 'Try/except/finally blocks, reading and dumping JSON' }),
      makeTask(1, 1, 'Day 5 Block 3: What are ACID properties? (first exposure)', 'interview', 'original', { dayNumber: 5, description: 'Atomicity, Consistency, Isolation, Durability definitions' }),
      makeTask(1, 1, 'Day 5 Block 4: Log reflection', 'log', 'original', { dayNumber: 5 }),
      // Day 6
      makeTask(1, 1, 'Day 6 Block 1: Hash Maps: Valid Anagram (LC #242)', 'dsa', 'original', { dayNumber: 6, description: 'Character frequency counting with dict / array', problemNumber: 242, problemDifficulty: 'Easy' }),
      makeTask(1, 1, 'Day 6 Block 2: Python: modules, packages, imports, virtual environments', 'technical', 'original', { dayNumber: 6, description: '__init__.py, relative imports, venv activation' }),
      makeTask(1, 1, 'Day 6 Block 3: Explain hash map time complexity', 'interview', 'original', { dayNumber: 6, description: 'Average O(1) vs worst case O(N) hash collision resolution' }),
      makeTask(1, 1, 'Day 6 Block 4: Log reflection', 'log', 'original', { dayNumber: 6 }),
      // Day 7
      makeTask(1, 1, 'Day 7 Block 1: WEEKLY CHECKPOINT — test on Days 1-6 material', 'dsa', 'original', { dayNumber: 7, description: 'Solve 2 problems under 45-min timer' }),
      makeTask(1, 1, 'Day 7 Block 2: Git workflow: branching, commits, PRs, .gitignore', 'technical', 'original', { dayNumber: 7, description: 'Feature branches, merge vs rebase basics, clean history' }),
      makeTask(1, 1, 'Day 7 Block 3: Review & plan Week 2', 'interview', 'original', { dayNumber: 7, description: 'Self-audit on strengths and schedule Week 2' }),
      makeTask(1, 1, 'Day 7 Block 4: Checkpoint scorecard', 'log', 'original', { dayNumber: 7, description: 'Score Week 1 performance out of 10' }),
    ],
  },
  {
    weekNumber: 2,
    weekRange: 'Week 2',
    blockRange: 'Weeks 1–2',
    phase: 1,
    phaseTitle: 'Phase 1: Foundations',
    title: 'Diagnose & Strengthen Foundations (Days 8–14)',
    summary:
      'Advanced hash maps (Group Anagrams, Top K Frequent), Python OOP, decorators, pytest unit testing, SQL SELECT queries, and baseline gap analysis.',
    topics: [
      { category: 'DSA', content: 'Group Anagrams (LC #49), Top K Frequent Elements (LC #347), Valid Palindrome (LC #125), Longest Substring Without Repeating (LC #3)' },
      { category: 'Python', content: 'OOP classes, inheritance, dunder methods, decorators, context managers, type hints, pytest basics' },
      { category: 'SQL', content: 'SELECT, WHERE, ORDER BY, NULLs handling with 5 practice queries' },
      { category: 'Review', content: 'Baseline gap analysis document: what I know vs what I need' },
    ],
    deliverables: [
      '8-10 DSA problems solved with explanations',
      'Python exercises covering core topics',
      'pytest basics demonstrated (write 5 test functions)',
      'SQL SELECT, WHERE, ORDER BY queries written',
      'Written baseline gap analysis document',
      'Week 2 checkpoint scorecard completed',
    ],
    checkpointFocus: 'Week 2 Checkpoint: Test Weeks 1-2 foundations & baseline gap analysis (Day 14)',
    dsaProblems: [
      { title: 'Group Anagrams', leetcodeNumber: 49, pattern: 'Arrays & Hashing', difficulty: 'Medium' },
      { title: 'Top K Frequent Elements', leetcodeNumber: 347, pattern: 'Arrays & Hashing', difficulty: 'Medium' },
      { title: 'Valid Palindrome', leetcodeNumber: 125, pattern: 'Two Pointers', difficulty: 'Easy' },
      { title: 'Longest Substring Without Repeating Characters', leetcodeNumber: 3, pattern: 'Sliding Window', difficulty: 'Medium' },
    ],
    tasks: [
      // Day 8
      makeTask(2, 1, 'Day 8 Block 1: Hash Maps: Group Anagrams (LC #49)', 'dsa', 'original', { dayNumber: 8, description: 'Tuple count key pattern', problemNumber: 49, problemDifficulty: 'Medium' }),
      makeTask(2, 1, 'Day 8 Block 2: Python OOP: classes, __init__, inheritance, encapsulation', 'technical', 'original', { dayNumber: 8, description: 'Build inheritance hierarchy with private attributes' }),
      makeTask(2, 1, 'Day 8 Block 3: Explain class vs instance variables', 'interview', 'original', { dayNumber: 8, description: 'Verbalize class attribute sharing across instances' }),
      makeTask(2, 1, 'Day 8 Block 4: Log reflection', 'log', 'original', { dayNumber: 8 }),
      // Day 9
      makeTask(2, 1, 'Day 9 Block 1: Hash Maps: Top K Frequent Elements (LC #347)', 'dsa', 'original', { dayNumber: 9, description: 'Bucket sort / heap approach', problemNumber: 347, problemDifficulty: 'Medium' }),
      makeTask(2, 1, 'Day 9 Block 2: Python OOP: composition, polymorphism, dunder methods', 'technical', 'original', { dayNumber: 9, description: '__repr__, __str__, __len__, __eq__ implementations' }),
      makeTask(2, 1, 'Day 9 Block 3: Explain polymorphism with an example', 'interview', 'original', { dayNumber: 9, description: 'Duck typing and interface polymorphism' }),
      makeTask(2, 1, 'Day 9 Block 4: Log reflection', 'log', 'original', { dayNumber: 9 }),
      // Day 10
      makeTask(2, 1, 'Day 10 Block 1: Revision: re-solve Days 3, 4 from scratch', 'dsa', 'original', { dayNumber: 10, description: 'Re-solve Two Sum and Buy/Sell Stock in < 15 mins' }),
      makeTask(2, 1, 'Day 10 Block 2: Python: decorators & context managers', 'technical', 'original', { dayNumber: 10, description: 'Write timer decorator and with-statement manager' }),
      makeTask(2, 1, 'Day 10 Block 3: What is a decorator? Explain to interviewer', 'interview', 'original', { dayNumber: 10, description: 'Higher-order function wrapping with functools.wraps' }),
      makeTask(2, 1, 'Day 10 Block 4: Log reflection', 'log', 'original', { dayNumber: 10 }),
      // Day 11
      makeTask(2, 1, 'Day 11 Block 1: Strings: Valid Palindrome (LC #125)', 'dsa', 'original', { dayNumber: 11, description: 'Two pointers inward scan', problemNumber: 125, problemDifficulty: 'Easy' }),
      makeTask(2, 1, 'Day 11 Block 2: Python: type hints, debugging, common pitfalls', 'technical', 'original', { dayNumber: 11, description: 'typing module, pdb/breakpoint(), mutable default argument' }),
      makeTask(2, 1, 'Day 11 Block 3: Explain mutable default argument pitfall', 'interview', 'original', { dayNumber: 11, description: 'def foo(items=[]) trap and None sentinel fix' }),
      makeTask(2, 1, 'Day 11 Block 4: Log reflection', 'log', 'original', { dayNumber: 11 }),
      // Day 12
      makeTask(2, 1, 'Day 12 Block 1: Strings: Longest Substring Without Repeating (LC #3) — attempt', 'dsa', 'original', { dayNumber: 12, description: 'Sliding window with set / index map', problemNumber: 3, problemDifficulty: 'Medium' }),
      makeTask(2, 1, 'Day 12 Block 2: Python: unit testing with pytest — write 5 test functions', 'technical', 'original', { dayNumber: 12, description: 'Test assertions, parametrize, test discovery' }),
      makeTask(2, 1, 'Day 12 Block 3: What is pytest fixture?', 'interview', 'original', { dayNumber: 12, description: 'Setup and teardown dependency injection in testing' }),
      makeTask(2, 1, 'Day 12 Block 4: Log reflection', 'log', 'original', { dayNumber: 12 }),
      // Day 13
      makeTask(2, 1, 'Day 13 Block 1: Finish LC #3 + analyze', 'dsa', 'original', { dayNumber: 13, description: 'Finalize optimal O(N) sliding window solution', problemNumber: 3, problemDifficulty: 'Medium' }),
      makeTask(2, 1, 'Day 13 Block 2: SQL: SELECT, WHERE, ORDER BY — 5 practice queries', 'sql', 'original', { dayNumber: 13, description: 'Basic queries and filtering on sample schema' }),
      makeTask(2, 1, 'Day 13 Block 3: What does ORDER BY do with NULLs?', 'interview', 'original', { dayNumber: 13, description: 'NULLS FIRST vs NULLS LAST in SQL standards' }),
      makeTask(2, 1, 'Day 13 Block 4: Log reflection', 'log', 'original', { dayNumber: 13 }),
      // Day 14
      makeTask(2, 1, 'Day 14 Block 1: WEEKLY CHECKPOINT — test Weeks 1-2', 'dsa', 'original', { dayNumber: 14, description: 'Timed assessment on Weeks 1-2 foundations' }),
      makeTask(2, 1, 'Day 14 Block 2: Baseline gap analysis document', 'technical', 'original', { dayNumber: 14, description: 'Write gap analysis: what I know vs what I need' }),
      makeTask(2, 1, 'Day 14 Block 3: Plan Week 3', 'interview', 'original', { dayNumber: 14, description: 'Map out Two Pointers and SQL JOIN goals' }),
      makeTask(2, 1, 'Day 14 Block 4: Checkpoint scorecard', 'log', 'original', { dayNumber: 14, description: 'Score Weeks 1-2 performance out of 10' }),
    ],
  },
  {
    weekNumber: 3,
    weekRange: 'Week 3',
    blockRange: 'Weeks 3–4',
    phase: 1,
    phaseTitle: 'Phase 1: Foundations',
    title: 'Build Problem-Solving Habits: Two Pointers & Sliding Window',
    summary:
      'Master Two Pointers (Two Sum II, 3Sum, Container With Most Water) and Sliding Window (Longest Repeating Character Replacement, Min Window Substring) + SQL JOINs.',
    topics: [
      { category: 'DSA', content: 'Two Pointers (LC #167, LC #15, LC #11), Sliding Window (LC #424, LC #76 attempt)' },
      { category: 'SQL', content: 'JOINs: INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL JOIN on sample schema' },
      { category: 'Practice', content: 'Explain solutions aloud before looking at editorial' },
    ],
    deliverables: [
      'Two Sum II, 3Sum, Container With Most Water solved with explanations',
      'Longest Repeating Character Replacement solved',
      'Attempt Minimum Window Substring',
      'Write 3 JOIN queries on sample schema (employees + departments)',
      'Explain INNER vs LEFT JOIN in writing',
    ],
    checkpointFocus: 'Mid-sprint pattern recognition check on Two Pointers & Sliding Window',
    dsaProblems: [
      { title: 'Two Sum II - Input Array Is Sorted', leetcodeNumber: 167, pattern: 'Two Pointers', difficulty: 'Medium' },
      { title: '3Sum', leetcodeNumber: 15, pattern: 'Two Pointers', difficulty: 'Medium' },
      { title: 'Container With Most Water', leetcodeNumber: 11, pattern: 'Two Pointers', difficulty: 'Medium' },
      { title: 'Longest Repeating Character Replacement', leetcodeNumber: 424, pattern: 'Sliding Window', difficulty: 'Medium' },
      { title: 'Minimum Window Substring', leetcodeNumber: 76, pattern: 'Sliding Window', difficulty: 'Hard' },
    ],
    tasks: [
      // Core Source Tasks
      makeTask(3, 1, 'Solve Two Sum II - Sorted (LC #167)', 'dsa', 'original', { problemNumber: 167, problemDifficulty: 'Medium' }),
      makeTask(3, 1, 'Solve 3Sum (LC #15)', 'dsa', 'original', { problemNumber: 15, problemDifficulty: 'Medium' }),
      makeTask(3, 1, 'Solve Container With Most Water (LC #11)', 'dsa', 'original', { problemNumber: 11, problemDifficulty: 'Medium' }),
      makeTask(3, 1, 'Solve Longest Repeating Character Replacement (LC #424)', 'dsa', 'original', { problemNumber: 424, problemDifficulty: 'Medium' }),
      makeTask(3, 1, 'Attempt Minimum Window Substring (LC #76)', 'dsa', 'original', { problemNumber: 76, problemDifficulty: 'Hard' }),
      makeTask(3, 1, 'Write 3 JOIN queries on sample schema (employees + departments)', 'sql', 'original'),
      makeTask(3, 1, 'Explain INNER vs LEFT JOIN in writing', 'sql', 'original'),
      // Generated Planning Tasks (Editable distribution)
      makeTask(3, 1, 'Day 15 Planned: Two Pointers deep dive (Two Sum II & 3Sum sorted logic)', 'dsa', 'generated', { isGeneratedPlanning: true, dayNumber: 15 }),
      makeTask(3, 1, 'Day 16 Planned: Container With Most Water max area proof & inward pointer rule', 'dsa', 'generated', { isGeneratedPlanning: true, dayNumber: 16 }),
      makeTask(3, 1, 'Day 17 Planned: Sliding Window Character Replacement dynamic window expansion', 'dsa', 'generated', { isGeneratedPlanning: true, dayNumber: 17 }),
      makeTask(3, 1, 'Day 18 Planned: Minimum Window Substring requirement map matching', 'dsa', 'generated', { isGeneratedPlanning: true, dayNumber: 18 }),
      makeTask(3, 1, 'Day 19 Planned: SQL JOINs hands-on syntax practice & query execution', 'sql', 'generated', { isGeneratedPlanning: true, dayNumber: 19 }),
      makeTask(3, 1, 'Day 20 Planned: Re-solve 3Sum and Container With Most Water without hints', 'dsa', 'generated', { isGeneratedPlanning: true, dayNumber: 20 }),
      makeTask(3, 1, 'Day 21 Planned: Week 3 review & vocalize Two Pointers rules under timer', 'interview', 'generated', { isGeneratedPlanning: true, dayNumber: 21 }),
    ],
  },
  {
    weekNumber: 4,
    weekRange: 'Week 4',
    blockRange: 'Weeks 3–4',
    phase: 1,
    phaseTitle: 'Phase 1: Foundations',
    title: 'Build Problem-Solving Habits: Stack, Binary Search & Advanced SQL',
    summary:
      'Prefix Sum, Stacks (Valid Parentheses, Min Stack, RPN), Binary Search (Search 2D Matrix), SQL GROUP BY/HAVING, and pytest API mocking.',
    topics: [
      { category: 'DSA', content: 'Prefix Sum (LC #303), Stack (LC #20, LC #155, LC #150), Binary Search (LC #704, LC #74), Merge Intervals intro (LC #56)' },
      { category: 'SQL', content: 'GROUP BY, HAVING, aggregations (COUNT, SUM, AVG), subqueries' },
      { category: 'Python', content: 'pytest fixtures, mocking external API calls in tests' },
    ],
    deliverables: [
      '15+ DSA problems solved across Weeks 3-4 with written explanations',
      'SQL exercises completed: 2 GROUP BY + HAVING queries, 1 subquery',
      'pytest: mock an external API call in a test',
      'Can explain Two Pointers, Sliding Window, Binary Search patterns without notes',
      'Week 4 Checkpoint scorecard completed',
    ],
    checkpointFocus: 'Week 4 Checkpoint: Test pattern recognition under 30-min timer',
    dsaProblems: [
      { title: 'Range Sum Query - Immutable', leetcodeNumber: 303, pattern: 'Prefix Sum', difficulty: 'Easy' },
      { title: 'Valid Parentheses', leetcodeNumber: 20, pattern: 'Stack', difficulty: 'Easy' },
      { title: 'Min Stack', leetcodeNumber: 155, pattern: 'Stack', difficulty: 'Medium' },
      { title: 'Evaluate Reverse Polish Notation', leetcodeNumber: 150, pattern: 'Stack', difficulty: 'Medium' },
      { title: 'Binary Search', leetcodeNumber: 704, pattern: 'Binary Search', difficulty: 'Easy' },
      { title: 'Search a 2D Matrix', leetcodeNumber: 74, pattern: 'Binary Search', difficulty: 'Medium' },
      { title: 'Merge Intervals', leetcodeNumber: 56, pattern: 'Intervals', difficulty: 'Medium' },
    ],
    tasks: [
      // Core Source Tasks
      makeTask(4, 1, 'Solve Range Sum Query (LC #303) prefix sum', 'dsa', 'original', { problemNumber: 303, problemDifficulty: 'Easy' }),
      makeTask(4, 1, 'Solve Valid Parentheses (LC #20)', 'dsa', 'original', { problemNumber: 20, problemDifficulty: 'Easy' }),
      makeTask(4, 1, 'Solve Min Stack (LC #155) with O(1) auxiliary stack', 'dsa', 'original', { problemNumber: 155, problemDifficulty: 'Medium' }),
      makeTask(4, 1, 'Solve Evaluate Reverse Polish Notation (LC #150)', 'dsa', 'original', { problemNumber: 150, problemDifficulty: 'Medium' }),
      makeTask(4, 1, 'Solve Binary Search (LC #704) & Search a 2D Matrix (LC #74)', 'dsa', 'original', { problemNumber: 704, problemDifficulty: 'Easy' }),
      makeTask(4, 1, 'Intro to Merge Intervals (LC #56)', 'dsa', 'original', { problemNumber: 56, problemDifficulty: 'Medium' }),
      makeTask(4, 1, 'Write 2 GROUP BY + HAVING queries and 1 subquery', 'sql', 'original'),
      makeTask(4, 1, 'pytest: mock an external API call in a test function', 'technical', 'original'),
      makeTask(4, 1, 'Week 4 Checkpoint: Test pattern recognition under 30-min timer', 'log', 'original'),
      // Generated Planning Tasks (Editable)
      makeTask(4, 1, 'Day 22 Planned: Range Sum Query and Valid Parentheses stack invariants', 'dsa', 'generated', { isGeneratedPlanning: true, dayNumber: 22 }),
      makeTask(4, 1, 'Day 23 Planned: Min Stack pair tracking and Evaluate Reverse Polish Notation', 'dsa', 'generated', { isGeneratedPlanning: true, dayNumber: 23 }),
      makeTask(4, 1, 'Day 24 Planned: Binary Search boundaries & 2D Matrix row/col mapping', 'dsa', 'generated', { isGeneratedPlanning: true, dayNumber: 24 }),
      makeTask(4, 1, 'Day 25 Planned: SQL GROUP BY vs WHERE filtering execution order', 'sql', 'generated', { isGeneratedPlanning: true, dayNumber: 25 }),
      makeTask(4, 1, 'Day 26 Planned: pytest unittest.mock patch decorator on API calls', 'technical', 'generated', { isGeneratedPlanning: true, dayNumber: 26 }),
      makeTask(4, 1, 'Day 27 Planned: Merge Intervals sorting by start time practice', 'dsa', 'generated', { isGeneratedPlanning: true, dayNumber: 27 }),
      makeTask(4, 1, 'Day 28 Planned: Week 4 Checkpoint timed run & scorecard', 'interview', 'generated', { isGeneratedPlanning: true, dayNumber: 28 }),
    ],
  },
  {
    weekNumber: 5,
    weekRange: 'Week 5',
    blockRange: 'Weeks 5–6',
    phase: 1,
    phaseTitle: 'Phase 1: Foundations',
    title: 'Connect Programming to Backend: Linked Lists, HTTP & PostgreSQL',
    summary:
      'Linked Lists (Reverse, Merge, Cycle, Remove Nth), Recursion (Climbing Stairs, Subsets), HTTP methods/status codes, and local PostgreSQL setup.',
    topics: [
      { category: 'DSA', content: 'Linked Lists (LC #206, LC #21, LC #141, LC #19), Recursion (LC #70, LC #78)' },
      { category: 'Backend', content: 'HTTP methods, status codes, headers, request/response body, REST principles' },
      { category: 'Database', content: 'Install PostgreSQL locally, create database, table schemas, foreign keys, normalization (1NF, 2NF, 3NF)' },
    ],
    deliverables: [
      'Linked Lists & Recursion problems solved',
      'HTTP & REST concepts explained in writing',
      'PostgreSQL running locally with sample schema and foreign keys',
      'Normalization (1NF, 2NF, 3NF) documented with examples',
    ],
    checkpointFocus: 'Mid-sprint Linked Lists pointer safety and relational database setup',
    dsaProblems: [
      { title: 'Reverse Linked List', leetcodeNumber: 206, pattern: 'Linked List', difficulty: 'Easy' },
      { title: 'Merge Two Sorted Lists', leetcodeNumber: 21, pattern: 'Linked List', difficulty: 'Easy' },
      { title: 'Linked List Cycle', leetcodeNumber: 141, pattern: 'Linked List', difficulty: 'Easy' },
      { title: 'Remove Nth Node From End of List', leetcodeNumber: 19, pattern: 'Linked List', difficulty: 'Medium' },
      { title: 'Climbing Stairs', leetcodeNumber: 70, pattern: 'Recursion', difficulty: 'Easy' },
      { title: 'Subsets', leetcodeNumber: 78, pattern: 'Recursion', difficulty: 'Medium' },
    ],
    tasks: [
      // Core Source Tasks
      makeTask(5, 1, 'Solve Reverse Linked List (LC #206) & Merge Two Sorted Lists (LC #21)', 'dsa', 'original', { problemNumber: 206, problemDifficulty: 'Easy' }),
      makeTask(5, 1, 'Solve Linked List Cycle (LC #141) Floyd Tortoise & Hare', 'dsa', 'original', { problemNumber: 141, problemDifficulty: 'Easy' }),
      makeTask(5, 1, 'Solve Remove Nth Node From End (LC #19)', 'dsa', 'original', { problemNumber: 19, problemDifficulty: 'Medium' }),
      makeTask(5, 1, 'Solve Climbing Stairs (LC #70) & Subsets (LC #78)', 'dsa', 'original', { problemNumber: 70, problemDifficulty: 'Easy' }),
      makeTask(5, 1, 'Understand HTTP methods (GET, POST, PUT, DELETE, PATCH) and status codes (200, 201, 400, 401, 403, 404, 500)', 'backend', 'original'),
      makeTask(5, 1, 'Install PostgreSQL locally and create sample database with 2 tables and foreign keys', 'backend', 'original'),
      makeTask(5, 1, 'Document normalization (1NF, 2NF, 3NF) with real schema examples', 'backend', 'original'),
      // Generated Planning Tasks
      makeTask(5, 1, 'Day 29 Planned: Reverse Linked List iterative & recursive pointer manipulation', 'dsa', 'generated', { isGeneratedPlanning: true, dayNumber: 29 }),
      makeTask(5, 1, 'Day 30 Planned: Merge Two Sorted Lists dummy head pattern & Cycle detection', 'dsa', 'generated', { isGeneratedPlanning: true, dayNumber: 30 }),
      makeTask(5, 1, 'Day 31 Planned: Remove Nth Node fast/slow pointer gap technique', 'dsa', 'generated', { isGeneratedPlanning: true, dayNumber: 31 }),
      makeTask(5, 1, 'Day 32 Planned: Recursion tree visualization for Climbing Stairs and Subsets', 'dsa', 'generated', { isGeneratedPlanning: true, dayNumber: 32 }),
      makeTask(5, 1, 'Day 33 Planned: HTTP request anatomy, REST semantics & idempotency table', 'backend', 'generated', { isGeneratedPlanning: true, dayNumber: 33 }),
      makeTask(5, 1, 'Day 34 Planned: Local psql CLI setup, create tables, insert test rows', 'backend', 'generated', { isGeneratedPlanning: true, dayNumber: 34 }),
      makeTask(5, 1, 'Day 35 Planned: Week 5 review and relational integrity checks', 'log', 'generated', { isGeneratedPlanning: true, dayNumber: 35 }),
    ],
  },
  {
    weekNumber: 6,
    weekRange: 'Week 6',
    blockRange: 'Weeks 5–6',
    phase: 1,
    phaseTitle: 'Phase 1: Foundations',
    title: 'Connect Programming to Backend: Trees, FastAPI & AgroVision-ML Scoping',
    summary:
      'Binary Trees intro, Heap intro, install FastAPI, Pydantic validation, audit AgroVision-ML, ERD schema design, and first /health endpoint committed to GitHub.',
    topics: [
      { category: 'DSA', content: 'Trees (LC #226, LC #104, LC #100, LC #102), Heap (LC #215), Re-solve 3 hardest' },
      { category: 'Backend', content: 'FastAPI installation, Pydantic models for request validation, /health check' },
      { category: 'Project', content: 'Audit AgroVision-ML repo, write 1-page spec, design ERD, initialize FastAPI skeleton' },
    ],
    deliverables: [
      '12+ DSA problems solved (cumulatively ~35 problems)',
      'AgroVision-ML repo audited: document what exists, what is missing',
      '1-page project specification: problem -> architecture -> endpoints -> data flow',
      'Database schema ERD designed',
      'FastAPI skeleton with /health committed to GitHub',
      'Week 6 Checkpoint: Phase 1 Foundations Review & project kickoff approval',
    ],
    checkpointFocus: 'Week 6 Checkpoint: Phase 1 Foundations Review & project kickoff approval',
    dsaProblems: [
      { title: 'Invert Binary Tree', leetcodeNumber: 226, pattern: 'Trees', difficulty: 'Easy' },
      { title: 'Maximum Depth of Binary Tree', leetcodeNumber: 104, pattern: 'Trees', difficulty: 'Easy' },
      { title: 'Same Tree', leetcodeNumber: 100, pattern: 'Trees', difficulty: 'Easy' },
      { title: 'Binary Tree Level Order Traversal', leetcodeNumber: 102, pattern: 'Trees', difficulty: 'Medium' },
      { title: 'Kth Largest Element in an Array', leetcodeNumber: 215, pattern: 'Heap / Priority Queue', difficulty: 'Medium' },
    ],
    tasks: [
      // Core Source Tasks
      makeTask(6, 1, 'Solve Invert Binary Tree (LC #226) & Max Depth (LC #104)', 'dsa', 'original', { problemNumber: 226, problemDifficulty: 'Easy' }),
      makeTask(6, 1, 'Solve Same Tree (LC #100) & Level Order Traversal (LC #102)', 'dsa', 'original', { problemNumber: 102, problemDifficulty: 'Medium' }),
      makeTask(6, 1, 'Solve Kth Largest Element in an Array (LC #215) using min-heap', 'dsa', 'original', { problemNumber: 215, problemDifficulty: 'Medium' }),
      makeTask(6, 1, 'Install FastAPI, run hello world, build Pydantic schemas for request validation', 'backend', 'original'),
      makeTask(6, 1, 'Clone AgroVision-ML, review code, document what exists and what needs to be built', 'project', 'original'),
      makeTask(6, 1, 'Write 1-page AgroVision-ML project specification & design database ERD', 'project', 'original'),
      makeTask(6, 1, 'Create initial FastAPI skeleton with /health endpoint and push to GitHub', 'project', 'original'),
      makeTask(6, 1, 'Week 6 Checkpoint: Complete Phase 1 Foundations review', 'log', 'original'),
      // Generated Planning Tasks
      makeTask(6, 1, 'Day 36 Planned: Tree recursion DFS vs BFS level-order traversal queue', 'dsa', 'generated', { isGeneratedPlanning: true, dayNumber: 36 }),
      makeTask(6, 1, 'Day 37 Planned: Heap properties and heapq module in Python for Kth largest', 'dsa', 'generated', { isGeneratedPlanning: true, dayNumber: 37 }),
      makeTask(6, 1, 'Day 38 Planned: FastAPI setup with uvicorn and interactive Swagger UI /docs', 'backend', 'generated', { isGeneratedPlanning: true, dayNumber: 38 }),
      makeTask(6, 1, 'Day 39 Planned: AgroVision-ML code audit: evaluate existing model weights & pipeline', 'project', 'generated', { isGeneratedPlanning: true, dayNumber: 39 }),
      makeTask(6, 1, 'Day 40 Planned: ERD design: crops, markets, historical_prices, predictions', 'project', 'generated', { isGeneratedPlanning: true, dayNumber: 40 }),
      makeTask(6, 1, 'Day 41 Planned: Implement /health endpoint with uptime and app version', 'project', 'generated', { isGeneratedPlanning: true, dayNumber: 41 }),
      makeTask(6, 1, 'Day 42 Planned: Phase 1 Final Checkpoint: Evaluate readiness for Phase 2', 'log', 'generated', { isGeneratedPlanning: true, dayNumber: 42 }),
    ],
  },

  // ==========================================
  // PHASE 2: BACKEND ENGINEERING & PROJECT (WEEKS 7–14)
  // ==========================================
  {
    weekNumber: 7,
    weekRange: 'Week 7',
    blockRange: 'Weeks 7–8',
    phase: 2,
    phaseTitle: 'Phase 2: Backend Engineering & Project',
    title: 'Build the Backend Core: SQLAlchemy & Migrations',
    summary:
      'Binary Search Trees, Rotated sorted arrays, FastAPI app directory layout, SQLAlchemy 2.0 ORM configuration, and Alembic migrations setup.',
    topics: [
      { category: 'DSA', content: 'Validate BST (LC #98), LCA of BST (LC #235), Search Rotated Sorted Array (LC #33)' },
      { category: 'Backend', content: 'Project structure: app/api, app/models, app/schemas, app/db, SQLAlchemy session pooling, Alembic' },
      { category: 'Project', content: 'Database migration scripts, Crop & Market relational models' },
    ],
    deliverables: [
      'SQLAlchemy PostgreSQL connection established',
      'Alembic migration setup running first schema migration',
      'Solve Validate BST and Search in Rotated Sorted Array',
      'Code structure matches production layout',
    ],
    checkpointFocus: 'Mid-sprint check on ORM database session lifecycle and migrations',
    dsaProblems: [
      { title: 'Validate Binary Search Tree', leetcodeNumber: 98, pattern: 'Trees', difficulty: 'Medium' },
      { title: 'Lowest Common Ancestor of a BST', leetcodeNumber: 235, pattern: 'Trees', difficulty: 'Medium' },
      { title: 'Search in Rotated Sorted Array', leetcodeNumber: 33, pattern: 'Binary Search', difficulty: 'Medium' },
    ],
    tasks: [
      makeTask(7, 2, 'Solve Validate BST (LC #98) & LCA of BST (LC #235)', 'dsa', 'original', { problemNumber: 98, problemDifficulty: 'Medium' }),
      makeTask(7, 2, 'Solve Search in Rotated Sorted Array (LC #33)', 'dsa', 'original', { problemNumber: 33, problemDifficulty: 'Medium' }),
      makeTask(7, 2, 'Set up project structure: app/, app/api/, app/models/, app/schemas/, app/db/, app/tests/', 'backend', 'original'),
      makeTask(7, 2, 'Configure SQLAlchemy 2.0 with PostgreSQL connection pooling', 'backend', 'original'),
      makeTask(7, 2, 'Create Alembic migration setup and verify initial migration', 'backend', 'original'),
      // Generated Planning Tasks
      makeTask(7, 2, 'Day 43 Planned: BST boundary validation range (min_val, max_val)', 'dsa', 'generated', { isGeneratedPlanning: true, dayNumber: 43 }),
      makeTask(7, 2, 'Day 44 Planned: Rotated binary search inflection point analysis', 'dsa', 'generated', { isGeneratedPlanning: true, dayNumber: 44 }),
      makeTask(7, 2, 'Day 45 Planned: SQLAlchemy declarative base, UUID primary keys, timestamps', 'backend', 'generated', { isGeneratedPlanning: true, dayNumber: 45 }),
      makeTask(7, 2, 'Day 46 Planned: Alembic env.py target metadata configuration', 'backend', 'generated', { isGeneratedPlanning: true, dayNumber: 46 }),
      makeTask(7, 2, 'Day 47 Planned: Database session dependency get_db with yield and cleanup', 'backend', 'generated', { isGeneratedPlanning: true, dayNumber: 47 }),
      makeTask(7, 2, 'Day 48 Planned: Seed initial sample crop and market data via Alembic', 'project', 'generated', { isGeneratedPlanning: true, dayNumber: 48 }),
      makeTask(7, 2, 'Day 49 Planned: Week 7 review and DB transaction testing', 'log', 'generated', { isGeneratedPlanning: true, dayNumber: 49 }),
    ],
  },
  {
    weekNumber: 8,
    weekRange: 'Week 8',
    blockRange: 'Weeks 7–8',
    phase: 2,
    phaseTitle: 'Phase 2: Backend Engineering & Project',
    title: 'Build the Backend Core: CRUD Endpoints, Tests & Resume Draft #1',
    summary:
      'FastAPI CRUD endpoints, Pydantic validation, structured error responses, 5+ pytest tests with TestClient, ATS Resume Draft #1, and GitHub profile cleanup.',
    topics: [
      { category: 'DSA', content: 'Subtree of Another Tree (LC #572), Construct Tree from Preorder/Inorder (LC #105), Find Min Rotated Array (LC #153)' },
      { category: 'Backend', content: '3-4 core endpoints (GET /prices, POST /forecasts), structured error responses, 5+ pytest tests' },
      { category: 'Career', content: 'Resume draft #1 (one-page ATS-friendly), GitHub profile cleanup (bio, pinned repos)' },
    ],
    deliverables: [
      'Functioning backend MVP: endpoints + database + migrations',
      '5+ passing pytest tests for endpoints using TestClient',
      'Structured error handling (no unhandled raw 500s)',
      'Resume draft #1 completed (honest, no fabricated metrics)',
      'GitHub profile cleaned up and README written',
      '~45 cumulative DSA problems',
      'Week 8 Checkpoint: Code review of backend core & schema migrations',
    ],
    checkpointFocus: 'Week 8 Checkpoint: Code review of backend core & schema migrations',
    dsaProblems: [
      { title: 'Subtree of Another Tree', leetcodeNumber: 572, pattern: 'Trees', difficulty: 'Easy' },
      { title: 'Construct Binary Tree from Preorder and Inorder Traversal', leetcodeNumber: 105, pattern: 'Trees', difficulty: 'Medium' },
      { title: 'Find Minimum in Rotated Sorted Array', leetcodeNumber: 153, pattern: 'Binary Search', difficulty: 'Medium' },
    ],
    tasks: [
      makeTask(8, 2, 'Solve Subtree of Another Tree (LC #572) & Construct Tree (LC #105)', 'dsa', 'original', { problemNumber: 105, problemDifficulty: 'Medium' }),
      makeTask(8, 2, 'Solve Find Minimum in Rotated Sorted Array (LC #153)', 'dsa', 'original', { problemNumber: 153, problemDifficulty: 'Medium' }),
      makeTask(8, 2, 'Implement 3-4 core endpoints: GET /prices, GET /prices/{id}, POST /forecasts, GET /forecasts', 'backend', 'original'),
      makeTask(8, 2, 'Pydantic request/response schemas with field validation and custom error formatting', 'backend', 'original'),
      makeTask(8, 2, 'Write 5+ pytest unit and integration tests using FastAPI TestClient', 'technical', 'original'),
      makeTask(8, 2, 'Draft Resume #1 (1 page, ATS format, truthful representation of skills)', 'career', 'original'),
      makeTask(8, 2, 'Clean up GitHub profile: bio, pinned repos, clean READMEs', 'career', 'original'),
      makeTask(8, 2, 'Week 8 Checkpoint: Code review backend core & schema migrations', 'log', 'original'),
      // Generated Planning Tasks
      makeTask(8, 2, 'Day 50 Planned: Implement GET /prices with filter query params', 'backend', 'generated', { isGeneratedPlanning: true, dayNumber: 50 }),
      makeTask(8, 2, 'Day 51 Planned: Implement POST /forecasts invoking mock ML model', 'backend', 'generated', { isGeneratedPlanning: true, dayNumber: 51 }),
      makeTask(8, 2, 'Day 52 Planned: Write pytest fixtures for test database session rollback', 'technical', 'generated', { isGeneratedPlanning: true, dayNumber: 52 }),
      makeTask(8, 2, 'Day 53 Planned: Verify 5+ tests pass with 100% assertions', 'technical', 'generated', { isGeneratedPlanning: true, dayNumber: 53 }),
      makeTask(8, 2, 'Day 54 Planned: Resume draft review against ATS keywords', 'career', 'generated', { isGeneratedPlanning: true, dayNumber: 54 }),
      makeTask(8, 2, 'Day 55 Planned: Write comprehensive README with curl examples', 'project', 'generated', { isGeneratedPlanning: true, dayNumber: 55 }),
      makeTask(8, 2, 'Day 56 Planned: Week 8 Checkpoint audit and revision', 'log', 'generated', { isGeneratedPlanning: true, dayNumber: 56 }),
    ],
  },
  {
    weekNumber: 9,
    weekRange: 'Week 9',
    blockRange: 'Weeks 9–10',
    phase: 2,
    phaseTitle: 'Phase 2: Backend Engineering & Project',
    title: 'Make the Application Credible: Graphs & JWT Auth',
    summary:
      'Graphs intro (BFS/DFS, Number of Islands, Clone Graph), Intervals (Merge Intervals), JWT authentication (register, login, password hash with bcrypt).',
    topics: [
      { category: 'DSA', content: 'Graphs intro (LC #200, LC #133), Intervals (LC #56, LC #435)' },
      { category: 'Backend', content: 'JWT authentication (login, register, token verification), bcrypt password hashing, protected routes' },
      { category: 'SQL', content: 'Window functions: ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD' },
    ],
    deliverables: [
      'Number of Islands and Clone Graph solved with graph traversals',
      'JWT authentication working with login, password hashing, and token verify',
      'Protected endpoints require valid Bearer token',
      'SQL window functions demonstrated with practice queries',
    ],
    checkpointFocus: 'Mid-sprint check on JWT token security and graph cycle detection',
    dsaProblems: [
      { title: 'Number of Islands', leetcodeNumber: 200, pattern: 'Graphs', difficulty: 'Medium' },
      { title: 'Clone Graph', leetcodeNumber: 133, pattern: 'Graphs', difficulty: 'Medium' },
      { title: 'Merge Intervals', leetcodeNumber: 56, pattern: 'Intervals', difficulty: 'Medium' },
      { title: 'Non-overlapping Intervals', leetcodeNumber: 435, pattern: 'Intervals', difficulty: 'Medium' },
    ],
    tasks: [
      makeTask(9, 2, 'Solve Number of Islands (LC #200) BFS/DFS grid traversal', 'dsa', 'original', { problemNumber: 200, problemDifficulty: 'Medium' }),
      makeTask(9, 2, 'Solve Clone Graph (LC #133) with visited node map', 'dsa', 'original', { problemNumber: 133, problemDifficulty: 'Medium' }),
      makeTask(9, 2, 'Solve Merge Intervals (LC #56) & Non-overlapping Intervals (LC #435)', 'dsa', 'original', { problemNumber: 56, problemDifficulty: 'Medium' }),
      makeTask(9, 2, 'Implement JWT auth: user registration, password hashing (bcrypt), login endpoint', 'backend', 'original'),
      makeTask(9, 2, 'Write reusable get_current_user FastAPI security dependency', 'backend', 'original'),
      makeTask(9, 2, 'Practice SQL window functions: ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD', 'sql', 'original'),
      // Generated Planning Tasks
      makeTask(9, 2, 'Day 57 Planned: Number of Islands DFS in-place grid sinking', 'dsa', 'generated', { isGeneratedPlanning: true, dayNumber: 57 }),
      makeTask(9, 2, 'Day 58 Planned: Clone Graph node mapping and recursive edge copying', 'dsa', 'generated', { isGeneratedPlanning: true, dayNumber: 58 }),
      makeTask(9, 2, 'Day 59 Planned: Non-overlapping Intervals greedy finish-time sorting', 'dsa', 'generated', { isGeneratedPlanning: true, dayNumber: 59 }),
      makeTask(9, 2, 'Day 60 Planned: bcrypt hash generation and passlib context setup', 'backend', 'generated', { isGeneratedPlanning: true, dayNumber: 60 }),
      makeTask(9, 2, 'Day 61 Planned: JWT token encoding with expiration and secret key in .env', 'backend', 'generated', { isGeneratedPlanning: true, dayNumber: 61 }),
      makeTask(9, 2, 'Day 62 Planned: Write SQL window function queries for price changes', 'sql', 'generated', { isGeneratedPlanning: true, dayNumber: 62 }),
      makeTask(9, 2, 'Day 63 Planned: Week 9 security review and auth integration testing', 'log', 'generated', { isGeneratedPlanning: true, dayNumber: 63 }),
    ],
  },
  {
    weekNumber: 10,
    weekRange: 'Week 10',
    blockRange: 'Weeks 9–10',
    phase: 2,
    phaseTitle: 'Phase 2: Backend Engineering & Project',
    title: 'Make the Application Credible: Pagination, SQL Deep-Dive & Job Tracker',
    summary:
      'Course Schedule, Insert Interval, Top K Frequent Words, query pagination/filtering, error middleware, CTEs & EXPLAIN ANALYZE, and job search spreadsheet setup.',
    topics: [
      { category: 'DSA', content: 'Course Schedule (LC #207), Insert Interval (LC #57), Top K Frequent Words (LC #692)' },
      { category: 'Backend', content: 'Pagination (page, limit, total), query filtering, custom error middleware, 10+ tests' },
      { category: 'SQL', content: 'CTEs (WITH clause), EXPLAIN ANALYZE on 3 queries to interpret execution plan' },
      { category: 'Career', content: 'Job search tracker spreadsheet, research 10 companies, analyze 5 Job Descriptions' },
    ],
    deliverables: [
      'Auth working with tests (10+ cumulative tests)',
      'Pagination + filtering working on list endpoints',
      'SQL window functions & CTEs demonstrated',
      'EXPLAIN ANALYZE run on 3 queries and interpreted',
      'Job tracking spreadsheet started with 10 companies researched',
      '5 Job Descriptions analyzed for required skills',
      '~55 cumulative DSA problems',
      'Week 10 Checkpoint: Test auth security and SQL performance',
    ],
    checkpointFocus: 'Week 10 Checkpoint: Test auth security and SQL performance',
    dsaProblems: [
      { title: 'Course Schedule', leetcodeNumber: 207, pattern: 'Graphs', difficulty: 'Medium' },
      { title: 'Insert Interval', leetcodeNumber: 57, pattern: 'Intervals', difficulty: 'Medium' },
      { title: 'Top K Frequent Words', leetcodeNumber: 692, pattern: 'Heap / Priority Queue', difficulty: 'Medium' },
    ],
    tasks: [
      makeTask(10, 2, 'Solve Course Schedule (LC #207) cycle detection with Kahn algorithm / DFS', 'dsa', 'original', { problemNumber: 207, problemDifficulty: 'Medium' }),
      makeTask(10, 2, 'Solve Insert Interval (LC #57) & Top K Frequent Words (LC #692)', 'dsa', 'original', { problemNumber: 57, problemDifficulty: 'Medium' }),
      makeTask(10, 2, 'Implement pagination and query filtering on prices and forecasts endpoints', 'backend', 'original'),
      makeTask(10, 2, 'Build custom error handling middleware for uniform error responses', 'backend', 'original'),
      makeTask(10, 2, 'Rewrite complex subqueries as Common Table Expressions (CTEs)', 'sql', 'original'),
      makeTask(10, 2, 'Run EXPLAIN ANALYZE on 3 PostgreSQL queries and document index scans vs seq scans', 'sql', 'original'),
      makeTask(10, 2, 'Create job search tracker spreadsheet: Company | Role | Link | Date | Status | Next Action', 'career', 'original'),
      makeTask(10, 2, 'Research 10 target companies & extract common requirements from 5 JDs', 'career', 'original'),
      makeTask(10, 2, 'Week 10 Checkpoint: Test auth security and SQL performance', 'log', 'original'),
      // Generated Planning Tasks
      makeTask(10, 2, 'Day 64 Planned: Course Schedule topological sorting in-degree array', 'dsa', 'generated', { isGeneratedPlanning: true, dayNumber: 64 }),
      makeTask(10, 2, 'Day 65 Planned: Insert Interval boundary stitching', 'dsa', 'generated', { isGeneratedPlanning: true, dayNumber: 65 }),
      makeTask(10, 2, 'Day 66 Planned: FastAPI generic Page[T] pagination schema with next/prev metadata', 'backend', 'generated', { isGeneratedPlanning: true, dayNumber: 66 }),
      makeTask(10, 2, 'Day 67 Planned: Error middleware catching HTTPException and ValidationError', 'backend', 'generated', { isGeneratedPlanning: true, dayNumber: 67 }),
      makeTask(10, 2, 'Day 68 Planned: Execute EXPLAIN ANALYZE and inspect cost/time numbers', 'sql', 'generated', { isGeneratedPlanning: true, dayNumber: 68 }),
      makeTask(10, 2, 'Day 69 Planned: Job tracker spreadsheet setup & JD analysis document', 'career', 'generated', { isGeneratedPlanning: true, dayNumber: 69 }),
      makeTask(10, 2, 'Day 70 Planned: Week 10 Checkpoint scorecard execution', 'log', 'generated', { isGeneratedPlanning: true, dayNumber: 70 }),
    ],
  },
  {
    weekNumber: 11,
    weekRange: 'Week 11',
    blockRange: 'Weeks 11–12',
    phase: 2,
    phaseTitle: 'Phase 2: Backend Engineering & Project',
    title: 'Engineering & Deployment: Docker & Advanced Graphs',
    summary:
      'Pacific Atlantic Water Flow, Course Schedule II, Number of Connected Components, multi-stage Dockerfile, and docker-compose.yml running app + PostgreSQL.',
    topics: [
      { category: 'DSA', content: 'Pacific Atlantic Water Flow (LC #417), Course Schedule II (LC #210), Connected Components (LC #323)' },
      { category: 'DevOps', content: 'Dockerfile for FastAPI app, docker-compose.yml (app + PostgreSQL), reproducible single-command launch' },
    ],
    deliverables: [
      'Multi-stage Dockerfile built and tested',
      'docker-compose.yml runs the entire stack locally with single command',
      'Solve Course Schedule II and Pacific Atlantic Water Flow',
    ],
    checkpointFocus: 'Mid-sprint check on Docker container health and port bindings',
    dsaProblems: [
      { title: 'Pacific Atlantic Water Flow', leetcodeNumber: 417, pattern: 'Graphs', difficulty: 'Medium' },
      { title: 'Course Schedule II', leetcodeNumber: 210, pattern: 'Graphs', difficulty: 'Medium' },
      { title: 'Number of Connected Components in an Undirected Graph', leetcodeNumber: 323, pattern: 'Graphs', difficulty: 'Medium' },
    ],
    tasks: [
      makeTask(11, 2, 'Solve Pacific Atlantic Water Flow (LC #417) multi-source DFS/BFS', 'dsa', 'original', { problemNumber: 417, problemDifficulty: 'Medium' }),
      makeTask(11, 2, 'Solve Course Schedule II (LC #210) topological sort ordering', 'dsa', 'original', { problemNumber: 210, problemDifficulty: 'Medium' }),
      makeTask(11, 2, 'Solve Connected Components (LC #323) Union-Find / BFS', 'dsa', 'original', { problemNumber: 323, problemDifficulty: 'Medium' }),
      makeTask(11, 2, 'Write multi-stage Dockerfile for FastAPI backend application', 'devops', 'original'),
      makeTask(11, 2, 'Write docker-compose.yml launching app + PostgreSQL with health checks', 'devops', 'original'),
      // Generated Planning Tasks
      makeTask(11, 2, 'Day 71 Planned: Pacific Atlantic reverse graph flow from ocean boundaries', 'dsa', 'generated', { isGeneratedPlanning: true, dayNumber: 71 }),
      makeTask(11, 2, 'Day 72 Planned: Course Schedule II building topological output list', 'dsa', 'generated', { isGeneratedPlanning: true, dayNumber: 72 }),
      makeTask(11, 2, 'Day 73 Planned: Union-Find with path compression implementation', 'dsa', 'generated', { isGeneratedPlanning: true, dayNumber: 73 }),
      makeTask(11, 2, 'Day 74 Planned: Multi-stage Docker build reducing final image size', 'devops', 'generated', { isGeneratedPlanning: true, dayNumber: 74 }),
      makeTask(11, 2, 'Day 75 Planned: docker-compose volumes, environment variables, network bridge', 'devops', 'generated', { isGeneratedPlanning: true, dayNumber: 75 }),
      makeTask(11, 2, 'Day 76 Planned: Test `docker compose up` clean bootstrap from scratch', 'devops', 'generated', { isGeneratedPlanning: true, dayNumber: 76 }),
      makeTask(11, 2, 'Day 77 Planned: Week 11 progress review', 'log', 'generated', { isGeneratedPlanning: true, dayNumber: 77 }),
    ],
  },
  {
    weekNumber: 12,
    weekRange: 'Week 12',
    blockRange: 'Weeks 11–12',
    phase: 2,
    phaseTitle: 'Phase 2: Backend Engineering & Project',
    title: 'Engineering & Deployment: CI/CD, Cloud Deployment & Demo Rehearsal',
    summary:
      'Greedy algorithms (Maximum Subarray, Jump Game, Gas Station), GitHub Actions CI workflow, deploy live API to Render/Railway, and 3-minute demo script.',
    topics: [
      { category: 'DSA', content: 'Maximum Subarray (LC #53), Jump Game (LC #55), Gas Station (LC #134)' },
      { category: 'DevOps', content: 'GitHub Actions CI (run pytest + ruff on push/PR), cloud deployment to Render/Railway' },
      { category: 'Project', content: 'Add Python logging, Swagger docs review, 3-minute project demo script' },
    ],
    deliverables: [
      'Docker Compose stack running locally with single command',
      'GitHub Actions CI running tests and linter automatically',
      'Live deployed API with documentation at /docs (or free tier URL)',
      '3-minute project demo script rehearsed',
      '~65 cumulative DSA problems',
      'Week 12 Checkpoint: Full deployment & CI pipeline inspection',
    ],
    checkpointFocus: 'Week 12 Checkpoint: Full deployment & CI pipeline inspection',
    dsaProblems: [
      { title: 'Maximum Subarray', leetcodeNumber: 53, pattern: 'Greedy', difficulty: 'Medium' },
      { title: 'Jump Game', leetcodeNumber: 55, pattern: 'Greedy', difficulty: 'Medium' },
      { title: 'Gas Station', leetcodeNumber: 134, pattern: 'Greedy', difficulty: 'Medium' },
    ],
    tasks: [
      makeTask(12, 2, 'Solve Maximum Subarray (LC #53) Kadane algorithm', 'dsa', 'original', { problemNumber: 53, problemDifficulty: 'Medium' }),
      makeTask(12, 2, 'Solve Jump Game (LC #55) greedy reach tracking', 'dsa', 'original', { problemNumber: 55, problemDifficulty: 'Medium' }),
      makeTask(12, 2, 'Solve Gas Station (LC #134) greedy circular circuit', 'dsa', 'original', { problemNumber: 134, problemDifficulty: 'Medium' }),
      makeTask(12, 2, 'Configure GitHub Actions CI workflow (.github/workflows/ci.yml) with pytest and ruff', 'devops', 'original'),
      makeTask(12, 2, 'Deploy application to cloud PaaS (Render, Railway, or Fly.io) with PostgreSQL addon', 'devops', 'original'),
      makeTask(12, 2, 'Add structured application logging with standard Python logging module', 'backend', 'original'),
      makeTask(12, 2, 'Rehearse 3-minute technical walkthrough script for interviews', 'career', 'original'),
      makeTask(12, 2, 'Week 12 Checkpoint: Full deployment & CI pipeline inspection', 'log', 'original'),
      // Generated Planning Tasks
      makeTask(12, 2, 'Day 78 Planned: Maximum Subarray dynamic programming vs Kadane', 'dsa', 'generated', { isGeneratedPlanning: true, dayNumber: 78 }),
      makeTask(12, 2, 'Day 79 Planned: Jump Game greedy backwards scan', 'dsa', 'generated', { isGeneratedPlanning: true, dayNumber: 79 }),
      makeTask(12, 2, 'Day 80 Planned: Gas Station total deficit vs current deficit logic', 'dsa', 'generated', { isGeneratedPlanning: true, dayNumber: 80 }),
      makeTask(12, 2, 'Day 81 Planned: GitHub Actions YAML configuration and secret injection', 'devops', 'generated', { isGeneratedPlanning: true, dayNumber: 81 }),
      makeTask(12, 2, 'Day 82 Planned: Cloud service configuration and verify live /health check', 'devops', 'generated', { isGeneratedPlanning: true, dayNumber: 82 }),
      makeTask(12, 2, 'Day 83 Planned: Draft and record 3-minute demo video / audio script', 'career', 'generated', { isGeneratedPlanning: true, dayNumber: 83 }),
      makeTask(12, 2, 'Day 84 Planned: Week 12 Checkpoint review', 'log', 'generated', { isGeneratedPlanning: true, dayNumber: 84 }),
    ],
  },
  {
    weekNumber: 13,
    weekRange: 'Week 13',
    blockRange: 'Weeks 13–14',
    phase: 2,
    phaseTitle: 'Phase 2: Backend Engineering & Project',
    title: 'Data, Correctness & Performance: Backtracking & DB Indexes',
    summary:
      'Backtracking (Combination Sum, Permutations), database B-tree indexes, ACID transactions, isolation levels, and locking.',
    topics: [
      { category: 'DSA', content: 'Combination Sum (LC #39), Permutations (LC #46), Backtracking template' },
      { category: 'Backend', content: 'Database indexes (B-tree, compound indexes), transactions, isolation levels (Read Committed, Repeatable Read, Serializable)' },
      { category: 'SQL', content: 'Locking mechanisms, deadlock causes and prevention in PostgreSQL' },
    ],
    deliverables: [
      'Combination Sum and Permutations solved with decision trees',
      'Database indexes added for frequently queried columns',
      'Transaction rollbacks and isolation levels verified',
    ],
    checkpointFocus: 'Mid-sprint check on database index utilization and backtracking recursion state',
    dsaProblems: [
      { title: 'Combination Sum', leetcodeNumber: 39, pattern: 'Backtracking', difficulty: 'Medium' },
      { title: 'Permutations', leetcodeNumber: 46, pattern: 'Backtracking', difficulty: 'Medium' },
    ],
    tasks: [
      makeTask(13, 2, 'Solve Combination Sum (LC #39) backtracking with candidate reuse', 'dsa', 'original', { problemNumber: 39, problemDifficulty: 'Medium' }),
      makeTask(13, 2, 'Solve Permutations (LC #46) backtracking with visited elements', 'dsa', 'original', { problemNumber: 46, problemDifficulty: 'Medium' }),
      makeTask(13, 2, 'Add B-tree indexes for crop_id, market_id, timestamp in PostgreSQL', 'backend', 'original'),
      makeTask(13, 2, 'Review and apply explicit ACID database transactions for multi-step mutations', 'backend', 'original'),
      makeTask(13, 2, 'Study transaction isolation levels and deadlock scenarios in PostgreSQL', 'sql', 'original'),
      // Generated Planning Tasks
      makeTask(13, 2, 'Day 85 Planned: Backtracking tree drawing and base case termination', 'dsa', 'generated', { isGeneratedPlanning: true, dayNumber: 85 }),
      makeTask(13, 2, 'Day 86 Planned: Permutations swap vs array slicing trade-offs', 'dsa', 'generated', { isGeneratedPlanning: true, dayNumber: 86 }),
      makeTask(13, 2, 'Day 87 Planned: Analyze index selectivity and create composite index', 'backend', 'generated', { isGeneratedPlanning: true, dayNumber: 87 }),
      makeTask(13, 2, 'Day 88 Planned: Implement with db.begin() atomic blocks in FastAPI handlers', 'backend', 'generated', { isGeneratedPlanning: true, dayNumber: 88 }),
      makeTask(13, 2, 'Day 89 Planned: Simulate concurrent transactions and lock contention', 'sql', 'generated', { isGeneratedPlanning: true, dayNumber: 89 }),
      makeTask(13, 2, 'Day 90 Planned: Benchmark index speedup with EXPLAIN ANALYZE', 'backend', 'generated', { isGeneratedPlanning: true, dayNumber: 90 }),
      makeTask(13, 2, 'Day 91 Planned: Week 13 review and revision queue catch-up', 'log', 'generated', { isGeneratedPlanning: true, dayNumber: 91 }),
    ],
  },
  {
    weekNumber: 14,
    weekRange: 'Week 14',
    blockRange: 'Weeks 13–14',
    phase: 2,
    phaseTitle: 'Phase 2: Backend Engineering & Project',
    title: 'Data, Correctness & Performance: Security, Load Testing & Phase 2 Defense',
    summary:
      'Word Search, N-Queens attempt, security checklist (SQL injection, XSS, CSRF, rate limiting, CORS), load testing script (10 req/s), and Phase 2 Backend Defense.',
    topics: [
      { category: 'DSA', content: 'Word Search (LC #79), N-Queens (LC #51 attempt), 5 revision problems' },
      { category: 'Security', content: 'Security checklist: SQL injection, XSS, CSRF, CORS, auth rate limiting' },
      { category: 'Testing', content: 'Simple concurrency load test (10 req/s), document known limitations' },
    ],
    deliverables: [
      'Database optimized with appropriate indexes',
      'Security checklist completed (CORS, rate limiting, SQL injection defense)',
      'Load testing completed with documented trade-offs and limits',
      '~75 cumulative DSA problems',
      'Phase 2 backend completion milestone achieved',
      'Week 14 Checkpoint: Phase 2 Backend Defense & mock technical walkthrough',
    ],
    checkpointFocus: 'Week 14 Checkpoint: Phase 2 Backend Defense & mock technical walkthrough',
    dsaProblems: [
      { title: 'Word Search', leetcodeNumber: 79, pattern: 'Backtracking', difficulty: 'Medium' },
      { title: 'N-Queens', leetcodeNumber: 51, pattern: 'Backtracking', difficulty: 'Hard' },
    ],
    tasks: [
      makeTask(14, 2, 'Solve Word Search (LC #79) grid backtracking with visited tracking', 'dsa', 'original', { problemNumber: 79, problemDifficulty: 'Medium' }),
      makeTask(14, 2, 'Attempt N-Queens (LC #51) column and diagonal bitmask / set constraints', 'dsa', 'original', { problemNumber: 51, problemDifficulty: 'Hard' }),
      makeTask(14, 2, 'Complete security checklist: SQL injection parameterization, XSS, CSRF, secure headers', 'backend', 'original'),
      makeTask(14, 2, 'Add rate limiting to authentication endpoints to prevent brute-force attacks', 'backend', 'original'),
      makeTask(14, 2, 'Configure strict CORS middleware for frontend origins', 'backend', 'original'),
      makeTask(14, 2, 'Run concurrency load test with 10 concurrent requests and document bottlenecks', 'technical', 'original'),
      makeTask(14, 2, 'Document project trade-offs and limitations honestly in ARCHITECTURE.md', 'project', 'original'),
      makeTask(14, 2, 'Week 14 Checkpoint: Conduct Phase 2 Backend Defense & mock technical walkthrough', 'log', 'original'),
      // Generated Planning Tasks
      makeTask(14, 2, 'Day 92 Planned: Word Search grid boundary guards and backtracking restore', 'dsa', 'generated', { isGeneratedPlanning: true, dayNumber: 92 }),
      makeTask(14, 2, 'Day 93 Planned: N-Queens attack validation algorithms', 'dsa', 'generated', { isGeneratedPlanning: true, dayNumber: 93 }),
      makeTask(14, 2, 'Day 94 Planned: Rate limiter implementation using in-memory token bucket', 'backend', 'generated', { isGeneratedPlanning: true, dayNumber: 94 }),
      makeTask(14, 2, 'Day 95 Planned: Load test script execution and latency measurement', 'technical', 'generated', { isGeneratedPlanning: true, dayNumber: 95 }),
      makeTask(14, 2, 'Day 96 Planned: Update ARCHITECTURE.md with architectural trade-offs', 'project', 'generated', { isGeneratedPlanning: true, dayNumber: 96 }),
      makeTask(14, 2, 'Day 97 Planned: Full mock technical walkthrough presentation rehearsal', 'career', 'generated', { isGeneratedPlanning: true, dayNumber: 97 }),
      makeTask(14, 2, 'Day 98 Planned: Phase 2 Final Checkpoint audit and sign-off', 'log', 'generated', { isGeneratedPlanning: true, dayNumber: 98 }),
    ],
  },

  // ==========================================
  // PHASE 3: INTERVIEW PREPARATION & JOB SEARCH (WEEKS 15–24)
  // ==========================================
  {
    weekNumber: 15,
    weekRange: 'Week 15',
    blockRange: 'Weeks 15–16',
    phase: 3,
    phaseTitle: 'Phase 3: Interview Preparation & Job Search',
    title: 'Complete DSA Foundation: 1D Dynamic Programming',
    summary:
      'Dynamic Programming foundations: House Robber, Coin Change, Longest Increasing Subsequence, recurrence relations, and memoization vs tabulation.',
    topics: [
      { category: 'DSA', content: 'Climbing Stairs revision, House Robber (LC #198), Coin Change (LC #322), LIS (LC #300)' },
      { category: 'DP Theory', content: 'Identifying overlapping subproblems, optimal substructure, recurrence relations' },
    ],
    deliverables: [
      'House Robber and Coin Change solved with bottom-up tabulation',
      'Longest Increasing Subsequence O(N^2) and O(N log N) analyzed',
      'DP recurrence relations explained aloud',
    ],
    checkpointFocus: 'Mid-sprint check on DP state transitions and edge cases',
    dsaProblems: [
      { title: 'Climbing Stairs', leetcodeNumber: 70, pattern: 'Dynamic Programming', difficulty: 'Easy' },
      { title: 'House Robber', leetcodeNumber: 198, pattern: 'Dynamic Programming', difficulty: 'Medium' },
      { title: 'Coin Change', leetcodeNumber: 322, pattern: 'Dynamic Programming', difficulty: 'Medium' },
      { title: 'Longest Increasing Subsequence', leetcodeNumber: 300, pattern: 'Dynamic Programming', difficulty: 'Medium' },
    ],
    tasks: [
      makeTask(15, 3, 'Solve House Robber (LC #198) 1D state transition', 'dsa', 'original', { problemNumber: 198, problemDifficulty: 'Medium' }),
      makeTask(15, 3, 'Solve Coin Change (LC #322) unbounded knapsack bottom-up', 'dsa', 'original', { problemNumber: 322, problemDifficulty: 'Medium' }),
      makeTask(15, 3, 'Solve Longest Increasing Subsequence (LC #300)', 'dsa', 'original', { problemNumber: 300, problemDifficulty: 'Medium' }),
      makeTask(15, 3, 'Practice expressing DP recurrence relations before writing code', 'dsa', 'original'),
      // Generated Planning Tasks
      makeTask(15, 3, 'Day 99 Planned: House Robber base cases and rob vs skip equation', 'dsa', 'generated', { isGeneratedPlanning: true, dayNumber: 99 }),
      makeTask(15, 3, 'Day 100 Planned: Coin Change array initialization with infinity sentinel', 'dsa', 'generated', { isGeneratedPlanning: true, dayNumber: 100 }),
      makeTask(15, 3, 'Day 101 Planned: LIS binary search patience sorting optimization', 'dsa', 'generated', { isGeneratedPlanning: true, dayNumber: 101 }),
      makeTask(15, 3, 'Day 102 Planned: Re-solve 2 prior medium problems under timer', 'dsa', 'generated', { isGeneratedPlanning: true, dayNumber: 102 }),
      makeTask(15, 3, 'Day 103 Planned: Project polish: finalize documentation', 'project', 'generated', { isGeneratedPlanning: true, dayNumber: 103 }),
      makeTask(15, 3, 'Day 104 Planned: Verbalize DP subproblem formulation out loud', 'interview', 'generated', { isGeneratedPlanning: true, dayNumber: 104 }),
      makeTask(15, 3, 'Day 105 Planned: Week 15 review', 'log', 'generated', { isGeneratedPlanning: true, dayNumber: 105 }),
    ],
  },
  {
    weekNumber: 16,
    weekRange: 'Week 16',
    blockRange: 'Weeks 15–16',
    phase: 3,
    phaseTitle: 'Phase 3: Interview Preparation & Job Search',
    title: 'Complete DSA Foundation: 2D DP, Timed Solving & First Mock Coding',
    summary:
      'LCS, Word Break, Unique Paths, Decode Ways, timed solving routine (2 mediums in 30m each), project feature freeze, and first 45-min mock coding interview.',
    topics: [
      { category: 'DSA', content: 'Longest Common Subsequence (LC #1143), Word Break (LC #139), Unique Paths (LC #62), Decode Ways (LC #91)' },
      { category: 'Practice', content: 'Timed coding: 2 random medium problems, 30 min each' },
      { category: 'Interview', content: 'First mock coding interview conducted (45 min, 2 problems) with recorded scorecard' },
      { category: 'Project', content: 'Project feature-complete and frozen' },
    ],
    deliverables: [
      'DP recurrence relations and tabulation demonstrated',
      'Timed practice routine established',
      'First mock coding interview conducted and logged',
      'AgroVision-ML backend feature-complete and frozen',
      '~85 cumulative DSA problems',
      'Week 16 Checkpoint: Coding speed & live problem-solving audit',
    ],
    checkpointFocus: 'Week 16 Checkpoint: Coding speed & live problem-solving audit',
    dsaProblems: [
      { title: 'Longest Common Subsequence', leetcodeNumber: 1143, pattern: 'Dynamic Programming', difficulty: 'Medium' },
      { title: 'Word Break', leetcodeNumber: 139, pattern: 'Dynamic Programming', difficulty: 'Medium' },
      { title: 'Unique Paths', leetcodeNumber: 62, pattern: 'Dynamic Programming', difficulty: 'Medium' },
      { title: 'Decode Ways', leetcodeNumber: 91, pattern: 'Dynamic Programming', difficulty: 'Medium' },
    ],
    tasks: [
      makeTask(16, 3, 'Solve Longest Common Subsequence (LC #1143) 2D grid DP', 'dsa', 'original', { problemNumber: 1143, problemDifficulty: 'Medium' }),
      makeTask(16, 3, 'Solve Word Break (LC #139) boolean prefix DP', 'dsa', 'original', { problemNumber: 139, problemDifficulty: 'Medium' }),
      makeTask(16, 3, 'Solve Unique Paths (LC #62) & Decode Ways (LC #91)', 'dsa', 'original', { problemNumber: 62, problemDifficulty: 'Medium' }),
      makeTask(16, 3, 'Timed coding session: solve 2 random medium problems in 30 min each', 'dsa', 'original'),
      makeTask(16, 3, 'Conduct first mock coding interview (45 min, 2 problems)', 'interview', 'original'),
      makeTask(16, 3, 'Freeze project codebase as feature-complete', 'project', 'original'),
      makeTask(16, 3, 'Week 16 Checkpoint: Coding speed & live problem-solving audit', 'log', 'original'),
      // Generated Planning Tasks
      makeTask(16, 3, 'Day 106 Planned: LCS 2D grid matching vs mismatch transition', 'dsa', 'generated', { isGeneratedPlanning: true, dayNumber: 106 }),
      makeTask(16, 3, 'Day 107 Planned: Word Break substring dictionary check', 'dsa', 'generated', { isGeneratedPlanning: true, dayNumber: 107 }),
      makeTask(16, 3, 'Day 108 Planned: Decode Ways single digit and double digit parsing edge cases', 'dsa', 'generated', { isGeneratedPlanning: true, dayNumber: 108 }),
      makeTask(16, 3, 'Day 109 Planned: Timed medium solving simulation #1', 'dsa', 'generated', { isGeneratedPlanning: true, dayNumber: 109 }),
      makeTask(16, 3, 'Day 110 Planned: Timed medium solving simulation #2', 'dsa', 'generated', { isGeneratedPlanning: true, dayNumber: 110 }),
      makeTask(16, 3, 'Day 111 Planned: Execute Mock Interview #1 (Pramp or Peer)', 'interview', 'generated', { isGeneratedPlanning: true, dayNumber: 111 }),
      makeTask(16, 3, 'Day 112 Planned: Week 16 Checkpoint scorecard', 'log', 'generated', { isGeneratedPlanning: true, dayNumber: 112 }),
    ],
  },
  {
    weekNumber: 17,
    weekRange: 'Week 17',
    blockRange: 'Weeks 17–18',
    phase: 3,
    phaseTitle: 'Phase 3: Interview Preparation & Job Search',
    title: 'Core CS Fundamentals & System Design: OS & Networks',
    summary:
      'Operating Systems (process vs thread, virtual memory, mutex/semaphore), Computer Networks (OSI, TCP/UDP, DNS, TLS handshake), and URL shortener design.',
    topics: [
      { category: 'OS', content: 'Process vs thread, context switch, virtual memory, paging, mutex vs semaphore, deadlock conditions' },
      { category: 'Networks', content: 'OSI/TCP-IP layers, TCP vs UDP, DNS resolution, HTTP/HTTPS, TLS handshake, URL anatomy' },
      { category: 'System Design', content: 'Design URL shortener (hashing, base62, database choice, caching with Redis)' },
    ],
    deliverables: [
      'OS interview notes compiled (1-2 pages)',
      'Networks interview notes compiled (1-2 pages)',
      'Design URL shortener end-to-end on whiteboard or paper',
    ],
    checkpointFocus: 'Mid-sprint check on OS concurrency concepts and networking flow',
    dsaProblems: [
      { title: 'Revision of weak patterns', difficulty: 'Medium' },
    ],
    tasks: [
      makeTask(17, 3, 'Compile OS interview notes: process vs thread, virtual memory, mutex vs semaphore, deadlock 4 conditions', 'cs_theory', 'original'),
      makeTask(17, 3, 'Compile Networks interview notes: TCP 3-way handshake, TCP vs UDP, DNS lookup, TLS handshake', 'cs_theory', 'original'),
      makeTask(17, 3, 'Explain end-to-end: "What happens when you type a URL into your browser?"', 'cs_theory', 'original'),
      makeTask(17, 3, 'Practice system design: Design a URL shortener end-to-end', 'system_design', 'original'),
      // Generated Planning Tasks
      makeTask(17, 3, 'Day 113 Planned: OS process address space, stack vs heap, threads race conditions', 'cs_theory', 'generated', { isGeneratedPlanning: true, dayNumber: 113 }),
      makeTask(17, 3, 'Day 114 Planned: Mutex vs binary semaphore vs spinlock trade-offs', 'cs_theory', 'generated', { isGeneratedPlanning: true, dayNumber: 114 }),
      makeTask(17, 3, 'Day 115 Planned: TCP flow control, congestion window, UDP use cases', 'cs_theory', 'generated', { isGeneratedPlanning: true, dayNumber: 115 }),
      makeTask(17, 3, 'Day 116 Planned: Step-by-step DNS recursive resolution and TLS 1.3 key exchange', 'cs_theory', 'generated', { isGeneratedPlanning: true, dayNumber: 116 }),
      makeTask(17, 3, 'Day 117 Planned: URL shortener capacity estimation and Base62 encoding', 'system_design', 'generated', { isGeneratedPlanning: true, dayNumber: 117 }),
      makeTask(17, 3, 'Day 118 Planned: Solve 1 random medium DSA revision problem', 'dsa', 'generated', { isGeneratedPlanning: true, dayNumber: 118 }),
      makeTask(17, 3, 'Day 119 Planned: Week 17 verbal review', 'interview', 'generated', { isGeneratedPlanning: true, dayNumber: 119 }),
    ],
  },
  {
    weekNumber: 18,
    weekRange: 'Week 18',
    blockRange: 'Weeks 17–18',
    phase: 3,
    phaseTitle: 'Phase 3: Interview Preparation & Job Search',
    title: 'Core CS Fundamentals & System Design: DBMS, OOP, Mocks & Resume v2',
    summary:
      'DBMS theory (B-trees, ACID, isolation levels), OOP (SOLID principles, composition), API rate limiter design, Resume v2, and backend/theory mock interviews.',
    topics: [
      { category: 'DBMS', content: 'Normalization, B-tree indexes, transactions, ACID, isolation levels, deadlocks' },
      { category: 'OOP', content: '4 pillars, SOLID principles simplified, composition vs inheritance, interfaces' },
      { category: 'System Design', content: 'API rate limiter, caching (Redis), message queues, scaling principles' },
      { category: 'Mock', content: '1 backend mock (30m) + 1 CS theory mock (20m)' },
      { category: 'Career', content: 'Resume v2 with honest, demonstrable achievements' },
    ],
    deliverables: [
      'CS interview notes complete across all 4 subjects',
      'System design: URL shortener and rate limiter explained end-to-end',
      'Resume v2 completed and reviewed',
      'Mock interview scores logged',
      '~90 cumulative DSA problems',
      'Week 18 Checkpoint: Rapid-fire CS theory and system design drill',
    ],
    checkpointFocus: 'Week 18 Checkpoint: Rapid-fire CS theory and system design drill',
    dsaProblems: [
      { title: 'Re-solve 3 hardest revision queue problems', difficulty: 'Medium' },
    ],
    tasks: [
      makeTask(18, 3, 'Compile DBMS interview notes: B-trees, indexing, ACID properties, isolation anomalies', 'cs_theory', 'original'),
      makeTask(18, 3, 'Compile OOP interview notes: 4 pillars, SOLID simplified, composition over inheritance', 'cs_theory', 'original'),
      makeTask(18, 3, 'Design an API rate limiter (Token bucket / Leaky bucket / Redis sliding window)', 'system_design', 'original'),
      makeTask(18, 3, 'Conduct 1 backend mock interview (30 min) + 1 CS theory rapid-fire mock (20 min)', 'interview', 'original'),
      makeTask(18, 3, 'Finalize Resume v2 with clean project metrics and verified tech stack', 'career', 'original'),
      makeTask(18, 3, 'Week 18 Checkpoint: Rapid-fire CS theory and system design drill', 'log', 'original'),
      // Generated Planning Tasks
      makeTask(18, 3, 'Day 120 Planned: B-Tree vs Hash index comparison, clustered vs non-clustered', 'cs_theory', 'generated', { isGeneratedPlanning: true, dayNumber: 120 }),
      makeTask(18, 3, 'Day 121 Planned: SOLID principles with Python code examples', 'cs_theory', 'generated', { isGeneratedPlanning: true, dayNumber: 121 }),
      makeTask(18, 3, 'Day 122 Planned: API rate limiter system design diagrams', 'system_design', 'generated', { isGeneratedPlanning: true, dayNumber: 122 }),
      makeTask(18, 3, 'Day 123 Planned: Backend API design mock session', 'interview', 'generated', { isGeneratedPlanning: true, dayNumber: 123 }),
      makeTask(18, 3, 'Day 124 Planned: CS theory rapid-fire mock session', 'interview', 'generated', { isGeneratedPlanning: true, dayNumber: 124 }),
      makeTask(18, 3, 'Day 125 Planned: Resume v2 review & export PDF', 'career', 'generated', { isGeneratedPlanning: true, dayNumber: 125 }),
      makeTask(18, 3, 'Day 126 Planned: Week 18 Checkpoint scorecard', 'log', 'generated', { isGeneratedPlanning: true, dayNumber: 126 }),
    ],
  },
  {
    weekNumber: 19,
    weekRange: 'Week 19',
    blockRange: 'Weeks 19–20',
    phase: 3,
    phaseTitle: 'Phase 3: Interview Preparation & Job Search',
    title: 'Focused Job Search Execution: Applications Sprint #1',
    summary:
      'Apply to 8-12 targeted roles across 4 company tiers, send 3-5 referral requests, track pipeline in spreadsheet, and target DSA revision.',
    topics: [
      { category: 'Applications', content: '8-12 targeted applications across Product High, Product Mid, Service+, Startups' },
      { category: 'Outreach', content: '3-5 professional referral requests per week, LinkedIn profile optimization' },
      { category: 'DSA', content: 'Targeted revision on weak patterns under timer' },
    ],
    deliverables: [
      '8-12 targeted applications sent and logged',
      '3-5 referral requests sent with customized intro',
      'LinkedIn headline, summary, and experience fully optimized',
      'Daily tracking in job application spreadsheet',
    ],
    checkpointFocus: 'Mid-sprint check on application volume and response rates',
    dsaProblems: [
      { title: 'Timed practice: 2 medium problems under 30 min', difficulty: 'Medium' },
    ],
    tasks: [
      makeTask(19, 3, 'Optimize LinkedIn profile: headline, technical summary, GitHub & project links', 'career', 'original'),
      makeTask(19, 3, 'Send 8-12 tailored job applications across the 4 company tiers', 'career', 'original'),
      makeTask(19, 3, 'Send 3-5 professional referral requests on LinkedIn with concise pitch', 'career', 'original'),
      makeTask(19, 3, 'Log every application in the job tracking spreadsheet daily', 'career', 'original'),
      makeTask(19, 3, 'Solve 2 timed medium DSA problems focused on weak patterns', 'dsa', 'original'),
      // Generated Planning Tasks
      makeTask(19, 3, 'Day 127 Planned: LinkedIn profile overhaul and portfolio URL test', 'career', 'generated', { isGeneratedPlanning: true, dayNumber: 127 }),
      makeTask(19, 3, 'Day 128 Planned: Apply to 3 Tier-1 Product companies with custom cover note', 'career', 'generated', { isGeneratedPlanning: true, dayNumber: 128 }),
      makeTask(19, 3, 'Day 129 Planned: Apply to 3 Tier-2 Product companies and send referral messages', 'career', 'generated', { isGeneratedPlanning: true, dayNumber: 129 }),
      makeTask(19, 3, 'Day 130 Planned: Apply to 3 funded startups on Wellfound / Instahyre', 'career', 'generated', { isGeneratedPlanning: true, dayNumber: 130 }),
      makeTask(19, 3, 'Day 131 Planned: Apply to 2 Service+ elevated tracks (TCS Digital / Infosys PP)', 'career', 'generated', { isGeneratedPlanning: true, dayNumber: 131 }),
      makeTask(19, 3, 'Day 132 Planned: Timed DSA practice on graphs and trees', 'dsa', 'generated', { isGeneratedPlanning: true, dayNumber: 132 }),
      makeTask(19, 3, 'Day 133 Planned: Week 19 pipeline update and follow-up logging', 'log', 'generated', { isGeneratedPlanning: true, dayNumber: 133 }),
    ],
  },
  {
    weekNumber: 20,
    weekRange: 'Week 20',
    blockRange: 'Weeks 19–20',
    phase: 3,
    phaseTitle: 'Phase 3: Interview Preparation & Job Search',
    title: 'Focused Job Search Execution: Applications Sprint #2 & Prep Folders',
    summary:
      'Send 8-12 more applications (16-24 cumulative), create company-specific interview prep folders, timed DSA rounds, and application pipeline audit.',
    topics: [
      { category: 'Applications', content: '8-12 more targeted applications (total 16-24 over 2 weeks)' },
      { category: 'Research', content: 'Research company-specific interview formats for callbacks / active pipelines' },
      { category: 'DSA', content: 'Reach ~95 cumulative solved DSA problems' },
    ],
    deliverables: [
      '16-24 cumulative applications sent over 2 weeks',
      'Application tracker spreadsheet maintained daily',
      'Company-specific interview prep folders created for active pipelines',
      '~95 cumulative DSA problems',
      'Week 20 Checkpoint: Application pipeline velocity & callback rate audit',
    ],
    checkpointFocus: 'Week 20 Checkpoint: Application pipeline velocity & callback rate audit',
    dsaProblems: [
      { title: 'Revision of hardest unsolved problems', difficulty: 'Medium' },
    ],
    tasks: [
      makeTask(20, 3, 'Send 8-12 more targeted job applications (16-24 total across Weeks 19-20)', 'career', 'original'),
      makeTask(20, 3, 'Send 3-5 more referral requests on LinkedIn', 'career', 'original'),
      makeTask(20, 3, 'Research interview formats and question history for responsive companies', 'career', 'original'),
      makeTask(20, 3, 'Maintain and update status of all applications in spreadsheet', 'career', 'original'),
      makeTask(20, 3, 'Reach ~95 cumulative solved DSA problems', 'dsa', 'original'),
      makeTask(20, 3, 'Week 20 Checkpoint: Application pipeline velocity & callback rate audit', 'log', 'original'),
      // Generated Planning Tasks
      makeTask(20, 3, 'Day 134 Planned: Batch 1 applications (4 companies) via careers portals', 'career', 'generated', { isGeneratedPlanning: true, dayNumber: 134 }),
      makeTask(20, 3, 'Day 135 Planned: Batch 2 applications (4 companies) on LinkedIn and Cutshort', 'career', 'generated', { isGeneratedPlanning: true, dayNumber: 135 }),
      makeTask(20, 3, 'Day 136 Planned: Company interview research and notes compilation', 'career', 'generated', { isGeneratedPlanning: true, dayNumber: 136 }),
      makeTask(20, 3, 'Day 137 Planned: Timed dynamic programming solving drill', 'dsa', 'generated', { isGeneratedPlanning: true, dayNumber: 137 }),
      makeTask(20, 3, 'Day 138 Planned: Timed sliding window and stack solving drill', 'dsa', 'generated', { isGeneratedPlanning: true, dayNumber: 138 }),
      makeTask(20, 3, 'Day 139 Planned: Follow-up outreach on pending referral requests', 'career', 'generated', { isGeneratedPlanning: true, dayNumber: 139 }),
      makeTask(20, 3, 'Day 140 Planned: Week 20 Checkpoint audit', 'log', 'generated', { isGeneratedPlanning: true, dayNumber: 140 }),
    ],
  },
  {
    weekNumber: 21,
    weekRange: 'Week 21',
    blockRange: 'Weeks 21–22',
    phase: 3,
    phaseTitle: 'Phase 3: Interview Preparation & Job Search',
    title: 'Interview Performance: Mock Rounds & Behavioral Stories',
    summary:
      '2 full coding mocks (45m), 1 system design mock, 1 behavioral mock, behavioral story bank (90s intro, 3m project defense, bug story), and 8-12 applications.',
    topics: [
      { category: 'Interviews', content: '2 full coding mocks (45 min each) + 1 system design / backend mock + 1 behavioral mock' },
      { category: 'Behavioral', content: '90s "Tell me about yourself", 3min project walkthrough, real bug fixed story, "Why this company?"' },
      { category: 'Applications', content: 'Continue 8-12 applications per week' },
    ],
    deliverables: [
      '2 full coding mocks conducted with scorecards',
      '1 system design mock and 1 behavioral mock completed',
      'Behavioral story bank rehearsed and timed',
      '8-12 additional job applications sent',
    ],
    checkpointFocus: 'Mid-sprint mock interview debrief and communication calibration',
    dsaProblems: [
      { title: 'Mock Coding Set 1 (2 Medium problems, 45 min)', difficulty: 'Medium' },
    ],
    tasks: [
      makeTask(21, 3, 'Conduct 2 full coding mock interviews (45 min, 2 problems each)', 'interview', 'original'),
      makeTask(21, 3, 'Conduct 1 system design / backend architecture mock interview', 'interview', 'original'),
      makeTask(21, 3, 'Rehearse behavioral responses: 90s intro, 3min project defense, bug fixed story', 'interview', 'original'),
      makeTask(21, 3, 'Send 8-12 targeted job applications', 'career', 'original'),
      makeTask(21, 3, 'Remediate any identified weak points from mock feedback', 'dsa', 'original'),
      // Generated Planning Tasks
      makeTask(21, 3, 'Day 141 Planned: Mock coding round #1 under strict 45-min timer', 'interview', 'generated', { isGeneratedPlanning: true, dayNumber: 141 }),
      makeTask(21, 3, 'Day 142 Planned: System design mock: URL shortener & rate limiter defense', 'interview', 'generated', { isGeneratedPlanning: true, dayNumber: 142 }),
      makeTask(21, 3, 'Day 143 Planned: Behavioral mock: deliver 90s pitch and project story', 'interview', 'generated', { isGeneratedPlanning: true, dayNumber: 143 }),
      makeTask(21, 3, 'Day 144 Planned: Mock coding round #2 under strict 45-min timer', 'interview', 'generated', { isGeneratedPlanning: true, dayNumber: 144 }),
      makeTask(21, 3, 'Day 145 Planned: Send 6 targeted applications', 'career', 'generated', { isGeneratedPlanning: true, dayNumber: 145 }),
      makeTask(21, 3, 'Day 146 Planned: Send 6 targeted applications', 'career', 'generated', { isGeneratedPlanning: true, dayNumber: 146 }),
      makeTask(21, 3, 'Day 147 Planned: Week 21 mock debrief and score logging', 'log', 'generated', { isGeneratedPlanning: true, dayNumber: 147 }),
    ],
  },
  {
    weekNumber: 22,
    weekRange: 'Week 22',
    blockRange: 'Weeks 21–22',
    phase: 3,
    phaseTitle: 'Phase 3: Interview Preparation & Job Search',
    title: 'Interview Performance: Weakness Remediation & 100 DSA Problems',
    summary:
      'Remediate failed mock topics, reach ~100 cumulative DSA problems mastered, 30-40 cumulative applications sent, and real interview debriefing.',
    topics: [
      { category: 'Interviews', content: 'Mock interview upward trend, debrief real interview experiences if scheduled' },
      { category: 'DSA', content: 'Target actual weak points from interviews; reach ~100 cumulative master problems' },
      { category: 'Applications', content: 'Continue 8-12 applications per week (30-40 cumulative sent)' },
    ],
    deliverables: [
      'Mock interview scorecard showing upward trend',
      'Weakness remediation: targeted practice on failed topics',
      '30-40 cumulative applications sent',
      '~100 cumulative DSA problems mastered',
      'Real interview experiences debriefed and logged',
      'Week 22 Checkpoint: Real interview performance calibration',
    ],
    checkpointFocus: 'Week 22 Checkpoint: Real interview performance calibration',
    dsaProblems: [
      { title: 'Mock Coding Set 2 (2 Medium problems, 45 min)', difficulty: 'Medium' },
    ],
    tasks: [
      makeTask(22, 3, 'Remediate identified technical weaknesses from mock rounds', 'dsa', 'original'),
      makeTask(22, 3, 'Reach ~100 cumulative DSA problems mastered across all 14 patterns', 'dsa', 'original'),
      makeTask(22, 3, 'Reach 30-40 cumulative job applications sent', 'career', 'original'),
      makeTask(22, 3, 'Log and debrief all real company interview rounds (OA, technical, behavioral)', 'career', 'original'),
      makeTask(22, 3, 'Week 22 Checkpoint: Real interview performance calibration', 'log', 'original'),
      // Generated Planning Tasks
      makeTask(22, 3, 'Day 148 Planned: Remediation: re-solve failed patterns under timer', 'dsa', 'generated', { isGeneratedPlanning: true, dayNumber: 148 }),
      makeTask(22, 3, 'Day 149 Planned: Advanced variant problem solving (reaching 100 problem target)', 'dsa', 'generated', { isGeneratedPlanning: true, dayNumber: 149 }),
      makeTask(22, 3, 'Day 150 Planned: Send 5 targeted applications & follow up on active OAs', 'career', 'generated', { isGeneratedPlanning: true, dayNumber: 150 }),
      makeTask(22, 3, 'Day 151 Planned: Complete Online Assessments (OAs) in timed environment', 'career', 'generated', { isGeneratedPlanning: true, dayNumber: 151 }),
      makeTask(22, 3, 'Day 152 Planned: Behavioral refinement: answering weakness question honestly', 'interview', 'generated', { isGeneratedPlanning: true, dayNumber: 152 }),
      makeTask(22, 3, 'Day 153 Planned: Real interview debrief logging in mockInterviews store', 'interview', 'generated', { isGeneratedPlanning: true, dayNumber: 153 }),
      makeTask(22, 3, 'Day 154 Planned: Week 22 Checkpoint review', 'log', 'generated', { isGeneratedPlanning: true, dayNumber: 154 }),
    ],
  },
  {
    weekNumber: 23,
    weekRange: 'Week 23',
    blockRange: 'Weeks 23–24',
    phase: 3,
    phaseTitle: 'Phase 3: Interview Preparation & Job Search',
    title: 'Final Readiness & Conversion: Full Pattern Consolidation',
    summary:
      'Consolidate all 14 DSA patterns, core CS concepts, project architecture defense, and company-specific interview prep for scheduled rounds.',
    topics: [
      { category: 'Revision', content: 'Consolidate all 14 DSA patterns, CS theory without notes, write SQL queries from memory' },
      { category: 'Interviews', content: 'Company-specific prep for scheduled interviews' },
      { category: 'Applications', content: 'Reach 50+ applications sent' },
    ],
    deliverables: [
      'Can solve 2 medium LC problems in 45 min consistently',
      'Can explain project architecture with trade-offs in 5 min',
      'Can answer 10 CS theory questions without notes',
      'Can write SQL joins, window functions, CTEs from memory',
    ],
    checkpointFocus: 'Mid-sprint final technical consolidation check',
    dsaProblems: [
      { title: 'Final rapid consolidation across 14 patterns', difficulty: 'Medium' },
    ],
    tasks: [
      makeTask(23, 3, 'Consolidate all 14 DSA patterns: review one problem from each pattern', 'dsa', 'original'),
      makeTask(23, 3, 'Rapid-fire CS theory drill: answer 10 questions without notes', 'cs_theory', 'original'),
      makeTask(23, 3, 'Write complex SQL joins, window functions, and CTEs from memory', 'sql', 'original'),
      makeTask(23, 3, 'Company-specific interview preparation for scheduled pipeline rounds', 'interview', 'original'),
      makeTask(23, 3, 'Send applications to reach 50+ total', 'career', 'original'),
      // Generated Planning Tasks
      makeTask(23, 3, 'Day 155 Planned: Review Arrays, Two Pointers, Sliding Window, Stack', 'dsa', 'generated', { isGeneratedPlanning: true, dayNumber: 155 }),
      makeTask(23, 3, 'Day 156 Planned: Review Binary Search, Linked List, Trees, BST', 'dsa', 'generated', { isGeneratedPlanning: true, dayNumber: 156 }),
      makeTask(23, 3, 'Day 157 Planned: Review Heap, Graphs, Intervals, Greedy', 'dsa', 'generated', { isGeneratedPlanning: true, dayNumber: 157 }),
      makeTask(23, 3, 'Day 158 Planned: Review Backtracking and Dynamic Programming', 'dsa', 'generated', { isGeneratedPlanning: true, dayNumber: 158 }),
      makeTask(23, 3, 'Day 159 Planned: Write 4 SQL queries from blank sheet from memory', 'sql', 'generated', { isGeneratedPlanning: true, dayNumber: 159 }),
      makeTask(23, 3, 'Day 160 Planned: Deliver 5-minute system architecture defense aloud', 'system_design', 'generated', { isGeneratedPlanning: true, dayNumber: 160 }),
      makeTask(23, 3, 'Day 161 Planned: Week 23 review', 'log', 'generated', { isGeneratedPlanning: true, dayNumber: 161 }),
    ],
  },
  {
    weekNumber: 24,
    weekRange: 'Week 24',
    blockRange: 'Weeks 23–24',
    phase: 3,
    phaseTitle: 'Phase 3: Interview Preparation & Job Search',
    title: 'Final Readiness & Conversion: Offer Evaluation & Career Transition',
    summary:
      'Final 8-point checklist verification, offer evaluation framework (fixed vs variable vs ESOPs vs cliff), 60+ cumulative applications, and career transition.',
    topics: [
      { category: 'Checklist', content: 'Final 8-point readiness checklist' },
      { category: 'Offers', content: 'Offer evaluation framework (fixed base, variable, joining bonus, ESOPs, clawback, PF)' },
      { category: 'Career', content: '60+ relevant positions applied total; transition plan' },
    ],
    deliverables: [
      'Can solve 2 medium LC problems in 45 min consistently',
      'Can defend project architecture with trade-offs in 5 min',
      'Truthful resume and 60+ applications sent total',
      'Offer evaluated with comprehensive CTC breakdown framework',
      'Week 24 Checkpoint: Final readiness audit & career transition',
    ],
    checkpointFocus: 'Week 24 Checkpoint: Final readiness audit & career transition',
    dsaProblems: [
      { title: 'Final readiness benchmark test (2 Mediums in 45 min)', difficulty: 'Medium' },
    ],
    tasks: [
      makeTask(24, 3, 'Execute final readiness benchmark: solve 2 medium LC problems in 45 min', 'dsa', 'original'),
      makeTask(24, 3, 'Defend AgroVision-ML architecture, data flow, and trade-offs in 5 minutes', 'project', 'original'),
      makeTask(24, 3, 'Verify final count of 60+ applications sent across all 4 tiers', 'career', 'original'),
      makeTask(24, 3, 'Apply offer evaluation framework: fixed base vs variable vs ESOPs vesting & cliff', 'career', 'original'),
      makeTask(24, 3, 'Complete Week 24 Checkpoint: Final readiness audit & career transition', 'log', 'original'),
      // Generated Planning Tasks
      makeTask(24, 3, 'Day 162 Planned: Final live benchmark coding test under timed condition', 'dsa', 'generated', { isGeneratedPlanning: true, dayNumber: 162 }),
      makeTask(24, 3, 'Day 163 Planned: 5-minute technical project defense recording', 'project', 'generated', { isGeneratedPlanning: true, dayNumber: 163 }),
      makeTask(24, 3, 'Day 164 Planned: Verify total application pipeline status (60+ target)', 'career', 'generated', { isGeneratedPlanning: true, dayNumber: 164 }),
      makeTask(24, 3, 'Day 165 Planned: Offer evaluation worksheet analysis for received offers', 'career', 'generated', { isGeneratedPlanning: true, dayNumber: 165 }),
      makeTask(24, 3, 'Day 166 Planned: Negotiation script preparation (base CTC, joining bonus)', 'career', 'generated', { isGeneratedPlanning: true, dayNumber: 166 }),
      makeTask(24, 3, 'Day 167 Planned: Finalize backup action plan if pipeline still in progress', 'career', 'generated', { isGeneratedPlanning: true, dayNumber: 167 }),
      makeTask(24, 3, 'Day 168 Planned: Week 24 Final Checkpoint & Transition', 'log', 'generated', { isGeneratedPlanning: true, dayNumber: 168 }),
    ],
  },
];

export const ROADMAP_CONTENT = {
  metadata: ROADMAP_METADATA,
  phases: ROADMAP_PHASES,
  milestones: ROADMAP_MILESTONES,
  weeks: ROADMAP_WEEKS,
  reviewSchedule: ROADMAP_METADATA.reviewSchedule,
};

export function getRoadmapWeek(weekNumber: number): RoadmapWeek | undefined {
  return ROADMAP_WEEKS.find((w) => w.weekNumber === weekNumber);
}

export function getAllRoadmapTasks(): RoadmapTask[] {
  return ROADMAP_WEEKS.flatMap((w) => w.tasks);
}

export function getOriginalSourceTasks(): RoadmapTask[] {
  return getAllRoadmapTasks().filter((t) => t.source === 'original');
}

export function getGeneratedPlanningTasks(): RoadmapTask[] {
  return getAllRoadmapTasks().filter((t) => t.isGeneratedPlanning);
}

export function getMilestones(): RoadmapMilestone[] {
  return ROADMAP_MILESTONES;
}

export function getMilestonesByPhase(phase: 1 | 2 | 3): RoadmapMilestone[] {
  return ROADMAP_MILESTONES.filter((m) => m.phase === phase);
}
