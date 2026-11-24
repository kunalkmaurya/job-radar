export interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  fromItem: number;
  toItem: number;
  pageSize: number;
  pageSizeOptions: number[];
  canPrevPage: boolean;
  canNextPage: boolean;
  pageNumbers: (number | 'ellipsis')[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onFirstPage: () => void;
  onLastPage: () => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  className?: string;
}

export interface UsePaginationOptions {
  totalItems: number;
  initialPageSize?: number;
  pageSizeOptions?: number[];
}
