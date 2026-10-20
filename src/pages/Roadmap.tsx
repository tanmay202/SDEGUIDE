import React, { useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, CardContent } from '../components/common/Card';
import { Badge } from '../components/common/Badge';

interface WeekDetail {
  weekRange: string;
  phase: 1 | 2 | 3;
  phaseTitle: string;
  title: string;
  focusTopics: { category: string; content: string }[];
  targetDsaCount: string;
  deliverables: string[];
  checkpointFocus: string;
}

const ROADMAP_WEEKS: WeekDetail[] = [
  {
    weekRange: 'Weeks 1–2',
    phase: 1,
    phaseTitle: 'Phase 1: Foundations',
    title: 'Diagnose & Strengthen Foundations',
    focusTopics: [
      { category: 'DSA', content: 'Big-O diagnostics, Two Sum, Buy/Sell Stock, Contains Duplicate, Anagrams, Group Anagrams, Top K Frequent, Longest Substring' },
      { category: 'Python', content: 'Variables, mutability, comprehensions, generators, decorators, pytest unit testing' },
      { category: 'SQL', content: 'SELECT, WHERE, ORDER BY, NULL handling with practice queries' },
      { category: 'Workflow', content: 'Git branching, clean commits, GitHub workflow established' },
    ],
    targetDsaCount: '8–10 problems',
    deliverables: [
      'Baseline assessment scores documented',
      'GitHub workflow established with clean commits',
      '8-10 DSA problems solved with explanations',
      'Written gap analysis document',
      'pytest basics demonstrated',
    ],
    checkpointFocus: 'Week 2 Checkpoint: Test on Weeks 1-2 foundations & baseline gap analysis',
  },
  {
    weekRange: 'Weeks 3–4',
    phase: 1,
    phaseTitle: 'Phase 1: Foundations',
    title: 'Build Problem-Solving Habits',
    focusTopics: [
      { category: 'DSA', content: 'Two Pointers (Two Sum II, 3Sum, Container With Most Water), Sliding Window, Prefix Sum, Stack (Valid Parentheses, Min Stack), Binary Search' },
      { category: 'SQL', content: 'JOINs (INNER, LEFT, RIGHT), GROUP BY, HAVING, aggregations, subqueries' },
      { category: 'Python', content: 'pytest fixtures, mocking external API calls, writing testable functions' },
      { category: 'Habits', content: 'Explain solutions aloud before looking at editorial' },
    ],
    targetDsaCount: '15+ problems (~25 cumulative)',
    deliverables: [
      '15+ DSA problems solved with written explanations',
      'SQL exercises completed with query + output',
      'pytest: mock an external API call in a test',
      'Verbalize Two Pointers, Sliding Window, Binary Search patterns without notes',
    ],
    checkpointFocus: 'Week 4 Checkpoint: Test pattern recognition under 30-min timer',
  },
  {
    weekRange: 'Weeks 5–6',
    phase: 1,
    phaseTitle: 'Phase 1: Foundations',
    title: 'Connect Programming to Backend Engineering',
    focusTopics: [
      { category: 'DSA', content: 'Linked Lists (Reverse, Merge, Cycle, Remove Nth), Recursion (Climbing Stairs, Subsets), Trees intro, Heaps intro' },
      { category: 'Backend', content: 'HTTP methods, status codes, request/response cycle, FastAPI installation, Pydantic models' },
      { category: 'Database', content: 'PostgreSQL setup, schema design, normalization (1NF, 2NF, 3NF)' },
      { category: 'Project', content: 'Audit AgroVision-ML repo, project specification, initial FastAPI skeleton with health-check' },
    ],
    targetDsaCount: '12+ problems (~37 cumulative)',
    deliverables: [
      '12+ DSA problems solved (cumulatively ~37)',
      'HTTP & REST concepts explained in writing',
      'PostgreSQL running locally with sample schema',
      'AgroVision-ML project specification document & ERD',
      'FastAPI skeleton with /health committed to GitHub',
    ],
    checkpointFocus: 'Week 6 Checkpoint: Phase 1 Foundations Review & project kickoff approval',
  },
  {
    weekRange: 'Weeks 7–8',
    phase: 2,
    phaseTitle: 'Phase 2: Backend Engineering & Project',
    title: 'Build the Backend Core',
    focusTopics: [
      { category: 'DSA', content: 'Binary Search Trees (Validate BST, LCA), Trees, Binary Search rotated arrays' },
      { category: 'Backend', content: 'FastAPI CRUD endpoints, Pydantic v2 schemas, SQLAlchemy 2.0 ORM, Alembic migrations' },
      { category: 'Testing', content: '5+ pytest tests with TestClient, structured error handling (no raw 500s)' },
      { category: 'Career', content: 'Resume draft #1 (one-page, ATS-friendly), GitHub profile cleanup' },
    ],
    targetDsaCount: '8+ problems (~45 cumulative)',
    deliverables: [
      'Functioning backend MVP: endpoints + database + migrations',
      '5+ passing pytest tests for API routes',
      'Resume draft #1 completed',
      'GitHub profile: bio, pinned repos, clean READMEs',
    ],
    checkpointFocus: 'Week 8 Checkpoint: Code review of backend core & schema migrations',
  },
  {
    weekRange: 'Weeks 9–10',
    phase: 2,
    phaseTitle: 'Phase 2: Backend Engineering & Project',
    title: 'Make the Application Credible',
    focusTopics: [
      { category: 'DSA', content: 'Graphs intro (BFS/DFS, Number of Islands, Clone Graph, Course Schedule), Intervals (Merge, Insert, Non-overlapping)' },
      { category: 'Backend', content: 'JWT authentication, password hashing (bcrypt), pagination, query filtering, error middleware' },
      { category: 'SQL', content: 'Window functions (ROW_NUMBER, RANK, LAG, LEAD), CTEs, EXPLAIN ANALYZE' },
      { category: 'Career', content: 'Job search tracker setup, research 10 companies, analyze 5 Job Descriptions' },
    ],
    targetDsaCount: '10+ problems (~55 cumulative)',
    deliverables: [
      'Auth working with unit and integration tests',
      'Pagination + filtering implemented on list endpoints',
      'SQL window functions demonstrated and benchmarked',
      'Job tracking spreadsheet initialized with 10 companies',
    ],
    checkpointFocus: 'Week 10 Checkpoint: Test auth security and SQL performance',
  },
  {
    weekRange: 'Weeks 11–12',
    phase: 2,
    phaseTitle: 'Phase 2: Backend Engineering & Project',
    title: 'Engineering & Deployment',
    focusTopics: [
      { category: 'DSA', content: 'Graphs (topological sort, union-find), Greedy (Maximum Subarray, Jump Game, Gas Station)' },
      { category: 'DevOps', content: 'Dockerfile, docker-compose.yml (app + PostgreSQL), GitHub Actions CI pipeline, linting (ruff)' },
      { category: 'Deploy', content: 'Deploy to free-tier cloud PaaS (Render, Railway, or Fly.io) with structured logging' },
      { category: 'Career', content: 'Project demo walkthrough script (what to show in an interview)' },
    ],
    targetDsaCount: '10+ problems (~65 cumulative)',
    deliverables: [
      'Docker Compose stack running locally with single command',
      'GitHub Actions CI running tests and linter on push',
      'Live deployed API with documentation at /docs',
      '3-minute project demo script rehearsed',
    ],
    checkpointFocus: 'Week 12 Checkpoint: Full deployment & CI pipeline inspection',
  },
  {
    weekRange: 'Weeks 13–14',
    phase: 2,
    phaseTitle: 'Phase 2: Backend Engineering & Project',
    title: 'Data, Correctness & Performance',
    focusTopics: [
      { category: 'DSA', content: 'Backtracking (Subsets, Combination Sum, Permutations, Word Search, N-Queens)' },
      { category: 'Backend', content: 'Database indexes, transactions, isolation levels, rate limiting, CORS' },
      { category: 'Security', content: 'Security checklist: SQL injection, XSS, CSRF review, DB connectivity health check' },
      { category: 'Testing', content: 'Load testing with simple script (10 concurrent requests), document limitations honestly' },
    ],
    targetDsaCount: '10+ problems (~75 cumulative)',
    deliverables: [
      'Database optimized with appropriate B-tree indexes',
      'Security review checklist completed',
      'Tested, defensible backend with documented trade-offs',
      'Phase 2 backend completion milestone achieved',
    ],
    checkpointFocus: 'Week 14 Checkpoint: Phase 2 Backend Defense & mock technical walkthrough',
  },
  {
    weekRange: 'Weeks 15–16',
    phase: 3,
    phaseTitle: 'Phase 3: Interview Preparation & Job Search',
    title: 'Complete DSA Foundation & Timed Practice',
    focusTopics: [
      { category: 'DSA', content: 'Dynamic Programming (Climbing Stairs, House Robber, Coin Change, LIS, LCS, Word Break, Unique Paths, Decode Ways)' },
      { category: 'Practice', content: 'Timed coding: 2 random medium problems in 30 minutes each' },
      { category: 'Interview', content: 'First mock coding interview conducted (45 min, 2 problems)' },
      { category: 'Project', content: 'Final polish and demo environment ready' },
    ],
    targetDsaCount: '10+ problems (~85 cumulative)',
    deliverables: [
      'DP recurrence relations and tabulation demonstrated',
      'Timed practice routine established',
      'First mock coding interview logged with scorecard',
      'Project feature-complete and frozen',
    ],
    checkpointFocus: 'Week 16 Checkpoint: Coding speed & live problem-solving audit',
  },
  {
    weekRange: 'Weeks 17–18',
    phase: 3,
    phaseTitle: 'Phase 3: Interview Preparation & Job Search',
    title: 'Core CS & System Design',
    focusTopics: [
      { category: 'CS Theory', content: 'OOP (SOLID, composition), DBMS (ACID, B-trees, indexing), OS (threads, virtual memory, mutex), Networks (TCP/UDP, DNS, TLS)' },
      { category: 'System Design', content: 'Entry-level: URL shortener, API rate limiter, caching (Redis), horizontal scaling' },
      { category: 'Mock', content: '1 backend mock (30m) + 1 CS theory mock (20m)' },
      { category: 'Career', content: 'Resume v2 with honest, demonstrable achievements' },
    ],
    targetDsaCount: '~90 cumulative problems mastered',
    deliverables: [
      'Core CS interview notes (1-2 pages per topic ready)',
      'Explain URL shortener system design end-to-end',
      'Resume v2 completed and reviewed',
      'Mock interview scores logged',
    ],
    checkpointFocus: 'Week 18 Checkpoint: Rapid-fire CS theory and system design drill',
  },
  {
    weekRange: 'Weeks 19–20',
    phase: 3,
    phaseTitle: 'Phase 3: Interview Preparation & Job Search',
    title: 'Focused Job Search Execution',
    focusTopics: [
      { category: 'Applications', content: '8-12 targeted applications per week across the 4 tiers (Product High, Mid, Service+, Startups)' },
      { category: 'Networking', content: '3-5 professional referral requests per week, LinkedIn optimization' },
      { category: 'DSA', content: 'Targeted revision on weak patterns and timed rounds' },
      { category: 'Research', content: 'Research company interview patterns before applying' },
    ],
    targetDsaCount: '~95 cumulative problems',
    deliverables: [
      '16–24 targeted applications sent and tracked',
      'Application tracker spreadsheet maintained daily',
      'LinkedIn profile fully optimized',
      'Company-specific interview prep folders created',
    ],
    checkpointFocus: 'Week 20 Checkpoint: Application pipeline velocity & callback rate audit',
  },
  {
    weekRange: 'Weeks 21–22',
    phase: 3,
    phaseTitle: 'Phase 3: Interview Preparation & Job Search',
    title: 'Interview Performance & Behavioral Prep',
    focusTopics: [
      { category: 'Interviews', content: '2 full coding mocks per week (45 min) + 1 system design mock + 1 behavioral mock' },
      { category: 'Behavioral', content: '90s "Tell me about yourself", 3min project walkthrough, bug story, strength/weakness' },
      { category: 'Applications', content: 'Continue 8-12 applications per week' },
      { category: 'Revision', content: 'Target actual weak points from mock/real interviews' },
    ],
    targetDsaCount: '~100 cumulative problems mastered',
    deliverables: [
      'Mock interview scorecard with upward trend',
      'Weakness remediation logged and practiced',
      '30-40 cumulative applications sent',
      'Real interview experiences debriefed',
    ],
    checkpointFocus: 'Week 22 Checkpoint: Real interview performance calibration',
  },
  {
    weekRange: 'Weeks 23–24',
    phase: 3,
    phaseTitle: 'Phase 3: Interview Preparation & Job Search',
    title: 'Final Readiness & Offer Conversion',
    focusTopics: [
      { category: 'Readiness', content: 'Consolidate all DSA patterns, CS concepts, project explanations' },
      { category: 'Offers', content: 'Offer evaluation framework (fixed base vs variable vs ESOPs vs cliff)' },
      { category: 'Checklist', content: 'Solve 2 medium LC in 45m, explain architecture in 5m, write SQL joins from memory' },
      { category: 'Applications', content: '60+ relevant positions applied total' },
    ],
    targetDsaCount: 'Final mastery: 67 master problems + 30+ variants',
    deliverables: [
      'Can solve 2 medium LC problems in 45 min consistently',
      'Can defend project architecture with trade-offs in 5 min',
      'Truthful resume and 60+ applications sent',
      'Offer evaluated with comprehensive CTC breakdown',
    ],
    checkpointFocus: 'Week 24 Checkpoint: Final readiness audit & career transition',
  },
];

