'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { useFeedJobs } from './useFeedJobs';
import { useFeedViewMode } from './useFeedViewMode';
import { FeedHeader } from './FeedHeader';
import { FeedCard } from './FeedCard';
import { FeedListView } from './FeedListView';
import { PaginationBar } from '../pagination/PaginationBar';
import { usePagination } from '../pagination/usePagination';

interface FeedViewProps {
  onJobTracked?: () => void;
  refreshTrigger?: number;
  onSync?: () => void;
  isSyncing?: boolean;
}

export function FeedView({ onJobTracked, refreshTrigger, onSync, isSyncing }: FeedViewProps) {
  const [viewMode, setViewMode] = useFeedViewMode();
  const { feedJobs, isLoading, searchQuery, setSearchQuery, trackingId, trackJob, untrackJob } =
    useFeedJobs({
      initialFeedType: 'public',
      onJobTracked,
      refreshTrigger,
    });

  const pagination = usePagination({
    totalItems: feedJobs.length,
    initialPageSize: 12,
    pageSizeOptions: [12, 24, 48, 96],
  });

  const paginatedJobs = pagination.paginateItems(feedJobs);

  return (
    <div className="w-full flex-1 flex flex-col justify-between min-h-full space-y-6">
      <div className="space-y-6 flex-1 flex flex-col">
        <FeedHeader
          totalJobs={feedJobs.length}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onSync={onSync}
          isSyncing={isSyncing}
        />

        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-16 text-(--text-muted) gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-(--accent-primary)" />
            <span className="text-xs">Loading public opportunities...</span>
          </div>
        ) : feedJobs.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-16 border border-dashed border-(--border-subtle) text-(--text-muted) gap-1 rounded-xs">
            <p className="text-sm font-medium">No opportunities found</p>
            <p className="text-xs">
              {searchQuery
                ? 'Try adjusting your search query'
                : 'No public curated listings found at this time.'}
            </p>
          </div>
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
                    onUntrack={untrackJob}
                  />
                ))}
              </div>
            ) : (
              <FeedListView
                jobs={paginatedJobs}
                trackingId={trackingId}
                onTrack={trackJob}
                onUntrack={untrackJob}
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
    </div>
  );
}
