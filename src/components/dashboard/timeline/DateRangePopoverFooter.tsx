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
        className="flex items-center gap-1.5 px-2.5 py-1.5 border border-(--border-subtle) bg-(--bg-app) text-(--text-secondary) hover:text-(--text-primary) hover:border-(--border-strong) rounded-xs cursor-pointer transition-colors font-medium"
      >
        <X className="w-3.5 h-3.5" />
        <span>Clear</span>
      </button>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center justify-center px-2.5 py-1.5 border border-(--border-subtle) bg-(--bg-app) text-(--text-secondary) hover:text-(--text-primary) hover:border-(--border-strong) rounded-xs cursor-pointer transition-colors font-medium"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={onApply}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-(--accent-primary) bg-(--accent-primary) text-white font-semibold hover:bg-(--accent-primary-hover) rounded-xs cursor-pointer transition-colors shadow-xs font-medium"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Apply</span>
        </button>
      </div>
    </div>
  );
}
