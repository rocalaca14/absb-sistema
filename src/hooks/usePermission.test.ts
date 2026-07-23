import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import type { Permission } from '@/constants';
import { usePermission } from './usePermission';

// Mock useAuth
vi.mock('./useAuth', () => ({
  useAuth: () => ({
    role: 'admin',
  }),
}));

describe('usePermission', () => {
  it('returns can function', () => {
    const { result } = renderHook(() => usePermission());
    expect(typeof result.current.can).toBe('function');
  });

  it('returns canAny function', () => {
    const { result } = renderHook(() => usePermission());
    expect(typeof result.current.canAny).toBe('function');
  });

  it('returns canAll function', () => {
    const { result } = renderHook(() => usePermission());
    expect(typeof result.current.canAll).toBe('function');
  });

  it('admin has all permissions', () => {
    const { result } = renderHook(() => usePermission());
    expect(result.current.can('associados.read')).toBe(true);
    expect(result.current.can('associados.write')).toBe(true);
    expect(result.current.can('usuarios.manage')).toBe(true);
    expect(result.current.can('configuracoes.manage')).toBe(true);
  });

  it('canAny returns true if any permission matches', () => {
    const { result } = renderHook(() => usePermission());
    expect(result.current.canAny(['associados.read', 'nonexistent' as unknown as Permission])).toBe(true);
  });

  it('canAny returns false if no permission matches', () => {
    const { result } = renderHook(() => usePermission());
    expect(result.current.canAny(['nonexistent' as unknown as Permission])).toBe(false);
  });

  it('canAll returns true if all permissions match', () => {
    const { result } = renderHook(() => usePermission());
    expect(result.current.canAll(['associados.read', 'associados.write'])).toBe(true);
  });

  it('canAll returns false if any permission does not match', () => {
    const { result } = renderHook(() => usePermission());
    expect(result.current.canAll(['associados.read', 'nonexistent' as unknown as Permission])).toBe(false);
  });
});
