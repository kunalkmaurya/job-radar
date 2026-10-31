'use client';

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useFeedJobs } from './useFeedJobs';
import { FeedHeader } from './FeedHeader';
import { FeedCard } from './FeedCard';
import { FeedListView } from './FeedListView';
import { AddPublicJobModal } from './AddPublicJobModal';
import { PaginationBar } from '../pagination/PaginationBar';
import { usePagination } from '../pagination/usePagination';

interface FeedViewProps {
  currentUser?: { email?: string; role?: string } | null;
  onJobTracked?: () => void;
  refreshTrigger?: number;
}

export function FeedView({ currentUser, onJobTracked, refreshTrigger }: FeedViewProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const {
    feedJobs,
    isLoading,
    searchQuery,
    setSearchQuery,
    trackingId,
    trackJob,
    isAddOpen,
    setIsAddOpen,
    refreshFeed,
  } = useFeedJobs({ onJobTracked, refreshTrigger });

  const isAdmin = currentUser?.role === 'admin';
  const pagination = usePagination({
    totalItems: feedJobs.length,
    initialPageSize: 12,
    pageSizeOptions: [12, 24, 48, 96],
  });

  const paginatedJobs = pagination.paginateItems(feedJobs);

  return (
    <div className="w-full space-y-6">
      <FeedHeader
        totalJobs={feedJobs.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        isAdmin={isAdmin}
        onOpenAddJob={() => setIsAddOpen(true)}
      />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-(--text-muted) gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-(--accent-primary)" />
          <span className="text-xs">Loading public feed...</span>
        </div>
      ) : feedJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border border-dashed border-(--border-subtle) text-(--text-muted) gap-1 rounded-xs">
          <p className="text-sm font-medium">No public opportunities found</p>
          <p className="text-xs">
            {searchQuery ? 'Try adjusting your search query' : 'Jobs posted by admins will appear here'}
          </p>
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {paginatedJobs.map((job) => (
                <FeedCard
                  key={job.id}
                  job={job}
                  isTracking={trackingId === job.id}
                  onTrack={trackJob}
                />
              ))}
            </div>
          ) : (
            <FeedListView jobs={paginatedJobs} trackingId={trackingId} onTrack={trackJob} />
          )}

          <div className="border border-(--border-subtle) rounded-xs bg-(--bg-surface) relative z-20">
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
        </>
      )}

      <AddPublicJobModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={refreshFeed}
      />
    </div>
  );
}
