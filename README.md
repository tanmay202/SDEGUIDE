# 🎯 SDE Journey OS | 24-Week ₹10+ LPA Preparation Dashboard

A polished, modern SaaS-grade personal productivity dashboard built for **Tanmay's 24-Week SDE Preparation Journey** (October 20, 2026 – April 20, 2027) based directly on the authoritative roadmap specification in `roadmap.md`.

---

## ⚡ Tech Stack & Architecture

- **Framework:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS with light and dark theme persistence
- **Icons:** Lucide React
- **Routing:** React Router v6 (nested layout with all 10 core routes)
- **Data Visualizations:** Recharts (responsive bar and radar charts)
- **Persistence:** Local-first IndexedDB via **Dexie.js** and `dexie-react-hooks` (runs 100% locally with zero cloud or Supabase dependencies)
- **Timezone Invariance:** Strict `Asia/Kolkata` (UTC+05:30) date handling to eliminate calendar day shifting
- **Testing:** Vitest + Testing Library + `fake-indexeddb`

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173/` (or the port Vite outputs).

### 3. Build for Production
```bash
npm run build
```

### 4. Run Automated Test Suite
```bash
npm test
```

---

## 📱 Page Directory (All 10 Routes Implemented)

1. **Dashboard (`/`)**
   - Prominent **Today's Mission** banner for Day 1 of 168 (October 20, 2026)
   - Quick launchers for the 4 preparation blocks
   - Metric cards: DSA solved/mastered, Spaced Repetition queue, Skills score average, Job applications
   - 120-minute daily architecture distribution chart
   - Milestone and Phase 1 roadmap radar
2. **Today's Plan (`/today`)**
   - Complete 4-block focus breakdown:
     - **Block 1: DSA (40m)** — Big-O quiz + Two Sum (LC #1)
     - **Block 2: Technical (60m)** — `day1_diagnostic.py` (7 core Python exercises)
     - **Block 3: Interview (10m)** — 60s self-introduction aloud + List vs Tuple
     - **Block 4: Log (10m)** — Daily diagnostic reflection & notes
   - Interactive task checklists with live IndexedDB persistence
   - Focus Timer integration
   - Daily reflection journal with Save mechanism
3. **Roadmap (`/roadmap`)**
   - Interactive 24-week schedule divided into Phase 1 (Weeks 1–6), Phase 2 (Weeks 7–14), and Phase 3 (Weeks 15–24)
   - Expandable week cards with deliverables, focus topics, target DSA counts, and checkpoint targets
   - Phase filtering controls
4. **DSA Tracker (`/dsa`)**
   - Comprehensive tracking of the **67 Master Problems** across 14 foundational patterns from `roadmap.md`
   - Filter by pattern, difficulty (Easy, Medium, Hard), and status (Mastered, Solved, In Revision, Unsolved)
   - Search by problem name or LeetCode problem number
   - Direct LeetCode problem links
   - Inline status updates and modal for time/space complexity notes
5. **Revision Queue (`/revision`)**
   - Spaced Repetition protocol: Review 1 (+1d), Review 2 (+3d), Review 3 (+7d), Review 4 (+14d)
   - Status indicators for Due Today, Overdue, Upcoming, and Completed (Mastered)
   - One-click interval progression and manual problem addition modal
6. **Skills Matrix (`/skills`)**
   - 9 Skill Verticals evaluated on a 0–5 scale (Python Fundamentals, OOP, DSA, SQL, FastAPI Backend, Core CS Theory, Git & DevOps, Interview Communication, Project Quality)
   - Competency Polygon radar chart comparing profile to target benchmark
   - Evaluation score editor with qualitative evidence recording
7. **Project Tracker (`/project`)**
   - Primary portfolio project: **AgroVision-ML Backend** (FastAPI, SQLAlchemy 2.0, Alembic, Docker, Pytest)
   - 5 milestone checklists spanning Weeks 5 through 14
   - Architectural flow blueprint (Frontend → FastAPI → SQLAlchemy → PostgreSQL)
   - Key REST endpoints specification table
8. **Job Applications (`/jobs`)**
   - 4-Tier company pipeline:
     - Tier 1: Product (High: ₹12–25 LPA)
     - Tier 2: Product (Mid: ₹8–18 LPA)
     - Tier 3: Service+ (₹7–12 LPA)
     - Tier 4: Startups (₹8–15 LPA)
   - Pipeline stages: Wishlist, Applied, OA/Screening, Technical Interview, HR Round, Offer, Rejected
   - Add/edit job application modal with CTC breakdowns
9. **Reviews & Mocks (`/reviews`)**
   - 24 Weekly Checkpoints with scorecards, identified bottlenecks, and action items
   - Mock Interview log recorder with scores, strengths, weaknesses, and remediation plans
10. **Settings (`/settings`)**
    - Candidate profile verification (Tanmay, MCA '27, Target ₹10+ LPA)
    - Strict Asia/Kolkata timezone verification
    - Light / Dark theme toggles
    - **Data Integrity Control**: Default Day 1 clean baseline (0 fake statistics) with optional toggle to load realistic sample dev data for previewing visualizations
    - JSON Export and Import for full offline backup and restore

---

## 🛡️ Data Integrity & Timezone Handling

- **No Fabricated Progress**: By default, the application seeds truthful Day 1 initial state (0 problems mastered, skills unassessed, clean baseline). A sample development preview mode can be activated from Settings or the TopBar for UI inspection without polluting your real records.
- **Strict Asia/Kolkata**: Pinned to `Asia/Kolkata` using the JavaScript `Intl` API, ensuring that whether accessed from UTC or US Pacific, Day 1 always corresponds to October 20, 2026 without calendar drift.
