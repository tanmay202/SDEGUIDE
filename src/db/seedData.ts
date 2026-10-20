import type {
  DsaProblem,
  DailyPlan,
  SkillVertical,
  ProjectState,
  WeeklyCheckpoint,
  UserSettings,
  JobApplication,
} from '../types';

export const MASTER_DSA_PROBLEMS: DsaProblem[] = [
  // Arrays & Hashing (8)
  { id: 1, title: 'Two Sum', leetcodeNumber: 1, difficulty: 'Easy', pattern: 'Arrays & Hashing', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/two-sum/' },
  { id: 2, title: 'Contains Duplicate', leetcodeNumber: 217, difficulty: 'Easy', pattern: 'Arrays & Hashing', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/contains-duplicate/' },
  { id: 3, title: 'Valid Anagram', leetcodeNumber: 242, difficulty: 'Easy', pattern: 'Arrays & Hashing', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/valid-anagram/' },
  { id: 4, title: 'Group Anagrams', leetcodeNumber: 49, difficulty: 'Medium', pattern: 'Arrays & Hashing', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/group-anagrams/' },
  { id: 5, title: 'Top K Frequent Elements', leetcodeNumber: 347, difficulty: 'Medium', pattern: 'Arrays & Hashing', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/top-k-frequent-elements/' },
  { id: 6, title: 'Product of Array Except Self', leetcodeNumber: 238, difficulty: 'Medium', pattern: 'Arrays & Hashing', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/product-of-array-except-self/' },
  { id: 7, title: 'Encode and Decode Strings', leetcodeNumber: 271, difficulty: 'Medium', pattern: 'Arrays & Hashing', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/encode-and-decode-strings/' },
  { id: 8, title: 'Longest Consecutive Sequence', leetcodeNumber: 128, difficulty: 'Medium', pattern: 'Arrays & Hashing', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/longest-consecutive-sequence/' },

  // Two Pointers (4)
  { id: 9, title: 'Valid Palindrome', leetcodeNumber: 125, difficulty: 'Easy', pattern: 'Two Pointers', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/valid-palindrome/' },
  { id: 10, title: 'Two Sum II - Input Array Is Sorted', leetcodeNumber: 167, difficulty: 'Medium', pattern: 'Two Pointers', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/' },
  { id: 11, title: '3Sum', leetcodeNumber: 15, difficulty: 'Medium', pattern: 'Two Pointers', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/3sum/' },
  { id: 12, title: 'Container With Most Water', leetcodeNumber: 11, difficulty: 'Medium', pattern: 'Two Pointers', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/container-with-most-water/' },

  // Sliding Window (4)
  { id: 13, title: 'Best Time to Buy and Sell Stock', leetcodeNumber: 121, difficulty: 'Easy', pattern: 'Sliding Window', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/' },
  { id: 14, title: 'Longest Substring Without Repeating Characters', leetcodeNumber: 3, difficulty: 'Medium', pattern: 'Sliding Window', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
  { id: 15, title: 'Longest Repeating Character Replacement', leetcodeNumber: 424, difficulty: 'Medium', pattern: 'Sliding Window', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/longest-repeating-character-replacement/' },
  { id: 16, title: 'Minimum Window Substring', leetcodeNumber: 76, difficulty: 'Hard', pattern: 'Sliding Window', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/minimum-window-substring/' },

  // Stack (4)
  { id: 17, title: 'Valid Parentheses', leetcodeNumber: 20, difficulty: 'Easy', pattern: 'Stack', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/valid-parentheses/' },
  { id: 18, title: 'Min Stack', leetcodeNumber: 155, difficulty: 'Medium', pattern: 'Stack', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/min-stack/' },
  { id: 19, title: 'Evaluate Reverse Polish Notation', leetcodeNumber: 150, difficulty: 'Medium', pattern: 'Stack', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/' },
  { id: 20, title: 'Daily Temperatures', leetcodeNumber: 739, difficulty: 'Medium', pattern: 'Stack', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/daily-temperatures/' },

  // Binary Search (4)
  { id: 21, title: 'Binary Search', leetcodeNumber: 704, difficulty: 'Easy', pattern: 'Binary Search', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/binary-search/' },
  { id: 22, title: 'Search a 2D Matrix', leetcodeNumber: 74, difficulty: 'Medium', pattern: 'Binary Search', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/search-a-2d-matrix/' },
  { id: 23, title: 'Search in Rotated Sorted Array', leetcodeNumber: 33, difficulty: 'Medium', pattern: 'Binary Search', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/search-in-rotated-sorted-array/' },
  { id: 24, title: 'Find Minimum in Rotated Sorted Array', leetcodeNumber: 153, difficulty: 'Medium', pattern: 'Binary Search', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/' },

  // Linked List (5)
  { id: 25, title: 'Reverse Linked List', leetcodeNumber: 206, difficulty: 'Easy', pattern: 'Linked List', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/reverse-linked-list/' },
  { id: 26, title: 'Merge Two Sorted Lists', leetcodeNumber: 21, difficulty: 'Easy', pattern: 'Linked List', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/merge-two-sorted-lists/' },
  { id: 27, title: 'Linked List Cycle', leetcodeNumber: 141, difficulty: 'Easy', pattern: 'Linked List', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/linked-list-cycle/' },
  { id: 28, title: 'Remove Nth Node From End of List', leetcodeNumber: 19, difficulty: 'Medium', pattern: 'Linked List', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/' },
  { id: 29, title: 'Reorder List', leetcodeNumber: 143, difficulty: 'Medium', pattern: 'Linked List', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/reorder-list/' },

  // Trees (9)
  { id: 30, title: 'Invert Binary Tree', leetcodeNumber: 226, difficulty: 'Easy', pattern: 'Trees', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/invert-binary-tree/' },
  { id: 31, title: 'Maximum Depth of Binary Tree', leetcodeNumber: 104, difficulty: 'Easy', pattern: 'Trees', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/' },
  { id: 32, title: 'Same Tree', leetcodeNumber: 100, difficulty: 'Easy', pattern: 'Trees', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/same-tree/' },
  { id: 33, title: 'Subtree of Another Tree', leetcodeNumber: 572, difficulty: 'Easy', pattern: 'Trees', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/subtree-of-another-tree/' },
  { id: 34, title: 'Binary Tree Level Order Traversal', leetcodeNumber: 102, difficulty: 'Medium', pattern: 'Trees', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/binary-tree-level-order-traversal/' },
  { id: 35, title: 'Validate Binary Search Tree', leetcodeNumber: 98, difficulty: 'Medium', pattern: 'Trees', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/validate-binary-search-tree/' },
  { id: 36, title: 'Lowest Common Ancestor of a BST', leetcodeNumber: 235, difficulty: 'Medium', pattern: 'Trees', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-bst/' },
  { id: 37, title: 'Construct Binary Tree from Preorder and Inorder Traversal', leetcodeNumber: 105, difficulty: 'Medium', pattern: 'Trees', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/' },
  { id: 38, title: 'Binary Tree Right Side View', leetcodeNumber: 199, difficulty: 'Medium', pattern: 'Trees', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/binary-tree-right-side-view/' },

  // Heap / Priority Queue (3)
  { id: 39, title: 'Kth Largest Element in an Array', leetcodeNumber: 215, difficulty: 'Medium', pattern: 'Heap / Priority Queue', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/kth-largest-element-in-an-array/' },
  { id: 40, title: 'Top K Frequent Words', leetcodeNumber: 692, difficulty: 'Medium', pattern: 'Heap / Priority Queue', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/top-k-frequent-words/' },
  { id: 41, title: 'Find Median from Data Stream', leetcodeNumber: 295, difficulty: 'Hard', pattern: 'Heap / Priority Queue', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/find-median-from-data-stream/' },

  // Graphs (6)
  { id: 42, title: 'Number of Islands', leetcodeNumber: 200, difficulty: 'Medium', pattern: 'Graphs', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/number-of-islands/' },
  { id: 43, title: 'Clone Graph', leetcodeNumber: 133, difficulty: 'Medium', pattern: 'Graphs', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/clone-graph/' },
  { id: 44, title: 'Course Schedule', leetcodeNumber: 207, difficulty: 'Medium', pattern: 'Graphs', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/course-schedule/' },
  { id: 45, title: 'Course Schedule II', leetcodeNumber: 210, difficulty: 'Medium', pattern: 'Graphs', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/course-schedule-ii/' },
  { id: 46, title: 'Pacific Atlantic Water Flow', leetcodeNumber: 417, difficulty: 'Medium', pattern: 'Graphs', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/pacific-atlantic-water-flow/' },
  { id: 47, title: 'Number of Connected Components in an Undirected Graph', leetcodeNumber: 323, difficulty: 'Medium', pattern: 'Graphs', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/' },

  // Intervals (3)
  { id: 48, title: 'Merge Intervals', leetcodeNumber: 56, difficulty: 'Medium', pattern: 'Intervals', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/merge-intervals/' },
  { id: 49, title: 'Insert Interval', leetcodeNumber: 57, difficulty: 'Medium', pattern: 'Intervals', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/insert-interval/' },
  { id: 50, title: 'Non-overlapping Intervals', leetcodeNumber: 435, difficulty: 'Medium', pattern: 'Intervals', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/non-overlapping-intervals/' },

  // Greedy (3)
  { id: 51, title: 'Maximum Subarray', leetcodeNumber: 53, difficulty: 'Medium', pattern: 'Greedy', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/maximum-subarray/' },
  { id: 52, title: 'Jump Game', leetcodeNumber: 55, difficulty: 'Medium', pattern: 'Greedy', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/jump-game/' },
  { id: 53, title: 'Gas Station', leetcodeNumber: 134, difficulty: 'Medium', pattern: 'Greedy', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/gas-station/' },

  // Backtracking (5)
  { id: 54, title: 'Subsets', leetcodeNumber: 78, difficulty: 'Medium', pattern: 'Backtracking', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/subsets/' },
  { id: 55, title: 'Combination Sum', leetcodeNumber: 39, difficulty: 'Medium', pattern: 'Backtracking', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/combination-sum/' },
  { id: 56, title: 'Permutations', leetcodeNumber: 46, difficulty: 'Medium', pattern: 'Backtracking', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/permutations/' },
  { id: 57, title: 'Word Search', leetcodeNumber: 79, difficulty: 'Medium', pattern: 'Backtracking', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/word-search/' },
  { id: 58, title: 'N-Queens', leetcodeNumber: 51, difficulty: 'Hard', pattern: 'Backtracking', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/n-queens/' },

  // Dynamic Programming (8)
  { id: 59, title: 'Climbing Stairs', leetcodeNumber: 70, difficulty: 'Easy', pattern: 'Dynamic Programming', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/climbing-stairs/' },
  { id: 60, title: 'House Robber', leetcodeNumber: 198, difficulty: 'Medium', pattern: 'Dynamic Programming', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/house-robber/' },
  { id: 61, title: 'Coin Change', leetcodeNumber: 322, difficulty: 'Medium', pattern: 'Dynamic Programming', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/coin-change/' },
  { id: 62, title: 'Longest Increasing Subsequence', leetcodeNumber: 300, difficulty: 'Medium', pattern: 'Dynamic Programming', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/longest-increasing-subsequence/' },
  { id: 63, title: 'Longest Common Subsequence', leetcodeNumber: 1143, difficulty: 'Medium', pattern: 'Dynamic Programming', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/longest-common-subsequence/' },
  { id: 64, title: 'Word Break', leetcodeNumber: 139, difficulty: 'Medium', pattern: 'Dynamic Programming', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/word-break/' },
  { id: 65, title: 'Unique Paths', leetcodeNumber: 62, difficulty: 'Medium', pattern: 'Dynamic Programming', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/unique-paths/' },
  { id: 66, title: 'Decode Ways', leetcodeNumber: 91, difficulty: 'Medium', pattern: 'Dynamic Programming', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/decode-ways/' },

  // Prefix Sum (1)
  { id: 67, title: 'Range Sum Query - Immutable', leetcodeNumber: 303, difficulty: 'Easy', pattern: 'Prefix Sum', status: 'unsolved', leetcodeUrl: 'https://leetcode.com/problems/range-sum-query-immutable/' },
];

export const INITIAL_SKILLS: SkillVertical[] = [
  {
    id: 'python_fundamentals',
    name: 'Python Fundamentals',
    score: 0,
    status: 'Unassessed',
    benchmark: 'Data structures mutability, comprehensions, generators, decorators, pytest',
    evidence: 'Unassessed — Day 1 diagnostic pending',
    category: 'core',
  },
  {
    id: 'python_oop',
    name: 'Python OOP',
    score: 0,
    status: 'Unassessed',
    benchmark: 'Classes, inheritance, encapsulation, composition, dunder methods',
    evidence: 'Unassessed',
    category: 'core',
  },
  {
    id: 'dsa_problem_solving',
    name: 'DSA Problem-Solving',
    score: 0,
    status: 'Unassessed',
    benchmark: 'NeetCode 75 patterns, optimal Big-O verbal explanation before code',
    evidence: 'Unassessed — Day 1 diagnostic pending',
    category: 'core',
  },
  {
    id: 'sql',
    name: 'SQL & Relational DBs',
    score: 0,
    status: 'Unassessed',
    benchmark: 'Complex JOINs, Window functions, CTEs, EXPLAIN ANALYZE, Transactions',
    evidence: 'Unassessed',
    category: 'backend',
  },
  {
    id: 'backend_development',
    name: 'Backend Development (FastAPI)',
    score: 0,
    status: 'Unassessed',
    benchmark: 'Pydantic v2, SQLAlchemy 2.0, Alembic, JWT auth, middleware, error handling',
    evidence: 'Not started',
    category: 'backend',
  },
  {
    id: 'core_cs_theory',
    name: 'Core CS Theory (OS/DBMS/CN)',
    score: 0,
    status: 'Unassessed',
    benchmark: 'ACID, B-Trees, Processes/Threads, Mutex/Semaphores, TCP/UDP, TLS handshake',
    evidence: 'Unassessed',
    category: 'systems',
  },
  {
    id: 'git_devops',
    name: 'Git & DevOps',
    score: 0,
    status: 'Unassessed',
    benchmark: 'Branching, PRs, Dockerfile, Docker Compose, GitHub Actions CI/CD, deployment',
    evidence: 'Unassessed',
    category: 'systems',
  },
  {
    id: 'interview_communication',
    name: 'Interview Communication',
    score: 0,
    status: 'Unassessed',
    benchmark: '60s self-introduction, explaining complexity aloud, structured trade-off debate',
    evidence: 'Unassessed',
    category: 'professional',
  },
  {
    id: 'project_quality',
    name: 'Project Quality & Depth',
    score: 0,
    status: 'Unassessed',
    benchmark: 'Production-ready code, 10+ unit/integration tests, CI badge, live URL, clean docs',
    evidence: 'Repo not yet audited',
    category: 'professional',
  },
];

export const DAY1_PLAN: DailyPlan = {
  date: '2026-10-20',
  dayNumber: 1,
  weekNumber: 1,
  phaseNumber: 1,
  targetFocus: 'Establish baseline diagnostic: Python fluency, Big-O analysis, and Git workflow',
  status: 'in-progress',
  blocks: [
    {
      id: 'dsa',
      name: 'Block 1 — DSA & Problem-Solving',
      durationMinutes: 40,
      description: 'Baseline diagnostic: Big-O quiz (5 snippets) + Two Sum (LC #1)',
      completed: false,
      subtasks: [
        { id: 'dsa-1', text: 'Part A: Big-O Diagnostic — 5 code snippets (15 min)', done: false },
        { id: 'dsa-2', text: 'Part B: Solve Two Sum (LC #1) with optimal hash map approach (25 min)', done: false },
        { id: 'dsa-3', text: 'Verbalize solution and write edge case analysis', done: false },
      ],
    },
    {
      id: 'technical',
      name: 'Block 2 — Python Diagnostic & Technical',
      durationMinutes: 60,
      description: 'Complete all 7 exercises in day1_diagnostic.py',
      completed: false,
      subtasks: [
        { id: 'tech-1', text: 'Ex 1: Variables, types & mutability reference prediction', done: false },
        { id: 'tech-2', text: 'Ex 2: Functions & recursion (count_vowels, flatten)', done: false },
        { id: 'tech-3', text: 'Ex 3: Dictionary & list comprehensions', done: false },
        { id: 'tech-4', text: 'Ex 4: OOP BankAccount & SavingsAccount hierarchy', done: false },
        { id: 'tech-5', text: 'Ex 5: Error handling with safe_divide', done: false },
        { id: 'tech-6', text: 'Ex 6: File & JSON reading/writing', done: false },
        { id: 'tech-7', text: 'Ex 7: Git repo initialization and initial commit', done: false },
      ],
    },
    {
      id: 'interview',
      name: 'Block 3 — Interview Readiness',
      durationMinutes: 10,
      description: 'Practice self-introduction aloud & write list vs tuple explanation',
      completed: false,
      subtasks: [
        { id: 'int-1', text: 'Deliver 60-second self-introduction out loud', done: false },
        { id: 'int-2', text: 'Write concise answer: "List vs Tuple in Python: when to use each?"', done: false },
      ],
    },
    {
      id: 'log',
      name: 'Block 4 — Progress Log',
      durationMinutes: 10,
      description: 'Record today’s diagnostic findings, struggles, and learnings in progress_log.md',
      completed: false,
      subtasks: [
        { id: 'log-1', text: 'Check off completed Day 1 tasks in checklist', done: false },
        { id: 'log-2', text: 'Document 2 struggles and 2 key learnings', done: false },
        { id: 'log-3', text: 'Preview Day 2 focus (Contains Duplicate & Python collections)', done: false },
      ],
    },
  ],
  reflections: '',
  struggledWith: '',
  keyLearnings: '',
};

export const INITIAL_PROJECT_STATE: ProjectState = {
  projectName: 'AgroVision-ML Backend',
  techStack: ['Python 3.11', 'FastAPI', 'PostgreSQL', 'SQLAlchemy 2.0', 'Alembic', 'Docker', 'pytest', 'JWT'],
  repoUrl: 'https://github.com/tanmay/agrovision-ml',
  status: 'Not Started',
  testsCount: 0,
  architectureSummary: 'A robust, production-grade backend service upgraded from ML prototype to provide real-time and historical agricultural crop price forecasting with JWT authentication, PostgreSQL relational storage, and Dockerized deployment.',
  keyEndpoints: [
    { method: 'GET', path: '/api/v1/health', description: 'Health check and database connectivity verification', status: 'planned' },
    { method: 'POST', path: '/api/v1/auth/login', description: 'JWT authentication and token generation', status: 'planned' },
    { method: 'GET', path: '/api/v1/prices', description: 'Paginated and filtered crop price time-series data', status: 'planned' },
    { method: 'POST', path: '/api/v1/forecasts', description: 'Generate ML inference forecast for specific crop and region', status: 'planned' },
    { method: 'GET', path: '/api/v1/forecasts/{id}', description: 'Retrieve forecast details and model accuracy metrics', status: 'planned' },
  ],
  milestones: [
    {
      id: 'm1',
      phaseWeeks: 'Weeks 5–6',
      title: 'Scoping & Architecture Skeleton',
      description: 'Audit existing repo, draft specification, design PostgreSQL ERD, initial FastAPI app skeleton.',
      completed: false,
      tasks: [
        { id: 'm1-1', text: 'Clone AgroVision-ML and write audit of existing code', done: false },
        { id: 'm1-2', text: 'Write 1-page backend specification document', done: false },
        { id: 'm1-3', text: 'Design PostgreSQL schema ERD (crops, markets, prices, forecasts)', done: false },
        { id: 'm1-4', text: 'FastAPI skeleton with /health endpoint running locally', done: false },
      ],
    },
    {
      id: 'm2',
      phaseWeeks: 'Weeks 7–8',
      title: 'Core CRUD & Database Integration',
      description: 'Set up SQLAlchemy ORM, Alembic migrations, CRUD endpoints, and 5+ pytest tests.',
      completed: false,
      tasks: [
        { id: 'm2-1', text: 'SQLAlchemy models + connection pool configuration', done: false },
        { id: 'm2-2', text: 'Alembic migration pipeline initialized', done: false },
        { id: 'm2-3', text: 'Core endpoints: GET /prices, POST /forecasts with Pydantic validation', done: false },
        { id: 'm2-4', text: '5+ passing unit/integration tests with TestClient', done: false },
      ],
    },
    {
      id: 'm3',
      phaseWeeks: 'Weeks 9–10',
      title: 'Authentication & API Polish',
      description: 'JWT auth, password hashing with bcrypt, pagination, filtering, and structured error handling.',
      completed: false,
      tasks: [
        { id: 'm3-1', text: 'JWT authentication (register, login, password hash)', done: false },
        { id: 'm3-2', text: 'Query pagination and filtering on prices endpoint', done: false },
        { id: 'm3-3', text: 'Custom error handling middleware for unified error format', done: false },
        { id: 'm3-4', text: '10+ cumulative tests with auth fixtures', done: false },
      ],
    },
    {
      id: 'm4',
      phaseWeeks: 'Weeks 11–12',
      title: 'Containerization & CI/CD Deployment',
      description: 'Dockerfile, Docker Compose with Postgres, GitHub Actions CI workflow, deployment to cloud PaaS.',
      completed: false,
      tasks: [
        { id: 'm4-1', text: 'Multi-stage Dockerfile for FastAPI app', done: false },
        { id: 'm4-2', text: 'docker-compose.yml running app + PostgreSQL together', done: false },
        { id: 'm4-3', text: 'GitHub Actions workflow running pytest and ruff linter on PR', done: false },
        { id: 'm4-4', text: 'Deploy live demo to Render/Railway free tier', done: false },
      ],
    },
    {
      id: 'm5',
      phaseWeeks: 'Weeks 13–14',
      title: 'Performance, Security & Final Polish',
      description: 'Database index tuning, transactions, rate limiting, security checklist, and demo walkthrough script.',
      completed: false,
      tasks: [
        { id: 'm5-1', text: 'Add B-tree indexes for timestamp and crop_id queries', done: false },
        { id: 'm5-2', text: 'Rate limiting on auth routes to prevent brute-force', done: false },
        { id: 'm5-3', text: 'Run simple concurrency load test (10 req/s)', done: false },
        { id: 'm5-4', text: 'Record 3-minute architectural demo script for interviews', done: false },
      ],
    },
  ],
};

export const INITIAL_CHECKPOINTS: WeeklyCheckpoint[] = Array.from({ length: 24 }, (_, i) => {
  const weekNum = i + 1;
  const phase = weekNum <= 6 ? 1 : weekNum <= 14 ? 2 : 3;
  return {
    weekNumber: weekNum,
    phase,
    title: `Week ${weekNum} Checkpoint`,
    targetDeliverables: [
      `Review material and problem-solving logs from Days ${(weekNum - 1) * 7 + 1} to ${weekNum * 7}`,
      `Conduct self-assessment test on weekly core topics`,
      `Record scorecard and identify primary bottleneck`,
    ],
    status: weekNum === 1 ? 'current' : 'upcoming',
  };
});

export const INITIAL_USER_SETTINGS: UserSettings = {
  candidateName: 'Tanmay',
  targetRole: 'SDE-1 / Python Backend Developer',
  targetCtc: '₹10+ LPA',
  dailyBudgetMinutes: 120,
  startDate: '2026-10-20',
  targetDate: '2027-04-20',
  timeZone: 'Asia/Kolkata',
  theme: 'light',
  isSampleDataMode: false,
};

/**
 * Clearly labeled sample development dataset to preview dashboard charts and visualizations
 */
export const SAMPLE_DEV_JOB_APPLICATIONS: JobApplication[] = [
  {
    companyName: 'Razorpay',
    roleTitle: 'Software Engineer - Backend',
    tier: 'tier_1_product_high',
    location: 'Bengaluru (Hybrid)',
    appliedDate: '2026-10-20',
    status: 'wishlist',
    expectedCtc: '₹16-20 LPA',
    salaryBreakdown: { fixed: '₹14 LPA', variable: '₹2 LPA', esops: '₹4 LPA' },
    notes: 'Top tier payment infrastructure. Focus on Python/Go, concurrency, distributed systems.',
  },
  {
    companyName: 'Freshworks',
    roleTitle: 'Product Engineer - Backend',
    tier: 'tier_2_product_mid',
    location: 'Chennai (Hybrid)',
    appliedDate: '2026-10-20',
    status: 'wishlist',
    expectedCtc: '₹12-15 LPA',
    salaryBreakdown: { fixed: '₹11 LPA', variable: '₹2 LPA' },
    notes: 'SaaS CRM scale. Good API design and PostgreSQL indexing expected.',
  },
  {
    companyName: 'TCS Digital',
    roleTitle: 'Systems Engineer (Digital)',
    tier: 'tier_3_service_plus',
    location: 'Pune / Mumbai',
    appliedDate: '2026-10-20',
    status: 'wishlist',
    expectedCtc: '₹7.5 LPA',
    notes: 'Elevated service cadre. Strong focus on coding round and technical fundamentals.',
  },
  {
    companyName: 'InfraScale Technologies',
    roleTitle: 'Junior Python Developer',
    tier: 'tier_4_startups',
    location: 'Remote',
    appliedDate: '2026-10-20',
    status: 'wishlist',
    expectedCtc: '₹10-12 LPA',
    notes: 'Series-A funded backend startup. Values FastAPI and independent ownership.',
  },
];
