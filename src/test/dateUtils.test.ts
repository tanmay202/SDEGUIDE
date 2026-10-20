import { describe, it, expect } from 'vitest';
import {
  calculateRoadmapDay,
  calculateRoadmapWeek,
  calculateRoadmapPhase,
  addDaysKolkata,
  formatKolkataDateDisplay,
  getDaysRemaining,
  ROADMAP_START_DATE,
  ROADMAP_TARGET_DATE,
  TOTAL_DAYS,
  TOTAL_WEEKS,
} from '../utils/dateUtils';

describe('Asia/Kolkata Date Utilities', () => {
  it('defines correct roadmap timeline constants', () => {
    expect(ROADMAP_START_DATE).toBe('2026-10-20');
    expect(ROADMAP_TARGET_DATE).toBe('2027-04-20');
    expect(TOTAL_DAYS).toBe(168);
    expect(TOTAL_WEEKS).toBe(24);
  });

  it('correctly calculates Day 1 on start date (2026-10-20)', () => {
    expect(calculateRoadmapDay('2026-10-20')).toBe(1);
  });

  it('correctly calculates Day 7 on first checkpoint date (2026-10-26)', () => {
    expect(calculateRoadmapDay('2026-10-26')).toBe(7);
  });

  it('correctly calculates Day 8 on start of Week 2 (2026-10-27)', () => {
    expect(calculateRoadmapDay('2026-10-27')).toBe(8);
  });

  it('caps at Day 168 on target date (2027-04-20)', () => {
    expect(calculateRoadmapDay('2027-04-20')).toBe(168);
  });

  it('defaults to Day 1 if date is before start date', () => {
    expect(calculateRoadmapDay('2026-10-15')).toBe(1);
  });

  it('correctly calculates week numbers across phases', () => {
    expect(calculateRoadmapWeek(1)).toBe(1);
    expect(calculateRoadmapWeek(7)).toBe(1);
    expect(calculateRoadmapWeek(8)).toBe(2);
    expect(calculateRoadmapWeek(14)).toBe(2);
    expect(calculateRoadmapWeek(42)).toBe(6);
    expect(calculateRoadmapWeek(43)).toBe(7);
    expect(calculateRoadmapWeek(98)).toBe(14);
    expect(calculateRoadmapWeek(99)).toBe(15);
    expect(calculateRoadmapWeek(168)).toBe(24);
  });

  it('correctly calculates roadmap phases (Phase 1: W1-6, Phase 2: W7-14, Phase 3: W15-24)', () => {
    expect(calculateRoadmapPhase(1)).toBe(1);
    expect(calculateRoadmapPhase(6)).toBe(1);
    expect(calculateRoadmapPhase(7)).toBe(2);
    expect(calculateRoadmapPhase(14)).toBe(2);
    expect(calculateRoadmapPhase(15)).toBe(3);
    expect(calculateRoadmapPhase(24)).toBe(3);
  });

  it('accurately adds days in Asia/Kolkata timezone', () => {
    expect(addDaysKolkata('2026-10-20', 1)).toBe('2026-10-21');
    expect(addDaysKolkata('2026-10-20', 3)).toBe('2026-10-23');
    expect(addDaysKolkata('2026-10-20', 7)).toBe('2026-10-27');
    expect(addDaysKolkata('2026-10-20', 14)).toBe('2026-11-03');
  });

  it('formats dates consistently without shifting backward', () => {
    const formatted = formatKolkataDateDisplay('2026-10-20');
    expect(formatted).toContain('20');
    expect(formatted).toContain('2026');
  });

  it('computes days remaining correctly', () => {
    expect(getDaysRemaining('2026-10-20')).toBe(182); // 182 days between Oct 20, 2026 and Apr 20, 2027
    expect(getDaysRemaining('2027-04-20')).toBe(0);
  });

  it('safely handles empty, malformed, or NaN date inputs without throwing or crashing', () => {
    expect(formatKolkataDateDisplay('')).toBe('');
    expect(formatKolkataDateDisplay('not-a-date')).toBe('');
    expect(calculateRoadmapDay('invalid-date')).toBe(1);
    expect(calculateRoadmapDay('')).toBe(1);
    expect(calculateRoadmapWeek(NaN)).toBe(1);
    expect(calculateRoadmapWeek(-5)).toBe(1);
    expect(calculateRoadmapPhase(NaN)).toBe(1);
    expect(addDaysKolkata('invalid', 5)).toBe('2026-10-25');
    expect(getDaysRemaining('invalid')).toBe(182);
  });
});
