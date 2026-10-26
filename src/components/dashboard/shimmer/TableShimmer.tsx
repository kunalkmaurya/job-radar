'use client';

import React from 'react';

interface TableShimmerProps {
  rowsCount?: number;
}

export function TableShimmer({ rowsCount = 6 }: TableShimmerProps) {
  const rows = Array.from({ length: rowsCount }, (_, i) => i);

  return (
    <tbody className="divide-y divide-[var(--border-subtle)] animate-pulse">
      {rows.map((idx) => (
        <tr key={`shimmer-row-${idx}`} className="bg-[var(--bg-surface)]/40">
          {/* Star Column */}
          <td className="py-4 pl-3 pr-1 w-8 text-center">
            <div className="w-4 h-4 mx-auto shimmer-block bg-[var(--border-subtle)]" />
          </td>

          {/* Company Column */}
          <td className="py-4 px-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 shimmer-block bg-[var(--border-subtle)] flex-shrink-0" />
              <div className="space-y-1.5 flex-1 max-w-[130px]">
                <div className="h-3.5 shimmer-block bg-[var(--border-subtle)] w-full" />
              </div>
            </div>
          </td>

          {/* Role Column */}
          <td className="py-4 px-4">
            <div className="flex items-center gap-2">
              <div className="h-3.5 shimmer-block bg-[var(--border-subtle)] w-36" />
              <div className="h-3 shimmer-block bg-[var(--border-subtle)] w-14" />
            </div>
          </td>

          {/* Status Column */}
          <td className="py-4 px-4">
            <div className="h-6 w-20 shimmer-block bg-[var(--border-subtle)]" />
          </td>

          {/* Timeline Column */}
          <td className="py-4 px-4">
            <div className="h-3.5 shimmer-block bg-[var(--border-subtle)] w-24" />
          </td>

          {/* Actions Column */}
          <td className="py-4 px-4 text-right">
            <div className="flex items-center justify-end gap-1.5">
              <div className="w-6 h-6 shimmer-block bg-[var(--border-subtle)]" />
              <div className="w-6 h-6 shimmer-block bg-[var(--border-subtle)]" />
              <div className="w-6 h-6 shimmer-block bg-[var(--border-subtle)]" />
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  );
}
