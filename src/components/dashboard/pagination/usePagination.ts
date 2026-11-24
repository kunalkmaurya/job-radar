'use client';

import { useState, useMemo } from 'react';
import { UsePaginationOptions } from './types';

export type { UsePaginationOptions };

export function usePagination({
  totalItems,
  initialPageSize = 10,
  pageSizeOptions = [5, 10, 20, 50],
}: UsePaginationOptions) {
  const [pageSize, setPageSizeState] = useState<number>(initialPageSize);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const setPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
  };

  const setPageSize = (newSize: number) => {
    setPageSizeState(newSize);
    setCurrentPage(1);
  };

  const nextPage = () => setPage(safeCurrentPage + 1);
  const prevPage = () => setPage(safeCurrentPage - 1);
  const firstPage = () => setPage(1);
  const lastPage = () => setPage(totalPages);

  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const fromItem = totalItems === 0 ? 0 : startIndex + 1;
  const toItem = endIndex;

  const pageNumbers = useMemo<(number | 'ellipsis')[]>(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (safeCurrentPage <= 4) {
      return [1, 2, 3, 4, 5, 'ellipsis', totalPages];
    }

    if (safeCurrentPage >= totalPages - 3) {
      return [
        1,
        'ellipsis',
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      'ellipsis',
      safeCurrentPage - 1,
      safeCurrentPage,
      safeCurrentPage + 1,
      'ellipsis',
      totalPages,
    ];
  }, [safeCurrentPage, totalPages]);

  const paginateItems = <T>(items: T[]): T[] => {
    return items.slice(startIndex, startIndex + pageSize);
  };

  return {
    currentPage: safeCurrentPage,
    pageSize,
    pageSizeOptions,
    totalPages,
    totalItems,
    fromItem,
    toItem,
    canPrevPage: safeCurrentPage > 1,
    canNextPage: safeCurrentPage < totalPages,
    setPage,
    setPageSize,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    pageNumbers,
    paginateItems,
  };
}
