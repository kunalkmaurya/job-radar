'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const MIN_WIDTH = 200;
const MAX_WIDTH = 380;
const DEFAULT_WIDTH = 240;
const STORAGE_WIDTH_KEY = 'job_radar_sidebar_width';
const STORAGE_COLLAPSED_KEY = 'job_radar_sidebar_collapsed';

export function useSidebar() {
  const [width, setWidth] = useState<number>(DEFAULT_WIDTH);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const widthRef = useRef(width);

  useEffect(() => {
    widthRef.current = width;
  }, [width]);

  useEffect(() => {
    try {
      const savedWidth = localStorage.getItem(STORAGE_WIDTH_KEY);
      if (savedWidth) {
        const parsed = parseInt(savedWidth, 10);
        if (!isNaN(parsed) && parsed >= MIN_WIDTH && parsed <= MAX_WIDTH) {
          setWidth(parsed);
        }
      }
      const savedCollapsed = localStorage.getItem(STORAGE_COLLAPSED_KEY);
      if (savedCollapsed !== null) {
        setIsCollapsed(savedCollapsed === 'true');
      }
    } catch {
      // LocalStorage access fallback
    }
  }, []);

  const toggleCollapsed = useCallback(() => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_COLLAPSED_KEY, String(next));
      } catch {
        // Fallback
      }
      return next;
    });
  }, []);

  const resetWidth = useCallback(() => {
    setWidth(DEFAULT_WIDTH);
    try {
      localStorage.setItem(STORAGE_WIDTH_KEY, String(DEFAULT_WIDTH));
    } catch {
      // Fallback
    }
  }, []);

  const startResizing = useCallback((mouseDownEvent: React.MouseEvent) => {
    mouseDownEvent.preventDefault();
    setIsResizing(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const handleMouseMove = (mouseMoveEvent: MouseEvent) => {
      const newWidth = Math.min(Math.max(mouseMoveEvent.clientX, MIN_WIDTH), MAX_WIDTH);
      setWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      try {
        localStorage.setItem(STORAGE_WIDTH_KEY, String(widthRef.current));
      } catch {
        // Fallback
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleCollapsed();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleCollapsed]);

  return {
    width,
    isCollapsed,
    isMobileOpen,
    isResizing,
    setIsMobileOpen,
    toggleCollapsed,
    resetWidth,
    startResizing,
  };
}
