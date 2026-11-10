'use client';

import { useState, useEffect } from 'react';
import { usePagination } from '../pagination/usePagination';

const MOBILE_PAGE_SIZE = 4;
const DESKTOP_PAGE_SIZE = 12;

const MOBILE_PAGE_OPTIONS = [4, 8, 12, 24];
const DESKTOP_PAGE_OPTIONS = [12, 24, 48, 96];

export function useFeedPagination(totalItems: number) {
  const [isMobile, setIsMobile] = useState(false);

  const pagination = usePagination({
    totalItems,
    initialPageSize: DESKTOP_PAGE_SIZE,
    pageSizeOptions: isMobile ? MOBILE_PAGE_OPTIONS : DESKTOP_PAGE_OPTIONS,
  });

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)');
    const updateSize = (matches: boolean) => {
      setIsMobile(matches);
      pagination.setPageSize(matches ? MOBILE_PAGE_SIZE : DESKTOP_PAGE_SIZE);
    };

    updateSize(mql.matches);

    const handler = (e: MediaQueryListEvent) => updateSize(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return pagination;
}

