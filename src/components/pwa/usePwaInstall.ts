'use client';

import { useState, useEffect, useCallback } from 'react';

const DISMISS_KEY = 'job_radar_install_dismissed_at';
const DISMISS_DURATION_MS = 3 * 24 * 60 * 60 * 1000; // 3 days

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let iosTimer: NodeJS.Timeout | undefined;
    const initialTimer = setTimeout(() => {
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      setIsStandalone(isStandaloneMode);
      if (isStandaloneMode) return;

      const ua = window.navigator.userAgent.toLowerCase();
      const isAppleDevice =
        /iphone|ipad|ipod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
      const isSafari = /safari/.test(ua) && !/crios|fxios|opios/.test(ua);
      const iOSSafari = isAppleDevice && isSafari;
      setIsIOS(iOSSafari);

      const dismissedAt = localStorage.getItem(DISMISS_KEY);
      const isDismissedRecently =
        dismissedAt && Date.now() - Number(dismissedAt) < DISMISS_DURATION_MS;

      if (iOSSafari && !isDismissedRecently) {
        iosTimer = setTimeout(() => setShowPrompt(true), 1500);
      }
    }, 0);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      const dismissedAt = localStorage.getItem(DISMISS_KEY);
      const isDismissedRecently =
        dismissedAt && Date.now() - Number(dismissedAt) < DISMISS_DURATION_MS;
      if (!isDismissedRecently) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      clearTimeout(initialTimer);
      if (iosTimer) clearTimeout(iosTimer);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const triggerInstall = useCallback(async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
      setDeferredPrompt(null);
    }
  }, [deferredPrompt, isIOS]);

  const dismiss = useCallback(() => {
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
    setShowPrompt(false);
    setShowIOSGuide(false);
  }, []);

  return {
    isInstallable: Boolean(deferredPrompt) || isIOS,
    isIOS,
    isStandalone,
    showPrompt,
    showIOSGuide,
    setShowIOSGuide,
    triggerInstall,
    dismiss,
  };
}
