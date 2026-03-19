/* ============================================================
 * Date & Timestamp Generator
 * Generate realistic timestamps for mock data
 * ============================================================ */

/* ============================================================
 * Date Range Helpers
 * ============================================================ */

/** Get date N days ago */
export function daysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

/** Get date N days from now */
export function daysFromNow(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

/** Get date N months ago */
export function monthsAgo(months: number): Date {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return date;
}

/** Get date N months from now */
export function monthsFromNow(months: number): Date {
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return date;
}

/** Get date N years ago */
export function yearsAgo(years: number): Date {
  const date = new Date();
  date.setFullYear(date.getFullYear() - years);
  return date;
}

/* ============================================================
 * Random Date Generation
 * ============================================================ */

/** Generate random date between two dates */
export function randomDateBetween(start: Date, end: Date): Date {
  const startTime = start.getTime();
  const endTime = end.getTime();
  const randomTime = startTime + Math.random() * (endTime - startTime);
  return new Date(randomTime);
}

/** Generate random date in the past N days */
export function randomPastDate(maxDaysAgo: number): Date {
  const end = new Date();
  const start = daysAgo(maxDaysAgo);
  return randomDateBetween(start, end);
}

/** Generate random future date within N days */
export function randomFutureDate(maxDaysFromNow: number): Date {
  const start = new Date();
  const end = daysFromNow(maxDaysFromNow);
  return randomDateBetween(start, end);
}

/** Generate random business hours timestamp */
export function randomBusinessHours(date?: Date): Date {
  const baseDate = date || new Date();
  const result = new Date(baseDate);
  
  // Business hours: 8:00 - 18:00
  const hour = Math.floor(Math.random() * 10) + 8; // 8-17
  const minute = Math.floor(Math.random() * 60);
  
  result.setHours(hour, minute, 0, 0);
  return result;
}

/** Generate random timestamp (any time of day) */
export function randomTimestamp(date?: Date): Date {
  const baseDate = date || new Date();
  const result = new Date(baseDate);
  
  const hour = Math.floor(Math.random() * 24);
  const minute = Math.floor(Math.random() * 60);
  const second = Math.floor(Math.random() * 60);
  
  result.setHours(hour, minute, second, 0);
  return result;
}

/* ============================================================
 * Realistic CRM Date Patterns
 * ============================================================ */

/** Generate realistic contact creation date */
export function generateContactCreatedDate(): Date {
  // Contacts created over the past 2 years
  // More recent = higher probability
  const random = Math.random();
  
  if (random < 0.4) {
    // 40% in last 3 months
    return randomPastDate(90);
  } else if (random < 0.7) {
    // 30% in last 6 months
    return randomPastDate(180);
  } else if (random < 0.9) {
    // 20% in last year
    return randomPastDate(365);
  } else {
    // 10% older than 1 year
    return randomDateBetween(yearsAgo(2), yearsAgo(1));
  }
}

/** Generate realistic deal creation date */
export function generateDealCreatedDate(): Date {
  // Most deals are recent
  const random = Math.random();
  
  if (random < 0.5) {
    // 50% in last month
    return randomPastDate(30);
  } else if (random < 0.8) {
    // 30% in last 3 months
    return randomPastDate(90);
  } else {
    // 20% in last 6 months
    return randomPastDate(180);
  }
}

/** Generate realistic activity date */
export function generateActivityDate(createdAfter?: Date): Date {
  const start = createdAfter || daysAgo(90);
  const end = new Date();
  const date = randomDateBetween(start, end);
  return randomBusinessHours(date);
}

/** Generate realistic next follow-up date */
export function generateFollowUpDate(): Date {
  // Follow-ups typically 1-14 days in future
  const days = Math.floor(Math.random() * 14) + 1;
  return daysFromNow(days);
}

/** Generate deal expected close date */
export function generateExpectedCloseDate(createdAt: Date): Date {
  // Typically 30-180 days after creation
  const daysToClose = Math.floor(Math.random() * 150) + 30;
  const closeDate = new Date(createdAt);
  closeDate.setDate(closeDate.getDate() + daysToClose);
  return closeDate;
}

/** Generate contract start date */
export function generateContractStartDate(): Date {
  const random = Math.random();
  
  if (random < 0.3) {
    // 30% start in past (already active)
    return randomPastDate(180);
  } else if (random < 0.6) {
    // 30% start today/this week
    return randomFutureDate(7);
  } else {
    // 40% start in future
    return randomFutureDate(90);
  }
}

/** Generate contract end date based on start date */
export function generateContractEndDate(startDate: Date, durationMonths?: number): Date {
  const duration = durationMonths || [12, 24, 36][Math.floor(Math.random() * 3)];
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + duration);
  return endDate;
}

