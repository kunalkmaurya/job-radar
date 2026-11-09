'use client';

import React, { useMemo } from 'react';
import { Job, JobStatus } from '@/types';
import { JobTableRow } from './JobTableRow';
import { JobTableHeader } from './table/JobTableHeader';
import { PaginationBar } from './pagination/PaginationBar';
import { usePagination } from './pagination/usePagination';
import { TableShimmer } from './shimmer/TableShimmer';
import { JobMobileCard } from './table/JobMobileCard';

interface JobListViewProps {
  jobs: Job[];
  isLoading?: boolean;
  nowTime: number;
  onSelectJob: (job: Job) => void;
  onStatusChange: (jobId: string, status: JobStatus, e?: React.MouseEvent) => void;
  onToggleImportant?: (jobId: string, e?: React.MouseEvent) => void;
  onApplyAndAdvance: (job: Job, e?: React.MouseEvent) => void;
  onDeleteJob: (jobId: string, e?: React.MouseEvent) => void;
}

export function JobListView({
  jobs,
  isLoading = false,
  nowTime,
  onSelectJob,
  onStatusChange,
  onToggleImportant,
  onApplyAndAdvance,
  onDeleteJob,
}: JobListViewProps) {
  const pagination = usePagination({
    totalItems: jobs.length,
    initialPageSize: 10,
    pageSizeOptions: [5, 10, 20, 50],
  });

  const paginatedJobs = useMemo(
    () => pagination.paginateItems(jobs),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [jobs, pagination.currentPage, pagination.pageSize]
  );

  const emptyMessage =
    jobs.length === 0
      ? 'No job applications yet. Visit Explore or click + Add Job to start tracking.'
      : 'No job applications match your filters.';

  return (
    <section className="border border-(--border-subtle) bg-(--bg-surface) rounded-md shadow-xs flex flex-col relative">
      {/* Mobile Card List */}
      <div className="block md:hidden divide-y divide-(--border-subtle) overflow-y-auto max-h-[calc(100vh-280px)] min-h-[160px]">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-(--text-muted) animate-pulse">
            Loading applications...
          </div>
        ) : paginatedJobs.length === 0 ? (
          <div className="py-12 text-center text-xs text-(--text-muted)">{emptyMessage}</div>
        ) : (
          paginatedJobs.map((job) => (
            <JobMobileCard
              key={job.id}
              job={job}
              nowTime={nowTime}
              onSelectJob={onSelectJob}
              onStatusChange={onStatusChange}
              onToggleImportant={onToggleImportant}
              onDeleteJob={onDeleteJob}
            />
          ))
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-auto flex-1 max-h-[calc(100vh-280px)] min-h-[160px] rounded-t-md">
        <table className="w-full min-w-[700px] text-left border-collapse text-xs">
          <JobTableHeader />
          {isLoading ? (
            <TableShimmer rowsCount={6} />
          ) : (
            <tbody className="divide-y divide-(--border-subtle)">
              {paginatedJobs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-(--text-muted)">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                paginatedJobs.map((job) => (
                  <JobTableRow
                    key={job.id}
                    job={job}
                    nowTime={nowTime}
                    onSelectJob={onSelectJob}
                    onStatusChange={onStatusChange}
                    onToggleImportant={onToggleImportant}
                    onApplyAndAdvance={onApplyAndAdvance}
                    onDeleteJob={onDeleteJob}
                  />
                ))
              )}
            </tbody>
          )}
        </table>
      </div>

      {!isLoading && (
        <PaginationBar
          className="sticky bottom-0 z-20 rounded-b-md shadow-xs"
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
      )}
    </section>
  );
}
