import { describe, it, expect, beforeEach } from 'vitest';
import { db } from '../db/database';
import {
  resetToCleanBaseline,
  loadSampleDevelopmentData,
  updateDsaProblemStatus,
  advanceRevisionItem,
  exportDatabaseBackup,
  importDatabaseBackup,
  getOrCreateDailyPlan,
} from '../db/dbService';

describe('Database Service & State Management', () => {
  beforeEach(async () => {
    await resetToCleanBaseline();
  });

  it('resets database to clean Day 1 baseline without fake statistics', async () => {
    const problemsCount = await db.dsaProblems.count();
    const skillsCount = await db.skills.count();
    const plansCount = await db.dailyPlans.count();
    const revisionCount = await db.revisionQueue.count();
    const settings = await db.settings.toCollection().first();

    expect(problemsCount).toBe(67);
    expect(skillsCount).toBe(9);
    expect(plansCount).toBe(1);
    expect(revisionCount).toBe(0); // Clean initial baseline has 0 revision items
    expect(settings?.isSampleDataMode).toBe(false);

    // Verify all problems are unsolved
    const solved = await db.dsaProblems.where('status').equals('solved').count();
    const mastered = await db.dsaProblems.where('status').equals('mastered').count();
    expect(solved).toBe(0);
    expect(mastered).toBe(0);
  });

  it('populates sample development data with clearly labeled preview entries', async () => {
    await loadSampleDevelopmentData();

    const solved = await db.dsaProblems.where('status').equals('solved').count();
    const mastered = await db.dsaProblems.where('status').equals('mastered').count();
    const revisionCount = await db.revisionQueue.count();
    const jobsCount = await db.jobApplications.count();
    const settings = await db.settings.toCollection().first();

    expect(mastered).toBeGreaterThan(0);
    expect(solved).toBeGreaterThan(0);
    expect(revisionCount).toBeGreaterThan(0);
    expect(jobsCount).toBe(4);
    expect(settings?.isSampleDataMode).toBe(true);
  });

  it('automatically adds solved problem to revision queue at Stage 1', async () => {
    await updateDsaProblemStatus(1, 'solved', 'One-pass hash map solution');

    const problem = await db.dsaProblems.get(1);
    expect(problem?.status).toBe('solved');
    expect(problem?.nextReviewDate).toBeDefined();

    const revisionItem = await db.revisionQueue.where('problemId').equals(1).first();
    expect(revisionItem).toBeDefined();
    expect(revisionItem?.reviewStage).toBe(1);
    expect(problem?.nextReviewDate).toBe(revisionItem?.nextReviewDate);
  });

  it('preserves existing reviewStage when updating notes on an active revision problem', async () => {
    await updateDsaProblemStatus(1, 'solved');
    const item = await db.revisionQueue.where('problemId').equals(1).first();
    expect(item?.id).toBeDefined();

    // Advance to Stage 3
    await advanceRevisionItem(item!.id!);
    await advanceRevisionItem(item!.id!);
    let updated = await db.revisionQueue.get(item!.id!);
    expect(updated?.reviewStage).toBe(3);

    // Update notes without regressing stage
    await updateDsaProblemStatus(1, 'solved', 'Added duplicate handling analysis');
    updated = await db.revisionQueue.get(item!.id!);
    expect(updated?.reviewStage).toBe(3);
  });

  it('clears or completes revision queue item when problem is marked unsolved', async () => {
    await updateDsaProblemStatus(1, 'solved');
    let item = await db.revisionQueue.where('problemId').equals(1).first();
    expect(item?.status).toBe('pending');

    await updateDsaProblemStatus(1, 'unsolved');
    item = await db.revisionQueue.where('problemId').equals(1).first();
    expect(item?.status).toBe('completed');

    const problem = await db.dsaProblems.get(1);
    expect(problem?.status).toBe('unsolved');
    expect(problem?.nextReviewDate).toBeUndefined();
  });

  it('advances revision item through the 4-stage curve and keeps dsaProblems.nextReviewDate synchronized', async () => {
    await updateDsaProblemStatus(1, 'solved');
    const item = await db.revisionQueue.where('problemId').equals(1).first();
    expect(item?.id).toBeDefined();

    if (item?.id) {
      // Advance from Stage 1 to Stage 2 (Day+3)
      await advanceRevisionItem(item.id);
      let updated = await db.revisionQueue.get(item.id);
      let problem = await db.dsaProblems.get(1);
      expect(updated?.reviewStage).toBe(2);
      expect(problem?.nextReviewDate).toBe(updated?.nextReviewDate);

      // Advance from Stage 2 to Stage 3 (Day+7)
      await advanceRevisionItem(item.id);
      updated = await db.revisionQueue.get(item.id);
      problem = await db.dsaProblems.get(1);
      expect(updated?.reviewStage).toBe(3);
      expect(problem?.nextReviewDate).toBe(updated?.nextReviewDate);

      // Advance from Stage 3 to Stage 4 (Day+14)
      await advanceRevisionItem(item.id);
      updated = await db.revisionQueue.get(item.id);
      problem = await db.dsaProblems.get(1);
      expect(updated?.reviewStage).toBe(4);
      expect(problem?.nextReviewDate).toBe(updated?.nextReviewDate);

      // Advance from Stage 4 -> Mastered
      await advanceRevisionItem(item.id);
      updated = await db.revisionQueue.get(item.id);
      problem = await db.dsaProblems.get(1);
      expect(updated?.status).toBe('completed');
      expect(problem?.status).toBe('mastered');
      expect(problem?.nextReviewDate).toBeUndefined();
    }
  });

  it('getOrCreateDailyPlan returns existing plan or initializes standard 4-block plan from roadmap', async () => {
    // Day 1 already seeded
    const day1 = await getOrCreateDailyPlan(1);
    expect(day1.dayNumber).toBe(1);
    expect(day1.blocks.length).toBe(4);

    // Day 2 not yet created -> dynamically initialized
    const day2 = await getOrCreateDailyPlan(2);
    expect(day2.dayNumber).toBe(2);
    expect(day2.targetFocus).toContain('Big-O analysis practice');
    expect(day2.blocks.length).toBe(4);
    const day2Minutes = day2.blocks.reduce((sum, b) => sum + b.durationMinutes, 0);
    expect(day2Minutes).toBe(120);

    // Day 7 (Week 1 Checkpoint)
    const day7 = await getOrCreateDailyPlan(7);
    expect(day7.dayNumber).toBe(7);
    expect(day7.targetFocus).toContain('Week 1 Checkpoint');

    // Day 14 (Week 2 Checkpoint)
    const day14 = await getOrCreateDailyPlan(14);
    expect(day14.dayNumber).toBe(14);
    expect(day14.targetFocus).toContain('Week 2 Checkpoint');

    // Fetching Day 2 again returns the persisted plan
    const day2Again = await getOrCreateDailyPlan(2);
    expect(day2Again.id).toBe(day2.id);
  });

  it('exports and restores JSON backups accurately', async () => {
    await updateDsaProblemStatus(1, 'mastered');
    const jsonString = await exportDatabaseBackup();

    expect(jsonString).toContain('Two Sum');
    expect(jsonString).toContain('mastered');

    // Clear and restore
    await db.dsaProblems.clear();
    expect(await db.dsaProblems.count()).toBe(0);

    const success = await importDatabaseBackup(jsonString);
    expect(success).toBe(true);

    const restoredCount = await db.dsaProblems.count();
    expect(restoredCount).toBe(67);
    const restoredTwoSum = await db.dsaProblems.get(1);
    expect(restoredTwoSum?.status).toBe('mastered');
  });
});
