'use client';

import { useMemo, useState } from 'react';
import { Job, JobStatus } from '@/types';
import { JobStatusFilter } from './JobStatusTabs';

export function useStatusFilter(
  jobs: Job[],
  externalStatus?: JobStatusFilter,
  onExternalChange?: (status: JobStatusFilter) => void
) {
  const [internalStatus, setInternalStatus] = useState<JobStatusFilter>('Saved');
  const activeStatus = externalStatus !== undefined ? externalStatus : internalStatus;
  const setActiveStatus = onExternalChange || setInternalStatus;

  const counts = useMemo(() => {
    const res: Record<JobStatusFilter, number> = {
      all: jobs.length,
      Saved: 0,
      Applied: 0,
      Interviewing: 0,
      Offer: 0,
      Rejected: 0,
      Archived: 0,
    };
    for (const job of jobs) {
      if (job.status in res) {
        res[job.status as JobStatus]++;
      }
    }
    return res;
  }, [jobs]);

  const displayedJobs = useMemo(() => {
    if (activeStatus === 'all') return jobs;
    return jobs.filter((job) => job.status === activeStatus);
  }, [jobs, activeStatus]);

  return { activeStatus, setActiveStatus, counts, displayedJobs };
}
