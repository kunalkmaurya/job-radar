import { Job } from '@/types';
import { isJobStale } from '../helpers';

export interface DayActivity {
  dateKey: string;
  label: string;
  count: number;
  companies: string[];
}

export function computeVelocityTrend(jobs: Job[], nowTime: number): DayActivity[] {
  const daysMap = new Map<string, { label: string; count: number; companies: string[] }>();
  const numDays = 14;

  for (let i = numDays - 1; i >= 0; i--) {
    const d = new Date(nowTime - i * 86400000);
    const key = d.toISOString().split('T')[0];
    const month = d.toLocaleDateString('en-US', { month: 'short' });
    const day = d.getDate();
    daysMap.set(key, { label: `${month} ${day}`, count: 0, companies: [] });
  }

  jobs.forEach((j) => {
    const targetDate = j.appliedAt ? new Date(j.appliedAt) : new Date(j.createdAt);
    const key = targetDate.toISOString().split('T')[0];
    if (daysMap.has(key)) {
      const entry = daysMap.get(key)!;
      entry.count += 1;
      if (!entry.companies.includes(j.company)) {
        entry.companies.push(j.company);
      }
    }
  });

  return Array.from(daysMap.entries()).map(([dateKey, val]) => ({
    dateKey,
    label: val.label,
    count: val.count,
    companies: val.companies,
  }));
}

export function computeFunnelStages(jobs: Job[]) {
  const total = jobs.length || 1;
  const saved = jobs.filter((j) => j.status === 'Saved').length;
  const applied = jobs.filter((j) => j.status === 'Applied').length;
  const interviewing = jobs.filter((j) => j.status === 'Interviewing').length;
  const offer = jobs.filter((j) => j.status === 'Offer').length;
  const rejected = jobs.filter((j) => j.status === 'Rejected').length;

  const totalAppliedPipeline = applied + interviewing + offer + rejected;
  const savedToAppliedRate = total > 0 ? Math.round((totalAppliedPipeline / total) * 100) : 0;
  const appliedToInterviewRate = totalAppliedPipeline > 0 ? Math.round(((interviewing + offer) / totalAppliedPipeline) * 100) : 0;
  const interviewToOfferRate = (interviewing + offer) > 0 ? Math.round((offer / (interviewing + offer)) * 100) : 0;

  return {
    total,
    saved,
    applied,
    interviewing,
    offer,
    rejected,
    totalAppliedPipeline,
    savedToAppliedRate,
    appliedToInterviewRate,
    interviewToOfferRate,
  };
}

export function computeWeeklyRhythm(jobs: Job[]) {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const counts = [0, 0, 0, 0, 0, 0, 0];

  jobs.forEach((j) => {
    const targetDate = j.appliedAt ? new Date(j.appliedAt) : new Date(j.createdAt);
    const dayIndex = targetDate.getDay();
    counts[dayIndex] += 1;
  });

  const rhythm = [
    { day: 'Mon', count: counts[1] },
    { day: 'Tue', count: counts[2] },
    { day: 'Wed', count: counts[3] },
    { day: 'Thu', count: counts[4] },
    { day: 'Fri', count: counts[5] },
    { day: 'Sat', count: counts[6] },
    { day: 'Sun', count: counts[0] },
  ];

  let maxCount = -1;
  let primeDay = 'Tue';
  rhythm.forEach((r) => {
    if (r.count > maxCount && r.count > 0) {
      maxCount = r.count;
      primeDay = r.day;
    }
  });

  return { rhythm, primeDay, maxCount: Math.max(...rhythm.map((r) => r.count), 1) };
}

export function computeVelocityStats(jobs: Job[], nowTime: number) {
  const staleCount = jobs.filter((j) => isJobStale(j, nowTime)).length;
  const followUpsDue = jobs.filter((j) => {
    if (!j.followUpDate) return false;
    const dueTime = new Date(j.followUpDate).getTime();
    return dueTime <= nowTime + 86400000 * 3; // within next 3 days or past
  }).length;

  const interviewJobs = jobs.filter((j) => (j.status === 'Interviewing' || j.status === 'Offer') && j.appliedAt);
  let avgDaysToInterview = 0;
  if (interviewJobs.length > 0) {
    const totalDays = interviewJobs.reduce((acc, j) => {
      const created = new Date(j.createdAt).getTime();
      const updated = new Date(j.updatedAt).getTime();
      return acc + Math.max(1, Math.round((updated - created) / 86400000));
    }, 0);
    avgDaysToInterview = Math.round((totalDays / interviewJobs.length) * 10) / 10;
  } else {
    avgDaysToInterview = 4.5; // Baseline metric
  }

  const weeklyRate = Math.round((jobs.length / 4) * 10) / 10;

  return {
    staleCount,
    followUpsDue,
    avgDaysToInterview,
    weeklyRate,
  };
}
