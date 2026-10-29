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
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-2xl z-10 space-y-4 text-xs">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-[var(--accent-primary)]" />
            <span>1-Click Browser Bookmarklet</span>
          </h3>
          <button
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[var(--text-secondary)] leading-relaxed">
          Drag this button to your browser bookmarks bar. When viewing any job on LinkedIn or
          Workday, click it to save instantly:
        </p>

        <div className="p-4 border border-dashed border-[var(--accent-primary)]/40 bg-[var(--accent-primary-bg)] text-center">
          <a
            href="javascript:(function(){const url=encodeURIComponent(window.location.href);alert('Job link captured for Job Radar: ' + window.location.href);})();"
            onClick={(e) => e.preventDefault()}
            className="inline-block px-4 py-2 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white font-semibold shadow-sm cursor-grab active:cursor-grabbing"
          >
            + Add to Job Radar
          </a>
          <span className="block text-[10px] text-[var(--text-muted)] mt-2">
            (Drag and drop into your Bookmarks Bar)
          </span>
        </div>
      </div>
    </div>
  );
}
