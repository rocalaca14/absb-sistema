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
import { associadosService } from '@/services/associados.service';
import type { Associado, AssociadoCreate, ListAssociadosParams } from '@/types/domain.types';

import { AssociadoDetailModal } from './AssociadoDetailModal';
import { AssociadoFormModal } from './AssociadoFormModal';
import styles from './AssociadosPage.module.css';

function maskCpf(cpf: string | null): string {
  if (!cpf) return '—';
  const d = cpf.replace(/\D/g, '');
  if (d.length !== 11) return cpf;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

function maskPhone(phone: string | null): string {
  if (!phone) return '—';
  const d = phone.replace(/\D/g, '');
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return phone;
}

export function AssociadosPage() {
  const { can } = usePermission();

  const canWrite = can('associados.write');

  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 300);

  const [filterAtivo, setFilterAtivo] = useState<'all' | 'true' | 'false'>('all');
  const [filterCategoria, setFilterCategoria] = useState('');

  const [items, setItems] = useState<Associado[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { page, pageSize, setPage, next, previous, range } = usePagination();

  const [selectedAssociado, setSelectedAssociado] = useState<Associado | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingAssociado, setEditingAssociado] = useState<Associado | null>(null);

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: ListAssociadosParams = {
        page,
        pageSize,
        orderBy: 'nome',
        orderDir: 'asc',
      };
      if (debouncedSearch) params.search = debouncedSearch;
      if (filterAtivo !== 'all') params.ativo = filterAtivo === 'true';
      if (filterCategoria) params.categoria = filterCategoria;

      const result = await associadosService.list(params);
      setItems(result.items);
      setTotal(result.total);
    } catch (err) {
      const message =
        AppError.isAppError(err) && err.code === ERROR_CODES.BACKEND_NOT_CONFIGURED
          ? err.userMessage
          : 'Não foi possível carregar os associados.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch, filterAtivo, filterCategoria]);

  useEffect(() => {
    void fetchList();
  }, [fetchList]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filterAtivo, filterCategoria, setPage]);

  const pagination = useMemo(() => range(total), [range, total]);

  const handleCreate = () => {
    setEditingAssociado(null);
    setFormOpen(true);
  };

  const handleEdit = (associado: Associado) => {
    setDetailOpen(false);
    setEditingAssociado(associado);
    setFormOpen(true);
  };

  const handleViewDetail = (associado: Associado) => {
    setSelectedAssociado(associado);
    setDetailOpen(true);
  };

  const handleFormSubmit = async (data: AssociadoCreate) => {
    if (editingAssociado) {
      await associadosService.update(editingAssociado.id, data);
    } else {
      await associadosService.create(data);
    }
    await fetchList();
  };

  const handleToggleActive = async (associado: Associado) => {
    try {
      if (associado.ativo) {
        await associadosService.deactivate(associado.id);
      } else {
        await associadosService.activate(associado.id);
      }
      setDetailOpen(false);
      setSelectedAssociado(null);
      await fetchList();
    } catch {
      // Error handled silently — service throws AppError
    }
  };

  const columns: ReadonlyArray<TableColumn<Associado>> = useMemo(
    () => [
      {
        key: 'nome',
        label: 'Nome',
        render: (r) => r.nome,
        width: '40%',
      },
      {
        key: 'cpf',
        label: 'CPF',
        render: (r) => maskCpf(r.cpf),
        hideOnMobile: true,
      },
      {
        key: 'telefone',
        label: 'Telefone',
        render: (r) => maskPhone(r.telefone),
        hideOnMobile: true,
      },
      {
        key: 'veiculo_placa',
        label: 'Placa',
        render: (r) => r.veiculoPlaca ?? '—',
      },
      {
        key: 'categoria',
        label: 'Categoria',
        render: (r) =>
          r.categoria ? <Badge variant="info">{r.categoria}</Badge> : '—',
        hideOnMobile: true,
      },
      {
        key: 'ativo',
        label: 'Status',
        render: (r) => (
          <Badge variant={r.ativo ? 'success' : 'danger'} showDot>
            {r.ativo ? 'Ativo' : 'Inativo'}
          </Badge>
        ),
        width: '10%',
      },
    ],
    [],
  );

  const emptyContent = useMemo(() => {
    if (error) {
      return (
        <EmptyState
          variant="error"
          title="Erro ao carregar associados"
          description={error}
          action={{ label: 'Tentar novamente', onClick: fetchList }}
        />
      );
    }
    if (debouncedSearch || filterAtivo !== 'all' || filterCategoria) {
      return (
        <EmptyState
          variant="empty"
          title="Nenhum resultado encontrado"
          description="Ajuste os filtros ou a busca para encontrar associados."
        />
      );
    }
    return (
      <EmptyState
        variant="first-use"
        title="Nenhum associado cadastrado"
        description="Adicione o primeiro associado para começar."
        {...(canWrite
          ? { action: { label: 'Adicionar associado', onClick: handleCreate } }
          : {})}
      />
    );
  }, [error, debouncedSearch, filterAtivo, filterCategoria, canWrite, fetchList]);

  return (
    <PageContainer>
      <main aria-label="Gestão de associados">
        <SectionTitle
          as="h1"
          title="Associados"
          subtitle={`${total} associado${total !== 1 ? 's' : ''} cadastrado${total !== 1 ? 's' : ''}`}
        />

        {/* Toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.toolbarRow}>
            <div className={styles.searchWrapper}>
              <Input
                placeholder="Buscar por nome, CPF ou placa..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                leftIcon={<Icon name="Search" ariaLabel="" />}
                aria-label="Buscar associados"
              />
            </div>
            {canWrite && (
              <Button
                variant="primary"
                onClick={handleCreate}
                leftIcon={<Icon name="Plus" ariaLabel="" />}
                fullWidth={false}
              >
                Novo
              </Button>
            )}
          </div>

          <div className={styles.filterGroup}>
            <select
              className={styles.filterGroup}
              value={filterAtivo}
              onChange={(e) => setFilterAtivo(e.target.value as typeof filterAtivo)}
              aria-label="Filtrar por status"
            >
              <option value="all">Todos</option>
              <option value="true">Ativos</option>
              <option value="false">Inativos</option>
            </select>

            <select
              className={styles.filterGroup}
              value={filterCategoria}
              onChange={(e) => setFilterCategoria(e.target.value)}
              aria-label="Filtrar por categoria"
            >
              <option value="">Todas categorias</option>
              <option value="Buggy">Buggy</option>
              <option value="Moto">Moto</option>
              <option value="Carro">Carro</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className={styles.tableSection}>
          <Table<Associado>
            columns={columns}
            rows={items}
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

      {/* Form Modal */}
      <AssociadoFormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingAssociado(null);
        }}
        onSubmit={handleFormSubmit}
        associado={editingAssociado}
      />

      {/* Detail Modal */}
      <AssociadoDetailModal
        open={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setSelectedAssociado(null);
        }}
        associado={selectedAssociado}
        onEdit={handleEdit}
        onToggleActive={handleToggleActive}
        canEdit={canWrite}
        canToggleActive={canWrite}
      />
    </PageContainer>
  );
}
