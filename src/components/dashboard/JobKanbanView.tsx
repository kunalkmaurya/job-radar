'use client';

import React, { useState } from 'react';
import { Job, JOB_STATUSES } from '@/types';
import { KanbanHeaderBar } from './kanban/KanbanHeaderBar';
import { KanbanColumn } from './kanban/KanbanColumn';
import { KanbanShimmer } from './shimmer/KanbanShimmer';

interface JobKanbanViewProps {
  jobs: Job[];
  isLoading?: boolean;
  nowTime: number;
  onSelectJob: (job: Job) => void;
  onToggleImportant?: (jobId: string, e?: React.MouseEvent) => void;
  onApplyAndAdvance: (job: Job, e?: React.MouseEvent) => void;
}

export function JobKanbanView({
  jobs,
  isLoading = false,
  nowTime,
  onSelectJob,
  onToggleImportant,
  onApplyAndAdvance,
}: JobKanbanViewProps) {
  const [cardsPerColumn, setCardsPerColumn] = useState<number | 'all'>(5);
  const visibleStatuses = JOB_STATUSES.filter((s) => s !== 'Archived');

  if (isLoading) {
    return <KanbanShimmer />;
  }

  return (
    <div className="space-y-4">
      {/* Board Controls & Column Limit Selector */}
      <KanbanHeaderBar
        totalJobs={jobs.length}
        columnCount={visibleStatuses.length}
        cardsPerColumn={cardsPerColumn}
        onCardsPerColumnChange={setCardsPerColumn}
      />

      {/* Kanban Columns Grid */}
      <section className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
        {visibleStatuses.map((colStatus) => {
          const columnJobs = jobs.filter((j) => j.status === colStatus);
          return (
            <KanbanColumn
              key={colStatus}
              status={colStatus}
              columnJobs={columnJobs}
              cardsPerColumn={cardsPerColumn}
              nowTime={nowTime}
              onSelectJob={onSelectJob}
              onToggleImportant={onToggleImportant}
              onApplyAndAdvance={onApplyAndAdvance}
            />
          );
        })}
      </section>
    </div>
  );
}
