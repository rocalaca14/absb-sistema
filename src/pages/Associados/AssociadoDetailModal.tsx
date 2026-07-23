import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Modal } from '@/components/ui/Modal';
import type { Associado } from '@/types/domain.types';

import { formatDate } from '@/utils/formatters';

import styles from './AssociadoDetailModal.module.css';

interface AssociadoDetailModalProps {
  open: boolean;
  onClose: () => void;
  associado: Associado | null;
  onEdit?: (associado: Associado) => void;
  onToggleActive?: (associado: Associado) => void;
  canEdit?: boolean;
  canToggleActive?: boolean;
}

export function AssociadoDetailModal({
  open,
  onClose,
  associado,
  onEdit,
  onToggleActive,
  canEdit = false,
  canToggleActive = false,
}: AssociadoDetailModalProps) {
  if (!associado) return null;

  const hasAddress = [associado.endereco, associado.cidade, associado.uf].some(Boolean);
  const hasVehicle = [associado.veiculoMarca, associado.veiculoModelo, associado.veiculoPlaca].some(Boolean);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={associado.nome}
      size="lg"
      {...(associado.email ? { description: associado.email } : {})}
      footer={
        <div className={styles.actions}>
          {canEdit && onEdit && (
            <Button
              variant="secondary"
              onClick={() => onEdit(associado)}
              leftIcon={<Icon name="Filter" ariaLabel="" />}
              fullWidth={false}
            >
              Editar
            </Button>
          )}
          {canToggleActive && onToggleActive && (
            <Button
              variant={associado.ativo ? 'tertiary' : 'primary'}
              onClick={() => onToggleActive(associado)}
              fullWidth={false}
            >
              {associado.ativo ? 'Desativar' : 'Reativar'}
            </Button>
          )}
        </div>
      }
    >
      <div className={styles.detail}>
        {/* Status */}
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Status</span>
          <Badge variant={associado.ativo ? 'success' : 'danger'} showDot>
            {associado.ativo ? 'Ativo' : 'Inativo'}
          </Badge>
        </div>

        {/* Dados Pessoais */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Dados Pessoais</h3>
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>CPF</span>
              <span className={styles.fieldValue}>{associado.cpf ?? '—'}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>RG</span>
              <span className={styles.fieldValue}>{associado.rg ?? '—'}</span>
            </div>
          </div>
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Telefone</span>
              <span className={styles.fieldValue}>{associado.telefone ?? '—'}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>E-mail</span>
              <span className={styles.fieldValue}>{associado.email ?? '—'}</span>
            </div>
          </div>
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Data de nascimento</span>
              <span className={styles.fieldValue}>{formatDate(associado.dataNascimento)}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Data de filiação</span>
              <span className={styles.fieldValue}>{formatDate(associado.dataFiliacao)}</span>
            </div>
          </div>
        </div>

        {/* Endereço */}
        {hasAddress && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Endereço</h3>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Endereço</span>
              <span className={styles.fieldValue}>
                {[associado.endereco, associado.numero, associado.complemento].filter(Boolean).join(', ')}
              </span>
            </div>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Bairro</span>
                <span className={styles.fieldValue}>{associado.bairro ?? '—'}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Cidade/UF</span>
                <span className={styles.fieldValue}>
                  {[associado.cidade, associado.uf].filter(Boolean).join(' / ') || '—'}
                </span>
              </div>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>CEP</span>
              <span className={styles.fieldValue}>{associado.cep ?? '—'}</span>
            </div>
          </div>
        )}

        {/* Veículo */}
        {hasVehicle && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Veículo</h3>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Marca/Modelo</span>
                <span className={styles.fieldValue}>
                  {[associado.veiculoMarca, associado.veiculoModelo].filter(Boolean).join(' ') || '—'}
                </span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Ano</span>
                <span className={styles.fieldValue}>{associado.veiculoAno ?? '—'}</span>
              </div>
            </div>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Placa</span>
                <span className={styles.fieldValue}>{associado.veiculoPlaca ?? '—'}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Cor</span>
                <span className={styles.fieldValue}>{associado.veiculoCor ?? '—'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Categoria e Observações */}
        <div className={styles.section}>
          {associado.categoria && (
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Categoria</span>
              <Badge variant="info">{associado.categoria}</Badge>
            </div>
          )}
          {associado.observacoes && (
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Observações</span>
              <span className={styles.fieldValue}>{associado.observacoes}</span>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
