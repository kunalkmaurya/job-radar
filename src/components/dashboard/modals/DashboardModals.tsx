'use client';

import React from 'react';
import { Job, JobStatus, UpdateReferralData } from '@/types';
import { NotesDrawer } from '../NotesDrawer';
import { AddJobModal } from '../AddJobModal';
import { BookmarkletModal } from '../BookmarkletModal';
import { DeleteJobModal } from './DeleteJobModal';
import { PodInviteModal, PodData } from '../pod';

interface DashboardModalsProps {
  drawerJob: Job | null;
  nowTime: number;
  onCloseDrawer: () => void;
  onStatusChange: (jobId: string, status: JobStatus) => void;
  onToggleImportant: (jobId: string) => void;
  onDeleteJob: (jobId: string) => void;
  onSaveNotes: (jobId: string, notes: string, followUpDate: string | null) => Promise<void>;
  onUpdateReferral?: (jobId: string, data: UpdateReferralData) => Promise<void>;
  jobToDelete?: Job | null;
  onConfirmDelete?: () => void;
  onCancelDelete?: () => void;
  isAddOpen: boolean;
  onCloseAdd: () => void;
  onJobAdded: (job: Job) => void;
  onRefreshJobs: () => Promise<void>;
  isBookmarkletOpen: boolean;
  onCloseBookmarklet: () => void;
  isPodOpen?: boolean;
  onClosePod?: () => void;
  podData?: PodData | null;
  onRefreshPod?: () => void;
  isRefreshingPod?: boolean;
  onSaveChatId?: (chatId: string) => Promise<boolean>;
  onSendTest?: () => Promise<boolean>;
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
  jobToDelete,
  onConfirmDelete,
  onCancelDelete,
  isAddOpen,
  onCloseAdd,
  onJobAdded,
  onRefreshJobs,
  isBookmarkletOpen,
  onCloseBookmarklet,
  isPodOpen = false,
  onClosePod = () => {},
  podData = null,
  onRefreshPod,
  isRefreshingPod,
  onSaveChatId,
  onSendTest,
}: DashboardModalsProps) {
  return (
    <>
      <NotesDrawer
        key={drawerJob?.id || 'empty'}
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

      <DeleteJobModal
        job={jobToDelete ?? null}
        isOpen={Boolean(jobToDelete)}
        onConfirm={onConfirmDelete ?? (() => {})}
        onCancel={onCancelDelete ?? (() => {})}
      />

      <PodInviteModal
        isOpen={isPodOpen}
        onClose={onClosePod}
        pod={podData}
        onRefreshPod={onRefreshPod}
        isRefreshing={isRefreshingPod}
        onSaveChatId={onSaveChatId}
        onSendTest={onSendTest}
      />
    </>
  );
}