/** Generate last activity timestamp */
export function generateLastActivityDate(createdAt: Date): Date {
  const now = new Date();
  const random = Math.random();
  
  if (random < 0.3) {
    // 30% very recent (last 7 days)
    return randomDateBetween(daysAgo(7), now);
  } else if (random < 0.6) {
    // 30% recent (last 30 days)
    return randomDateBetween(daysAgo(30), daysAgo(7));
  } else if (random < 0.85) {
    // 25% moderate (last 90 days)
    return randomDateBetween(daysAgo(90), daysAgo(30));
  } else {
    // 15% old (no recent activity)
    return randomDateBetween(createdAt, daysAgo(90));
  }
}

/* ============================================================
 * Time Series Generation
 * ============================================================ */

/** Generate ordered timestamps (for timeline data) */
export function generateTimeSeriesDates(
  count: number,
  startDate: Date,
  endDate: Date
): Date[] {
  const dates: Date[] = [];
  const interval = (endDate.getTime() - startDate.getTime()) / count;
  
  for (let i = 0; i < count; i++) {
    const timestamp = startDate.getTime() + interval * i;
    const date = new Date(timestamp);
    // Add some randomness (±10% of interval)
    const jitter = (Math.random() - 0.5) * interval * 0.2;
    date.setTime(date.getTime() + jitter);
    dates.push(date);
  }
  
  return dates.sort((a, b) => a.getTime() - b.getTime());
}

/** Generate activity timeline (multiple events over time) */
export function generateActivityTimeline(
  contactCreatedAt: Date,
  activityCount: number
): Date[] {
  const now = new Date();
  return generateTimeSeriesDates(activityCount, contactCreatedAt, now)
    .map(date => randomBusinessHours(date));
}

/* ============================================================
 * Date Formatting Helpers
 * ============================================================ */

/** Format date to ISO string (YYYY-MM-DD) */
export function toISODate(date: Date): string {
  return date.toISOString().split("T")[0];
}

/** Format date to ISO DateTime (YYYY-MM-DDTHH:mm:ss.sssZ) */
export function toISODateTime(date: Date): string {
  return date.toISOString();
}

/** Format date to Vietnamese format (DD/MM/YYYY) */
export function toVietnameseDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/* ============================================================
 * Business Day Calculations
 * ============================================================ */

/** Check if date is weekend */
export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday or Saturday
}

/** Get next business day */
export function nextBusinessDay(date: Date): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + 1);
  
  while (isWeekend(result)) {
    result.setDate(result.getDate() + 1);
  }
  
  return result;
}

/** Add business days */
export function addBusinessDays(date: Date, days: number): Date {
  let result = new Date(date);
  let addedDays = 0;
  
  while (addedDays < days) {
    result.setDate(result.getDate() + 1);
    if (!isWeekend(result)) {
      addedDays++;
    }
  }
  
  return result;
}

/* ============================================================
 * Realistic Date Relationships
 * ============================================================ */

/** Generate coherent date sequence for entity lifecycle */
export function generateEntityDates(baseDate?: Date): {
  createdAt: Date;
  updatedAt: Date;
  lastActivityAt: Date | null;
  deletedAt: Date | null;
} {
  const createdAt = baseDate || generateContactCreatedDate();
  const now = new Date();
  
  // Updated at: sometime between created and now
  const updatedAt = randomDateBetween(createdAt, now);
  
  // Last activity: 70% have recent activity
  const lastActivityAt = Math.random() < 0.7
    ? generateLastActivityDate(createdAt)
    : null;
  
  // Deleted at: 5% are soft-deleted
  const deletedAt = Math.random() < 0.05
    ? randomDateBetween(createdAt, now)
    : null;
  
  return {
    createdAt,
    updatedAt,
    lastActivityAt,
    deletedAt,
  };
}

/** Generate deal lifecycle dates */
export function generateDealDates(): {
  createdAt: Date;
  updatedAt: Date;
  expectedCloseDate: Date;
  actualCloseDate: Date | null;
} {
  const createdAt = generateDealCreatedDate();
  const now = new Date();
  const updatedAt = randomDateBetween(createdAt, now);
  const expectedCloseDate = generateExpectedCloseDate(createdAt);
  
  // 30% of deals are closed
  const actualCloseDate = Math.random() < 0.3
    ? randomDateBetween(createdAt, now)
    : null;
  
  return {
    createdAt,
    updatedAt,
    expectedCloseDate,
    actualCloseDate,
  };
}

/* ============================================================
 * Seeded Random Dates (for reproducible results)
 * ============================================================ */

let seed = Date.now();

/** Set random seed */
export function setSeed(newSeed: number): void {
  seed = newSeed;
}

/** Seeded random number */
function seededRandom(): number {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

/** Generate seeded random date */
export function seededRandomDate(minDate: Date, maxDate: Date): Date {
  const minTime = minDate.getTime();
  const maxTime = maxDate.getTime();
  const randomTime = minTime + seededRandom() * (maxTime - minTime);
  return new Date(randomTime);
}
