import type { UserRole } from '@/core/supabase/types';

export const ROLES = {
  ADMIN: 'admin',
  TESOUREIRO: 'tesoureiro',
  DIRETOR: 'diretor',
  VISUALIZADOR: 'visualizador',
} as const;

export type Role = UserRole;

export const ROLE_LABELS: Record<Role, string> = {
  admin: 'Administrador',
  tesoureiro: 'Tesoureiro',
  diretor: 'Diretor',
  visualizador: 'Visualizador',
};

export const PERMISSIONS = {
  ASSOCIADOS_READ: 'associados.read',
  ASSOCIADOS_WRITE: 'associados.write',
  ASSOCIADOS_DELETE: 'associados.delete',
  MENSALIDADES_READ: 'mensalidades.read',
  MENSALIDADES_WRITE: 'mensalidades.write',
  MENSALIDADES_DELETE: 'mensalidades.delete',
  PAGAMENTOS_READ: 'pagamentos.read',
  PAGAMENTOS_WRITE: 'pagamentos.write',
  PAGAMENTOS_DELETE: 'pagamentos.delete',
  IMPORTACAO_EXECUTAR: 'importacao.executar',
  IMPORTACAO_READ: 'importacao.read',
  RELATORIOS_VIEW: 'relatorios.view',
  USUARIOS_MANAGE: 'usuarios.manage',
  CONFIGURACOES_MANAGE: 'configuracoes.manage',
  AUDIT_VIEW: 'audit.view',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

const ROLE_PERMISSIONS: Record<Role, ReadonlyArray<Permission>> = {
  admin: Object.values(PERMISSIONS),
  tesoureiro: [
    PERMISSIONS.ASSOCIADOS_READ,
    PERMISSIONS.MENSALIDADES_READ,
    PERMISSIONS.MENSALIDADES_WRITE,
    PERMISSIONS.PAGAMENTOS_READ,
    PERMISSIONS.PAGAMENTOS_WRITE,
    PERMISSIONS.RELATORIOS_VIEW,
  ],
  diretor: [
    PERMISSIONS.ASSOCIADOS_READ,
    PERMISSIONS.ASSOCIADOS_WRITE,
    PERMISSIONS.MENSALIDADES_READ,
    PERMISSIONS.RELATORIOS_VIEW,
  ],
  visualizador: [
    PERMISSIONS.ASSOCIADOS_READ,
    PERMISSIONS.MENSALIDADES_READ,
    PERMISSIONS.PAGAMENTOS_READ,
  ],
};

export function roleHasPermission(role: Role | null, permission: Permission): boolean {
  if (!role) return false;
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function rolePermissions(role: Role): ReadonlyArray<Permission> {
  return ROLE_PERMISSIONS[role];
}
