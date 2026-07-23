import { useCallback, useEffect, useMemo, useState } from 'react';

import { PageContainer } from '@/components/layout/PageContainer';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Table, type TableColumn } from '@/components/ui/Table';
import { AppError, ERROR_CODES } from '@/core/errors/AppError';
import { useDebounce } from '@/hooks/useDebounce';
import { usePagination } from '@/hooks/usePagination';
import { usePermission } from '@/hooks/usePermission';
import { mensalidadesService } from '@/services/mensalidades.service';
import { pagamentosService } from '@/services/pagamentos.service';
import type {
  ListMensalidadesParams,
  MensalidadeWithAssociado,
  PagamentoCreate,
} from '@/types/domain.types';

import { MensalidadeDetalheModal } from './MensalidadeDetalheModal';
import { PagamentoHistoricoModal } from './PagamentoHistoricoModal';
import { PagamentoModal } from './PagamentoModal';
import { formatCurrency, formatDate } from '@/utils/formatters';

import styles from './MensalidadesPage.module.css';

function getStatus(pago: boolean, vencimentoEm: string): { variant: 'success' | 'danger' | 'warning'; label: string } {
  if (pago) return { variant: 'success', label: 'Pago' };
  const now = new Date();
  const venc = new Date(vencimentoEm + 'T23:59:59');
  if (venc < now) return { variant: 'danger', label: 'Vencida' };
  return { variant: 'warning', label: 'Pendente' };
}

