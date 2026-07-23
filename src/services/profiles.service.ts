import { supabase } from '@/core/supabase/client';
import { AppError, ERROR_CODES } from '@/core/errors/AppError';
import { logger } from '@/core/logger/logger';

import { ROLE_LABELS, type Role } from '@/constants';
import type { UserRole } from '@/core/supabase/types';
import type { ListParams, PaginatedResult } from '@/types/domain.types';

export interface UserListItem {
  id: string;
  email: string;
  nome: string;
  role: Role;
  ativo: boolean;
  ultimoAcessoEm: string | null;
  createdAt: string;
}

interface DbProfile {
  id: string;
  nome: string;
  role: UserRole;
  ativo: boolean;
  ultimo_acesso_em: string | null;
  created_at: string;
}

function ensureClient(): NonNullable<typeof supabase> {
  if (!supabase) {
    throw new AppError({ code: ERROR_CODES.BACKEND_NOT_CONFIGURED });
  }
  return supabase;
}

const DEFAULT_PAGE_SIZE = 20;

function toUserListItem(row: DbProfile, email: string): UserListItem {
  return {
    id: row.id,
    email,
    nome: row.nome,
    role: row.role as Role,
    ativo: row.ativo,
    ultimoAcessoEm: row.ultimo_acesso_em,
    createdAt: row.created_at,
  };
}

export const profilesService = {
  /**
   * Lista usuários com seus profiles.
   *
   * Combina `auth.users` (para email) com `profiles` (para nome, role, ativo).
   * Acesso restrito a admin (RLS em profiles).
   */
  async list(params: ListParams = {}): Promise<PaginatedResult<UserListItem>> {
    const client = ensureClient();
    const {
      page = 1,
      pageSize = DEFAULT_PAGE_SIZE,
      orderBy = 'created_at',
      orderDir = 'desc' as const,
    } = params;

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await client
      .from('profiles')
      .select('*', { count: 'exact' })
      .order(orderBy, { ascending: orderDir === 'asc' })
      .range(from, to);

    if (error) {
      logger.warn('Erro em profiles.list', { error });
      throw new AppError({ code: ERROR_CODES.INTERNAL, originalError: error });
    }

    const items = await Promise.all(
      (data ?? []).map(async (row) => {
        const dbRow = row as DbProfile;
        const {
          data: { user: authUser },
        } = await client.auth.admin.getUserById(dbRow.id).catch(() => ({
          data: { user: null },
        }));
        return toUserListItem(dbRow, authUser?.email ?? '');
      }),
    );

    return {
      items,
      total: count ?? 0,
      page,
      pageSize,
    };
  },

  async get(id: string): Promise<UserListItem | null> {
    const client = ensureClient();
    const { data, error } = await client
      .from('profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      logger.warn('Erro em profiles.get', { error });
      throw new AppError({ code: ERROR_CODES.INTERNAL, originalError: error });
    }

    if (!data) return null;

    const {
      data: { user: authUser },
    } = await client.auth.admin.getUserById(id).catch(() => ({
      data: { user: null },
    }));
    return toUserListItem(data as DbProfile, authUser?.email ?? '');
  },

  /**
   * Altera o role de um usuário.
   */
  async updateRole(id: string, role: Role): Promise<void> {
    const client = ensureClient();
    const { error } = await client
      .from('profiles')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      logger.warn('Erro em profiles.updateRole', { error });
      throw new AppError({ code: ERROR_CODES.INTERNAL, originalError: error });
    }
  },

  /**
   * Desativa ou ativa um usuário.
   */
  async setAtivo(id: string, ativo: boolean): Promise<void> {
    const client = ensureClient();
    const { error } = await client
      .from('profiles')
      .update({ ativo, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      logger.warn('Erro em profiles.setAtivo', { error });
      throw new AppError({ code: ERROR_CODES.INTERNAL, originalError: error });
    }
  },

  /**
   * Convida um novo usuário.
   *
   * BLOQUEADO: depende de regras de convite e email transacional
   * (INFO-09, FASE_2_PLAN.md). Implementar após decisão.
   */
  async invite(_email: string, _nome: string, _role: Role): Promise<void> {
    throw new AppError({
      code: ERROR_CODES.INTERNAL,
      userMessage: 'Convite ainda não habilitado.',
      technicalMessage: 'Regras de convite pendentes (FASE_2_PLAN.md).',
    });
  },

  /**
   * Lista os rótulos de papéis disponíveis.
   */
  roleLabels: ROLE_LABELS,
};
