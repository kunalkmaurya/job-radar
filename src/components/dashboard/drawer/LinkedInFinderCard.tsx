'use client';

import React from 'react';
import { ExternalLink, Users, Search } from 'lucide-react';
import {
  getLinkedIn1stDegreeSearchUrl,
  getLinkedIn2ndDegreeSearchUrl,
  cleanCompanyName,
} from '@/lib/linkedin';

interface LinkedInFinderCardProps {
  company: string;
}

export function LinkedInFinderCard({ company }: LinkedInFinderCardProps) {
  const cleanName = cleanCompanyName(company);
  const firstDegreeUrl = getLinkedIn1stDegreeSearchUrl(company);
  const secondDegreeUrl = getLinkedIn2ndDegreeSearchUrl(company);

  return (
    <div className="border border-(--border-subtle) bg-(--bg-app) p-3 space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-(--text-primary) font-semibold text-xs">
          <Users className="w-3.5 h-3.5 text-[#0A66C2]" />
          <span>LinkedIn Network at {cleanName}</span>
        </div>
        <span className="text-[10px] text-(--text-muted) uppercase tracking-wider font-mono">
          Deep Link
        </span>
      </div>

      <p className="text-[11px] text-(--text-secondary) leading-relaxed">
        Search for your connections currently employed at {cleanName} to request an internal
        employee referral.
      </p>

      <div className="grid grid-cols-2 gap-2 pt-0.5">
        <a
          href={firstDegreeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 border border-(--border-subtle) hover:border-[#0A66C2]/60 bg-(--bg-surface) hover:bg-(--bg-surface-hover) text-[#0A66C2] text-[11px] font-medium transition-colors"
        >
          <Search className="w-3 h-3 shrink-0" />
          <span>1st-Degree</span>
          <ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-60" />
        </a>

        <a
          href={secondDegreeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 border border-(--border-subtle) hover:border-(--border-focus) bg-(--bg-surface) hover:bg-(--bg-surface-hover) text-(--text-secondary) hover:text-(--text-primary) text-[11px] font-medium transition-colors"
        >
          <span>2nd-Degree & Alumni</span>
          <ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-60" />
        </a>
      </div>
    </div>
  );
}