export function MensalidadesPage() {
  const { can } = usePermission();

  const canPagamentosWrite = can('pagamentos.write');

  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 300);

  const [filterPago, setFilterPago] = useState<'all' | 'true' | 'false'>('all');
  const [filterReferencia, setFilterReferencia] = useState('');

  const [items, setItems] = useState<MensalidadeWithAssociado[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { page, pageSize, setPage, next, previous, range } = usePagination({ initialPageSize: 50 });

  const [selectedMensalidade, setSelectedMensalidade] = useState<MensalidadeWithAssociado | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [pagamentoOpen, setPagamentoOpen] = useState(false);
  const [historicoOpen, setHistoricoOpen] = useState(false);

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: ListMensalidadesParams = {
        page,
        pageSize,
        orderBy: 'vencimento_em',
        orderDir: 'asc',
      };
      if (filterPago !== 'all') params.pago = filterPago === 'true';
      if (filterReferencia) params.referencia = filterReferencia;

      const result = await mensalidadesService.list(params);
      setItems(result.items);
      setTotal(result.total);
    } catch (err) {
      const message =
        AppError.isAppError(err) && err.code === ERROR_CODES.BACKEND_NOT_CONFIGURED
          ? err.userMessage
          : 'Não foi possível carregar as mensalidades.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, filterPago, filterReferencia]);

  useEffect(() => {
    void fetchList();
  }, [fetchList]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filterPago, filterReferencia, setPage]);

  const pagination = useMemo(() => range(total), [range, total]);

  const filteredItems = useMemo(() => {
    if (!debouncedSearch) return items;
    const term = debouncedSearch.toLowerCase();
    return items.filter(
      (r) =>
        r.associado?.nome?.toLowerCase().includes(term) ||
        r.referencia.toLowerCase().includes(term),
    );
  }, [items, debouncedSearch]);

  const handleViewDetail = (mensalidade: MensalidadeWithAssociado) => {
    setSelectedMensalidade(mensalidade);
    setDetailOpen(true);
  };

  const handlePay = (mensalidade: MensalidadeWithAssociado) => {
    setDetailOpen(false);
    setSelectedMensalidade(mensalidade);
    setPagamentoOpen(true);
  };

  const handleViewHistory = (mensalidade: MensalidadeWithAssociado) => {
    setDetailOpen(false);
    setSelectedMensalidade(mensalidade);
    setHistoricoOpen(true);
  };

  const handlePagamentoSubmit = async (data: PagamentoCreate) => {
    await pagamentosService.create(data);
    await fetchList();
  };

  const columns: ReadonlyArray<TableColumn<MensalidadeWithAssociado>> = useMemo(
    () => [
      {
        key: 'associado',
        label: 'Associado',
        render: (r) => r.associado?.nome ?? '—',
        width: '30%',
      },
      {
        key: 'referencia',
        label: 'Referência',
        render: (r) => r.referencia,
      },
      {
        key: 'valor_final',
        label: 'Valor',
        render: (r) => (
          <span className={styles.valorCell}>
            {formatCurrency(r.valorFinal ?? r.valor)}
          </span>
        ),
        align: 'right',
      },
      {
        key: 'vencimento_em',
        label: 'Vencimento',
        render: (r) => (
          <span className={styles.vencimentoCell}>
            {formatDate(r.vencimentoEm)}
          </span>
        ),
        hideOnMobile: true,
      },
      {
        key: 'pago',
        label: 'Status',
        render: (r) => {
          const status = getStatus(r.pago, r.vencimentoEm);
          return <Badge variant={status.variant} showDot>{status.label}</Badge>;
        },
        width: '12%',
      },
    ],
    [],
  );

  const emptyContent = useMemo(() => {
    if (error) {
      return (
        <EmptyState
          variant="error"
          title="Erro ao carregar mensalidades"
          description={error}
          action={{ label: 'Tentar novamente', onClick: fetchList }}
        />
      );
    }
    if (debouncedSearch || filterPago !== 'all' || filterReferencia) {
      return (
        <EmptyState
          variant="empty"
          title="Nenhum resultado encontrado"
          description="Ajuste os filtros ou a busca para encontrar mensalidades."
        />
      );
    }
    return (
      <EmptyState
        variant="first-use"
        title="Nenhuma mensalidade encontrada"
        description="As mensalidades serão exibidas aqui quando cadastradas."
      />
    );
  }, [error, debouncedSearch, filterPago, filterReferencia, fetchList]);

  return (
    <PageContainer>
      <main aria-label="Gestão de mensalidades">
        <SectionTitle
          as="h1"
          title="Mensalidades"
          subtitle={`${total} mensalidade${total !== 1 ? 's' : ''}`}
        />

        {/* Toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.toolbarRow}>
            <div className={styles.searchWrapper}>
              <Input
                placeholder="Buscar por associado ou referência..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                leftIcon={<Icon name="Search" ariaLabel="" />}
                aria-label="Buscar mensalidades"
              />
            </div>
          </div>

          <div className={styles.filterGroup}>
            <select
              value={filterPago}
              onChange={(e) => setFilterPago(e.target.value as typeof filterPago)}
              aria-label="Filtrar por status"
            >
              <option value="all">Todos</option>
              <option value="false">Pendentes</option>
              <option value="true">Pagos</option>
            </select>

            <Input
              placeholder="Referência (YYYY-MM)"
              value={filterReferencia}
              onChange={(e) => setFilterReferencia(e.target.value)}
              aria-label="Filtrar por referência"
              maxLength={7}
            />
          </div>
        </div>

        {/* Table */}
        <div className={styles.tableSection}>
          <Table<MensalidadeWithAssociado>
            columns={columns}
            rows={filteredItems}
            getRowKey={(r) => r.id}
            onRowClick={handleViewDetail}
            loading={loading}
            empty={emptyContent}
            footer={
              pagination.totalPages > 1 && (
                <div className={styles.pagination}>
                  <span className={styles.paginationInfo}>
                    Página {page} de {pagination.totalPages}
                  </span>
                  <div className={styles.paginationControls}>
                    <Button
                      variant="tertiary"
                      onClick={previous}
                      disabled={page <= 1}
                      fullWidth={false}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="tertiary"
                      onClick={next}
                      disabled={page >= pagination.totalPages}
                      fullWidth={false}
                    >
                      Próxima
                    </Button>
                  </div>
                </div>
              )
            }
          />
        </div>
      </main>

      {/* Detail Modal */}
      <MensalidadeDetalheModal
        open={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setSelectedMensalidade(null);
        }}
        mensalidade={selectedMensalidade}
        onPay={handlePay}
        onViewHistory={handleViewHistory}
        canPay={canPagamentosWrite}
      />

      {/* Payment Modal */}
      <PagamentoModal
        open={pagamentoOpen}
        onClose={() => {
          setPagamentoOpen(false);
          setSelectedMensalidade(null);
        }}
        onSubmit={handlePagamentoSubmit}
        mensalidade={selectedMensalidade}
      />

      {/* Payment History Modal */}
      <PagamentoHistoricoModal
        open={historicoOpen}
        onClose={() => {
          setHistoricoOpen(false);
          setSelectedMensalidade(null);
        }}
        mensalidade={selectedMensalidade}
      />
    </PageContainer>
  );
}
