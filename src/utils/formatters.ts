/**
 * Funções utilitárias de formatação.
 *
 * Centraliza formatCurrency e formatDate para evitar duplicação
 * em InicioPage, MensalidadesPage, MensalidadeDetalheModal,
 * PagamentoModal, PagamentoHistoricoModal, AssociadoDetailModal.
 */

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('pt-BR');
}

export function formatDateTime(dateStr: string | null): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
