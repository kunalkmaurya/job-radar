'use client';

import { useState, useEffect } from 'react';

export function useFeedViewMode(): [
  'grid' | 'list',
  React.Dispatch<React.SetStateAction<'grid' | 'list'>>,
] {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  useEffect(() => {
    const applySaved = () => {
      try {
        const stored = localStorage.getItem('job_radar_app_settings_v1');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.defaultFeedView === 'grid' || parsed.defaultFeedView === 'list') {
            setViewMode(parsed.defaultFeedView);
          }
        }
      } catch {
        // ignore
      }
    };
    applySaved();
    window.addEventListener('job_radar_settings_updated', applySaved);
    return () => window.removeEventListener('job_radar_settings_updated', applySaved);
  }, []);

  return [viewMode, setViewMode];
}
