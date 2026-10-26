'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  useDashboardJobs,
  useJobDrawer,
  DashboardHeader,
  DashboardNavTabs,
  DashboardTab,
  PipelineView,
  AnalyticsView,
  SettingsView,
  ProfileView,
  DashboardModals,
} from '@/components/dashboard';

function DashboardContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as DashboardTab) || 'dashboard';
  const [activeNavTab, setActiveNavTab] = useState<DashboardTab>(initialTab);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isBookmarkletOpen, setIsBookmarkletOpen] = useState(false);

  const {
    jobs, setJobs, isLoading, theme, toggleTheme, viewMode, setViewMode,
    timelineFilter, setTimelineFilter, customRange, setCustomRange,
    searchQuery, setSearchQuery, staleOnlyFilter, setStaleOnlyFilter,
    statusFilter, setStatusFilter,
    nowTime, currentUser, staleCount, metrics, filteredJobs,
    timelineScopedJobs, handleApplyAndAdvance, handleStatusChange,
    handleToggleImportant, handleDeleteJob, handleExportCSV, fetchJobs,
  } = useDashboardJobs();

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
        onOpenProfile={() => setActiveNavTab('profile')}
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
            timelineFilter={timelineFilter} onSelectTimeline={setTimelineFilter}
            customRange={customRange} onCustomRangeChange={setCustomRange}
            timelineScopedJobs={timelineScopedJobs} totalJobsCount={jobs.length}
            isLoading={isLoading} metrics={metrics}
            searchQuery={searchQuery} onSearchChange={setSearchQuery}
            staleCount={staleCount} staleOnlyFilter={staleOnlyFilter}
            onToggleStaleFilter={() => setStaleOnlyFilter(!staleOnlyFilter)}
            viewMode={viewMode} onSelectViewMode={setViewMode}
            filteredJobs={filteredJobs} statusFilter={statusFilter} onSelectStatus={setStatusFilter}
            nowTime={nowTime} onSelectJob={setDrawerJob}
            onStatusChange={onJobStatusChange} onToggleImportant={handleToggleImportant}
            onApplyAndAdvance={handleApplyAndAdvance} onDeleteJob={onJobDelete}
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

        {activeNavTab === 'profile' && (
          <ProfileView
            currentUser={currentUser}
            totalJobs={jobs.length}
            metrics={metrics}
            onExportCSV={handleExportCSV}
          />
        )}
      </div>

      <DashboardModals
        drawerJob={drawerJob} nowTime={nowTime} onCloseDrawer={() => setDrawerJob(null)}
        onStatusChange={onJobStatusChange} onToggleImportant={onJobToggleImportant}
        onDeleteJob={onJobDelete} onSaveNotes={handleSaveNotes}
        isAddOpen={isAddOpen} onCloseAdd={() => setIsAddOpen(false)}
        onJobAdded={(newJob) => setJobs((prev) => [newJob, ...prev])} onRefreshJobs={fetchJobs}
        isBookmarkletOpen={isBookmarkletOpen} onCloseBookmarklet={() => setIsBookmarkletOpen(false)}
      />
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
