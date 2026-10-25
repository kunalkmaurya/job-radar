import { Job, TimelineFilter, CustomDateRange } from '@/types';

export function isJobStale(job: Job, nowTime: number): boolean {
  if (job.status !== 'Applied' || !job.appliedAt) return false;
  const diffDays = (nowTime - new Date(job.appliedAt).getTime()) / (1000 * 60 * 60 * 24);
  return diffDays > 14;
}

export function filterJobsByTimeline(
  jobs: Job[],
  timelineFilter: TimelineFilter,
  nowTime: number,
  customRange?: CustomDateRange
): Job[] {
  if (timelineFilter === 'all') return jobs;

  return jobs.filter((job) => {
    const createdTime = new Date(job.createdAt).getTime();
    const appliedTime = job.appliedAt ? new Date(job.appliedAt).getTime() : 0;
    const latestTime = Math.max(createdTime, appliedTime);

    if (timelineFilter === 'today') {
      const startOfDay = new Date(nowTime).setHours(0, 0, 0, 0);
      return latestTime >= startOfDay;
    }
    if (timelineFilter === 'this_week') {
      const sevenDaysAgo = nowTime - 1000 * 60 * 60 * 24 * 7;
      return latestTime >= sevenDaysAgo;
    }
    if (timelineFilter === 'past_30_days') {
      const thirtyDaysAgo = nowTime - 1000 * 60 * 60 * 24 * 30;
      return latestTime >= thirtyDaysAgo;
    }
    if (timelineFilter === 'custom') {
      if (!customRange?.startDate && !customRange?.endDate) return true;
      const startTime = customRange?.startDate
        ? new Date(customRange.startDate + 'T00:00:00').getTime()
        : 0;
      const endTime = customRange?.endDate
        ? new Date(customRange.endDate + 'T23:59:59.999').getTime()
        : Infinity;
      return latestTime >= startTime && latestTime <= endTime;
    }
    return true;
  });
}

export function computeMetrics(
  scopedJobs: Job[],
  timelineFilter: TimelineFilter,
  nowTime: number,
  customRange?: CustomDateRange
) {
  const totalJobs = scopedJobs.length;
  const appliedJobs = scopedJobs.filter((j) =>
    ['Applied', 'Interviewing', 'Offer', 'Rejected'].includes(j.status)
  );
  const interviewingCount = scopedJobs.filter((j) => j.status === 'Interviewing').length;
  const offerCount = scopedJobs.filter((j) => j.status === 'Offer').length;
  const responseRate = appliedJobs.length > 0
    ? Math.round(((interviewingCount + offerCount) / appliedJobs.length) * 100)
    : 0;

  let appliedLabel = 'Total Applied';
  let windowLabel = 'All-time tracked';

  if (timelineFilter === 'today') {
    appliedLabel = 'Applied Today';
    windowLabel = 'Active today';
  } else if (timelineFilter === 'this_week') {
    appliedLabel = 'Applied This Week';
    windowLabel = 'Active this week';
  } else if (timelineFilter === 'past_30_days') {
    appliedLabel = 'Applied (30d)';
    windowLabel = 'Past 30 days window';
  } else if (timelineFilter === 'custom') {
    appliedLabel = 'Applied (Range)';
    if (customRange?.startDate && customRange?.endDate) {
      windowLabel = `${customRange.startDate} → ${customRange.endDate}`;
    } else if (customRange?.startDate) {
      windowLabel = `From ${customRange.startDate}`;
    } else if (customRange?.endDate) {
      windowLabel = `Until ${customRange.endDate}`;
    } else {
      windowLabel = 'Custom date range';
    }
  }

  return {
    totalJobs,
    appliedCount: appliedJobs.length,
    appliedLabel,
    interviewingCount,
    offerCount,
    responseRate,
    windowLabel,
  };
}

export function filterJobs(
  jobs: Job[],
  searchQuery: string,
  staleOnly: boolean,
  nowTime: number
): Job[] {
  return jobs.filter((job) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!job.company.toLowerCase().includes(q) && !job.role.toLowerCase().includes(q)) return false;
    }
    if (staleOnly && !isJobStale(job, nowTime)) return false;
    return true;
  });
}

export function exportJobsToCSV(jobs: Job[]) {
  const headers = ['Company', 'Role', 'Status', 'Link', 'Notes', 'Follow Up', 'Applied At', 'Created At'];
  const rows = jobs.map((j) => [
    `"${j.company}"`,
    `"${j.role}"`,
    `"${j.status}"`,
    `"${j.link}"`,
    `"${(j.notes || '').replace(/"/g, '""')}"`,
    `"${j.followUpDate || ''}"`,
    `"${j.appliedAt ? new Date(j.appliedAt).toISOString() : ''}"`,
    `"${new Date(j.createdAt).toISOString()}"`,
  ]);
  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `job_tracker_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
