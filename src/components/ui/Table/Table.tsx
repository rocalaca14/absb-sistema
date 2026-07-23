import { type ReactNode } from 'react';

import { Skeleton } from '@/components/ui/Skeleton';

import styles from './Table.module.css';

export type TableAlign = 'left' | 'center' | 'right';

export interface TableColumn<T> {
  key: string;
  /** Rótulo textual usado como cabeçalho e como data-label no mobile. */
  label: string;
  /** Renderiza o conteúdo da célula. */
  render: (row: T) => ReactNode;
  /** Conteúdo customizado do cabeçalho. Se omitido, usa `label`. */
  header?: ReactNode;
  /** Largura CSS da coluna. */
  width?: string;
  /** Alinhamento do conteúdo. */
  align?: TableAlign;
  /** Esconde a coluna em telas pequenas. */
  hideOnMobile?: boolean;
}

export interface TableProps<T> {
  columns: ReadonlyArray<TableColumn<T>>;
  rows: ReadonlyArray<T>;
  loading?: boolean;
  empty?: ReactNode;
  /** Função que retorna uma chave única para cada linha. */
  getRowKey: (row: T) => string;
  /** Handler de clique na linha inteira. */
  onRowClick?: (row: T) => void;
  /** Slot para renderizar no rodapé (ex.: paginação). */
  footer?: ReactNode;
  className?: string | undefined;
}

const SKELETON_ROW_COUNT = 5;

/**
 * Table — tabela de dados com suporte a:
 *
 * - **Estados**: loading (skeleton), vazio (slot `empty`), erro (via `empty`).
 * - **Responsividade**: em mobile, cada linha vira um card empilhado
 *   com label-valor (data-label).
 * - **Sem scroll horizontal** (regra D2 da Fase 1).
 * - **Acessibilidade**: `<table>` semântica com `<thead>` e `<tbody>`,
 *   cabeçalhos com `scope="col"`.
 *
 * Para uso com dados em memória. Para integração com paginação
 * server-side, usar `usePagination` e passar `footer` com controles.
 *
 * @example
 * ```tsx
 * <Table
 *   columns={[
 *     { key: 'nome', label: 'Nome', render: (r) => r.nome },
 *     { key: 'cpf', label: 'CPF', render: (r) => maskCpf(r.cpf) },
 *   ]}
 *   rows={associados}
 *   getRowKey={(r) => r.id}
 *   onRowClick={(r) => navigate(`/associados/${r.id}`)}
 *   loading={isLoading}
 *   empty={<EmptyState ... />}
 * />
 * ```
 */
export function Table<T>({
  columns,
  rows,
  loading = false,
  empty,
  getRowKey,
  onRowClick,
  footer,
  className,
}: TableProps<T>) {
  const composedClassName = [styles.wrapper, className ?? ''].filter(Boolean).join(' ');

  if (loading) {
    return (
      <div className={composedClassName}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} scope="col">
                  {col.header ?? col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: SKELETON_ROW_COUNT }).map((_, rowIndex) => (
              <tr key={`skeleton-${rowIndex}`} className={styles.skeleton}>
                {columns.map((col) => (
                  <td key={col.key}>
                    <Skeleton height={20} width="80%" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {footer}
      </div>
    );
  }

  if (rows.length === 0 && empty) {
    return (
      <div className={composedClassName}>
        {empty}
        {footer}
      </div>
    );
  }

  return (
    <div className={composedClassName}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                style={{ width: col.width, textAlign: col.align ?? 'left' }}
                className={col.hideOnMobile ? styles.mobileStacked : undefined}
              >
                {col.header ?? col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={getRowKey(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              onKeyDown={
                onRowClick
                  ? (event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        onRowClick(row);
                      }
                    }
                  : undefined
              }
              tabIndex={onRowClick ? 0 : undefined}
              className={onRowClick ? styles.clickable : undefined}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  data-label={col.label}
                  style={{ textAlign: col.align ?? 'left' }}
                >
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {footer}
    </div>
  );
}
