'use client';

import React from 'react';
import { Job, JobStatus } from '@/types';
import { NotesDrawer } from '../NotesDrawer';
import { AddJobModal } from '../AddJobModal';
import { BookmarkletModal } from '../BookmarkletModal';

interface DashboardModalsProps {
  drawerJob: Job | null;
  nowTime: number;
  onCloseDrawer: () => void;
  onStatusChange: (jobId: string, status: JobStatus) => void;
  onToggleImportant: (jobId: string) => void;
  onDeleteJob: (jobId: string) => void;
  onSaveNotes: (jobId: string, notes: string, followUpDate: string | null) => Promise<void>;
  onUpdateReferral?: (jobId: string, data: any) => Promise<void>;
  isAddOpen: boolean;
  onCloseAdd: () => void;
  onJobAdded: (job: Job) => void;
  onRefreshJobs: () => Promise<void>;
  isBookmarkletOpen: boolean;
  onCloseBookmarklet: () => void;
}

export function DashboardModals({
  drawerJob,
  nowTime,
  onCloseDrawer,
  onStatusChange,
  onToggleImportant,
  onDeleteJob,
  onSaveNotes,
  onUpdateReferral,
  isAddOpen,
  onCloseAdd,
  onJobAdded,
  onRefreshJobs,
  isBookmarkletOpen,
  onCloseBookmarklet,
}: DashboardModalsProps) {
  return (
    <>
      <NotesDrawer
        job={drawerJob}
        nowTime={nowTime}
        onClose={onCloseDrawer}
        onStatusChange={onStatusChange}
        onToggleImportant={onToggleImportant}
        onDeleteJob={onDeleteJob}
        onSaveNotes={onSaveNotes}
        onUpdateReferral={onUpdateReferral}
      />

      <AddJobModal
        isOpen={isAddOpen}
        onClose={onCloseAdd}
        onJobAdded={onJobAdded}
        onRefreshJobs={onRefreshJobs}
      />

      <BookmarkletModal isOpen={isBookmarkletOpen} onClose={onCloseBookmarklet} />
    </>
  );
}
