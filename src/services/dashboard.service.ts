import { supabase } from '@/core/supabase/client';
import { AppError, ERROR_CODES } from '@/core/errors/AppError';
import { logger } from '@/core/logger/logger';

import type { DashboardResumo } from '@/types/domain.types';

function ensureClient(): NonNullable<typeof supabase> {
  if (!supabase) {
    throw new AppError({ code: ERROR_CODES.BACKEND_NOT_CONFIGURED });
  }
  return supabase;
}

function getCurrentYearMonth(): { ano: number; mes: number; referencia: string } {
  const now = new Date();
  const ano = now.getFullYear();
  const mes = now.getMonth() + 1;
  const referencia = `${ano}-${String(mes).padStart(2, '0')}`;
  return { ano, mes, referencia };
}

/**
 * Service de agregações para o dashboard.
 *
 * NOTA: regras de inadimplência e agregações específicas (INFO-05) ainda
 * não estão aplicadas. Os contadores e valores retornados são neutros
 * (totais brutos).
 *
 * @see FASE_2_PLAN.md
 */
export const dashboardService = {
  async getResumo(): Promise<DashboardResumo> {
    const client = ensureClient();
    const { referencia } = getCurrentYearMonth();

    const [
      associadosAtivosRes,
      emAbertoRes,
      emAbertoSumRes,
      pagasMesRes,
      pagasMesSumRes,
      vencidasRes,
    ] = await Promise.all([
      client.from('associados').select('id', { count: 'exact', head: true }).eq('ativo', true),
      client.from('mensalidades').select('id', { count: 'exact', head: true }).eq('pago', false),
      client.from('mensalidades').select('valor_final').eq('pago', false),
      client.from('mensalidades').select('id', { count: 'exact', head: true })
        .eq('pago', true)
        .eq('referencia', referencia),
      client.from('mensalidades').select('valor_final').eq('pago', true).eq('referencia', referencia),
      client.from('mensalidades').select('id', { count: 'exact', head: true })
        .eq('pago', false)
        .lt('vencimento_em', new Date().toISOString().split('T')[0]),
    ]);

    function checkError(
      res: { error: { message: string } | null },
      label: string,
    ): void {
      if (res.error) {
        logger.warn(`Erro em dashboard.${label}`, { error: res.error });
        throw new AppError({
          code: ERROR_CODES.INTERNAL,
          originalError: res.error,
        });
      }
    }

    checkError(associadosAtivosRes, 'associadosAtivos');
    checkError(emAbertoRes, 'emAberto');
    checkError(emAbertoSumRes, 'emAbertoSum');
    checkError(pagasMesRes, 'pagasMes');
    checkError(pagasMesSumRes, 'pagasMesSum');
    checkError(vencidasRes, 'vencidas');

    const sumValor = (rows: Array<{ valor_final: number | null }> | null): number =>
      (rows ?? []).reduce((acc, r) => acc + (r.valor_final ?? 0), 0);

    return {
      totalAssociadosAtivos: associadosAtivosRes.count ?? 0,
      totalMensalidadesEmAberto: emAbertoRes.count ?? 0,
      valorEmAberto: sumValor(emAbertoSumRes.data),
      totalPagasNoMes: pagasMesRes.count ?? 0,
      valorPagoNoMes: sumValor(pagasMesSumRes.data),
      totalVencidas: vencidasRes.count ?? 0,
    };
  },
};
