'use client';

import React, { useState, Suspense } from 'react';
import { Job, JobStatus } from '@/types';
import {
  useDashboardJobs,
  DashboardHeader,
  AnalyticsRibbon,
  ControlBar,
  JobListView,
  JobKanbanView,
  NotesDrawer,
  AddJobModal,
  BookmarkletModal,
} from '@/components/dashboard';

function DashboardContent() {
  const {
    jobs, setJobs, theme, toggleTheme, viewMode, setViewMode,
    timelineFilter, setTimelineFilter, searchQuery, setSearchQuery,
    staleOnlyFilter, setStaleOnlyFilter, nowTime, currentUser,
    staleCount, metrics, filteredJobs, handleApplyAndAdvance,
    handleStatusChange, handleDeleteJob, handleExportCSV, fetchJobs,
  } = useDashboardJobs();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isBookmarkletOpen, setIsBookmarkletOpen] = useState(false);
  const [drawerJob, setDrawerJob] = useState<Job | null>(null);

  const handleSaveNotes = async (jobId: string, notes: string, followUpDate: string | null) => {
    try {
      await fetch(`/api/jobs/${jobId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes, followUpDate }),
      });
      setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, notes, followUpDate, updatedAt: new Date(nowTime) } : j)));
      if (drawerJob?.id === jobId) setDrawerJob((prev) => (prev ? { ...prev, notes, followUpDate } : null));
    } catch (err) {
      console.error('Failed to save notes:', err);
    }
  };

  const onJobStatusChange = (jobId: string, status: JobStatus) => {
    handleStatusChange(jobId, status);
    if (drawerJob?.id === jobId) setDrawerJob((prev) => (prev ? { ...prev, status } : null));
  };

  const onJobDelete = (jobId: string) => {
    handleDeleteJob(jobId);
    if (drawerJob?.id === jobId) setDrawerJob(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-app)] text-[var(--text-primary)]">
      <DashboardHeader
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenBookmarklet={() => setIsBookmarkletOpen(true)}
        onExportCSV={handleExportCSV}
        onOpenAddJob={() => setIsAddOpen(true)}
        currentUser={currentUser}
      />

      <div className="w-full px-[20px] py-6 space-y-6 flex-1">
        <AnalyticsRibbon metrics={metrics} />

        <ControlBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          staleCount={staleCount}
          staleOnlyFilter={staleOnlyFilter}
          onToggleStaleFilter={() => setStaleOnlyFilter(!staleOnlyFilter)}
          timelineFilter={timelineFilter}
          onSelectTimeline={setTimelineFilter}
          viewMode={viewMode}
          onSelectViewMode={setViewMode}
        />

        {viewMode === 'list' ? (
          <JobListView
            jobs={filteredJobs}
            nowTime={nowTime}
            onSelectJob={setDrawerJob}
            onStatusChange={handleStatusChange}
            onApplyAndAdvance={handleApplyAndAdvance}
            onDeleteJob={onJobDelete}
          />
        ) : (
          <JobKanbanView
            jobs={filteredJobs}
            nowTime={nowTime}
            onSelectJob={setDrawerJob}
            onApplyAndAdvance={handleApplyAndAdvance}
          />
        )}
      </div>

      <NotesDrawer
        job={drawerJob}
        nowTime={nowTime}
        onClose={() => setDrawerJob(null)}
        onStatusChange={onJobStatusChange}
        onDeleteJob={onJobDelete}
        onSaveNotes={handleSaveNotes}
      />

      <AddJobModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onJobAdded={(newJob) => setJobs((prev) => [newJob, ...prev])}
        onRefreshJobs={fetchJobs}
      />

      <BookmarkletModal isOpen={isBookmarkletOpen} onClose={() => setIsBookmarkletOpen(false)} />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--bg-app)] flex items-center justify-center text-xs text-[var(--text-muted)]">
          Loading workspace...
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
