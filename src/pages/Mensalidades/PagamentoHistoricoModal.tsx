import { useCallback, useEffect, useState } from 'react';

import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { AppError, ERROR_CODES } from '@/core/errors/AppError';
import { pagamentosService } from '@/services/pagamentos.service';
import type { MensalidadeWithAssociado, Pagamento } from '@/types/domain.types';

import { formatCurrency, formatDateTime } from '@/utils/formatters';

import styles from './PagamentoHistoricoModal.module.css';

interface PagamentoHistoricoModalProps {
  open: boolean;
  onClose: () => void;
  mensalidade: MensalidadeWithAssociado | null;
}

const FORMA_PAGAMENTO_LABELS: Record<string, string> = {
  dinheiro: 'Dinheiro',
  pix: 'PIX',
  transferencia: 'Transferência',
  cartao: 'Cartão',
  boleto: 'Boleto',
  outro: 'Outro',
};

export function PagamentoHistoricoModal({
  open,
  onClose,
  mensalidade,
}: PagamentoHistoricoModalProps) {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPagamentos = useCallback(async () => {
    if (!mensalidade || !open) return;
    setLoading(true);
    setError(null);
    try {
      const data = await pagamentosService.listByMensalidade(mensalidade.id);
      setPagamentos(data);
    } catch (err) {
      const message =
        AppError.isAppError(err) && err.code === ERROR_CODES.BACKEND_NOT_CONFIGURED
          ? err.userMessage
          : 'Não foi possível carregar o histórico de pagamentos.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [mensalidade, open]);

  useEffect(() => {
    void fetchPagamentos();
  }, [fetchPagamentos]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Pagamentos — ${mensalidade?.referencia ?? ''}`}
      size="md"
    >
      <div className={styles.history}>
        {loading && (
          <>
            <Skeleton height={80} rounded="md" />
            <Skeleton height={80} rounded="md" />
          </>
        )}

        {!loading && error && (
          <EmptyState
            variant="error"
            title="Erro ao carregar pagamentos"
            description={error}
          />
        )}

        {!loading && !error && pagamentos.length === 0 && (
          <div className={styles.empty}>
            Nenhum pagamento registrado para esta mensalidade.
          </div>
        )}

        {!loading && !error && pagamentos.length > 0 && (
          pagamentos.map((pagamento) => (
            <div key={pagamento.id} className={styles.payment}>
              <div className={styles.paymentHeader}>
                <span className={styles.paymentValue}>
                  {formatCurrency(pagamento.valorPago)}
                </span>
                <span className={styles.paymentDate}>
                  {formatDateTime(pagamento.pagoEm)}
                </span>
              </div>
              <div className={styles.paymentMethod}>
                {FORMA_PAGAMENTO_LABELS[pagamento.formaPagamento] ?? pagamento.formaPagamento}
              </div>
              {pagamento.observacoes && (
                <div className={styles.paymentNote}>
                  {pagamento.observacoes}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </Modal>
  );
}
