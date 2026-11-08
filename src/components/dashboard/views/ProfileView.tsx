'use client';

import React from 'react';
import {
  ProfileHeroCard,
  ProfilePreferencesCard,
  ProfileStatsCard,
  ProfileSecurityCard,
  ProfileEmailDigestCard,
  ProfilePodCard,
} from '../profile';

interface ProfileViewProps {
  currentUser: { email?: string; name?: string; role?: string } | null;
  totalJobs: number;
  metrics: {
    totalJobs: number;
    appliedCount: number;
    appliedLabel: string;
    interviewingCount: number;
    offerCount: number;
    responseRate: number;
  };
  onExportCSV: () => void;
  onOpenInviteModal?: () => void;
}

export function ProfileView({
  currentUser,
  totalJobs,
  metrics,
  onExportCSV,
  onOpenInviteModal,
}: ProfileViewProps) {
  return (
    <div className="space-y-6">
      <ProfileHeroCard currentUser={currentUser} totalJobs={totalJobs} />

      <ProfilePodCard onOpenInviteModal={onOpenInviteModal} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProfilePreferencesCard />
        <ProfileEmailDigestCard userEmail={currentUser?.email} />
      </div>

      <ProfileStatsCard metrics={metrics} />

      <ProfileSecurityCard currentUser={currentUser} onExportCSV={onExportCSV} />
    </div>
  );
}
