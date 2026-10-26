'use client';

import React from 'react';
import { Star } from 'lucide-react';

export function JobTableHeader() {
  return (
    <thead>
      <tr className="border-b border-[var(--border-subtle)] text-[var(--text-muted)] bg-[var(--bg-surface)]/50 text-xs">
        <th className="py-3 pl-3 pr-1 w-8 text-center" aria-label="Important">
          <Star className="w-3.5 h-3.5 mx-auto opacity-40" />
        </th>
        <th className="py-3 px-4 font-semibold uppercase tracking-wider">Company</th>
        <th className="py-3 px-4 font-semibold uppercase tracking-wider">Role</th>
        <th className="py-3 px-4 font-semibold uppercase tracking-wider">Status</th>
        <th className="py-3 px-4 font-semibold uppercase tracking-wider">Timeline / Age</th>
        <th className="py-3 px-4 font-semibold uppercase tracking-wider text-right">Actions</th>
      </tr>
    </thead>
  );
}
