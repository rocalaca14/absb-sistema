import { supabase } from '@/core/supabase/client';
import { AppError, ERROR_CODES } from '@/core/errors/AppError';
import { logger } from '@/core/logger/logger';
import { sheetsClient } from '@/core/sheets/client';
import { parseCsv } from '@/core/sheets/parser';
import { MAPEAMENTO_ASSOCIADOS } from '@/core/sheets/mapeamento';

import type { ImportResult } from '@/core/sheets/types';

function ensureMapeamento(): void {
  if (MAPEAMENTO_ASSOCIADOS.length === 0) {
    throw new AppError({
      code: ERROR_CODES.INTERNAL,
      userMessage: 'Mapeamento de colunas não configurado.',
      technicalMessage:
        'core/sheets/mapeamento.ts está vazio. Aguardando planilha real para preenchimento.',
    });
  }
}

function ensureClient(): NonNullable<typeof supabase> {
  if (!supabase) {
    throw new AppError({ code: ERROR_CODES.BACKEND_NOT_CONFIGURED });
  }
  return supabase;
}

export const importacaoService = {
  /**
   * Pré-visualização da importação.
   *
   * - Busca o CSV.
   * - Parseia.
   * - Retorna estatísticas e primeiras linhas.
   *
   * Implementação completa (validação Zod, detecção de duplicatas) entra em
   * fase futura após definição do mapeamento.
   */
  async preview(url: string): Promise<{ totalLinhas: number; primeirosIndices: number[] }> {
    ensureMapeamento();
    const csv = await sheetsClient.fetchCsv(url);
    const { rows } = parseCsv(csv);
    logger.info('Preview de importação solicitado', { total: rows.length });
    return {
      totalLinhas: rows.length,
      primeirosIndices: rows.slice(0, 10).map((r) => r.rowIndex),
    };
  },

  /**
   * Execução da importação.
   *
   * Stub: valida configuração mínima, busca CSV, parseia, mas não executa
   * upsert. Implementação completa virá após a planilha real.
   */
  async executar(_url: string): Promise<ImportResult> {
    const client = ensureClient();
    ensureMapeamento();

    // Garante que o cliente Supabase está disponível (usado quando o upsert
    // real for implementado). Sem chamada ativa, ESLint reclamaria de variável não usada.
    void client;

    throw new AppError({
      code: ERROR_CODES.INTERNAL,
      userMessage:
        'Importação ainda não implementada. Aguardando planilha real para preencher o mapeamento.',
    });
  },
};

export type ImportacaoService = typeof importacaoService;
