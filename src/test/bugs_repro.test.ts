import { describe, it, expect, beforeEach } from 'vitest';
import { db } from '../db/database';
import {
  resetToCleanBaseline,
  updateDsaProblemStatus,
  advanceRevisionItem,
  getOrCreateDailyPlan,
} from '../db/dbService';
import {
  calculateRoadmapDay,
  calculateRoadmapWeek,
  formatKolkataDateDisplay,
  addDaysKolkata,
} from '../utils/dateUtils';

describe('Skeptical Review Bug Probes', () => {
  beforeEach(async () => {
    await resetToCleanBaseline();
  });

  it('PROBE 1: changing solved problem to unsolved should remove or complete it in revision queue', async () => {
    // Solve problem 1
    await updateDsaProblemStatus(1, 'solved');
    let inQueue = await db.revisionQueue.where('problemId').equals(1).first();
    expect(inQueue).toBeDefined();

    // Mark problem 1 as unsolved
    await updateDsaProblemStatus(1, 'unsolved');
    inQueue = await db.revisionQueue.where('problemId').equals(1).first();
    // What is inQueue now?
    expect(inQueue?.status).toBe('completed'); // or should be deleted/cleared
  });

  it('PROBE 2: updating notes on a problem at Stage 3 should NOT reset reviewStage back to 1', async () => {
    await updateDsaProblemStatus(1, 'solved');
    const item = await db.revisionQueue.where('problemId').equals(1).first();
    expect(item?.id).toBeDefined();

    // Advance to Stage 3
    await advanceRevisionItem(item!.id!);
    await advanceRevisionItem(item!.id!);
    let updated = await db.revisionQueue.get(item!.id!);
    expect(updated?.reviewStage).toBe(3);

    // Now update notes on the problem in DSA tracker
    await updateDsaProblemStatus(1, 'solved', 'Added edge case about duplicates');

    updated = await db.revisionQueue.get(item!.id!);
    // EXPECTED: Should still be at Stage 3!
    expect(updated?.reviewStage).toBe(3);
  });

  it('PROBE 3: advancing revision item should keep dsaProblems.nextReviewDate in sync', async () => {
    await updateDsaProblemStatus(1, 'solved');
    const item = await db.revisionQueue.where('problemId').equals(1).first();
    expect(item?.id).toBeDefined();

    // Advance to Stage 2
    await advanceRevisionItem(item!.id!);
    const updatedItem = await db.revisionQueue.get(item!.id!);
    const problem = await db.dsaProblems.get(1);

    // EXPECTED: problem.nextReviewDate must match updatedItem.nextReviewDate
    expect(problem?.nextReviewDate).toBe(updatedItem?.nextReviewDate);
  });

  it('PROBE 4: invalid or malformed date inputs in dateUtils should be handled gracefully without throwing or returning NaN', () => {
    // Malformed strings
    expect(formatKolkataDateDisplay('')).toBe('');
    expect(() => formatKolkataDateDisplay('invalid-date')).not.toThrow();
    expect(formatKolkataDateDisplay('invalid-date')).toBe('');

    expect(calculateRoadmapDay('invalid-date')).toBe(1);
    expect(calculateRoadmapWeek(NaN)).toBe(1);

    expect(() => addDaysKolkata('invalid-date', 3)).not.toThrow();
  });

  it('PROBE 5: getOrCreateDailyPlan dynamically creates standard 4-block plans for Day 2+ from roadmap.md', async () => {
    // Check Day 1
    const day1 = await getOrCreateDailyPlan(1);
    expect(day1.dayNumber).toBe(1);
    expect(day1.blocks.length).toBe(4);

    // Request Day 2 - does not exist initially
    const day2 = await getOrCreateDailyPlan(2);
    expect(day2.dayNumber).toBe(2);
    expect(day2.targetFocus).toContain('Big-O analysis practice');
    expect(day2.blocks.length).toBe(4);

    // Request Day 7
    const day7 = await getOrCreateDailyPlan(7);
    expect(day7.dayNumber).toBe(7);
    expect(day7.targetFocus).toContain('Week 1 Checkpoint');

    // Retrieve Day 2 again - should return the created plan from DB
    const day2Again = await getOrCreateDailyPlan(2);
    expect(day2Again.id).toBe(day2.id);
  });
});
