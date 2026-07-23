import { supabase } from '@/core/supabase/client';
import { AppError, ERROR_CODES } from '@/core/errors/AppError';
import { logger } from '@/core/logger/logger';

import { toPagamento } from './mappers';
import type { Mensalidade, Pagamento, PagamentoCreate } from '@/types/domain.types';

function ensureClient(): NonNullable<typeof supabase> {
  if (!supabase) {
    throw new AppError({ code: ERROR_CODES.BACKEND_NOT_CONFIGURED });
  }
  return supabase;
}

/**
 * Service de Pagamentos.
 *
 * Operações neutras, sem regras de negócio.
 * Cálculo de juros/multa, validação de valor mínimo, e regras de
 * inadimplência dependem de definições do cliente (INFO-01, INFO-05).
 *
 * @see FASE_2_PLAN.md
 */
export const pagamentosService = {
  /**
   * Registra um pagamento para uma mensalidade.
   *
   * O trigger de `audit_trigger` em `pagamentos` registra automaticamente
   * a operação. O trigger em `mensalidades` deveria atualizar `pago` e
   * `pago_em` automaticamente (ver `0001_init_schema.sql`).
   *
   * NOTA: regras de bloqueio por inadimplência NÃO são aplicadas aqui.
   * O backend deve permitir registro de qualquer pagamento.
   */
  async create(input: PagamentoCreate): Promise<Pagamento> {
    const client = ensureClient();
    const {
      data: { user },
    } = await client.auth.getUser();

    const insertPayload = {
      mensalidade_id: input.mensalidadeId,
      valor_pago: input.valorPago,
      forma_pagamento: input.formaPagamento,
      pago_em: input.pagoEm ?? new Date().toISOString(),
      comprovante_url: input.comprovanteUrl ?? null,
      observacoes: input.observacoes ?? null,
      created_by: user?.id ?? null,
    };

    const { data, error } = await client
      .from('pagamentos')
      .insert(insertPayload)
      .select('*')
      .single();

    if (error) {
      logger.warn('Erro em pagamentos.create', { error });
      throw new AppError({ code: ERROR_CODES.INTERNAL, originalError: error });
    }

    // Atualiza mensalidade para pago (cálculo bruto, sem regras de juros)
    const { error: updateError } = await client
      .from('mensalidades')
      .update({
        pago: true,
        pago_em: insertPayload.pago_em,
        updated_by: user?.id ?? null,
      })
      .eq('id', input.mensalidadeId);

    if (updateError) {
      logger.warn('Erro ao atualizar mensalidade após pagamento', { updateError });
      // Pagamento foi criado mas mensalidade não atualizou.
      // Não relança erro para não perder o pagamento; cliente pode sincronizar.
    }

    return toPagamento(data);
  },

  /**
   * Lista pagamentos de uma mensalidade.
   */
  async listByMensalidade(mensalidadeId: string): Promise<Pagamento[]> {
    const client = ensureClient();
    const { data, error } = await client
      .from('pagamentos')
      .select('*')
      .eq('mensalidade_id', mensalidadeId)
      .order('pago_em', { ascending: false });

    if (error) {
      logger.warn('Erro em pagamentos.listByMensalidade', { error });
      throw new AppError({ code: ERROR_CODES.INTERNAL, originalError: error });
    }

    return (data ?? []).map(toPagamento);
  },

  /**
   * Estorna um pagamento (remove e marca mensalidade como não paga).
   *
   * BLOQUEADO: regras de estorno dependem de decisões de negócio.
   */
  async estornar(_id: string): Promise<Mensalidade> {
    throw new AppError({
      code: ERROR_CODES.INTERNAL,
      userMessage: 'Estorno ainda não habilitado.',
      technicalMessage: 'Regras de estorno pendentes (INFO-01, INFO-09).',
    });
  },
};
