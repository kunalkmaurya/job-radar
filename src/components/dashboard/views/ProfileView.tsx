'use client';

import React from 'react';
import { ProfileHeroCard } from '../profile/ProfileHeroCard';
import { ProfilePreferencesCard } from '../profile/ProfilePreferencesCard';
import { ProfileStatsCard } from '../profile/ProfileStatsCard';
import { ProfileSecurityCard } from '../profile/ProfileSecurityCard';

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
}

export function ProfileView({ currentUser, totalJobs, metrics, onExportCSV }: ProfileViewProps) {
  return (
    <div className="space-y-6">
      {/* 1. Profile Hero & Identity Card */}
      <ProfileHeroCard currentUser={currentUser} totalJobs={totalJobs} />

      {/* 2. Middle Grid: Career Preferences & Pipeline Velocity Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProfilePreferencesCard />
        <ProfileStatsCard metrics={metrics} />
      </div>

      {/* 3. Security Boundary & Account Governance */}
      <ProfileSecurityCard currentUser={currentUser} onExportCSV={onExportCSV} />
    </div>
  );
}
