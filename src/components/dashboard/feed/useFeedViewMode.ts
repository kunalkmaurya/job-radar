'use client';

import { useState, useEffect } from 'react';

export function useFeedViewMode(): [
  'grid' | 'list',
  React.Dispatch<React.SetStateAction<'grid' | 'list'>>,
] {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)');

    const applyMode = () => {
      if (mql.matches) {
        setViewMode('grid');
        return;
      }
      try {
        const stored = localStorage.getItem('job_radar_app_settings_v1');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.defaultFeedView === 'grid' || parsed.defaultFeedView === 'list') {
            setViewMode(parsed.defaultFeedView);
            return;
          }
        }
      } catch {
        // ignore
      }
      setViewMode('list');
    };

    applyMode();
    mql.addEventListener('change', applyMode);
    window.addEventListener('job_radar_settings_updated', applyMode);
    return () => {
      mql.removeEventListener('change', applyMode);
      window.removeEventListener('job_radar_settings_updated', applyMode);
    };
  }, []);

  return [viewMode, setViewMode];
}
