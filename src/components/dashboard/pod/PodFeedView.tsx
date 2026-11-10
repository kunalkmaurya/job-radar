'use client';

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useFeedJobs } from '../feed/useFeedJobs';
import { FeedCard } from '../feed/FeedCard';
import { FeedListView } from '../feed/FeedListView';
import { AddPublicJobModal } from '../feed/AddPublicJobModal';
import { PaginationBar } from '../pagination/PaginationBar';
import { usePagination } from '../pagination/usePagination';
import { PodFeedHeader } from './PodFeedHeader';
import { PodFeedEmptyState } from './PodFeedEmptyState';
import { usePodManager } from './usePodManager';

interface PodFeedViewProps {
  onJobTracked?: () => void;
  refreshTrigger?: number;
  onOpenInviteModal?: () => void;
}

export function PodFeedView({ onJobTracked, refreshTrigger, onOpenInviteModal }: PodFeedViewProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { podData, fetchPod, handleCreatePod, handleJoinPod, isMutating } = usePodManager();
  const {
    feedJobs,
    isLoading,
    searchQuery,
    setSearchQuery,
    trackingId,
    trackJob,
    deleteJob,
    isAddOpen,
    setIsAddOpen,
    isSyncing,
    syncTelegramJobs,
    refreshFeed,
  } = useFeedJobs({ initialFeedType: 'pod', onJobTracked, refreshTrigger });

  const pagination = usePagination({
    totalItems: feedJobs.length,
    initialPageSize: 12,
    pageSizeOptions: [12, 24, 48, 96],
  });

  const paginatedJobs = pagination.paginateItems(feedJobs);
  const handleSyncAll = () => Promise.all([syncTelegramJobs(), fetchPod()]);

  const onJoin = async (code: string) => {
    const ok = await handleJoinPod(code);
    if (ok) await refreshFeed();
    return ok;
  };

  const onCreate = async () => {
    const ok = await handleCreatePod();
    if (ok) await refreshFeed();
  };

  return (
    <div className="w-full flex-1 flex flex-col justify-between min-h-full space-y-6">
      <div className="space-y-6 flex-1 flex flex-col">
        <PodFeedHeader
          podName={podData?.name || 'Peer Pod Feed'}
          totalJobs={feedJobs.length}
          memberCount={podData?.memberCount || 1}
          memberLimit={podData?.memberLimit || 6}
          isTelegramConnected={Boolean(podData?.isTelegramConnected)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onOpenAddJob={() => setIsAddOpen(true)}
          onOpenManagePod={onOpenInviteModal}
          onSyncTelegram={handleSyncAll}
          isSyncing={isSyncing}
        />

        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-16 text-(--text-muted) gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-(--accent-primary)" />
            <span className="text-xs">Loading pod opportunities...</span>
          </div>
        ) : feedJobs.length === 0 ? (
          <PodFeedEmptyState
            hasPod={Boolean(podData)}
            telegramConnectUrl={podData?.telegramConnectUrl}
            onOpenAddJob={() => setIsAddOpen(true)}
            onCreatePod={onCreate}
            onJoinPod={onJoin}
            isMutating={isMutating}
          />
        ) : (
          <div className="flex-1">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {paginatedJobs.map((job) => (
                  <FeedCard
                    key={job.id}
                    job={job}
                    isTracking={trackingId === job.id}
                    onTrack={trackJob}
                    onDelete={deleteJob}
                  />
                ))}
              </div>
            ) : (
              <FeedListView
                jobs={paginatedJobs}
                trackingId={trackingId}
                onTrack={trackJob}
                onDelete={deleteJob}
              />
            )}
          </div>
        )}
      </div>

      <div className="mt-auto shrink-0 pt-2 sticky bottom-0 z-20">
        <div className="border border-(--border-subtle) rounded-xs bg-(--bg-surface) shadow-xs">
          <PaginationBar
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            fromItem={pagination.fromItem}
            toItem={pagination.toItem}
            pageSize={pagination.pageSize}
            pageSizeOptions={pagination.pageSizeOptions}
            canPrevPage={pagination.canPrevPage}
            canNextPage={pagination.canNextPage}
            pageNumbers={pagination.pageNumbers}
            onPageChange={pagination.setPage}
            onPageSizeChange={pagination.setPageSize}
            onFirstPage={pagination.firstPage}
            onLastPage={pagination.lastPage}
            onPrevPage={pagination.prevPage}
            onNextPage={pagination.nextPage}
          />
        </div>
      </div>

      <AddPublicJobModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={refreshFeed}
      />
    </div>
  );
}
