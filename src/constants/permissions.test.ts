import { describe, it, expect } from 'vitest';
import { roleHasPermission, rolePermissions } from './permissions';

describe('permissions', () => {
  it('returns true for admin permission', () => {
    expect(roleHasPermission('admin', 'usuarios.manage')).toBe(true);
  });

  it('returns false for null role', () => {
    expect(roleHasPermission(null, 'associados.read')).toBe(false);
  });

  it('returns false for unauthorized permission', () => {
    expect(roleHasPermission('visualizador', 'configuracoes.manage')).toBe(false);
  });

  it('returns role permissions array', () => {
    const perms = rolePermissions('admin');
    expect(perms.length).toBeGreaterThan(0);
    expect(perms).toContain('associados.read');
  });
});
