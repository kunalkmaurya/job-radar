'use client';

import React from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { usePwaInstall } from './usePwaInstall';
import { InstallIOSModal } from './InstallIOSModal';

export function InstallPromptBanner() {
  const {
    showPrompt,
    isStandalone,
    isIOS,
    showIOSGuide,
    setShowIOSGuide,
    triggerInstall,
    dismiss,
  } = usePwaInstall();

  if (!showPrompt || isStandalone) return null;

  return (
    <>
      <aside
        role="region"
        aria-label="Install Job Radar Application"
        className="fixed bottom-4 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-sm z-50 border border-[var(--border-strong)] bg-[var(--bg-surface)]/95 backdrop-blur-xl shadow-2xl p-3.5 sm:p-4 animate-in slide-in-from-bottom-5 duration-300"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[var(--accent-primary-bg)] border border-[var(--border-subtle)] flex items-center justify-center p-1 shrink-0">
              <img src="/icon.svg" alt="Job Radar" className="w-5 h-5 object-contain" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm tracking-tight text-[var(--text-primary)]">
                Install Job Radar App
              </h4>
              <p className="text-[11px] text-[var(--text-muted)] leading-tight">
                Add to your home screen for instant, full-screen access.
              </p>
            </div>
          </div>
          <button
            onClick={dismiss}
            title="Dismiss for now"
            aria-label="Dismiss install prompt"
            className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={triggerInstall}
            className="flex-1 h-8 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-[0.98] cursor-pointer"
          >
            {isIOS ? (
              <>
                <Smartphone className="w-3.5 h-3.5" />
                <span>How to Install</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Install App</span>
              </>
            )}
          </button>
          <button
            onClick={dismiss}
            className="h-8 px-3 border border-[var(--border-subtle)] bg-[var(--bg-app)] hover:bg-[var(--bg-surface-hover)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            Later
          </button>
        </div>
      </aside>

      <InstallIOSModal isOpen={showIOSGuide} onClose={() => setShowIOSGuide(false)} />
    </>
  );
}
