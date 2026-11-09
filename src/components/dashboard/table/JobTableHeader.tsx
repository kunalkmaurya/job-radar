'use client';

import React from 'react';
import { Star } from 'lucide-react';

export function JobTableHeader() {
  return (
    <thead className="sticky top-0 z-10">
      <tr className="border-b border-(--border-subtle) text-(--text-muted) bg-(--bg-surface-hover) text-[11px]">
        <th
          className="py-2.5 pl-3 pr-1 w-8 text-center sticky top-0 z-10 bg-(--bg-surface-hover)"
          aria-label="Important"
        >
          <Star className="w-3.5 h-3.5 mx-auto opacity-40" />
        </th>
        <th className="py-2.5 px-4 font-bold uppercase tracking-wider sticky top-0 z-10 bg-(--bg-surface-hover)">
          Company
        </th>
        <th className="py-2.5 px-4 font-bold uppercase tracking-wider sticky top-0 z-10 bg-(--bg-surface-hover)">
          Role
        </th>
        <th className="py-2.5 px-4 font-bold uppercase tracking-wider sticky top-0 z-10 bg-(--bg-surface-hover)">
          Status
        </th>
        <th className="py-2.5 px-4 font-bold uppercase tracking-wider sticky top-0 z-10 bg-(--bg-surface-hover)">
          Timeline / Age
        </th>
        <th className="py-2.5 px-4 font-bold uppercase tracking-wider text-right sticky top-0 z-10 bg-(--bg-surface-hover)">
          Actions
        </th>
      </tr>
    </thead>
  );
}
