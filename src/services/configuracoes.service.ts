import { supabase } from '@/core/supabase/client';
import { AppError, ERROR_CODES } from '@/core/errors/AppError';
import { logger } from '@/core/logger/logger';

import { toConfiguracao } from './mappers';
import type { Configuracao, ConfiguracaoUpdate } from '@/types/domain.types';

function ensureClient(): NonNullable<typeof supabase> {
  if (!supabase) {
    throw new AppError({ code: ERROR_CODES.BACKEND_NOT_CONFIGURED });
  }
  return supabase;
}

/**
 * Chaves de configuração pré-definidas.
 *
 * Pendente: chaves reais dependem de INFO-04 (valor padrão mensalidade)
 * e demais decisões da Fase 2.
 */
export const CONFIGURACAO_CHAVES = {
  ASSOCIACAO_NOME: 'associacao.nome',
  ASSOCIACAO_CNPJ: 'associacao.cnpj',
  MENSALIDADE_VALOR_PADRAO: 'financeiro.mensalidade_valor_padrao',
  MENSALIDADE_VENCIMENTO_DIA: 'financeiro.vencimento_dia',
  SUPORTE_EMAIL: 'app.suporte_email',
  SUPORTE_TELEFONE: 'app.suporte_telefone',
} as const;

export type ConfiguracaoChave =
  (typeof CONFIGURACAO_CHAVES)[keyof typeof CONFIGURACAO_CHAVES];

/**
 * Service de Configurações.
 *
 * Acesso por chave. RLS permite leitura a todos autenticados; escrita
 * apenas a admin.
 */
export const configuracoesService = {
  async get(chave: string): Promise<Configuracao | null> {
    const client = ensureClient();
    const { data, error } = await client
      .from('configuracoes')
      .select('*')
      .eq('chave', chave)
      .maybeSingle();

    if (error) {
      logger.warn('Erro em configuracoes.get', { error });
      throw new AppError({ code: ERROR_CODES.INTERNAL, originalError: error });
    }

    return data ? toConfiguracao(data) : null;
  },

  async list(): Promise<Configuracao[]> {
    const client = ensureClient();
    const { data, error } = await client
      .from('configuracoes')
      .select('*')
      .order('chave');

    if (error) {
      logger.warn('Erro em configuracoes.list', { error });
      throw new AppError({ code: ERROR_CODES.INTERNAL, originalError: error });
    }

    return (data ?? []).map(toConfiguracao);
  },

  async upsert(chave: string, input: ConfiguracaoUpdate): Promise<Configuracao> {
    const client = ensureClient();
    const {
      data: { user },
    } = await client.auth.getUser();

    const { data, error } = await client
      .from('configuracoes')
      .upsert(
        {
          chave,
          valor: input.valor as never,
          descricao: input.descricao ?? null,
          updated_by: user?.id ?? null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'chave' },
      )
      .select('*')
      .single();

    if (error) {
      logger.warn('Erro em configuracoes.upsert', { error });
      throw new AppError({ code: ERROR_CODES.INTERNAL, originalError: error });
    }

    return toConfiguracao(data);
  },
};
