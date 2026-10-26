'use client';

import React, { useMemo } from 'react';
import { Job, JobStatus } from '@/types';
import { JobTableRow } from './JobTableRow';
import { JobTableHeader } from './table/JobTableHeader';
import { PaginationBar } from './pagination/PaginationBar';
import { usePagination } from './pagination/usePagination';
import { TableShimmer } from './shimmer/TableShimmer';

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

  return (
    <section className="border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-sm flex flex-col">
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse text-xs">
          <JobTableHeader />
          {isLoading ? (
            <TableShimmer rowsCount={6} />
          ) : (
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {paginatedJobs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[var(--text-muted)]">
                    No job applications match your filters.
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
