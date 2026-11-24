'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  useDashboardJobs,
  useJobDrawer,
  DashboardHeader,
  DashboardSidebar,
  DashboardTab,
  DashboardTabContent,
  DashboardModals,
  usePodManager,
} from '@/components/dashboard';

function DashboardContent() {
  const searchParams = useSearchParams();
  const [activeNavTab, setActiveNavTab] = useState<DashboardTab>(
    () => (searchParams.get('tab') as DashboardTab) || 'dashboard'
  );
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isBookmarkletOpen, setIsBookmarkletOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [feedRefreshCount, setFeedRefreshCount] = useState(0);
  const [isFeedSyncing, setIsFeedSyncing] = useState(false);

  const podManager = usePodManager();
  const d = useDashboardJobs();
  const { jobs, setJobs, revalidate, theme, toggleTheme, nowTime, currentUser } = d;

  const handleSync = async () => {
    setIsFeedSyncing(true);
    setFeedRefreshCount((c) => c + 1);
    await Promise.all([revalidate(), podManager.fetchPod()]);
    setTimeout(() => setIsFeedSyncing(false), 500);
  };

  const drawerState = useJobDrawer({
    jobs,
    nowTime,
    setJobs,
    handleStatusChange: d.handleStatusChange,
    handleToggleImportant: d.handleToggleImportant,
    handleDeleteJob: d.handleDeleteJob,
  });

  const mutatePod = async (fn: () => Promise<boolean>) => {
    const ok = await fn();
    if (ok) setFeedRefreshCount((c) => c + 1);
    return ok;
  };

  return (
    <div className="h-screen flex bg-(--bg-app) text-(--text-primary) overflow-hidden">
      <DashboardSidebar
        activeTab={activeNavTab}
        onTabChange={setActiveNavTab}
        jobCount={jobs.length}
        currentUser={currentUser}
        theme={theme}
        onToggleTheme={toggleTheme}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        onOpenPodModal={() => podManager.setIsPodOpen(true)}
        hasPod={Boolean(podManager.podData)}
      />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <DashboardHeader
          theme={theme}
          onToggleTheme={toggleTheme}
          onOpenBookmarklet={() => setIsBookmarkletOpen(true)}
          onExportCSV={d.handleExportCSV}
          onOpenAddJob={() => setIsAddOpen(true)}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          activeTab={activeNavTab}
          jobCount={jobs.length}
        />

        <main className="flex-1 overflow-y-auto flex flex-col min-h-0">
          <DashboardTabContent
            activeTab={activeNavTab}
            {...d}
            setDrawerJob={drawerState.setDrawerJob}
            onJobStatusChange={drawerState.onJobStatusChange}
            onJobDelete={drawerState.onJobDelete}
            onJobTracked={revalidate}
            refreshTrigger={feedRefreshCount}
            onOpenInviteModal={() => podManager.setIsPodOpen(true)}
            onSync={handleSync}
            isSyncing={d.isSyncing || isFeedSyncing}
          />
        </main>
      </div>

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
        onRefreshJobs={d.fetchJobs}
        isBookmarkletOpen={isBookmarkletOpen}
        onCloseBookmarklet={() => setIsBookmarkletOpen(false)}
        isPodOpen={podManager.isPodOpen}
        onClosePod={() => podManager.setIsPodOpen(false)}
        podData={podManager.podData}
        onRefreshPod={podManager.fetchPod}
        isRefreshingPod={podManager.isRefreshing}
        onSaveChatId={podManager.handleSaveChatId}
        onSendTest={podManager.handleSendTest}
        onLeavePod={() => mutatePod(podManager.handleLeavePod)}
        onDeletePod={() => mutatePod(podManager.handleDeletePod)}
        onClearJobs={() => mutatePod(podManager.handleClearJobs)}
        onCreatePod={() => mutatePod(podManager.handleCreatePod)}
        onJoinPod={(code) => mutatePod(() => podManager.handleJoinPod(code))}
        isMutatingPod={podManager.isMutating}
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
