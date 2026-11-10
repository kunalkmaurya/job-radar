'use client';

import React from 'react';
import { PodMember } from './types';

interface PodMembersSectionProps {
  members: PodMember[];
}

export function PodMembersSection({ members }: PodMembersSectionProps) {
  return (
    <div className="space-y-1.5 pt-1">
      <div className="text-xs font-semibold text-(--text-secondary)">Members</div>
      <div className="flex flex-wrap gap-2">
        {members.map((m) => (
          <span
            key={m.id}
            className="inline-flex items-center gap-2 px-2.5 py-1 text-xs border border-(--border-subtle) bg-(--bg-surface) text-(--text-primary) rounded-sm font-medium shadow-xs"
          >
            <span className="w-4 h-4 rounded-full bg-(--accent-primary-bg) text-(--accent-blue-bright) font-bold text-[9px] flex items-center justify-center shrink-0">
              {(m.name || m.email)[0].toUpperCase()}
            </span>
            <span className="truncate">{m.name || m.email.split('@')[0]}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

