import { useCallback, useEffect, useMemo, useState } from 'react';

import { PageContainer } from '@/components/layout/PageContainer';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Table, type TableColumn } from '@/components/ui/Table';
import { AppError, ERROR_CODES } from '@/core/errors/AppError';
import { useDebounce } from '@/hooks/useDebounce';
import { usePagination } from '@/hooks/usePagination';
import { usePermission } from '@/hooks/usePermission';
import { associadosService } from '@/services/associados.service';
import type { Associado, ListAssociadosParams } from '@/types/domain.types';

import styles from './RelatoriosPage.module.css';

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

function escapeCsv(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function toCsvRow(values: (string | number | null)[]): string {
  return values.map((v) => escapeCsv(String(v ?? ''))).join(',');
}

export function RelatoriosPage() {
  const { can } = usePermission();
  const canView = can('relatorios.view');

  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 300);

  const [filterAtivo, setFilterAtivo] = useState<'all' | 'true' | 'false'>('all');
  const [filterCategoria, setFilterCategoria] = useState('');

  const [items, setItems] = useState<Associado[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { page, pageSize, setPage, range } = usePagination({
    initialPageSize: 20,
  });

  const { totalPages } = range(total);

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
          : 'Erro ao carregar relatório de associados.';
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

  const handleExportCsv = useCallback(() => {
    const header = [
      'Nome',
      'CPF',
      'Telefone',
      'Email',
      'Categoria',
      'Status',
      'Data Filiação',
    ];

    const rows = items.map((a) =>
      toCsvRow([
        a.nome,
        maskCpf(a.cpf),
        maskPhone(a.telefone),
        a.email ?? '',
        a.categoria ?? '',
        a.ativo ? 'Ativo' : 'Inativo',
        a.dataFiliacao ?? '',
      ]),
    );

    const csv = [header.join(','), ...rows].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `associados_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, [items]);

  const columns: TableColumn<Associado>[] = useMemo(
    () => [
      { key: 'nome', label: 'Nome', render: (a) => a.nome, width: '30%' },
      { key: 'cpf', label: 'CPF', render: (a) => maskCpf(a.cpf), width: '15%' },
      { key: 'telefone', label: 'Telefone', render: (a) => maskPhone(a.telefone), width: '15%', hideOnMobile: true },
      { key: 'email', label: 'Email', render: (a) => a.email ?? '—', width: '20%', hideOnMobile: true },
      {
        key: 'categoria',
        label: 'Categoria',
        render: (a) => <Badge variant="info">{a.categoria ?? '—'}</Badge>,
        width: '10%',
        hideOnMobile: true,
      },
      {
        key: 'ativo',
        label: 'Status',
        render: (a) => (
          <Badge variant={a.ativo ? 'success' : 'danger'} showDot>
            {a.ativo ? 'Ativo' : 'Inativo'}
          </Badge>
        ),
        width: '10%',
      },
    ],
    [],
  );

  if (!canView) {
    return (
      <PageContainer>
        <SectionTitle as="h1" title="Relatórios" subtitle="Acesso restrito" />
        <EmptyState
          variant="error"
          title="Sem permissão"
          description="Você não tem permissão para visualizar relatórios."
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <main aria-label="Relatório de Associados">
        <SectionTitle
          as="h1"
          title="Relatório de Associados"
          subtitle={`${total} associado${total !== 1 ? 's' : ''} encontrado${total !== 1 ? 's' : ''}`}
        />

        <div className={styles.toolbar}>
          <Input
            placeholder="Buscar por nome, CPF, email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            aria-label="Buscar associados"
          />

          <div className={styles.filters}>
            <select
              className={styles.filterSelect}
              value={filterAtivo}
              onChange={(e) => setFilterAtivo(e.target.value as 'all' | 'true' | 'false')}
              aria-label="Filtrar por status"
            >
              <option value="all">Todos</option>
              <option value="true">Ativos</option>
              <option value="false">Inativos</option>
            </select>

            <select
              className={styles.filterSelect}
              value={filterCategoria}
              onChange={(e) => setFilterCategoria(e.target.value)}
              aria-label="Filtrar por categoria"
            >
              <option value="">Todas categorias</option>
              <option value="Socio">Sócio</option>
              <option value="Contribuinte">Contribuinte</option>
              <option value="Colaborador">Colaborador</option>
            </select>
          </div>

          <Button
            variant="secondary"
            onClick={handleExportCsv}
            disabled={loading || items.length === 0}
          >
            Exportar CSV
          </Button>
        </div>

        <Table<Associado>
          columns={columns}
          rows={items}
          loading={loading}
          getRowKey={(a) => a.id}
          empty={
            error ? (
              <EmptyState
                variant="error"
                title="Erro ao carregar"
                description={error}
                action={{ label: 'Tentar novamente', onClick: fetchList }}
              />
            ) : (
              <EmptyState
                variant="empty"
                title="Nenhum associado encontrado"
                description="Ajuste os filtros para encontrar associados."
              />
            )
          }
          footer={
            totalPages > 1 ? (
              <div className={styles.pagination}>
                <Button
                  variant="secondary"
                  onClick={() => setPage(page - 1)}
                  disabled={page <= 1}
                >
                  Anterior
                </Button>
                <span className={styles.pageInfo}>
                  Página {page} de {totalPages}
                </span>
                <Button
                  variant="secondary"
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages}
                >
                  Próxima
                </Button>
              </div>
            ) : undefined
          }
        />
      </main>
    </PageContainer>
  );
}
