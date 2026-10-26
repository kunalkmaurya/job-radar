'use client';

import { useState, useMemo, useEffect } from 'react';

export interface UsePaginationOptions {
  totalItems: number;
  initialPageSize?: number;
  pageSizeOptions?: number[];
}

export function usePagination({
  totalItems,
  initialPageSize = 10,
  pageSizeOptions = [5, 10, 20, 50],
}: UsePaginationOptions) {
  const [pageSize, setPageSizeState] = useState<number>(initialPageSize);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Automatically keep current page within valid bounds when totalItems changes
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const setPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
  };

  const setPageSize = (newSize: number) => {
    setPageSizeState(newSize);
    setCurrentPage(1); // Reset to page 1 upon changing page size
  };

  const nextPage = () => setPage(currentPage + 1);
  const prevPage = () => setPage(currentPage - 1);
  const firstPage = () => setPage(1);
  const lastPage = () => setPage(totalPages);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const fromItem = totalItems === 0 ? 0 : startIndex + 1;
  const toItem = endIndex;

  // Generate page numbers with smart windowing (e.g., [1, 2, 3, 4, 5])
  const pageNumbers = useMemo<(number | 'ellipsis')[]>(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, 'ellipsis', totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [1, 'ellipsis', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages];
  }, [currentPage, totalPages]);

  const paginateItems = <T,>(items: T[]): T[] => {
    return items.slice(startIndex, startIndex + pageSize);
  };

  return {
    currentPage,
    pageSize,
    pageSizeOptions,
    totalPages,
    totalItems,
    fromItem,
    toItem,
    canPrevPage: currentPage > 1,
    canNextPage: currentPage < totalPages,
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
