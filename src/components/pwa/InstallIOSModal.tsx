'use client';

import React from 'react';
import { Share, PlusSquare, X } from 'lucide-react';

interface InstallIOSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InstallIOSModal({ isOpen, onClose }: InstallIOSModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 shadow-2xl relative space-y-4">
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-3.5 right-3.5 p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[var(--accent-primary-bg)] border border-[var(--border-subtle)] flex items-center justify-center p-1.5 shrink-0">
            <img src="/icon.svg" alt="Job Radar" className="w-6 h-6 object-contain" />
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-tight text-[var(--text-primary)]">
              Install on iPhone / iPad
            </h3>
            <p className="text-[11px] text-[var(--text-muted)]">
              Add to Home Screen for the full app experience
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-2 text-xs text-[var(--text-secondary)]">
          <div className="flex items-start gap-3 p-2.5 bg-[var(--bg-app)] border border-[var(--border-subtle)]">
            <div className="w-6 h-6 rounded bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0">
              <Share className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-semibold text-[var(--text-primary)]">Step 1: </span>
              Tap the <span className="font-semibold text-sky-400">Share</span> icon in
              Safari&apos;s bottom bar.
            </div>
          </div>

          <div className="flex items-start gap-3 p-2.5 bg-[var(--bg-app)] border border-[var(--border-subtle)]">
            <div className="w-6 h-6 rounded bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <PlusSquare className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-semibold text-[var(--text-primary)]">Step 2: </span>
              Scroll down and tap{' '}
              <span className="font-semibold text-emerald-400">Add to Home Screen</span>.
            </div>
          </div>

          <div className="flex items-start gap-3 p-2.5 bg-[var(--bg-app)] border border-[var(--border-subtle)]">
            <div className="w-6 h-6 rounded bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 text-[10px] font-bold">
              3
            </div>
            <div>
              <span className="font-semibold text-[var(--text-primary)]">Step 3: </span>
              Tap <span className="font-semibold text-[var(--text-primary)]">Add</span> in the top
              right corner.
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full h-9 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white text-xs font-semibold shadow-sm transition-all active:scale-[0.98] cursor-pointer"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
