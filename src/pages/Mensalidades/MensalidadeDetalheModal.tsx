import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Modal } from '@/components/ui/Modal';
import type { MensalidadeWithAssociado } from '@/types/domain.types';

import { formatCurrency, formatDate } from '@/utils/formatters';

import styles from './MensalidadeDetalheModal.module.css';

interface MensalidadeDetalheModalProps {
  open: boolean;
  onClose: () => void;
  mensalidade: MensalidadeWithAssociado | null;
  onPay?: (mensalidade: MensalidadeWithAssociado) => void;
  onViewHistory?: (mensalidade: MensalidadeWithAssociado) => void;
  canPay?: boolean;
}

function getStatus(pago: boolean, vencimentoEm: string): { variant: 'success' | 'danger' | 'warning'; label: string } {
  if (pago) return { variant: 'success', label: 'Pago' };
  const now = new Date();
  const venc = new Date(vencimentoEm + 'T23:59:59');
  if (venc < now) return { variant: 'danger', label: 'Vencida' };
  return { variant: 'warning', label: 'Pendente' };
}

export function MensalidadeDetalheModal({
  open,
  onClose,
  mensalidade,
  onPay,
  onViewHistory,
  canPay = false,
}: MensalidadeDetalheModalProps) {
  if (!mensalidade) return null;

  const status = getStatus(mensalidade.pago, mensalidade.vencimentoEm);
  const valorFinal = mensalidade.valorFinal ?? mensalidade.valor;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Mensalidade — ${mensalidade.referencia}`}
      size="md"
      footer={
        <div className={styles.actions}>
          {canPay && !mensalidade.pago && onPay && (
            <Button
              variant="primary"
              onClick={() => onPay(mensalidade)}
              leftIcon={<Icon name="Check" ariaLabel="" />}
              fullWidth={false}
            >
              Registrar pagamento
            </Button>
          )}
          {onViewHistory && (
            <Button
              variant="secondary"
              onClick={() => onViewHistory(mensalidade)}
              fullWidth={false}
            >
              Histórico de pagamentos
            </Button>
          )}
        </div>
      }
    >
      <div className={styles.detail}>
        {/* Status */}
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Status</span>
          <Badge variant={status.variant} showDot>
            {status.label}
          </Badge>
        </div>

        {/* Valores */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Valores</h3>
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Valor base</span>
              <span className={styles.fieldValue}>{formatCurrency(mensalidade.valor)}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Valor final</span>
              <span className={styles.fieldValueLarge}>{formatCurrency(valorFinal)}</span>
            </div>
          </div>
          {(mensalidade.desconto > 0 || mensalidade.acrescimo > 0) && (
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Desconto</span>
                <span className={styles.fieldValue}>
                  {mensalidade.desconto > 0 ? `- ${formatCurrency(mensalidade.desconto)}` : '—'}
                </span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Acréscimo</span>
                <span className={styles.fieldValue}>
                  {mensalidade.acrescimo > 0 ? `+ ${formatCurrency(mensalidade.acrescimo)}` : '—'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Datas */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Datas</h3>
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Vencimento</span>
              <span className={styles.fieldValue}>{formatDate(mensalidade.vencimentoEm)}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Pagamento</span>
              <span className={styles.fieldValue}>
                {mensalidade.pagoEm ? formatDate(mensalidade.pagoEm) : '—'}
              </span>
            </div>
          </div>
        </div>

        {/* Associado */}
        {mensalidade.associado && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Associado</h3>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Nome</span>
              <span className={styles.fieldValue}>{mensalidade.associado.nome}</span>
            </div>
            {mensalidade.associado.cpf && (
              <div className={styles.field}>
                <span className={styles.fieldLabel}>CPF</span>
                <span className={styles.fieldValue}>{mensalidade.associado.cpf}</span>
              </div>
            )}
          </div>
        )}

        {/* Observações */}
        {mensalidade.observacoes && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Observações</h3>
            <div className={styles.field}>
              <span className={styles.fieldValue}>{mensalidade.observacoes}</span>
            </div>
          </div>
        )}

        {/* Aviso de regras pendentes */}
        {!mensalidade.pago && (
          <div className={styles.pendente}>
            <span>⚠ Regras de juros, multa e inadimplência ainda não definidas (pendências INFO-01 a INFO-05).</span>
          </div>
        )}
      </div>
    </Modal>
  );
}
