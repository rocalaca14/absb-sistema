import { useState, type FormEvent } from 'react';

import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { pagamentoCreateSchema, type PagamentoCreateSchema } from '@/utils/validators';
import type { MensalidadeWithAssociado, PagamentoCreate } from '@/types/domain.types';

import { formatCurrency, formatDate } from '@/utils/formatters';

import styles from './PagamentoModal.module.css';

const FORMA_PAGAMENTO_OPTIONS = [
  { value: 'dinheiro', label: 'Dinheiro' },
  { value: 'pix', label: 'PIX' },
  { value: 'transferencia', label: 'Transferência' },
  { value: 'cartao', label: 'Cartão' },
  { value: 'boleto', label: 'Boleto' },
  { value: 'outro', label: 'Outro' },
] as const;

interface PagamentoModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PagamentoCreate) => Promise<void>;
  mensalidade: MensalidadeWithAssociado | null;
}

type FormErrors = Partial<Record<keyof PagamentoCreateSchema, string>>;

export function PagamentoModal({
  open,
  onClose,
  onSubmit,
  mensalidade,
}: PagamentoModalProps) {
  const [values, setValues] = useState<PagamentoCreateSchema>(() => ({
    mensalidade_id: mensalidade?.id ?? '',
    valor_pago: mensalidade?.valorFinal ?? mensalidade?.valor ?? 0,
    forma_pagamento: 'pix' as const,
    pago_em: new Date().toISOString().slice(0, 16),
    observacoes: undefined,
    comprovante_url: undefined,
  }));

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const setField = <K extends keyof PagamentoCreateSchema>(
    key: K,
    value: PagamentoCreateSchema[K],
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitError(null);

    if (!mensalidade) return;

    const payload: PagamentoCreateSchema = {
      ...values,
      mensalidade_id: mensalidade.id,
    };

    const parsed = pagamentoCreateSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors: FormErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FormErrors;
        if (key && !fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    try {
      const createInput: PagamentoCreate = {
        mensalidadeId: parsed.data.mensalidade_id,
        valorPago: parsed.data.valor_pago,
        formaPagamento: parsed.data.forma_pagamento,
        pagoEm: parsed.data.pago_em ?? new Date().toISOString(),
        observacoes: parsed.data.observacoes ?? null,
        comprovanteUrl: parsed.data.comprovante_url ?? null,
      };
      await onSubmit(createInput);
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao registrar pagamento.';
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!mensalidade) return null;

  const valorFinal = mensalidade.valorFinal ?? mensalidade.valor;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Registrar pagamento"
      size="md"
      primaryAction={{
        label: 'Confirmar pagamento',
        onClick: () => {
          void handleSubmit(new Event('submit') as unknown as FormEvent);
        },
        loading: submitting,
      }}
      secondaryAction={{
        label: 'Cancelar',
        onClick: onClose,
      }}
    >
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {submitError && (
          <p className={styles.errorText} role="alert">{submitError}</p>
        )}

        {/* Resumo da mensalidade */}
        <div className={styles.info}>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Associado</span>
            <span className={styles.infoValue}>{mensalidade.associado?.nome ?? '—'}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Referência</span>
            <span className={styles.infoValue}>{mensalidade.referencia}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Vencimento</span>
            <span className={styles.infoValue}>{formatDate(mensalidade.vencimentoEm)}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Valor</span>
            <span className={styles.infoValue}>{formatCurrency(valorFinal)}</span>
          </div>
        </div>

        {/* Formulário de pagamento */}
        <div className={styles.fieldGroup}>
          <Input
            label="Valor pago"
            required
            type="number"
            value={values.valor_pago}
            onChange={(e) => setField('valor_pago', Number(e.target.value))}
            errorMessage={errors.valor_pago}
            min={0}
            step={0.01}
          />

          <div>
            <label htmlFor="forma-pagamento" className={styles.infoLabel}>Forma de pagamento</label>
            <select
              id="forma-pagamento"
              className={styles.select}
              value={values.forma_pagamento}
              onChange={(e) => setField('forma_pagamento', e.target.value as PagamentoCreateSchema['forma_pagamento'])}
            >
              {FORMA_PAGAMENTO_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {errors.forma_pagamento && (
              <p className={styles.errorText}>{errors.forma_pagamento}</p>
            )}
          </div>

          <Input
            label="Data e hora"
            required
            type="datetime-local"
            value={values.pago_em ?? ''}
            onChange={(e) => setField('pago_em', e.target.value || undefined)}
            errorMessage={errors.pago_em}
          />

          <Input
            label="Observação"
            value={values.observacoes ?? ''}
            onChange={(e) => setField('observacoes', e.target.value || undefined)}
            errorMessage={errors.observacoes}
            placeholder="Observação opcional..."
          />
        </div>
      </form>
    </Modal>
  );
}
