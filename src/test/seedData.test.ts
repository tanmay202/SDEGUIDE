import { describe, it, expect } from 'vitest';
import {
  MASTER_DSA_PROBLEMS,
  INITIAL_SKILLS,
  DAY1_PLAN,
  INITIAL_PROJECT_STATE,
  INITIAL_CHECKPOINTS,
  INITIAL_USER_SETTINGS,
} from '../db/seedData';

describe('Roadmap Specification Compliance', () => {
  it('contains exactly 67 master DSA problems', () => {
    expect(MASTER_DSA_PROBLEMS.length).toBe(67);
  });

  it('covers all 14 patterns defined in roadmap.md', () => {
    const patterns = new Set(MASTER_DSA_PROBLEMS.map((p) => p.pattern));
    expect(patterns.size).toBe(14);
    expect(patterns.has('Arrays & Hashing')).toBe(true);
    expect(patterns.has('Two Pointers')).toBe(true);
    expect(patterns.has('Sliding Window')).toBe(true);
    expect(patterns.has('Stack')).toBe(true);
    expect(patterns.has('Binary Search')).toBe(true);
    expect(patterns.has('Linked List')).toBe(true);
    expect(patterns.has('Trees')).toBe(true);
    expect(patterns.has('Heap / Priority Queue')).toBe(true);
    expect(patterns.has('Graphs')).toBe(true);
    expect(patterns.has('Intervals')).toBe(true);
    expect(patterns.has('Greedy')).toBe(true);
    expect(patterns.has('Backtracking')).toBe(true);
    expect(patterns.has('Dynamic Programming')).toBe(true);
    expect(patterns.has('Prefix Sum')).toBe(true);
  });

  it('all problems default to unsolved status with valid URLs', () => {
    MASTER_DSA_PROBLEMS.forEach((prob) => {
      expect(prob.status).toBe('unsolved');
      expect(prob.leetcodeUrl).toContain('https://leetcode.com/problems/');
      expect(prob.id).toBeGreaterThanOrEqual(1);
      expect(prob.id).toBeLessThanOrEqual(67);
    });
  });

  it('defines exactly 9 skill verticals, all starting at score 0 / Unassessed', () => {
    expect(INITIAL_SKILLS.length).toBe(9);
    INITIAL_SKILLS.forEach((skill) => {
      expect(skill.score).toBe(0);
      expect(skill.status).toBe('Unassessed');
    });
  });

  it('Day 1 plan contains 4 blocks totaling exactly 120 minutes', () => {
    expect(DAY1_PLAN.blocks.length).toBe(4);
    const totalMinutes = DAY1_PLAN.blocks.reduce((acc, b) => acc + b.durationMinutes, 0);
    expect(totalMinutes).toBe(120);

    const blockMap = Object.fromEntries(DAY1_PLAN.blocks.map((b) => [b.id, b.durationMinutes]));
    expect(blockMap.dsa).toBe(40);
    expect(blockMap.technical).toBe(60);
    expect(blockMap.interview).toBe(10);
    expect(blockMap.log).toBe(10);
  });

  it('AgroVision-ML project defines 5 milestones covering Weeks 5-14', () => {
    expect(INITIAL_PROJECT_STATE.milestones.length).toBe(5);
    expect(INITIAL_PROJECT_STATE.status).toBe('Not Started');
    expect(INITIAL_PROJECT_STATE.testsCount).toBe(0);
  });

  it('generates 24 weekly checkpoints across the 3 phases', () => {
    expect(INITIAL_CHECKPOINTS.length).toBe(24);
    expect(INITIAL_CHECKPOINTS.filter((c) => c.phase === 1).length).toBe(6);
    expect(INITIAL_CHECKPOINTS.filter((c) => c.phase === 2).length).toBe(8);
    expect(INITIAL_CHECKPOINTS.filter((c) => c.phase === 3).length).toBe(10);
  });

  it('configures initial user settings matching candidate specs', () => {
    expect(INITIAL_USER_SETTINGS.candidateName).toBe('Tanmay');
    expect(INITIAL_USER_SETTINGS.targetCtc).toContain('₹10+ LPA');
    expect(INITIAL_USER_SETTINGS.dailyBudgetMinutes).toBe(120);
    expect(INITIAL_USER_SETTINGS.timeZone).toBe('Asia/Kolkata');
    expect(INITIAL_USER_SETTINGS.isSampleDataMode).toBe(false);
  });
});
