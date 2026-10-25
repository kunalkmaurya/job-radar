import { Job, TimelineFilter } from '@/types';

export function isJobStale(job: Job, nowTime: number): boolean {
  if (job.status !== 'Applied' || !job.appliedAt) return false;
  const diffDays = (nowTime - new Date(job.appliedAt).getTime()) / (1000 * 60 * 60 * 24);
  return diffDays > 14;
}

export function computeMetrics(jobs: Job[], nowTime: number) {
  const totalJobs = jobs.length;
  const oneWeekAgo = nowTime - 1000 * 60 * 60 * 24 * 7;
  const appliedThisWeek = jobs.filter((j) => j.appliedAt && new Date(j.appliedAt).getTime() >= oneWeekAgo).length;
  const interviewingCount = jobs.filter((j) => j.status === 'Interviewing').length;
  const offerCount = jobs.filter((j) => j.status === 'Offer').length;
  const totalApplied = jobs.filter((j) => ['Applied', 'Interviewing', 'Offer', 'Rejected'].includes(j.status)).length;
  const responseRate = totalApplied > 0 ? Math.round(((interviewingCount + offerCount) / totalApplied) * 100) : 0;
  return { totalJobs, appliedThisWeek, interviewingCount, offerCount, responseRate };
}

export function filterJobs(
  jobs: Job[],
  searchQuery: string,
  staleOnly: boolean,
  timelineFilter: TimelineFilter,
  nowTime: number
): Job[] {
  return jobs.filter((job) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!job.company.toLowerCase().includes(q) && !job.role.toLowerCase().includes(q)) return false;
    }
    if (staleOnly && !isJobStale(job, nowTime)) return false;
    const createdTime = new Date(job.createdAt).getTime();
    if (timelineFilter === 'today' && createdTime < new Date(nowTime).setHours(0, 0, 0, 0)) return false;
    if (timelineFilter === 'this_week' && createdTime < nowTime - 1000 * 60 * 60 * 24 * 7) return false;
    if (timelineFilter === 'past_30_days' && createdTime < nowTime - 1000 * 60 * 60 * 24 * 30) return false;
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
