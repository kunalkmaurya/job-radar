'use client';

import React from 'react';
import { Bookmark, X } from 'lucide-react';

interface BookmarkletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BookmarkletModal({ isOpen, onClose }: BookmarkletModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-md border border-(--border-subtle) bg-(--bg-surface) p-6 rounded-[8px] shadow-2xl z-10 space-y-4 text-xs">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2 text-(--text-primary)">
            <Bookmark className="w-4 h-4 text-(--accent-primary)" />
            <span>Bookmarklet</span>
          </h3>
          <button
            onClick={onClose}
            className="h-8 w-8 inline-flex items-center justify-center text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-surface-hover) rounded-sm cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-(--text-secondary) leading-relaxed">
          Drag this button to your browser bookmarks bar. When viewing any job on LinkedIn or
          Workday, click it to save instantly:
        </p>

        <div className="p-4 border border-dashed border-(--accent-border) bg-(--accent-primary-bg) rounded-sm text-center">
          <a
            href="javascript:(function(){const url=encodeURIComponent(window.location.href);alert('Job link captured for Job Radar: ' + window.location.href);})();"
            onClick={(e) => e.preventDefault()}
            className="inline-block h-8 px-4 leading-8 bg-(--accent-primary) hover:bg-(--accent-primary-hover) text-(--accent-primary-text) font-semibold rounded-sm shadow-xs cursor-grab active:cursor-grabbing"
          >
            + Job Radar
          </a>
          <span className="block text-xs text-(--text-muted) mt-2">
            (Drag and drop into your Bookmarks Bar)
          </span>
        </div>
      </div>
    </div>
  );
}
