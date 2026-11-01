'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  useDashboardJobs,
  useJobDrawer,
  DashboardHeader,
  DashboardNavTabs,
  DashboardTab,
  DashboardTabContent,
  DashboardModals,
} from '@/components/dashboard';

function DashboardContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as DashboardTab) || 'dashboard';
  const [activeNavTab, setActiveNavTab] = useState<DashboardTab>(initialTab);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isBookmarkletOpen, setIsBookmarkletOpen] = useState(false);
  const [feedRefreshCount, setFeedRefreshCount] = useState(0);
  const [isFeedSyncing, setIsFeedSyncing] = useState(false);

  const dashboardState = useDashboardJobs();
  const {
    jobs,
    setJobs,
    revalidate,
    theme,
    toggleTheme,
    nowTime,
    currentUser,
    handleExportCSV,
    fetchJobs,
  } = dashboardState;

  const handleSync = async () => {
    setIsFeedSyncing(true);
    setFeedRefreshCount((c) => c + 1);
    await revalidate();
    setTimeout(() => setIsFeedSyncing(false), 500);
  };

  const drawerState = useJobDrawer({
    jobs,
    nowTime,
    setJobs,
    handleStatusChange: dashboardState.handleStatusChange,
    handleToggleImportant: dashboardState.handleToggleImportant,
    handleDeleteJob: dashboardState.handleDeleteJob,
  });

  return (
    <div className="min-h-screen flex flex-col bg-(--bg-app) text-(--text-primary)">
      <DashboardHeader
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenBookmarklet={() => setIsBookmarkletOpen(true)}
        onExportCSV={handleExportCSV}
        onOpenAddJob={() => setIsAddOpen(true)}
        onOpenProfile={() => setActiveNavTab('profile')}
        currentUser={currentUser}
        isSyncing={dashboardState.isSyncing || isFeedSyncing}
        onSync={handleSync}
      />

      <DashboardNavTabs
        activeTab={activeNavTab}
        onTabChange={setActiveNavTab}
        jobCount={jobs.length}
      />

      <DashboardTabContent
        activeTab={activeNavTab}
        {...dashboardState}
        setDrawerJob={drawerState.setDrawerJob}
        onJobStatusChange={drawerState.onJobStatusChange}
        onJobDelete={drawerState.onJobDelete}
        onJobTracked={revalidate}
        refreshTrigger={feedRefreshCount}
      />

      <DashboardModals
        drawerJob={drawerState.drawerJob}
        nowTime={nowTime}
        onCloseDrawer={() => drawerState.setDrawerJob(null)}
        onStatusChange={drawerState.onJobStatusChange}
        onToggleImportant={drawerState.onJobToggleImportant}
        onDeleteJob={drawerState.onJobDelete}
        onSaveNotes={drawerState.handleSaveNotes}
        onUpdateReferral={drawerState.handleUpdateReferral}
        jobToDelete={drawerState.jobToDelete}
        onConfirmDelete={drawerState.confirmDeleteJob}
        onCancelDelete={drawerState.cancelDeleteJob}
        isAddOpen={isAddOpen}
        onCloseAdd={() => setIsAddOpen(false)}
        onJobAdded={(newJob) => setJobs((prev) => [newJob, ...prev])}
        onRefreshJobs={fetchJobs}
        isBookmarkletOpen={isBookmarkletOpen}
        onCloseBookmarklet={() => setIsBookmarkletOpen(false)}
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-(--bg-app) flex items-center justify-center text-xs text-(--text-muted)">
          Loading workspace...
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
