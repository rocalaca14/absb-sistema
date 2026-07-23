import { supabase } from '@/core/supabase/client';
import { AppError, ERROR_CODES } from '@/core/errors/AppError';
import { logger } from '@/core/logger/logger';

import { toMensalidade, toMensalidadeWithAssociado } from './mappers';
import type {
  ListMensalidadesParams,
  Mensalidade,
  MensalidadeCreate,
  MensalidadeUpdate,
  MensalidadeWithAssociado,
  PaginatedResult,
} from '@/types/domain.types';

function ensureClient(): NonNullable<typeof supabase> {
  if (!supabase) {
    throw new AppError({ code: ERROR_CODES.BACKEND_NOT_CONFIGURED });
  }
  return supabase;
}

const DEFAULT_PAGE_SIZE = 50;
const DEFAULT_ORDER_BY = 'vencimento_em';
const DEFAULT_ORDER_DIR = 'asc' as const;

/**
 * Service de Mensalidades.
 *
 * Operações neutras, sem regras de negócio.
 * Cálculos financeiros (juros, multa, valor_final com regras) dependem de
 * definições do cliente (INFO-01, INFO-04, INFO-05).
 *
 * @see FASE_2_PLAN.md
 */
export const mensalidadesService = {
  async list(
    params: ListMensalidadesParams = {},
  ): Promise<PaginatedResult<MensalidadeWithAssociado>> {
    const client = ensureClient();
    const {
      referencia,
      pago,
      associadoId,
      vencidasAte,
      page = 1,
      pageSize = DEFAULT_PAGE_SIZE,
      orderBy = DEFAULT_ORDER_BY,
      orderDir = DEFAULT_ORDER_DIR,
    } = params;

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = client
      .from('mensalidades')
      .select(
        'id, associado_id, referencia, valor, desconto, acrescimo, valor_final, vencimento_em, pago, pago_em, observacoes, created_at, updated_at, associado:associados(id, nome, cpf, categoria)',
        { count: 'exact' },
      )
      .order(orderBy, { ascending: orderDir === 'asc' })
      .range(from, to);

    if (referencia) {
      query = query.eq('referencia', referencia);
    }
    if (typeof pago === 'boolean') {
      query = query.eq('pago', pago);
    }
    if (associadoId) {
      query = query.eq('associado_id', associadoId);
    }
    if (vencidasAte) {
      // Mensalidades não pagas com vencimento até esta data
      query = query.eq('pago', false).lte('vencimento_em', vencidasAte);
    }

    const { data, error, count } = await query;

    if (error) {
      logger.warn('Erro em mensalidades.list', { error });
      throw new AppError({ code: ERROR_CODES.INTERNAL, originalError: error });
    }

    return {
      items: (data ?? []).map((row) => toMensalidadeWithAssociado(row as never)),
      total: count ?? 0,
      page,
      pageSize,
    };
  },

  async get(id: string): Promise<Mensalidade | null> {
    const client = ensureClient();
    const { data, error } = await client
      .from('mensalidades')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      logger.warn('Erro em mensalidades.get', { error });
      throw new AppError({ code: ERROR_CODES.INTERNAL, originalError: error });
    }

    return data ? toMensalidade(data) : null;
  },

  /**
   * Cria uma mensalidade.
   *
   * `valorFinal` é calculado automaticamente pelo trigger do banco.
   * Validações de regras de cobrança (INFO-01) não são aplicadas aqui.
   */
  async create(input: MensalidadeCreate): Promise<Mensalidade> {
    const client = ensureClient();
    const {
      data: { user },
    } = await client.auth.getUser();

    const insertPayload = {
      associado_id: input.associadoId,
      referencia: input.referencia,
      valor: input.valor,
      desconto: input.desconto ?? 0,
      acrescimo: input.acrescimo ?? 0,
      vencimento_em: input.vencimentoEm,
      observacoes: input.observacoes ?? null,
      created_by: user?.id ?? null,
      updated_by: user?.id ?? null,
    };

    const { data, error } = await client
      .from('mensalidades')
      .insert(insertPayload)
      .select('*')
      .single();

    if (error) {
      logger.warn('Erro em mensalidades.create', { error });
      if (error.code === '23505') {
        throw new AppError({ code: ERROR_CODES.CONFLICT, originalError: error });
      }
      throw new AppError({ code: ERROR_CODES.INTERNAL, originalError: error });
    }

    return toMensalidade(data);
  },

  async update(id: string, input: MensalidadeUpdate): Promise<Mensalidade> {
    const client = ensureClient();
    const {
      data: { user },
    } = await client.auth.getUser();

    const updatePayload: Record<string, unknown> = {};
    if (input.valor !== undefined) updatePayload.valor = input.valor;
    if (input.desconto !== undefined) updatePayload.desconto = input.desconto;
    if (input.acrescimo !== undefined) updatePayload.acrescimo = input.acrescimo;
    if (input.vencimentoEm !== undefined) updatePayload.vencimento_em = input.vencimentoEm;
    if (input.observacoes !== undefined) updatePayload.observacoes = input.observacoes;
    updatePayload.updated_by = user?.id ?? null;

    const { data, error } = await client
      .from('mensalidades')
      .update(updatePayload as never)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      logger.warn('Erro em mensalidades.update', { error });
      if (error.code === 'PGRST116') {
        throw new AppError({ code: ERROR_CODES.NOT_FOUND, originalError: error });
      }
      throw new AppError({ code: ERROR_CODES.INTERNAL, originalError: error });
    }

    return toMensalidade(data);
  },

  /**
   * Geração de mensalidades em lote para um mês.
   *
   * BLOQUEADO: depende de decisão sobre regras de geração (INFO-01,
   * INFO-04). Implementar após definição de valor padrão e regras de
   * cobrança.
   */
  async gerarLote(_referencia: string): Promise<{ criados: number; ignorados: number }> {
    throw new AppError({
      code: ERROR_CODES.INTERNAL,
      userMessage: 'Geração em lote ainda não habilitada.',
      technicalMessage:
        'Depende de INFO-01 (regras) e INFO-04 (valor padrão) do FASE_2_PLAN.md.',
    });
  },

  async delete(id: string): Promise<void> {
    const client = ensureClient();
    const { error } = await client.from('mensalidades').delete().eq('id', id);

    if (error) {
      logger.warn('Erro em mensalidades.delete', { error });
      throw new AppError({ code: ERROR_CODES.INTERNAL, originalError: error });
    }
  },
};
