import { useCallback, useState } from 'react';

export interface UsePaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
}

export interface UsePaginationResult {
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  next: () => void;
  previous: () => void;
  first: () => void;
  range: (total: number) => { from: number; to: number; totalPages: number };
  offset: number;
  limit: number;
}

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;

/**
 * Hook de paginação client-side.
 *
 * Fornece estado de página, navegação (next, previous, first) e cálculo
 * de range para uso em listas. Compatível com Supabase `.range(from, to)`.
 *
 * @example
 * ```tsx
 * const { page, pageSize, next, range, offset, limit } = usePagination();
 * const result = await fetchList({ offset, limit });
 * const { from, to, totalPages } = range(result.total);
 * ```
 */
export function usePagination(options: UsePaginationOptions = {}): UsePaginationResult {
  const { initialPage = DEFAULT_PAGE, initialPageSize = DEFAULT_PAGE_SIZE } = options;

  const [page, setPageState] = useState<number>(initialPage);
  const [pageSize, setPageSizeState] = useState<number>(initialPageSize);

  const setPage = useCallback((next: number) => {
    setPageState(Math.max(1, next));
  }, []);

  const setPageSize = useCallback((size: number) => {
    setPageSizeState(Math.max(1, size));
    setPageState(1);
  }, []);

  const next = useCallback(() => {
    setPageState((p) => p + 1);
  }, []);

  const previous = useCallback(() => {
    setPageState((p) => Math.max(1, p - 1));
  }, []);

  const first = useCallback(() => {
    setPageState(1);
  }, []);

  const range = useCallback(
    (total: number) => {
      const totalPages = Math.max(1, Math.ceil(total / pageSize));
      const from = (page - 1) * pageSize;
      const to = Math.min(from + pageSize - 1, total - 1);
      return { from, to, totalPages };
    },
    [page, pageSize],
  );

  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  return {
    page,
    pageSize,
    setPage,
    setPageSize,
    next,
    previous,
    first,
    range,
    offset,
    limit,
  };
}
