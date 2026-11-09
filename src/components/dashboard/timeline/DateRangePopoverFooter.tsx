'use client';

import React from 'react';
import { X, Check } from 'lucide-react';

interface DateRangePopoverFooterProps {
  onClear: () => void;
  onCancel: () => void;
  onApply: () => void;
}

export function DateRangePopoverFooter({
  onClear,
  onCancel,
  onApply,
}: DateRangePopoverFooterProps) {
  return (
    <div className="flex items-center justify-between pt-2.5 border-t border-(--border-subtle) text-xs">
      <button
        type="button"
        onClick={onClear}
        className="h-8 inline-flex items-center gap-1.5 px-2.5 border border-(--border-subtle) bg-(--bg-surface) text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--bg-surface-hover) rounded-sm cursor-pointer transition-colors font-medium text-xs"
      >
        <X className="w-3.5 h-3.5" />
        <span>Clear</span>
      </button>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="h-8 inline-flex items-center justify-center px-3 border border-(--border-subtle) bg-(--bg-surface) text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--bg-surface-hover) rounded-sm cursor-pointer transition-colors font-medium text-xs"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={onApply}
          className="h-8 inline-flex items-center gap-1.5 px-3.5 bg-(--accent-primary) hover:bg-(--accent-primary-hover) text-(--accent-primary-text) font-semibold rounded-sm cursor-pointer transition-colors shadow-xs text-xs"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Apply</span>
        </button>
      </div>
    </div>
  );
}
