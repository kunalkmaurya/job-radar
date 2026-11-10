'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { useFeedJobs } from '../feed/useFeedJobs';
import { useFeedViewMode } from '../feed/useFeedViewMode';
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
  const [viewMode, setViewMode] = useFeedViewMode();
  const pod = usePodManager();
  const feed = useFeedJobs({ initialFeedType: 'pod', onJobTracked, refreshTrigger });

  const pagination = usePagination({
    totalItems: feed.feedJobs.length,
    initialPageSize: 12,
    pageSizeOptions: [12, 24, 48, 96],
  });

  const paginatedJobs = pagination.paginateItems(feed.feedJobs);
  const handleSyncAll = () => Promise.all([feed.syncTelegramJobs(), pod.fetchPod()]);

  const onJoin = async (code: string) => {
    const ok = await pod.handleJoinPod(code);
    if (ok) await feed.refreshFeed();
    return ok;
  };

  const onCreate = async () => {
    if (await pod.handleCreatePod()) await feed.refreshFeed();
  };

  return (
    <div className="w-full flex-1 flex flex-col justify-between min-h-full space-y-6">
      <div className="space-y-6 flex-1 flex flex-col">
        <PodFeedHeader
          podName={pod.podData?.name || 'Peer Pod Feed'}
          totalJobs={feed.feedJobs.length}
          memberCount={pod.podData?.memberCount || 1}
          memberLimit={pod.podData?.memberLimit || 6}
          isTelegramConnected={Boolean(pod.podData?.isTelegramConnected)}
          searchQuery={feed.searchQuery}
          onSearchChange={feed.setSearchQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onOpenAddJob={() => feed.setIsAddOpen(true)}
          onOpenManagePod={onOpenInviteModal}
          onSyncTelegram={handleSyncAll}
          isSyncing={feed.isSyncing}
        />

        {feed.isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-16 text-(--text-muted) gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-(--accent-primary)" />
            <span className="text-xs">Loading pod opportunities...</span>
          </div>
        ) : feed.feedJobs.length === 0 ? (
          <PodFeedEmptyState
            hasPod={Boolean(pod.podData)}
            telegramConnectUrl={pod.podData?.telegramConnectUrl}
            onOpenAddJob={() => feed.setIsAddOpen(true)}
            onCreatePod={onCreate}
            onJoinPod={onJoin}
            isMutating={pod.isMutating}
          />
        ) : (
          <div className="flex-1">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {paginatedJobs.map((job) => (
                  <FeedCard
                    key={job.id}
                    job={job}
                    isTracking={feed.trackingId === job.id}
                    onTrack={feed.trackJob}
                    onUntrack={feed.untrackJob}
                    onDelete={feed.deleteJob}
                  />
                ))}
              </div>
            ) : (
              <FeedListView
                jobs={paginatedJobs}
                trackingId={feed.trackingId}
                onTrack={feed.trackJob}
                onUntrack={feed.untrackJob}
                onDelete={feed.deleteJob}
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
        isOpen={feed.isAddOpen}
        onClose={() => feed.setIsAddOpen(false)}
        onSuccess={feed.refreshFeed}
      />
    </div>
  );
}
