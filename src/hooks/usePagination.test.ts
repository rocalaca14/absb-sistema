import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { usePagination } from './usePagination';

describe('usePagination', () => {
  it('initializes with default values', () => {
    const { result } = renderHook(() => usePagination());
    expect(result.current.page).toBe(1);
    expect(result.current.pageSize).toBe(20);
  });

  it('initializes with custom values', () => {
    const { result } = renderHook(() => usePagination({ initialPage: 3, initialPageSize: 10 }));
    expect(result.current.page).toBe(3);
    expect(result.current.pageSize).toBe(10);
  });

  it('sets page correctly', () => {
    const { result } = renderHook(() => usePagination());
    act(() => result.current.setPage(5));
    expect(result.current.page).toBe(5);
  });

  it('prevents page below 1', () => {
    const { result } = renderHook(() => usePagination());
    act(() => result.current.setPage(0));
    expect(result.current.page).toBe(1);
  });

  it('calculates range correctly', () => {
    const { result } = renderHook(() => usePagination({ initialPageSize: 10 }));
    const range = result.current.range(50);
    expect(range.totalPages).toBe(5);
    expect(range.from).toBe(0);
    expect(range.to).toBe(9);
  });

  it('calculates offset and limit', () => {
    const { result } = renderHook(() => usePagination({ initialPage: 3, initialPageSize: 10 }));
    expect(result.current.offset).toBe(20);
    expect(result.current.limit).toBe(10);
  });

  it('changes page size and resets page', () => {
    const { result } = renderHook(() => usePagination({ initialPage: 3, initialPageSize: 10 }));
    act(() => result.current.setPageSize(25));
    expect(result.current.pageSize).toBe(25);
    expect(result.current.page).toBe(1);
  });

  it('navigates to next page', () => {
    const { result } = renderHook(() => usePagination());
    act(() => result.current.next());
    expect(result.current.page).toBe(2);
  });

  it('navigates to previous page', () => {
    const { result } = renderHook(() => usePagination({ initialPage: 3 }));
    act(() => result.current.previous());
    expect(result.current.page).toBe(2);
  });

  it('prevents previous page below 1', () => {
    const { result } = renderHook(() => usePagination());
    act(() => result.current.previous());
    expect(result.current.page).toBe(1);
  });

  it('navigates to first page', () => {
    const { result } = renderHook(() => usePagination({ initialPage: 5 }));
    act(() => result.current.first());
    expect(result.current.page).toBe(1);
  });

  it('calculates range for last page', () => {
    const { result } = renderHook(() => usePagination({ initialPage: 5, initialPageSize: 10 }));
    const range = result.current.range(47);
    expect(range.totalPages).toBe(5);
    expect(range.from).toBe(40);
    expect(range.to).toBe(46);
  });
});