export const Roadmap: React.FC = () => {
  const { weekNumber, phaseNumber } = useApp();
  const [selectedPhase, setSelectedPhase] = useState<'all' | 1 | 2 | 3>('all');
  const [expandedWeeks, setExpandedWeeks] = useState<Record<string, boolean>>({
    'Weeks 1–2': true, // Expanded by default
  });

  const toggleExpand = (weekRange: string) => {
    setExpandedWeeks((prev) => ({
      ...prev,
      [weekRange]: !prev[weekRange],
    }));
  };

  const filteredWeeks = ROADMAP_WEEKS.filter(
    (w) => selectedPhase === 'all' || w.phase === selectedPhase
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="purple" size="sm">24 Weeks Total</Badge>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs text-slate-500 font-medium">
              Start: Oct 20, 2026 → Target: Apr 20, 2027
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Authoritative Preparation Roadmap
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            2 hours/day systematic strategy to achieve ₹10+ LPA Software Engineering role
          </p>
        </div>

        {/* Phase Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs font-medium">
          <button
            onClick={() => setSelectedPhase('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              selectedPhase === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Phases
          </button>
          <button
            onClick={() => setSelectedPhase(1)}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              selectedPhase === 1
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Phase 1 (W1-6)
          </button>
          <button
            onClick={() => setSelectedPhase(2)}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              selectedPhase === 2
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Phase 2 (W7-14)
          </button>
          <button
            onClick={() => setSelectedPhase(3)}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              selectedPhase === 3
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Phase 3 (W15-24)
          </button>
        </div>
      </div>

      {/* Overview Cards for the 3 Phases */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={`border-l-4 ${phaseNumber === 1 ? 'border-l-emerald-500 shadow-md ring-1 ring-emerald-500/20' : 'border-l-slate-300 dark:border-l-slate-700'}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold uppercase text-emerald-600 dark:text-emerald-400">Phase 1 (Weeks 1–6)</span>
              {phaseNumber === 1 && <Badge variant="success" size="sm">Active Phase</Badge>}
            </div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Foundations & Diagnostics</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Python fluency, DSA problem-solving habits, SQL basics, and AgroVision-ML backend scoping.
            </p>
          </CardContent>
        </Card>

        <Card className={`border-l-4 ${phaseNumber === 2 ? 'border-l-indigo-500 shadow-md ring-1 ring-indigo-500/20' : 'border-l-slate-300 dark:border-l-slate-700'}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold uppercase text-indigo-600 dark:text-indigo-400">Phase 2 (Weeks 7–14)</span>
              {phaseNumber === 2 && <Badge variant="purple" size="sm">Active Phase</Badge>}
            </div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Backend Engineering & Project</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Build full FastAPI service: ORM, Alembic migrations, JWT auth, Docker, CI, and deployment.
            </p>
          </CardContent>
        </Card>

        <Card className={`border-l-4 ${phaseNumber === 3 ? 'border-l-amber-500 shadow-md ring-1 ring-amber-500/20' : 'border-l-slate-300 dark:border-l-slate-700'}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold uppercase text-amber-600 dark:text-amber-400">Phase 3 (Weeks 15–24)</span>
              {phaseNumber === 3 && <Badge variant="warning" size="sm">Active Phase</Badge>}
            </div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Interviews & Job Search</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Complete DSA coverage, core CS theory, entry-level system design, mocks, and 60+ applications.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Week-by-Week Accordion List */}
      <div className="space-y-3">
        {filteredWeeks.map((week) => {
          const isExpanded = !!expandedWeeks[week.weekRange];
          const isCurrentRange = week.weekRange.includes(`Week ${weekNumber}`) || (week.weekRange === 'Weeks 1–2' && weekNumber <= 2);

          return (
            <Card key={week.weekRange} className={isCurrentRange ? 'border-emerald-500/60 dark:border-emerald-600/60' : ''}>
              <div
                onClick={() => toggleExpand(week.weekRange)}
                className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <button className="text-slate-400">
                    {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </button>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                        {week.weekRange}
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{week.phaseTitle}</span>
                      {isCurrentRange && (
                        <Badge variant="success" size="sm">
                          Current Stage
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                      {week.title}
                    </h3>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                    🎯 {week.targetDsaCount}
                  </span>
                </div>
              </div>

              {isExpanded && (
                <CardContent className="pt-0 pb-5 px-5 sm:px-6 border-t border-slate-100 dark:border-slate-800/60 mt-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    {/* Focus Topics */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                        Core Focus Topics
                      </h4>
                      <div className="space-y-2">
                        {week.focusTopics.map((topic, i) => (
                          <div key={i} className="text-xs p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                            <span className="font-semibold text-emerald-700 dark:text-emerald-400 mr-1.5">
                              {topic.category}:
                            </span>
                            <span className="text-slate-700 dark:text-slate-300">{topic.content}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Deliverables & Checkpoint */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                          Key Deliverables
                        </h4>
                        <div className="space-y-1.5">
                          {week.deliverables.map((deliv, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                              <span>{deliv}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-900/40">
                        <span className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 uppercase block">
                          Weekly Checkpoint Target
                        </span>
                        <p className="text-xs text-indigo-950 dark:text-indigo-200 mt-0.5">
                          {week.checkpointFocus}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
