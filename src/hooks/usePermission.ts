import { roleHasPermission, type Permission } from '@/constants';

import { useAuth } from './useAuth';

export interface UsePermissionResult {
  can: (permission: Permission) => boolean;
  canAny: (permissions: ReadonlyArray<Permission>) => boolean;
  canAll: (permissions: ReadonlyArray<Permission>) => boolean;
}

/**
 * Hook de checagem de permissões.
 *
 * Lê o `role` do usuário autenticado via `useAuth` e expõe helpers
 * `can`, `canAny`, `canAll` para checagem declarativa.
 *
 * @example
 * ```tsx
 * const { can } = usePermission();
 * {can('associados.write') && <Button>Adicionar</Button>}
 * ```
 */
export function usePermission(): UsePermissionResult {
  const { role } = useAuth();

  return {
    can: (permission) => roleHasPermission(role, permission),
    canAny: (permissions) => permissions.some((p) => roleHasPermission(role, p)),
    canAll: (permissions) => permissions.every((p) => roleHasPermission(role, p)),
  };
}
