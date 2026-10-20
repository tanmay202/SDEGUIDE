/**
 * Strict Asia/Kolkata date utilities to avoid calendar day shifting across timezones.
 * Single source of truth for the SDE Preparation OS.
 */

export const TIMEZONE_KOLKATA = 'Asia/Kolkata';
export const ROADMAP_START_DATE = '2026-10-20'; // Day 1
export const ROADMAP_TARGET_DATE = '2027-04-20'; // Target Offer Date (End of 6-Month Plan)
export const TOTAL_DAYS = 168; // 24 Weeks * 7 Days
export const TOTAL_WEEKS = 24;

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Validates whether string is in YYYY-MM-DD format with real calendar day
 */
export function isValidDateString(dateStr: unknown): dateStr is string {
  if (typeof dateStr !== 'string' || !DATE_REGEX.test(dateStr)) return false;
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  return (
    !isNaN(date.getTime()) &&
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

/**
 * Returns the current date in Asia/Kolkata formatted as YYYY-MM-DD
 */
export function getKolkataDateString(date: Date = new Date()): string {
  const validDate = isNaN(date?.getTime?.() ?? NaN) ? new Date() : date;
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIMEZONE_KOLKATA,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(validDate);
}

/**
 * Returns formatted current time in Asia/Kolkata e.g. "05:30 PM IST"
 */
export function getKolkataTimeString(date: Date = new Date()): string {
  const validDate = isNaN(date?.getTime?.() ?? NaN) ? new Date() : date;
  const formatter = new Intl.DateTimeFormat('en-IN', {
    timeZone: TIMEZONE_KOLKATA,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
  return `${formatter.format(validDate)} IST`;
}

/**
 * Formats a YYYY-MM-DD string into a human readable format e.g. "Tuesday, Oct 20, 2026"
 */
export function formatKolkataDateDisplay(dateStr: string): string {
  if (!dateStr || !isValidDateString(dateStr)) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));

  const formatter = new Intl.DateTimeFormat('en-IN', {
    timeZone: TIMEZONE_KOLKATA,
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  return formatter.format(date);
}

/**
 * Parses YYYY-MM-DD into milliseconds UTC timestamp
 */
export function parseKolkataDateToUtcMidnight(dateStr: string): number {
  if (!dateStr || !isValidDateString(dateStr)) {
    dateStr = ROADMAP_START_DATE;
  }
  const [year, month, day] = dateStr.split('-').map(Number);
  return Date.UTC(year, month - 1, day, 0, 0, 0);
}

/**
 * Calculates the Day number (1 to 168) relative to the roadmap start date.
 * If currentDate is before start date, returns 1 as the default launch day.
 */
export function calculateRoadmapDay(currentDateStr: string = getKolkataDateString()): number {
  if (!currentDateStr || !isValidDateString(currentDateStr)) {
    return 1;
  }
  const startMs = parseKolkataDateToUtcMidnight(ROADMAP_START_DATE);
  const currentMs = parseKolkataDateToUtcMidnight(currentDateStr);

  const diffDays = Math.floor((currentMs - startMs) / (1000 * 60 * 60 * 24));
  if (isNaN(diffDays) || diffDays < 0) {
    return 1; // Prior to start date, default to Day 1
  }
  return Math.min(diffDays + 1, TOTAL_DAYS);
}

/**
 * Calculates current Week number (1 to 24) based on day number
 */
export function calculateRoadmapWeek(dayNumber: number): number {
  if (!dayNumber || isNaN(dayNumber) || dayNumber <= 0) return 1;
  return Math.min(Math.ceil(dayNumber / 7), TOTAL_WEEKS);
}

/**
 * Calculates current Phase number (1, 2, or 3)
 * Phase 1: Weeks 1-6 (Foundations)
 * Phase 2: Weeks 7-14 (Backend Engineering & Project)
 * Phase 3: Weeks 15-24 (Interview Preparation & Job Search)
 */
export function calculateRoadmapPhase(weekNumber: number): 1 | 2 | 3 {
  if (!weekNumber || isNaN(weekNumber) || weekNumber <= 6) return 1;
  if (weekNumber <= 14) return 2;
  return 3;
}

/**
 * Adds N days to a YYYY-MM-DD date in IST
 */
export function addDaysKolkata(dateStr: string, days: number): string {
  const safeDateStr = isValidDateString(dateStr) ? dateStr : ROADMAP_START_DATE;
  const safeDays = isNaN(days) ? 0 : days;
  const [year, month, day] = safeDateStr.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + safeDays, 12, 0, 0));
  return getKolkataDateString(date);
}

/**
 * Returns number of days remaining until April 20, 2027
 */
export function getDaysRemaining(currentDateStr: string = getKolkataDateString()): number {
  if (!isValidDateString(currentDateStr)) {
    currentDateStr = ROADMAP_START_DATE;
  }
  const targetMs = parseKolkataDateToUtcMidnight(ROADMAP_TARGET_DATE);
  const currentMs = parseKolkataDateToUtcMidnight(currentDateStr);
  const diff = Math.ceil((targetMs - currentMs) / (1000 * 60 * 60 * 24));
  return isNaN(diff) ? 0 : Math.max(0, diff);
}
