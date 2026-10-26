'use client';

import { useState } from 'react';
import { Job, JobStatus } from '@/types';

interface UseJobDrawerProps {
  nowTime: number;
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
  handleStatusChange: (jobId: string, status: JobStatus) => void;
  handleToggleImportant?: (jobId: string) => void;
  handleDeleteJob: (jobId: string) => void;
}

export function useJobDrawer({
  nowTime,
  setJobs,
  handleStatusChange,
  handleToggleImportant,
  handleDeleteJob,
}: UseJobDrawerProps) {
  const [drawerJob, setDrawerJob] = useState<Job | null>(null);

  const handleSaveNotes = async (jobId: string, notes: string, followUpDate: string | null) => {
    try {
      await fetch(`/api/jobs/${jobId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes, followUpDate }),
      });
      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, notes, followUpDate, updatedAt: new Date(nowTime) } : j))
      );
      if (drawerJob?.id === jobId) {
        setDrawerJob((prev) => (prev ? { ...prev, notes, followUpDate } : null));
      }
    } catch (err) {
      console.error('Failed to save notes:', err);
    }
  };

  const onJobStatusChange = (jobId: string, status: JobStatus) => {
    handleStatusChange(jobId, status);
    if (drawerJob?.id === jobId) setDrawerJob((prev) => (prev ? { ...prev, status } : null));
  };

  const onJobToggleImportant = (jobId: string) => {
    handleToggleImportant?.(jobId);
    if (drawerJob?.id === jobId) {
      setDrawerJob((prev) => (prev ? { ...prev, isImportant: !prev.isImportant } : null));
    }
  };

  const onJobDelete = (jobId: string) => {
    handleDeleteJob(jobId);
    if (drawerJob?.id === jobId) setDrawerJob(null);
  };

  return { drawerJob, setDrawerJob, handleSaveNotes, onJobStatusChange, onJobToggleImportant, onJobDelete };
}
