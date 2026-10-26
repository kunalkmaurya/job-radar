'use client';

import React, { useState, Suspense } from 'react';
import {
  useDashboardJobs,
  useJobDrawer,
  DashboardHeader,
  DashboardNavTabs,
  DashboardTab,
  PipelineView,
  AnalyticsView,
  SettingsView,
  NotesDrawer,
  AddJobModal,
  BookmarkletModal,
} from '@/components/dashboard';

function DashboardContent() {
  const {
    jobs, setJobs, isLoading, theme, toggleTheme, viewMode, setViewMode,
    timelineFilter, setTimelineFilter, customRange, setCustomRange,
    searchQuery, setSearchQuery, staleOnlyFilter, setStaleOnlyFilter,
    statusFilter, setStatusFilter,
    nowTime, currentUser, staleCount, metrics, filteredJobs,
    timelineScopedJobs, handleApplyAndAdvance, handleStatusChange,
    handleToggleImportant, handleDeleteJob, handleExportCSV, fetchJobs,
  } = useDashboardJobs();

  const [activeNavTab, setActiveNavTab] = useState<DashboardTab>('dashboard');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isBookmarkletOpen, setIsBookmarkletOpen] = useState(false);

  const { drawerJob, setDrawerJob, handleSaveNotes, onJobStatusChange, onJobToggleImportant, onJobDelete } = useJobDrawer({
    nowTime,
    setJobs,
    handleStatusChange,
    handleToggleImportant,
    handleDeleteJob,
  });

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

      <DashboardNavTabs
        activeTab={activeNavTab}
        onTabChange={setActiveNavTab}
        jobCount={jobs.length}
      />

      <div className="w-full px-[20px] py-6 space-y-6 flex-1">
        {activeNavTab === 'dashboard' && (
          <PipelineView
            timelineFilter={timelineFilter}
            onSelectTimeline={setTimelineFilter}
            customRange={customRange}
            onCustomRangeChange={setCustomRange}
            timelineScopedJobs={timelineScopedJobs}
            totalJobsCount={jobs.length}
            isLoading={isLoading}
            metrics={metrics}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            staleCount={staleCount}
            staleOnlyFilter={staleOnlyFilter}
            onToggleStaleFilter={() => setStaleOnlyFilter(!staleOnlyFilter)}
            viewMode={viewMode}
            onSelectViewMode={setViewMode}
            filteredJobs={filteredJobs}
            statusFilter={statusFilter}
            onSelectStatus={setStatusFilter}
            nowTime={nowTime}
            onSelectJob={setDrawerJob}
            onStatusChange={onJobStatusChange}
            onToggleImportant={handleToggleImportant}
            onApplyAndAdvance={handleApplyAndAdvance}
            onDeleteJob={onJobDelete}
          />
        )}

        {activeNavTab === 'analytics' && (
          <AnalyticsView
            timelineFilter={timelineFilter}
            onSelectTimeline={setTimelineFilter}
            customRange={customRange}
            onCustomRangeChange={setCustomRange}
            timelineScopedJobs={timelineScopedJobs}
            totalJobsCount={jobs.length}
            metrics={metrics}
          />
        )}

        {activeNavTab === 'settings' && (
          <SettingsView
            currentUser={currentUser}
            onExportCSV={handleExportCSV}
            totalJobs={jobs.length}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
        )}
      </div>

      <NotesDrawer
        job={drawerJob}
        nowTime={nowTime}
        onClose={() => setDrawerJob(null)}
        onStatusChange={onJobStatusChange}
        onToggleImportant={onJobToggleImportant}
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
